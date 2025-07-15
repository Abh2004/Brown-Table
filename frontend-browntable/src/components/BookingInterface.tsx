import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GuestSelector from "./GuestSelector";
import DateTimeSelector from "./DateTimeSelector";
import { useBooking } from "../context/BookingContext";
import { useGroupMembers } from "../context/groupMemebersContext";
import { useAuth } from "../context/AuthContext";

const BookingInterface: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    selectedDate,
    setSelectedDate,
    arrivalTime,
    setArrivalTime,
    checkoutTime,
    setCheckoutTime,
    setCurrentGroupId,
  } = useBooking();
  
  const { 
    groupInfo, 
    createGroup, 
    loading: groupLoading, 
    error: groupError 
  } = useGroupMembers();
  
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(1);

  const handleGuestCountChange = (count: number) => {
    setGuestCount(count);
  };

  const handleCreateGroup = async () => {
    if (!arrivalTime || !checkoutTime || !selectedDate || !user) {
      setLocalError("Please fill in all required fields and ensure you're logged in");
      return;
    }

    try {
      setIsCreatingGroup(true);
      setLocalError(null);
      
      const groupId = await createGroup({
        adminName: user.name,
        adminId: user.id,
        arrivalTime,
        departureTime: checkoutTime,
        date: selectedDate,
        guestCount: guestCount,
      });

      // Set the current group ID in booking context
      setCurrentGroupId(groupId);

      console.log("✅ Group created successfully with ID:", groupId);
      
      // Navigate to invite page
      navigate("/invite");
    } catch (error: any) {
      console.error("❌ Failed to create group:", error);
      setLocalError(error.message);
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleOrderForAll = async () => {
    if (!arrivalTime || !checkoutTime || !selectedDate || !user) {
      setLocalError("Please fill in all required fields and ensure you're logged in");
      return;
    }

    try {
      setIsCreatingGroup(true);
      setLocalError(null);

      // Create group first if not already created
      if (!groupInfo.id) {
        const groupId = await createGroup({
          adminName: user.name,
          adminId: user.id,
          arrivalTime,
          departureTime: checkoutTime,
          date: selectedDate,
          guestCount: guestCount,
        });

        setCurrentGroupId(groupId);
      }

      // Navigate to group order page
      navigate("/group-order");
    } catch (error: any) {
      console.error("❌ Failed to create group:", error);
      setLocalError(error.message);
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const isLoading = groupLoading || isCreatingGroup;
  const displayError = localError || groupError;

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-0 sm:pt-16 mb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Book Your Table
            </h2>
            <p className="text-gray-600 mt-1">
              Select your preferences for the perfect dining experience
            </p>
            {displayError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {displayError}
              </div>
            )}
          </div>

          <div className="p-6 space-y-8">
            {/* Guest Selector */}
            <GuestSelector
              guests={guestCount}
              onGuestsChange={handleGuestCountChange}
            />

            {/* Date & Time Selector */}
            <DateTimeSelector
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              arrivalTime={arrivalTime}
              onArrivalTimeChange={setArrivalTime}
              checkoutTime={checkoutTime}
              onCheckoutTimeChange={setCheckoutTime}
            />

            {/* Action Buttons */}
            <div className="flex flex-row justify-center gap-4 bottom-10 left-0 right-0 fixed sm:mx-2 mx-6">
              <button
                disabled={
                  arrivalTime === "" ||
                  checkoutTime === "" ||
                  selectedDate === "" ||
                  isLoading ||
                  !user
                }
                onClick={handleCreateGroup}
                className="flex-1 bg-[#4d3a00] text-white py-3 rounded-full font-medium text-base hover:bg-[#6e6240] transition-colors max-w-44 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating..." : "Invite members"}
              </button>
              <button
                onClick={handleOrderForAll}
                className="flex-1 bg-[#4d3a00] text-white py-3 rounded-full font-medium text-base hover:bg-[#6e6240] transition-colors max-w-44 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  arrivalTime === "" ||
                  checkoutTime === "" ||
                  selectedDate === "" ||
                  isLoading ||
                  !user
                }
              >
                {isLoading ? "Creating..." : "Order for all"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingInterface;
