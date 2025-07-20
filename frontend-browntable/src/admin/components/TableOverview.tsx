import React, { useState } from "react";
import { MapPin, Grid, Eye, Edit3, Check, X } from "lucide-react";

interface Table {
  id: string;
  number: number;
  status: "free" | "reserved" | "occupied" | "maintenance";
  capacity: number;
  currentGuests: number;
  location?: string;
  section?: string;
}

interface TimeSlot {
  time: string;
  tables: Table[];
}

interface TableOverviewProps {
  data: TimeSlot[];
  countFreeTables: number;
  countReservedTables: number;
  countOccupiedTables: number;
  viewMode: "tab" | "map";
  onViewModeChange: (mode: "tab" | "map") => void;
  onTableStatusUpdate?: (
    tableId: string,
    status: string,
    currentGuests?: number
  ) => Promise<void>;
}

const TableOverview: React.FC<TableOverviewProps> = ({
  data,
  countFreeTables,
  countReservedTables,
  countOccupiedTables,
  viewMode,
  onViewModeChange,
  onTableStatusUpdate,
}) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(0);
  const [editingTable, setEditingTable] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editGuests, setEditGuests] = useState<number>(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "free":
        return "bg-green-500";
      case "reserved":
        return "bg-yellow-500";
      case "occupied":
        return "bg-red-500";
      case "maintenance":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "free":
        return "Free";
      case "reserved":
        return "Reserved";
      case "occupied":
        return "Occupied";
      case "maintenance":
        return "Maintenance";
      default:
        return "Unknown";
    }
  };

  const handleEditTable = (table: Table) => {
    setEditingTable(table.id);
    setEditStatus(table.status);
    setEditGuests(table.currentGuests);
  };

  const handleSaveTable = async () => {
    if (!editingTable || !onTableStatusUpdate) return;

    try {
      await onTableStatusUpdate(editingTable, editStatus, editGuests);
      setEditingTable(null);
    } catch (error) {
      console.error("Failed to update table status:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTable(null);
  };

  const currentTimeSlot = data[selectedTimeSlot];

  return (
    <div className="bg-white rounded-2xl shadow-warm border border-coffee-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-coffee-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-coffee-900">
              Table Overview
            </h2>
            <p className="text-coffee-600 text-sm">
              Monitor table status and availability
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewModeChange("tab")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "tab"
                  ? "bg-coffee-100 text-coffee-700"
                  : "text-coffee-600 hover:bg-coffee-50"
              }`}
              title="Tab View"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange("map")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "map"
                  ? "bg-coffee-100 text-coffee-700"
                  : "text-coffee-600 hover:bg-coffee-50"
              }`}
              title="Map View (Coming Soon)"
            >
              <MapPin className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {viewMode === "tab" ? (
          <div>
            {/* Tables Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentTimeSlot?.tables.map((table) => (
                <div
                  key={table.id}
                  className="border border-coffee-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {editingTable === table.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-coffee-900">
                          Table {table.number} | {table.capacity} seats
                        </h4>
                        <div className="flex gap-1">
                          <button
                            onClick={handleSaveTable}
                            className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                            title="Save"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-coffee-600 mb-1">
                            Status
                          </label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="w-full text-sm border border-coffee-200 rounded px-2 py-1"
                          >
                            <option value="free">Free</option>
                            <option value="reserved">Reserved</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-coffee-600 mb-1">
                            Current Guests
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={table.capacity}
                            value={editGuests}
                            onChange={(e) =>
                              setEditGuests(Number(e.target.value))
                            }
                            className="w-full text-sm border border-coffee-200 rounded px-2 py-1"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div
                        className="flex items-center justify-between mb-2"
                        style={{
                          backgroundColor: getStatusColor(table.status),
                        }}
                      >
                        <h4 className="font-semibold text-coffee-900">
                          Table {table.number} |
                          <span className="text-coffee-600 text-[0.1xl] font-sans">
                            {table.capacity} seats
                          </span>
                        </h4>
                        <button
                          onClick={() => handleEditTable(table)}
                          className="p-1 hover:bg-coffee-100 rounded transition-colors"
                          title="Edit Table"
                        >
                          <Edit3 className="w-3 h-3 text-coffee-600" />
                        </button>
                      </div>

                      <div className="space-y-1 text-sm">
                        <p className="text-coffee-600">
                          Capacity:{" "}
                          <span className="font-medium">
                            {table.capacity} people
                          </span>
                        </p>
                        {table.status === "occupied" && (
                          <p className="text-coffee-600">
                            Current:{" "}
                            <span className="font-medium">
                              {table.currentGuests} guests
                            </span>
                          </p>
                        )}
                      </div>

                      <button className="mt-3 w-full text-xs text-coffee-600 hover:text-coffee-700 flex items-center justify-center gap-1">
                        <Eye className="w-3 h-3" />
                        View More
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-coffee-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-coffee-900 mb-2">
              Map View
            </h3>
            <p className="text-coffee-600">
              Graphical table layout coming soon!
            </p>
            <p className="text-coffee-500 text-sm mt-2">
              This will show the physical layout of tables in the restaurant
            </p>
          </div>
        )}
      </div>
      <div className="mb-4 ml-8">
        <div className="flex items-center gap-4 text-sm text-coffee-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Free: {countFreeTables}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Reserved: {countReservedTables}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Occupied: {countOccupiedTables}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Maintenance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableOverview;
