import React, { useState } from "react";
import {
  MapPin,
  Grid,
  Eye,
  Edit3,
  Check,
  X,
  Users,
  Clock,
  Calendar,
} from "lucide-react";

interface Table {
  id: string;
  number: number;
  status: "free" | "reserved" | "occupied" | "maintenance";
  capacity: number;
  currentGuests: number;
  location?: string;
  section?: string;
  guestName?: string;
  reservationTime?: string;
  arrivalTime?: string;
  departureTime?: string;
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
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleViewMore = (table: Table) => {
    setSelectedTable(table);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTable(null);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedTable || !onTableStatusUpdate) return;

    try {
      await onTableStatusUpdate(
        selectedTable.id,
        newStatus,
        selectedTable.currentGuests
      );
      setSelectedTable({ ...selectedTable, status: newStatus as any });
    } catch (error) {
      console.error("Failed to update table status:", error);
    }
  };

  const currentTimeSlot = data[selectedTimeSlot];

  return (
    <>
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
                    <>
                      <div
                        className="flex items-center justify-between mb-2"
                        style={{
                          backgroundColor: getStatusColor(table.status),
                        }}
                      >
                        <h4 className="font-semibold text-coffee-900">
                          Table {table.number} |{" "}
                          <span className="text-coffee-600 text-[0.7rem] font-sans">
                            {table.capacity} seats
                          </span>
                        </h4>
                        <span
                          className={`text-coffee-600 text-[1rem] font-sans ${
                            table.status === "free"
                              ? "text-green-600"
                              : table.status === "reserved"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          ⦿
                        </span>
                      </div>

                      <div className="space-y-1 text-sm">
                        <p className="text-coffee-600">
                          {table.status === "free"
                            ? "Free"
                            : table.status === "reserved"
                            ? ` ${table.guestName || "Guest"} `
                            : ` ${table.guestName || "Guest"} `}
                        </p>
                      </div>

                      <button
                        onClick={() => handleViewMore(table)}
                        className="mt-3 w-full text-xs text-coffee-600 hover:text-coffee-700 flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View More
                      </button>
                    </>
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

      {/* Table Details Modal */}
      {isModalOpen && selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-coffee-100 relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 w-8 h-8 bg-coffee-100 rounded-full flex items-center justify-center hover:bg-coffee-200 transition-colors"
              >
                <X className="w-4 h-4 text-coffee-600" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-coffee-900">
                  The Brown Table
                </h2>
                <p className="text-coffee-600 text-sm mt-1">
                  238, Dr CV Raman Road, RMV extension, Sadashiva Nagar,
                  Bengaluru, Karnataka 560080
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Table Info */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-coffee-900">
                    {selectedTable.guestName || "Guest"}
                  </h3>
                  <span className="text-coffee-600 font-medium">
                    Table - {selectedTable.number}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-coffee-600">
                    <Calendar className="w-4 h-4" />
                    <span>DATE: {new Date().toLocaleDateString("en-GB")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-coffee-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date().toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-coffee-600">
                    <Users className="w-4 h-4" />
                    <span>Capacity: {selectedTable.capacity} seats</span>
                  </div>
                </div>

                {/* Current Status */}
                <div className="mt-4 p-3 rounded-lg bg-coffee-50">
                  <div className="flex items-center justify-between">
                    <span className="text-coffee-700 font-medium">
                      Current Status:
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        selectedTable.status === "free"
                          ? "bg-green-100 text-green-700"
                          : selectedTable.status === "reserved"
                          ? "bg-yellow-100 text-yellow-700"
                          : selectedTable.status === "occupied"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {getStatusText(selectedTable.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              <div className="space-y-3">
                {selectedTable.status === "free" && (
                  <>
                    <button
                      onClick={() => handleStatusChange("maintenance")}
                      className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                    >
                      Block the table
                    </button>
                    <button
                      onClick={() => handleStatusChange("reserved")}
                      className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                    >
                      Reserve the table
                    </button>
                  </>
                )}

                {selectedTable.status === "reserved" && (
                  <>
                    <button
                      onClick={() => handleStatusChange("occupied")}
                      className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                      Mark as Occupied
                    </button>
                    <button
                      onClick={() => handleStatusChange("free")}
                      className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                      Cancel Reservation
                    </button>
                  </>
                )}

                {selectedTable.status === "occupied" && (
                  <button
                    onClick={() => handleStatusChange("free")}
                    className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    Bill order and free table
                  </button>
                )}

                {selectedTable.status === "maintenance" && (
                  <button
                    onClick={() => handleStatusChange("free")}
                    className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    Unblock table
                  </button>
                )}
              </div>

              {/* Reservation Details */}
              {selectedTable.status !== "free" &&
                selectedTable.status !== "maintenance" && (
                  <div className="mt-6 p-4 bg-coffee-50 rounded-lg">
                    <h4 className="font-medium text-coffee-900 mb-3">
                      Reservation Details
                    </h4>
                    <div className="space-y-2 text-sm text-coffee-600">
                      {selectedTable.arrivalTime && (
                        <div>Arrival: {selectedTable.arrivalTime}</div>
                      )}
                      {selectedTable.departureTime && (
                        <div>Departure: {selectedTable.departureTime}</div>
                      )}
                      {selectedTable.currentGuests > 0 && (
                        <div>Current Guests: {selectedTable.currentGuests}</div>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TableOverview;
