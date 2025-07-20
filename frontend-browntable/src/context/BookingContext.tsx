import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { orderAPI, menuAPI } from "../services/api";
import { useAuth } from "./AuthContext";
import type { CartItem as APICartItem } from "../services/api";

interface CartItem {
  id: string;
  name: string;
  price: number; // can be 10.99, 14.99, 16.99, etc.
  quantity: number; // can be 1, 2, 3, etc.
  type: "veg" | "non-veg";
  addedBy?: string;
  specialInstructions?: string;
}

interface BookingContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity" | "addedBy">) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateCartItemNotes: (id: string, notes: string) => void;
  getCartTotal: () => number;
  clearCart: () => void;
  totalPrice: number;
  totalCartItems: number;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  arrivalTime: string;
  setArrivalTime: (time: string) => void;
  checkoutTime: string;
  setCheckoutTime: (time: string) => void;
  // Backend integration fields
  currentGroupId: string | null;
  setCurrentGroupId: (groupId: string | null) => void;
  syncOrderWithBackend: () => Promise<void>;
  refreshOrderData: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [checkoutTime, setCheckoutTime] = useState("");

  // Backend integration state
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastApiCallTime, setLastApiCallTime] = useState<number>(0);

  // Update totals whenever cart changes
  useEffect(() => {
    const newTotalPrice = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const newTotalItems = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    setTotalPrice(newTotalPrice);
    setTotalCartItems(newTotalItems);

    // Log cart changes for debugging
    console.log("Cart updated:", {
      cart,
      totalPrice: newTotalPrice,
      totalItems: newTotalItems,
    });
  }, [cart]);

  // Sync cart with backend whenever it changes (debounced)
  useEffect(() => {
    if (!currentGroupId || !user) return;

    const timeoutId = setTimeout(() => {
      syncOrderWithBackend();
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeoutId);
  }, [cart, currentGroupId, user]);

  // Load group order data when group changes
  useEffect(() => {
    if (currentGroupId && user) {
      loadGroupOrderData();
    }
  }, [currentGroupId, user]);

  // No automatic periodic refresh - only manual refresh via buttons

  const syncOrderWithBackend = async () => {
    if (!currentGroupId || !user) return;

    // Check cooldown (5 seconds between API calls)
    const now = Date.now();
    const timeSinceLastCall = now - lastApiCallTime;
    if (timeSinceLastCall < 5000) {
      console.log("⏳ Sync skipped - cooldown active:", {
        timeSinceLastCall: Math.round(timeSinceLastCall / 1000),
        remainingCooldown: Math.round((5000 - timeSinceLastCall) / 1000),
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setLastApiCallTime(now);

      // Filter cart items for current user only
      const userItems = cart.filter((item) => item.addedBy === user.id);

      console.log("🔄 Syncing user order to backend:", {
        userId: user.id,
        userIdType: typeof user.id,
        items: userItems.length,
        groupId: currentGroupId,
      });

      await orderAPI.updateOrder(currentGroupId, {
        items: userItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          type: item.type,
          addedBy: user.id, // Use user.id consistently
          specialInstructions: item.specialInstructions || "",
        })),
        userId: user.id,
      });

      console.log("✅ Order synced with backend successfully");
      // Note: No immediate fetch - users can manually refresh when needed
    } catch (err: any) {
      console.error("❌ Failed to sync order with backend:", err);
      setError(err.response?.data?.message || "Failed to sync order");
    } finally {
      setLoading(false);
    }
  };

  const loadGroupOrderData = async () => {
    if (!currentGroupId || !user) return;

    // Check cooldown (5 seconds between API calls)
    const now = Date.now();
    const timeSinceLastCall = now - lastApiCallTime;
    if (timeSinceLastCall < 5000) {
      console.log("⏳ API call skipped - cooldown active:", {
        timeSinceLastCall: Math.round(timeSinceLastCall / 1000),
        remainingCooldown: Math.round((5000 - timeSinceLastCall) / 1000),
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setLastApiCallTime(now);

      console.log("🔄 Loading group order data from DB...");

      const response = await orderAPI.getGroupOrder(currentGroupId);

      if (response.success) {
        // Update cart with all group members' items
        const allItems = response.data.order?.items || [];
        const previousCartLength = cart.length;

        setCart(allItems);

        console.log("✅ Group order data loaded successfully:", {
          totalItems: allItems.length,
          previousItems: previousCartLength,
          groupId: currentGroupId,
          orderId: response.data.order?.id,
        });

        // Log breakdown by user
        const itemsByUser = allItems.reduce((acc: any, item: any) => {
          acc[item.addedBy] = (acc[item.addedBy] || 0) + 1;
          return acc;
        }, {});

        console.log("📊 Items breakdown by user:", itemsByUser);
      } else {
        throw new Error(response.message || "Failed to load group order data");
      }
    } catch (err: any) {
      console.error("❌ Failed to load group order data:", err);
      setError(
        err.response?.data?.message || "Failed to load group order data"
      );
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: Omit<CartItem, "quantity" | "addedBy">) => {
    if (!user) {
      console.error("User must be authenticated to add items to cart");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1, addedBy: user.id }];
      }
    });
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const updateCartItemNotes = (id: string, notes: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, specialInstructions: notes } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  const value: BookingContextType = {
    cart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    updateCartItemNotes,
    getCartTotal,
    clearCart,
    totalPrice,
    totalCartItems,
    selectedDate,
    setSelectedDate,
    arrivalTime,
    setArrivalTime,
    checkoutTime,
    setCheckoutTime,
    // Backend integration
    currentGroupId,
    setCurrentGroupId,
    syncOrderWithBackend,
    refreshOrderData: loadGroupOrderData,
    loading,
    error,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};
