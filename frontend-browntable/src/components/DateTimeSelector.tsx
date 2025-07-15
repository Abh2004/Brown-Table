import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DateTimeSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  arrivalTime: string;
  onArrivalTimeChange: (time: string) => void;
  checkoutTime: string;
  onCheckoutTimeChange: (time: string) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  onDateChange,
  arrivalTime,
  onArrivalTimeChange,
  checkoutTime,
  onCheckoutTimeChange,
}) => {
  // State for arrival time components
  const [arrivalHour, setArrivalHour] = useState("11");
  const [arrivalMinute, setArrivalMinute] = useState("00");
  const [arrivalPeriod, setArrivalPeriod] = useState("AM");

  // State for checkout time components
  const [checkoutHour, setCheckoutHour] = useState("12");
  const [checkoutMinute, setCheckoutMinute] = useState("00");
  const [checkoutPeriod, setCheckoutPeriod] = useState("PM");

  // Initialize from props
  useEffect(() => {
    if (arrivalTime) {
      const parts = arrivalTime.split(":");
      if (parts.length === 2) {
        let hour = parseInt(parts[0]);
        const minute = parts[1];
        const period = hour >= 12 ? "PM" : "AM";
        if (hour > 12) hour -= 12;
        if (hour === 0) hour = 12;
        
        setArrivalHour(hour.toString());
        setArrivalMinute(minute);
        setArrivalPeriod(period);
      }
    }
  }, [arrivalTime]);

  useEffect(() => {
    if (checkoutTime) {
      const parts = checkoutTime.split(":");
      if (parts.length === 2) {
        let hour = parseInt(parts[0]);
        const minute = parts[1];
        const period = hour >= 12 ? "PM" : "AM";
        if (hour > 12) hour -= 12;
        if (hour === 0) hour = 12;
        
        setCheckoutHour(hour.toString());
        setCheckoutMinute(minute);
        setCheckoutPeriod(period);
      }
    }
  }, [checkoutTime]);

  // Convert 12-hour to 24-hour format
  const convertTo24Hour = (hour: string, minute: string, period: string) => {
    let hour24 = parseInt(hour);
    if (period === "AM" && hour24 === 12) {
      hour24 = 0;
    } else if (period === "PM" && hour24 !== 12) {
      hour24 += 12;
    }
    return `${hour24.toString().padStart(2, "0")}:${minute}`;
  };

  // Handle arrival time changes
  const handleArrivalTimeChange = (hour?: string, minute?: string, period?: string) => {
    const newHour = hour || arrivalHour;
    const newMinute = minute || arrivalMinute;
    const newPeriod = period || arrivalPeriod;
    
    if (hour) setArrivalHour(hour);
    if (minute) setArrivalMinute(minute);
    if (period) setArrivalPeriod(period);
    
    const time24 = convertTo24Hour(newHour, newMinute, newPeriod);
    onArrivalTimeChange(time24);
  };

  // Handle checkout time changes
  const handleCheckoutTimeChange = (hour?: string, minute?: string, period?: string) => {
    const newHour = hour || checkoutHour;
    const newMinute = minute || checkoutMinute;
    const newPeriod = period || checkoutPeriod;
    
    if (hour) setCheckoutHour(hour);
    if (minute) setCheckoutMinute(minute);
    if (period) setCheckoutPeriod(period);
    
    const time24 = convertTo24Hour(newHour, newMinute, newPeriod);
    onCheckoutTimeChange(time24);
  };

  // Generate hour options (1-12)
  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  
  // Generate minute options
  const minuteOptions = [
    "00", "15", "30", "45"
  ];

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select Date
        </h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          max={
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4d3a00] focus:border-[#4d3a00] transition-colors"
        />
      </div>

      {/* Arrival Time Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Arrival Time
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {/* Hour */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hour</label>
            <div className="relative">
              <select
                value={arrivalHour}
                onChange={(e) => handleArrivalTimeChange(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4d3a00] focus:border-[#4d3a00] appearance-none cursor-pointer"
              >
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Minute */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minute</label>
            <div className="relative">
              <select
                value={arrivalMinute}
                onChange={(e) => handleArrivalTimeChange(undefined, e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4d3a00] focus:border-[#4d3a00] appearance-none cursor-pointer"
              >
                {minuteOptions.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* AM/PM */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
            <div className="relative">
              <select
                value={arrivalPeriod}
                onChange={(e) => handleArrivalTimeChange(undefined, undefined, e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4d3a00] focus:border-[#4d3a00] appearance-none cursor-pointer"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">
            Arrival time: <span className="font-semibold text-gray-900">{arrivalHour}:{arrivalMinute} {arrivalPeriod}</span>
          </span>
        </div>
      </div>

      {/* Checkout Time Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Departure Time
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {/* Hour */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hour</label>
            <div className="relative">
              <select
                value={checkoutHour}
                onChange={(e) => handleCheckoutTimeChange(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4d3a00] focus:border-[#4d3a00] appearance-none cursor-pointer"
              >
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Minute */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minute</label>
            <div className="relative">
              <select
                value={checkoutMinute}
                onChange={(e) => handleCheckoutTimeChange(undefined, e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4d3a00] focus:border-[#4d3a00] appearance-none cursor-pointer"
              >
                {minuteOptions.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* AM/PM */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
            <div className="relative">
              <select
                value={checkoutPeriod}
                onChange={(e) => handleCheckoutTimeChange(undefined, undefined, e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4d3a00] focus:border-[#4d3a00] appearance-none cursor-pointer"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">
            Departure time: <span className="font-semibold text-gray-900">{checkoutHour}:{checkoutMinute} {checkoutPeriod}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelector;
