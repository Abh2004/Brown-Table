import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Filter,
  Plus,
  Coffee,
  Users,
  Clock,
  Award,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import MenuCategories from "./MenuCategories";
import MenuItems from "./MenuItems";
import DietaryFilters from "./DietaryFilters";
import { useGroupMembers } from "../context/groupMemebersContext";
import { useBooking } from "../context/BookingContext";

const RestaurantMenu: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "veg" | "non-veg">(
    "all"
  );
  const { groupMembers, groupInfo } = useGroupMembers();
  const { refreshOrderData, loading } = useBooking();

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 via-latte-50 to-cream-50">
      {/* Elegant Hero Section */}
      <section className="relative h-80 lg:h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
            alt="The Brown Table Restaurant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/80 via-coffee-800/40 to-coffee-700/20"></div>
        </div>

        {/* Floating coffee beans decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-12 left-8 w-3 h-3 bg-cream/30 rounded-full animate-float-1"></div>
          <div className="absolute top-24 right-12 w-2 h-2 bg-latte-200/40 rounded-full animate-float-2"></div>
          <div className="absolute bottom-20 left-1/4 w-4 h-4 bg-coffee-300/30 rounded-full animate-float-3"></div>
          <div className="absolute bottom-12 right-1/3 w-2 h-2 bg-cream/40 rounded-full animate-float-4"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-end">
          <div className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Restaurant Title with Coffee Icon */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-coffee-gradient rounded-full flex items-center justify-center shadow-warm">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-6xl font-bold text-white font-serif tracking-tight">
                    The Brown Table
                  </h1>
                  <p className="text-cream/90 text-lg font-light mt-1">
                    Curated Culinary Experience
                  </p>
                </div>
              </div>

              {/* Group Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-cream" />
                    <div>
                      <p className="text-white font-semibold">
                        {groupMembers.length} Guests
                      </p>
                      <p className="text-cream/70 text-sm">Group Size</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-cream" />
                    <div>
                      <p className="text-white font-semibold">
                        {groupInfo.arrivalTime}
                      </p>
                      <p className="text-cream/70 text-sm">Arrival Time</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <Coffee className="w-5 h-5 text-cream" />
                    <div>
                      <p className="text-white font-semibold">
                        {groupInfo.table}
                      </p>
                      <p className="text-cream/70 text-sm">Table</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-cream" />
                    <div>
                      <p className="text-white font-semibold">
                        {groupInfo.discount}% Off
                      </p>
                      <p className="text-cream/70 text-sm">Group Discount</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Group Members Status Section */}
      <section className="bg-white shadow-warm border-b border-coffee-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Status Legend */}
            <div className="flex items-center gap-6">
              <h3 className="text-coffee-900 font-semibold font-serif text-lg">
                Group Status:
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-400 rounded-full shadow-sm"></div>
                  <span className="text-coffee-700">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                  <span className="text-coffee-700">Accepted</span>
                </div>
              </div>
            </div>

            {/* Group Members and Refresh Button */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {groupMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 bg-white border-2 border-coffee-200 px-4 py-2 rounded-full shadow-warm hover:shadow-warm-lg transition-all duration-200 whitespace-nowrap"
                  >
                    <div
                      className={`w-3 h-3 rounded-full shadow-sm ${
                        member.hasAccepted === true
                          ? "bg-green-500"
                          : "bg-amber-400"
                      }`}
                    ></div>
                    <span className="text-coffee-800 font-medium text-sm">
                      {member.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Refresh Button */}
              <button
                onClick={refreshOrderData}
                disabled={loading}
                className="flex items-center gap-2 bg-coffee-600 hover:bg-coffee-700 text-white px-4 py-2 rounded-full shadow-warm hover:shadow-warm-lg transition-all duration-200 disabled:opacity-50"
                title="Refresh group order data"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-coffee-900 font-serif mb-4">
            Curated Menu Collection
          </h2>
          <p className="text-coffee-600 text-lg max-w-2xl mx-auto">
            Discover our carefully crafted dishes made with premium ingredients
            and culinary expertise
          </p>
        </div>

        {/* Menu Filters and Categories */}
        <div className="bg-white rounded-2xl shadow-warm border border-coffee-100 p-6 mb-8">
          <MenuCategories
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <DietaryFilters
            selectedFilter={dietaryFilter}
            onFilterChange={setDietaryFilter}
          />
        </div>

        {/* Menu Items */}
        <MenuItems category={selectedCategory} dietaryFilter={dietaryFilter} />
      </section>
    </div>
  );
};

export default RestaurantMenu;
