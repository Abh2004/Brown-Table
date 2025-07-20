import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Users,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  Loader2,
  Edit,
  Save,
  X,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { useGroupMembers } from "../context/groupMemebersContext";
import { useAuth } from "../context/AuthContext";
import { groupAPI } from "../services/api";
import OrderSummary from "./OrderSummary";
import CoffeeLoader from "./CoffeeLoader";

const GroupOrder: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const {
    cart,
    updateCartItemQuantity,
    totalPrice,
    totalCartItems,
    setCurrentGroupId,
  } = useBooking();
  const {
    groupMembers,
    groupInfo,
    loadGroup,
    setGroupInfo,
    loading: groupLoading,
    deleteGroup,
  } = useGroupMembers();
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);
  const [editedGroupName, setEditedGroupName] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const groupId = searchParams.get("groupId");

  // Load group order data when component mounts or groupId changes
  useEffect(() => {
    const loadGroupData = async () => {
      // If no groupId, redirect to groups page
      if (!groupId) {
        navigate("/groups");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Load group data using the context method
        await loadGroup(groupId);

        // Load group order data (includes cart items)
        const orderResponse = await groupAPI.getGroupOrder(groupId);
        if (orderResponse.success) {
          setOrderData(orderResponse.data);
          console.log("✅ Group order loaded:", orderResponse.data);
        }

        // Set the current group ID in booking context for cart syncing
        setCurrentGroupId(groupId);

        console.log("✅ Group order data loaded successfully");
      } catch (err: any) {
        console.error("❌ Failed to load group data:", err);
        setError(err.message || "Failed to load group data");
      } finally {
        setLoading(false);
      }
    };

    loadGroupData();
  }, [groupId, navigate]); // Only depend on groupId and navigate

  // Function to refresh order data
  const refreshOrderData = async () => {
    if (!groupId) return;

    try {
      setRefreshing(true);
      setError(null);

      console.log("🔄 Refreshing group order data...");

      // Load group order data (includes cart items)
      const orderResponse = await groupAPI.getGroupOrder(groupId);
      if (orderResponse.success) {
        setOrderData(orderResponse.data);
        console.log("✅ Group order refreshed:", orderResponse.data);
      } else {
        throw new Error(
          orderResponse.message || "Failed to refresh order data"
        );
      }
    } catch (err: any) {
      console.error("❌ Failed to refresh order data:", err);
      setError(err.message || "Failed to refresh order data");
    } finally {
      setRefreshing(false);
    }
  };

  // Handle group name update
  const updateGroupName = async () => {
    if (!groupId || !editedGroupName.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // Update group name via API
      const response = await groupAPI.updateGroup(groupId, {
        name: editedGroupName,
      });

      if (response.success) {
        // Update local state
        setGroupInfo({ ...groupInfo, name: editedGroupName });
        setIsEditingGroupName(false);
        setEditedGroupName("");
        console.log("✅ Group name updated successfully");
      } else {
        throw new Error(response.message || "Failed to update group name");
      }
    } catch (err: any) {
      console.error("❌ Failed to update group name:", err);
      setError(err.message || "Failed to update group name");
    } finally {
      setLoading(false);
    }
  };

  // Start editing group name
  const startEditingGroupName = () => {
    setEditedGroupName(groupInfo.name || "");
    setIsEditingGroupName(true);
  };

  // Cancel editing group name
  const cancelEditingGroupName = () => {
    setIsEditingGroupName(false);
    setEditedGroupName("");
  };

  // Handle group deletion
  const handleDeleteGroup = async () => {
    if (!groupId || !currentUserId) return;

    try {
      setLoading(true);
      setError(null);

      await deleteGroup(groupId, currentUserId);

      console.log("✅ Group deleted successfully");
      // Navigate to groups page after successful deletion
      navigate("/groups");
    } catch (err: any) {
      console.error("❌ Failed to delete group:", err);
      setError(err.message || "Failed to delete group");
    } finally {
      setLoading(false);
      setShowDeleteConfirmation(false);
    }
  };

  // Use authenticated user ID
  const currentUserId = user?.id;

  // Group cart items by member using the order data from backend
  const cartByMember = orderData?.itemsByMember || {};

  // Calculate totals from the order data
  const totalItems =
    orderData?.order?.items?.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    ) || 0;

  const getCartTotal = () => orderData?.order?.totalAmount || 0;

  // Show loading state
  if (loading || groupLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coffee-50 to-latte-100">
        <CoffeeLoader size="lg" message="Loading group order..." />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-red-800 font-medium mb-2">
              Error Loading Group
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/groups")}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Groups
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show group not found if no group data
  if (!groupInfo.id) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h3 className="text-yellow-800 font-medium mb-2">
              Group Not Found
            </h3>
            <p className="text-yellow-600 mb-4">
              The group you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <button
              onClick={() => navigate("/groups")}
              className="w-full bg-[#4d3a00] text-white px-4 py-2 rounded-lg hover:bg-[#6e6240] transition-colors"
            >
              Back to Groups
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[500px] lg:max-w-full mx-auto lg:mx-0 lg:px-6">
      {/* Header */}
      <div className="pt-8 pb-4 px-4 lg:px-0">
        <div className="flex items-center justify-center gap-2 mb-4">
          {isEditingGroupName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedGroupName}
                onChange={(e) => setEditedGroupName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    updateGroupName();
                  } else if (e.key === "Escape") {
                    cancelEditingGroupName();
                  }
                }}
                className="text-xl font-bold text-center text-black border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#4d3a00]"
                autoFocus
              />
              <button
                onClick={() => updateGroupName()}
                className="p-1 text-green-600 hover:text-green-700"
              >
                <Save className="w-5 h-5" />
              </button>
              <button
                onClick={cancelEditingGroupName}
                className="p-1 text-red-600 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-center text-black">
                {groupInfo.name || "Group Order"}
              </h2>
              {currentUserId === groupInfo.groupAdminId && (
                <button
                  onClick={startEditingGroupName}
                  className="p-1 text-gray-600 hover:text-[#4d3a00]"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {/* Delete button available for all members */}
              {currentUserId && (
                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="p-1 text-gray-600 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          {groupMembers.map((member: any) => (
            <div
              key={member.id}
              className={`w-8 h-8 ${member.color} rounded-full flex items-center justify-center text-white -ml-[{%{member.id}*20px}] `}
            >
              {member.avatar || member.name.charAt(0)}
            </div>
          ))}
          <span className="ml-2 text-gray-600 text-sm">
            {groupMembers.length === 1
              ? "Just you"
              : `${groupMembers.length} members`}
            <ArrowRight className="inline w-4 h-4 align-middle ml-1" />
          </span>
        </div>
      </div>

      {/* Member Cards */}
      <div className="flex-1 px-4 lg:px-0 space-y-4 max-w-[500px] lg:max-w-2xl mx-auto w-full">
        {groupMembers.map((member: any) => {
          const memberData = cartByMember[member.id] || { member, items: [] };
          const memberItems = memberData.items || [];
          return (
            <div
              key={member.id}
              className="border border-gray-300 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-8 h-8 ${member.color} rounded-full flex items-center justify-center text-white font-semibold`}
                >
                  {member.avatar || member.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-black">{member.name}</div>
                  <div className="text-xs text-gray-500">
                    {memberItems.length} item
                    {memberItems.length !== 1 ? "s" : ""} added
                  </div>
                </div>
              </div>
              {memberItems.length === 0 ? (
                <div className="text-gray-400 text-sm italic py-4">
                  No items added yet
                </div>
              ) : (
                memberItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-gray-200 py-2 last:border-b-0"
                  >
                    <div>
                      <div className="text-black text-sm font-medium">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500">₹{item.price}</div>
                      {item.specialInstructions && (
                        <div className="text-xs text-gray-400 italic">
                          Note: {item.specialInstructions}
                        </div>
                      )}
                    </div>
                    {member.id === currentUserId ? (
                      <div className="flex items-center rounded-full px-2 py-1 bg-[#4d3a00] text-white cursor-pointer">
                        <button
                          onClick={() =>
                            updateCartItemQuantity(item.id, item.quantity - 1)
                          }
                          className="px-1 focus:outline-none"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-2 text-base font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartItemQuantity(item.id, item.quantity + 1)
                          }
                          className="px-1 focus:outline-none"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center rounded-full px-2 py-1 bg-gray-200 text-gray-600">
                        <span className="px-2 text-base font-semibold">
                          {item.quantity}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
              {member.id === currentUserId && (
                <button
                  onClick={() => navigate("/menu")}
                  className="mt-2 text-[#4d3a00] text-sm font-semibold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add more items
                </button>
              )}
            </div>
          );
        })}

        {/* Invite Button */}
        {/* <button
          onClick={() => navigate("/invite")}
          className="w-full flex items-center border border-[#4d3a00] rounded-xl overflow-hidden mt-2"
        >
          <span className="flex items-center gap-2 px-4 py-3 text-[#4d3a00] font-medium">
            <Users className="w-5 h-5" /> Invite friends to join your group
            order
          </span>
          <span className="ml-auto bg-[#4d3a00] text-white px-4 py-3 flex items-center">
            <ArrowRight className="w-5 h-5" />
          </span>
        </button> */}
      </div>

      {/* Subtotal */}
      <div className="px-4 lg:px-0 py-4 flex justify-between items-center text-base font-semibold mb-20 max-w-[500px] lg:max-w-2xl mx-auto w-full">
        <span className="text-gray-700">Subtotal</span>
        <span className="text-black">₹{getCartTotal().toFixed(2)}</span>
      </div>

      {/* Bottom Bar */}
      <div className="fixed left-0 right-0 bottom-0 px-4 pb-4 bg-transparent z-50">
        <div className="max-w-[500px] lg:max-w-2xl mx-auto">
          <button
            className="w-full bg-[#4d3a00] text-white py-3 rounded-full font-bold text-base flex items-center justify-center gap-2 shadow-lg"
            onClick={() => setShowOrderSummary(true)}
            disabled={totalItems === 0}
          >
            {totalItems} item{totalItems !== 1 ? "s" : ""} • Go to Cart{" "}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <OrderSummary
        open={showOrderSummary}
        onClose={() => setShowOrderSummary(false)}
      />

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Delete Group
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this group? This action cannot be
              undone and will remove all orders and data associated with this
              group.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                disabled={loading}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGroup}
                disabled={loading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Group
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupOrder;
