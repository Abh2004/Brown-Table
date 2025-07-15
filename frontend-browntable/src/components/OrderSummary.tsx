import React, { useState } from "react";
import { useBooking } from "../context/BookingContext";
import { useGroupMembers } from "../context/groupMemebersContext";
import { X, Plus, Minus } from "lucide-react";

interface OrderSummaryProps {
  open: boolean;
  onClose: () => void;
}

const SERVICE_RATE = 0.1;
const TAX_RATE = 0.18;

const OrderSummary: React.FC<OrderSummaryProps> = ({ open, onClose }) => {
  const { cart, updateCartItemQuantity, updateCartItemNotes } = useBooking();
  const { groupMembers, groupInfo } = useGroupMembers();

  // Assume the logged-in user is 'karthik' for demo
  // TODO: Get current user from the database
  const currentUserId = "karthik";

  // Notes editing state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>("");

  // Group cart items by member
  const cartByMember = groupMembers.reduce((acc: any, member: any) => {
    acc[member.id] = cart.filter((item: any) => item.addedBy === member.id);
    return acc;
  }, {} as Record<string, any[]>);

  // Calculate totals
  const getSubtotal = (items: any[]) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const getService = (subtotal: number) => Math.round(subtotal * SERVICE_RATE);
  const getTax = (subtotal: number) => Math.round(subtotal * TAX_RATE);

  const memberTotals = groupMembers.map((member: any) => {
    const items = cartByMember[member.id] || [];
    const subtotal = getSubtotal(items);
    const service = getService(subtotal);
    const tax = getTax(subtotal);
    return {
      member,
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
  cart.forEach((item: any) => {
    if (item.specialInstructions) {
      notes[item.id] = item.specialInstructions;
    }
  });

  // Handle note edit
  const handleEditNote = (item: any) => {
    setEditingNoteId(item.id);
    setNoteInput(notes[item.id] || "");
  };
  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteInput(e.target.value);
  };
  const handleNoteSave = (item: any) => {
    updateCartItemNotes(item.id, noteInput);
    setEditingNoteId(null);
  };
  const handleNoteKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    item: any
  ) => {
    if (e.key === "Enter") {
      handleNoteSave(item);
    } else if (e.key === "Escape") {
      setEditingNoteId(null);
    }
  };

  return (
    <div className="fixed z-50 max-w-[100vw]">
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-50 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ minHeight: "70vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b">
          <div className="font-bold text-lg">Order Summary</div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Table/Time Info */}
        <div className="px-4 py-2 text-sm text-gray-600 flex items-center gap-2 border-b">
          <span>{groupMembers.length} guests</span>
          <span>•</span>
          <span>{groupInfo.arrivalTime}</span>
          <span>•</span>
          <span>{groupInfo.departureTime}</span>
        </div>
        {/* Orders by Member */}
        <div className="px-4 py-4 space-y-8">
          {memberTotals.map(
            ({ member, items, subtotal, service, tax, total }) => (
              <div key={member.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold flex items-center gap-2">
                    <span>👤</span>
                    {member.name}'s order
                  </div>
                  <div className="font-bold">₹{total.toFixed(2)}</div>
                </div>
                {items.map((item: any) => (
                  <div key={item.id} className="mb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.addedBy === currentUserId && (
                          <button
                            className="text-xs text-[#4d3a00] underline mt-1 block"
                            onClick={() => handleEditNote(item)}
                          >
                            {notes[item.id]
                              ? "Edit instructions"
                              : "Add instructions"}
                          </button>
                        )}
                        {editingNoteId === item.id ? (
                          <input
                            className="border border-gray-300 rounded px-2 py-1 text-xs mt-1 w-32"
                            placeholder="Add special instructions"
                            value={noteInput}
                            autoFocus
                            onChange={handleNoteChange}
                            onBlur={() => handleNoteSave(item)}
                            onKeyDown={(e) => handleNoteKeyDown(e, item)}
                          />
                        ) : notes[item.id] ? (
                          <div className="text-xs text-gray-500 mt-1">
                            {notes[item.id]}
                          </div>
                        ) : null}
                      </div>
                      <div className="items-center">
                        <div
                          className={`flex items-center bg-[#4d3a00] rounded-lg py-1 ${
                            item.addedBy === currentUserId
                              ? "bg-[#4d3a00] text-white"
                              : "bg-gray-200 text-black cursor-not-allowed"
                          }`}
                        >
                          <button
                            className={`rounded-l-md px-3 py-1 text-base font-bold m-0 h-auto ${
                              item.addedBy === currentUserId
                                ? "bg-[#4d3a00] text-white"
                                : "bg-gray-200 text-black cursor-not-allowed"
                            }`}
                            disabled={item.addedBy !== currentUserId}
                            onClick={() => {
                              if (item.addedBy === currentUserId) {
                                updateCartItemQuantity(
                                  item.id,
                                  item.quantity - 1
                                );
                              }
                            }}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-2 text-base m-0 h-auto font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            className={`px-3 rounded-r-md py-1 text-base font-bold m-0 h-auto ${
                              item.addedBy === currentUserId
                                ? "bg-[#4d3a00] text-white"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                            disabled={item.addedBy !== currentUserId}
                            onClick={() => {
                              if (item.addedBy === currentUserId) {
                                updateCartItemQuantity(
                                  item.id,
                                  item.quantity + 1
                                );
                              }
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-right font-semibold ml-4">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Subtotals */}
                <div className="text-xs text-gray-500 mt-2 ml-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service (10%):</span>
                    <span>₹{service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%):</span>
                    <span>₹{tax}</span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        {/* Grand Total */}
        <div className="px-4 py-2 border-t font-bold text-lg flex justify-between">
          <span>Grand Total :</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
        {/* Info Box */}
        <div className="px-4 py-4">
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-sm flex items-start gap-2">
            <span className="mt-1">⚠️</span>
            <span>
              <span className="font-semibold">Important:</span> <br />
              You will pay the bill for the entire order, your friends can pay
              you through the app or pay you separately
            </span>
          </div>
        </div>
        {/* Payment Section */}
        <div className="px-4 pb-6">
          <button className="w-full bg-[#e9e7d7] text-black rounded-lg flex items-center justify-between px-4 py-3 font-semibold mb-2">
            <span className="items-center ">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Google_Pay_Logo.svg"
                alt="Google Pay"
                className="h-5 w-5"
              />
              <div className="flex items-left">
                <div className="text-left">
                  <div className="text-xs">Pay using </div>
                  Google Pay UPI
                </div>
              </div>
            </span>
            <div className="bg-[#4d3a00] text-white rounded px-4 ml-2 items-center flex justify-between w-[200px] py-2">
              <div className=" items-center">
                <div className="font-semibold">₹{grandTotal.toFixed(2)}</div>
                <div className="">Total</div>{" "}
              </div>
              <div className="">Pay now &gt;</div>{" "}
              {/* <div className="underline">Pay later &gt;</div> */}
            </div>
          </button>
          <div className="text-xs text-gray-600 mt-2 flex items-center gap-2">
            <span className="text-green-600">●</span> Request accepted
            <span className="text-gray-400">●</span> Non-Smoking
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
