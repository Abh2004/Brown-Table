import React, { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Search,
  ShoppingCart,
  Star,
  Clock,
  Loader2,
  Coffee,
  Edit3,
  X,
} from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { useGroupMembers } from "../context/groupMemebersContext";
import { useMenu } from "../hooks/useMenu";
import { useNavigate } from "react-router-dom";
import OrderSummary from "./OrderSummary";
import CoffeeLoader from "./CoffeeLoader";

interface MenuItemsProps {
  category?: string; // Food, Beverages, Desserts, Wine, Specific Wine, etc.
  dietaryFilter?: "all" | "veg" | "non-veg"; // Not used for now
}

const MenuItems: React.FC<MenuItemsProps> = ({ category, dietaryFilter }) => {
  const navigate = useNavigate();
  const { cart, addToCart, updateCartItemQuantity, updateCartItemNotes, loading: cartLoading } =
    useBooking();
  const { menuData, loading: menuLoading, error: menuError } = useMenu();
  const [noteOpen, setNoteOpen] = useState<{ [id: string]: boolean }>({});
  const [notes, setNotes] = useState<{ [id: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  // Sync notes with cart items
  useEffect(() => {
    const cartNotes: { [id: string]: string } = {};
    cart.forEach((item) => {
      if (item.specialInstructions) {
        cartNotes[item.id] = item.specialInstructions;
      }
    });
    setNotes(cartNotes);
  }, [cart]);

  const getCartItem = (id: string) => cart.find((item) => item.id === id);

  if (menuLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <CoffeeLoader size="lg" message="Brewing your menu experience..." />
      </div>
    );
  }

  if (menuError || !menuData) {
    return (
      <div className="pb-32 max-w-4xl mx-auto">
        <div className="text-center py-12 bg-white rounded-2xl shadow-warm border border-coffee-100">
          <Coffee className="w-16 h-16 text-coffee-300 mx-auto mb-4" />
          <p className="text-coffee-700 mb-6 text-lg font-medium">
            {menuError || "Failed to load menu"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-coffee-gradient text-white px-8 py-3 rounded-xl hover:scale-105 transition-all duration-200 shadow-warm hover:shadow-warm-lg font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Filter menu sections based on category
  const filteredSections = menuData.data.filter(
    (section: { title: string; items: any[] }) => {
      // If no category or "All" is selected, show all sections
      if (!category || category === "All") {
        return true;
      }

      // If category is specified, filter by item categories within the section
      const hasMatchingCategory = section.items.some(
        (item: any) => item.category === category
      );

      return hasMatchingCategory;
    }
  );

  // Filter items within each section based on dietary filter and search query
  const processedSections = filteredSections
    .map((section: { title: string; items: any[] }) => {
      const filteredItems = section.items.filter((item: any) => {
        // Filter by dietary preference
        const dietaryMatch =
          !dietaryFilter ||
          dietaryFilter === "all" ||
          item.type === dietaryFilter;

        // Filter by search query
        const searchMatch =
          !searchQuery ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          section.title.toLowerCase().includes(searchQuery.toLowerCase());

        return dietaryMatch && searchMatch;
      });

      return {
        ...section,
        items: filteredItems,
      };
    })
    .filter((section: any) => section.items.length > 0); // Only show sections with items

  console.log("Processed sections:", processedSections);

  if (processedSections.length === 0) {
    return (
      <div className="pb-32 max-w-4xl mx-auto">
        {/* Enhanced Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-coffee-400" />
            </div>
            <input
              type="text"
              placeholder="Search our curated menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-12 py-4 border-2 border-coffee-200 rounded-xl leading-5 bg-white placeholder-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 text-coffee-900 shadow-warm hover:shadow-warm-lg transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-coffee-50 rounded-r-xl transition-colors"
              >
                <X className="w-5 h-5 text-coffee-400 hover:text-coffee-600" />
              </button>
            )}
          </div>
        </div>
        
        <div className="text-center py-16 bg-white rounded-2xl shadow-warm border border-coffee-100">
          <Search className="w-20 h-20 text-coffee-200 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-coffee-900 font-serif mb-4">
            {searchQuery ? "No matches found" : "No items available"}
          </h3>
          <p className="text-coffee-600 text-lg">
            {searchQuery
              ? `Try searching for something else or browse our complete menu`
              : "Please adjust your filters to see available items"}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 bg-coffee-gradient text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-200 shadow-warm hover:shadow-warm-lg"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>
    );
  }

  const handleNoteChange = (itemId: string, noteValue: string) => {
    setNotes((prev) => ({ ...prev, [itemId]: noteValue }));
    updateCartItemNotes(itemId, noteValue);
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      ...item,
      type: item.type as "veg" | "non-veg",
    });
  };

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  return (
    <div className="pb-32 max-w-4xl mx-auto">
      {/* Cart Loading Indicator */}
      {cartLoading && (
        <div className="fixed top-24 right-4 bg-coffee-gradient text-white px-4 py-3 rounded-xl text-sm z-50 shadow-warm-lg flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Syncing your order...
        </div>
      )}

      {/* Enhanced Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-coffee-400" />
          </div>
          <input
            type="text"
            placeholder="Search our curated menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-12 py-4 border-2 border-coffee-200 rounded-xl leading-5 bg-white placeholder-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 text-coffee-900 shadow-warm hover:shadow-warm-lg transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-coffee-50 rounded-r-xl transition-colors"
            >
              <X className="w-5 h-5 text-coffee-400 hover:text-coffee-600" />
            </button>
          )}
        </div>
      </div>

      {/* Menu Sections */}
      {processedSections.map((section: { title: string; items: any[] }) => {
        const isExpanded = expandedSections[section.title] !== false; // Default to expanded
        
        return (
          <div key={section.title} className="mb-10">
            {/* Section Header */}
            <div 
              className="flex items-center justify-between mb-6 cursor-pointer group"
              onClick={() => toggleSection(section.title)}
            >
              <div className="flex items-center gap-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-coffee-900 font-serif group-hover:text-coffee-700 transition-colors">
                  {section.title}
                </h2>
                <div className="px-3 py-1 bg-coffee-100 text-coffee-700 rounded-full text-sm font-medium">
                  {section.items.length} items
                </div>
              </div>
              <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-6 h-6 text-coffee-600 group-hover:text-coffee-800" />
              </div>
            </div>

            {/* Section Items */}
            {isExpanded && (
              <div className="grid grid-cols-1 gap-4 animate-slide-up">
                {section.items.map((item: any) => {
                  const cartItem = getCartItem(item.id);
                  
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-warm hover:shadow-warm-lg transition-all duration-300 border border-coffee-100 overflow-hidden group hover:border-coffee-200"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          {/* Item Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-coffee-900 group-hover:text-coffee-700 transition-colors">
                                {item.name}
                              </h3>
                              <div
                                className={`w-4 h-4 rounded-full border-2 ${
                                  item.type === "veg" 
                                    ? "bg-green-500 border-green-600" 
                                    : "bg-red-500 border-red-600"
                                }`}
                              ></div>
                            </div>
                            
                            <p className="text-coffee-600 text-base leading-relaxed mb-3 max-w-2xl">
                              {item.description}
                            </p>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-coffee-900">₹{item.price}</span>
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                              <span className="text-sm text-coffee-600 font-medium">Chef's Special</span>
                            </div>
                          </div>

                          {/* Add to Cart Controls */}
                          <div className="flex flex-col items-end gap-3 min-w-[120px]">
                            {cartItem ? (
                              <div className="flex items-center gap-2 bg-coffee-50 rounded-xl p-1">
                                <button
                                  className="bg-coffee-600 text-white rounded-lg px-3 py-2 font-bold disabled:opacity-50 hover:bg-coffee-700 transition-colors"
                                  onClick={() =>
                                    updateCartItemQuantity(
                                      item.id,
                                      cartItem.quantity - 1
                                    )
                                  }
                                  disabled={cartLoading}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 text-lg font-bold text-coffee-900 min-w-[3rem] text-center">
                                  {cartItem.quantity}
                                </span>
                                <button
                                  className="bg-coffee-600 text-white rounded-lg px-3 py-2 font-bold disabled:opacity-50 hover:bg-coffee-700 transition-colors"
                                  onClick={() =>
                                    updateCartItemQuantity(
                                      item.id,
                                      cartItem.quantity + 1
                                    )
                                  }
                                  disabled={cartLoading}
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                className="bg-coffee-gradient text-white rounded-xl px-8 py-3 font-bold text-lg disabled:opacity-50 hover:scale-105 transition-all duration-200 shadow-warm hover:shadow-warm-lg"
                                onClick={() => handleAddToCart(item)}
                                disabled={cartLoading}
                              >
                                Add
                              </button>
                            )}
                            
                            {/* Add Note Button */}
                            {cartItem && (
                              <button
                                className={`flex items-center gap-2 text-coffee-600 hover:text-coffee-800 transition-colors text-sm font-medium ${
                                  noteOpen[item.id] ? "text-coffee-800" : ""
                                }`}
                                onClick={() =>
                                  setNoteOpen((prev) => ({
                                    ...prev,
                                    [item.id]: !prev[item.id],
                                  }))
                                }
                              >
                                <Edit3 className="w-4 h-4" />
                                <span>{noteOpen[item.id] ? "Hide note" : "Add note"}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Special Instructions Input */}
                        {noteOpen[item.id] && cartItem && (
                          <div className="mt-4 pt-4 border-t border-coffee-100 animate-slide-up">
                            <label className="block text-sm font-medium text-coffee-700 mb-2">
                              Special Instructions
                            </label>
                            <input
                              className="w-full border-2 border-coffee-200 rounded-xl px-4 py-3 text-coffee-900 placeholder-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-all duration-200"
                              placeholder="e.g., Extra spicy, no onions, etc."
                              value={notes[item.id] || ""}
                              onChange={(e) =>
                                handleNoteChange(item.id, e.target.value)
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Enhanced Floating Cart Button */}
      {cart.length > 0 && (
        <>
          <div
            className="fixed left-0 right-0 bottom-6 flex justify-center z-50 px-4"
            onClick={() => setShowOrderSummary(true)}
          >
            <div className="bg-coffee-gradient text-white rounded-2xl px-8 py-4 font-bold text-lg flex items-center justify-between shadow-warm-xl max-w-md w-full cursor-pointer hover:scale-105 transition-all duration-200 border border-coffee-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">
                    {cart.length} Item{cart.length !== 1 ? "s" : ""} Added
                  </p>
                  <p className="text-cream/80 text-sm">
                    ₹{cart.reduce((total, item) => total + (item.price * item.quantity), 0)}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
          <OrderSummary
            open={showOrderSummary}
            onClose={() => setShowOrderSummary(false)}
          />
        </>
      )}
    </div>
  );
};

export default MenuItems;
