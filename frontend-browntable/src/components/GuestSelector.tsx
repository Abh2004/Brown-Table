import React from "react";

interface GuestSelectorProps {
  guests: number;
  onGuestsChange: (guests: number) => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({
  guests,
  onGuestsChange,
}) => {
  const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div>
      <h3 className="text-base font-semibold text-black mb-2">
        Number of guests
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {guestOptions.map((count) => (
          <button
            key={count}
            onClick={() => onGuestsChange(count)}
            className={`w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full border text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#85754d] focus:border-[#85754d] ${
              guests === count
                ? "bg-[#85754d] text-white border-[#85754d]"
                : "bg-white text-black border-[#85754d] hover:bg-[#85754d]/10"
            }`}
          >
            {count}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GuestSelector;
