import React from 'react';
import { Leaf, Heart, Star } from 'lucide-react';

interface DietaryFiltersProps {
  selectedFilter: 'all' | 'veg' | 'non-veg';
  onFilterChange: (filter: 'all' | 'veg' | 'non-veg') => void;
}

const DietaryFilters: React.FC<DietaryFiltersProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const filters = [
    {
      id: 'all',
      label: 'All Items',
      icon: Star,
      color: 'coffee',
      description: 'Complete menu'
    },
    {
      id: 'veg',
      label: 'Vegetarian',
      icon: Leaf,
      color: 'green',
      description: 'Plant-based dishes'
    },
    {
      id: 'non-veg',
      label: 'Non-Vegetarian',
      icon: Heart,
      color: 'red',
      description: 'Meat & seafood'
    }
  ];

  return (
    <div className="border-t border-coffee-100 pt-6">
      <div className="flex items-center gap-3 mb-4">
        <Leaf className="w-5 h-5 text-coffee-600" />
        <h3 className="text-lg font-semibold text-coffee-900 font-serif">Dietary Preferences</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isSelected = selectedFilter === filter.id;
          
          return (
            <label
              key={filter.id}
              className={`group relative cursor-pointer block p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                isSelected
                  ? filter.color === 'green'
                    ? 'bg-green-50 border-green-300 shadow-lg'
                    : filter.color === 'red'
                    ? 'bg-red-50 border-red-300 shadow-lg'
                    : 'bg-coffee-50 border-coffee-300 shadow-lg'
                  : 'bg-white border-coffee-200 hover:bg-coffee-25 hover:border-coffee-300 shadow-warm hover:shadow-warm-lg'
              }`}
            >
              <input
                type="radio"
                name="dietary"
                checked={isSelected}
                onChange={() => onFilterChange(filter.id as any)}
                className="sr-only"
              />
              
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSelected
                    ? filter.color === 'green'
                      ? 'bg-green-500 text-white shadow-md'
                      : filter.color === 'red'
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-coffee-600 text-white shadow-md'
                    : 'bg-coffee-100 text-coffee-600 group-hover:bg-coffee-200'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold ${
                      isSelected ? 'text-coffee-900' : 'text-coffee-800'
                    }`}>
                      {filter.label}
                    </span>
                    
                    {/* Visual indicator for veg/non-veg */}
                    {filter.id !== 'all' && (
                      <div className={`w-3 h-3 rounded-full shadow-sm ${
                        filter.id === 'veg' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    )}
                  </div>
                  
                  <p className={`text-sm ${
                    isSelected ? 'text-coffee-700' : 'text-coffee-600'
                  }`}>
                    {filter.description}
                  </p>
                </div>
              </div>
              
              {/* Selection indicator */}
              {isSelected && (
                <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                  filter.color === 'green'
                    ? 'bg-green-500'
                    : filter.color === 'red'
                    ? 'bg-red-500'
                    : 'bg-coffee-600'
                } shadow-md animate-scale-in`}>
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default DietaryFilters;