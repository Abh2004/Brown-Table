import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { ArrowLeft, Trash2 } from "lucide-react";

function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    updateCartItemQuantity,
    removeFromCart,
    totalPrice,
    totalCartItems,
  } = useBooking();

  // Log cart changes for debugging
  useEffect(() => {
    console.log("Cart component - Cart updated:", {
      cart,
      totalPrice,
      totalCartItems,
    });
  }, [cart, totalPrice, totalCartItems]);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some delicious items from our menu!
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="bg-[#4d3a00] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#6e6240] transition-colors"
            >
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/group-order")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
                <p className="text-gray-600 mt-1">
                  {totalCartItems} item{totalCartItems !== 1 ? "s" : ""} • $
                  {totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="p-6">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <span
                        className={`w-3 h-3 rounded-full inline-block ${
                          item.type === "veg" ? "bg-green-600" : "bg-red-600"
                        }`}
                      ></span>
                    </div>
                    <p className="text-sm text-gray-600">${item.price}</p>
                    {item.specialInstructions && (
                      <p className="text-xs text-gray-500 italic mt-1">
                        Note: {item.specialInstructions}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                      <button
                        onClick={() =>
                          updateCartItemQuantity(item.id, item.quantity - 1)
                        }
                        className="text-gray-600 hover:text-gray-800 px-2"
                      >
                        -
                      </button>
                      <span className="px-3 font-medium">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateCartItemQuantity(item.id, item.quantity + 1)
                        }
                        className="text-gray-600 hover:text-gray-800 px-2"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              className="w-full bg-[#4d3a00] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#6e6240] transition-colors"
              onClick={() => alert("Checkout functionality would go here!")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
