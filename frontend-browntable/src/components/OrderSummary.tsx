import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Edit3,
  Save,
  Users,
  CreditCard,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { useGroupMembers } from "../context/groupMemebersContext";
import { useAuth } from "../context/AuthContext";
import { orderAPI } from "../services/api";
import CoffeeLoader from "./CoffeeLoader";

interface OrderSummaryProps {
  open: boolean;
  onClose: () => void;
}

const SERVICE_RATE = 0.1;
const TAX_RATE = 0.18;

const OrderSummary: React.FC<OrderSummaryProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentGroupId } = useBooking();
  const { groupInfo } = useGroupMembers();

  // State for backend data
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [lastApiCallTime, setLastApiCallTime] = useState<number>(0);

  // Notes editing state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>("");

  // Load order data when component opens
  useEffect(() => {
    if (open && currentGroupId) {
      loadOrderData();
    }
  }, [open, currentGroupId]);

  // No automatic periodic refresh - only manual refresh via button

  // Check if current user is the group owner
  useEffect(() => {
    if (user && groupInfo) {
      setIsOwner(groupInfo.groupAdminId === user.id);
    }
  }, [user, groupInfo]);

  const loadOrderData = async () => {
    if (!currentGroupId) return;

    // Check cooldown (5 seconds between API calls)
    const now = Date.now();
    const timeSinceLastCall = now - lastApiCallTime;
    if (timeSinceLastCall < 5000) {
      console.log("⏳ OrderSummary API call skipped - cooldown active:", {
        timeSinceLastCall: Math.round(timeSinceLastCall / 1000),
        remainingCooldown: Math.round((5000 - timeSinceLastCall) / 1000),
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setLastApiCallTime(now);

      const response = await orderAPI.getGroupOrder(currentGroupId);

      if (response.success) {
        setOrderData(response.data);
        console.log("✅ Order data loaded:", response.data);
      } else {
        throw new Error(response.message || "Failed to load order data");
      }
    } catch (err: any) {
      console.error("❌ Failed to load order data:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load order data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Group items by member
  const itemsByMember = orderData?.itemsByMember || {};

  // Calculate totals
  const getSubtotal = (items: any[]) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const getService = (subtotal: number) => Math.round(subtotal * SERVICE_RATE);
  const getTax = (subtotal: number) => Math.round(subtotal * TAX_RATE);

  const memberTotals = Object.values(itemsByMember).map((memberData: any) => {
    const items = memberData.items || [];
    const subtotal = getSubtotal(items);
    const service = getService(subtotal);
    const tax = getTax(subtotal);
    return {
      member: memberData.member,
      items,
      subtotal,
      service,
      tax,
      total: subtotal + service + tax,
    };
  });

  const grandTotal = memberTotals.reduce((sum, m) => sum + m.total, 0);

  // Get notes for each item
  const notes: Record<string, string> = {};
  if (orderData?.order?.items) {
    orderData.order.items.forEach((item: any) => {
      if (item.specialInstructions) {
        notes[item.id] = item.specialInstructions;
      }
    });
  }

  // Handle note edit
  const handleEditNote = (item: any) => {
    setEditingNoteId(item.id);
    setNoteInput(notes[item.id] || "");
  };

  const handleSaveNote = async (item: any) => {
    try {
      // Update note in backend
      await orderAPI.updateOrder(currentGroupId!, {
        items: orderData.order.items.map((orderItem: any) => ({
          ...orderItem,
          specialInstructions:
            orderItem.id === item.id
              ? noteInput
              : orderItem.specialInstructions,
        })),
        userId: user!.id,
      });

      setEditingNoteId(null);
      setNoteInput("");

      // Reload order data to get updated notes (respects cooldown)
      await loadOrderData();
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      if (isOwner) {
        // Owner pays for entire group
        console.log("Owner paying for entire group:", grandTotal);
        // TODO: Implement payment gateway integration
        alert(
          `Payment of ₹${grandTotal.toFixed(
            2
          )} will be processed for the entire group.`
        );
      } else {
        // Member pays their share
        const userItems = memberTotals.find(
          (m) => m.member.userId === user?.id
        );
        const userTotal = userItems?.total || 0;
        console.log("Member paying their share:", userTotal);
        // TODO: Implement payment gateway integration
        alert(
          `Payment of ₹${userTotal.toFixed(
            2
          )} will be processed for your share.`
        );
      }
    } catch (error) {
      console.error("Payment failed:", error);
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  if (loading && !orderData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <CoffeeLoader size="lg" message="Loading order details..." />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-warm-xl">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-coffee-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-coffee-gradient rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-coffee-900">
                Group Order Summary
              </h2>
              <p className="text-coffee-600 text-sm">
                {groupInfo?.name || "Group Order"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadOrderData}
              disabled={loading || Date.now() - lastApiCallTime < 5000}
              className="p-2 hover:bg-coffee-50 rounded-lg transition-colors disabled:opacity-50"
              title={
                Date.now() - lastApiCallTime < 5000
                  ? `Refresh available in ${Math.round(
                      (5000 - (Date.now() - lastApiCallTime)) / 1000
                    )}s`
                  : "Refresh order data"
              }
            >
              <RefreshCw
                className={`w-5 h-5 text-coffee-600 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-coffee-50 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-coffee-600" />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex-shrink-0">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Order Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {orderData ? (
            <div className="space-y-6">
              {/* Member Orders */}
              {memberTotals.map((memberData) => (
                <div
                  key={memberData.member.userId}
                  className="border border-coffee-200 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: memberData.member.color }}
                      >
                        {memberData.member.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-coffee-900">
                          {memberData.member.name}
                          {memberData.member.isAdmin && (
                            <span className="ml-2 text-xs bg-coffee-100 text-coffee-700 px-2 py-1 rounded-full">
                              Owner
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-coffee-600">
                          {memberData.items.length} item
                          {memberData.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-coffee-900">
                        ₹{memberData.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-coffee-600">
                        Subtotal: ₹{memberData.subtotal.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Member's Items */}
                  {memberData.items.length > 0 ? (
                    <div className="space-y-3">
                      {memberData.items.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-coffee-50 rounded-lg p-3"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-coffee-900">
                                {item.name}
                              </h4>
                              <span className="text-sm text-coffee-600">
                                x{item.quantity}
                              </span>
                            </div>
                            {item.specialInstructions && (
                              <p className="text-sm text-coffee-600 mt-1">
                                Note: {item.specialInstructions}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-coffee-900">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                            {/* Edit note button - only for current user's items */}
                            {user?.id === memberData.member.userId && (
                              <button
                                onClick={() => handleEditNote(item)}
                                className="p-1 hover:bg-coffee-200 rounded transition-colors"
                              >
                                <Edit3 className="w-4 h-4 text-coffee-600" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-coffee-500">
                      No items added yet
                    </div>
                  )}
                </div>
              ))}

              {/* Note Editing Modal */}
              {editingNoteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                    <h3 className="font-semibold text-coffee-900 mb-4">
                      Edit Special Instructions
                    </h3>
                    <input
                      type="text"
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      className="w-full border border-coffee-200 rounded-lg px-3 py-2 mb-4"
                      placeholder="Enter special instructions..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="flex-1 px-4 py-2 border border-coffee-200 rounded-lg text-coffee-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          handleSaveNote(
                            orderData.order.items.find(
                              (item: any) => item.id === editingNoteId
                            )
                          )
                        }
                        className="flex-1 px-4 py-2 bg-coffee-gradient text-white rounded-lg"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-coffee-600">No order data available</p>
            </div>
          )}
        </div>

        {/* Footer with Payment - Fixed */}
        {orderData && (
          <div className="border-t border-coffee-100 p-6 flex-shrink-0">
            {/* Total Summary */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-coffee-900">
                Total
              </span>
              <span className="text-2xl font-bold text-coffee-900">
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>

            {/* Role-based Info */}
            <div className="mb-4">
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-sm flex items-start gap-2">
                <span className="mt-1">⚠️</span>
                <span>
                  <span className="font-semibold">Important:</span> <br />
                  {isOwner
                    ? "You will pay the bill for the entire group order. Your friends can pay you separately."
                    : `You will pay only for your share to ${groupInfo?.groupAdminId} of the order.`}
                </span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-coffee-gradient text-white rounded-xl flex items-center justify-between px-6 py-4 font-semibold mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-sm">Pay using</div>
                  <div>Google Pay UPI</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">
                  ₹
                  {isOwner
                    ? grandTotal.toFixed(2)
                    : memberTotals
                        .find((m) => m.member.userId === user?.id)
                        ?.total.toFixed(2) || "0.00"}
                </div>
                <div className="text-sm">
                  {isOwner ? "Total" : "Pay Your Share"}
                </div>
              </div>
            </button>

            {/* Role Indicator */}
            <div className="flex items-center justify-center gap-2 text-sm text-coffee-600">
              {isOwner ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>You are the group owner</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  <span>You are a group member</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
