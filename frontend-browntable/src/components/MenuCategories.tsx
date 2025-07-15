import React from "react";
import { Sparkles } from "lucide-react";
import MenuData from "./menuData.json";

interface MenuCategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

// Get unique categories from menu data
const getCategories = () => {
  const categories = new Set<string>();
  categories.add("All"); // Always include "All" option

  // Add section titles
  MenuData.data.forEach((section: any) => {
    categories.add(section.title);
  });

  // Add item categories
  MenuData.data.forEach((section: any) => {
    section.items.forEach((item: any) => {
      if (item.category) {
        categories.add(item.category);
      }
    });
  });

  return Array.from(categories).sort();
};

const categories = getCategories();

const MenuCategories: React.FC<MenuCategoriesProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-5 h-5 text-coffee-600" />
        <h3 className="text-lg font-semibold text-coffee-900 font-serif">Menu Categories</h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              selectedCategory === category
                ? "bg-coffee-gradient text-white shadow-warm-lg"
                : "bg-white text-coffee-700 border-2 border-coffee-200 hover:bg-coffee-50 hover:border-coffee-300 shadow-warm hover:shadow-warm-lg"
            }`}
          >
            <span className="relative z-10 text-sm font-semibold tracking-wide">
              {category}
            </span>
            {selectedCategory === category && (
              <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuCategories;
