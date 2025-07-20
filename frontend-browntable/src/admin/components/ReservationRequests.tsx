import React, { useState } from "react";
import {
  Users,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Member {
  name: string;
  phone: string;
}

interface Reservation {
  id: string;
  guestName: string;
  guestCount: number;
  reservationTime: string;
  table: string;
  status: string;
  createdAt: string;
  preOrderDetails: string;
  members: Member[];
}

interface ReservationRequestsProps {
  reservations: Reservation[];
  countPendingReservations: number;
  onConfirm: (groupId: string) => void;
  onCancel: (groupId: string) => void;
}

const ReservationRequests: React.FC<ReservationRequestsProps> = ({
  reservations,
  countPendingReservations,
  onConfirm,
  onCancel,
}) => {
  const [expandedReservation, setExpandedReservation] = useState<string | null>(
    null
  );

  const toggleExpanded = (id: string) => {
    setExpandedReservation(expandedReservation === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-warm border border-coffee-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-coffee-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-coffee-900">
              Reservation Requests
            </h2>
            <p className="text-coffee-600 text-sm">
              {countPendingReservations} pending request
              {countPendingReservations !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="w-8 h-8 bg-coffee-100 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-coffee-600" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {reservations.length === 0 ? (
          <div className="p-6 text-center">
            <Users className="w-12 h-12 text-coffee-300 mx-auto mb-3" />
            <p className="text-coffee-600">No pending reservations</p>
            <p className="text-coffee-500 text-sm">All caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-coffee-100">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="p-4 hover:bg-coffee-50 transition-colors"
              >
                {/* Main Info */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-coffee-900">
                        {reservation.guestName}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          reservation.status
                        )}`}
                      >
                        {reservation.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-coffee-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{reservation.guestCount} guests</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{reservation.reservationTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>Table {reservation.table}</span>
                      </div>
                    </div>

                    <p className="text-xs text-coffee-500">
                      Requested on {formatDate(reservation.createdAt)} at{" "}
                      {formatTime(reservation.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleExpanded(reservation.id)}
                      className="p-1 hover:bg-coffee-100 rounded transition-colors"
                    >
                      {expandedReservation === reservation.id ? (
                        <ChevronUp className="w-4 h-4 text-coffee-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-coffee-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedReservation === reservation.id && (
                  <div className="mt-4 pt-4 border-t border-coffee-100">
                    <div className="space-y-3">
                      {/* Members */}
                      <div>
                        <h4 className="text-sm font-medium text-coffee-900 mb-2">
                          Group Members
                        </h4>
                        <div className="space-y-1">
                          {reservation.members.map((member, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-coffee-700">
                                {member.name}
                              </span>
                              <span className="text-coffee-500">
                                {member.phone}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pre-order Details */}
                      <div>
                        <h4 className="text-sm font-medium text-coffee-900 mb-2">
                          Pre-order Details
                        </h4>
                        <p className="text-sm text-coffee-600 bg-coffee-50 p-3 rounded-lg">
                          {reservation.preOrderDetails}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => onConfirm(reservation.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Confirm
                        </button>
                        <button
                          onClick={() => onCancel(reservation.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationRequests;
