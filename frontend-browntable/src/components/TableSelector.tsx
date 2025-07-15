import React from 'react';

interface TableSelectorProps {
  selectedTable: string | null;
  onTableSelect: (table: string | null) => void;
}

const TableSelector: React.FC<TableSelectorProps> = ({ selectedTable, onTableSelect }) => {
  const tables = [
    { id: 'table-1', x: 20, y: 20, size: 'small' },
    { id: 'table-2', x: 60, y: 20, size: 'medium' },
    { id: 'table-3', x: 20, y: 60, size: 'large' },
    { id: 'table-4', x: 60, y: 60, size: 'small' },
    { id: 'table-5', x: 80, y: 40, size: 'medium' },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select your table</h3>
      
      <div className="mb-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 border-2 border-gray-300 rounded"></div>
          <span className="text-sm text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-900 rounded"></div>
          <span className="text-sm text-gray-600">Selected</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 min-h-[300px] relative border-2 border-dashed border-gray-300">
        {/* Restaurant Layout */}
        <div className="absolute inset-4">
          {/* Bar Area */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Bar
          </div>

          {/* Tables */}
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => onTableSelect(table.id)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-lg transition-all hover:scale-110 ${
                table.size === 'small' ? 'w-8 h-8' : table.size === 'medium' ? 'w-10 h-10' : 'w-12 h-12'
              } ${
                selectedTable === table.id
                  ? 'bg-amber-900 border-2 border-amber-700'
                  : 'bg-gray-200 border-2 border-gray-300 hover:bg-gray-300'
              }`}
              style={{
                left: `${table.x}%`,
                top: `${table.y}%`,
              }}
            />
          ))}

          {/* Entrance */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 flex items-center gap-1">
            ↑ Entrance
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSelector;