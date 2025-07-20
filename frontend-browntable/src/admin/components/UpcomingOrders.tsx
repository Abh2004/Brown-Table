import React from "react";
import {
  Coffee,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  Timer,
} from "lucide-react";

interface Order {
  id: string;
  groupId: string;
  guestName: string;
  table: string;
  orderSummary: string;
  totalAmount: number;
  createdAt: string;
  estimatedReadyTime: string;
  status: string;
  estimatedTime: number;
  items: any[];
}

interface UpcomingOrdersProps {
  orders: Order[];
  onClear: (orderId: string) => void;
}

const UpcomingOrders: React.FC<UpcomingOrdersProps> = ({ orders, onClear }) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeUntilReady = (estimatedReadyTime: string) => {
    const now = new Date();
    const readyTime = new Date(estimatedReadyTime);
    const diffInMinutes = Math.ceil(
      (readyTime.getTime() - now.getTime()) / (1000 * 60)
    );

    if (diffInMinutes <= 0) {
      return "Ready now";
    } else if (diffInMinutes === 1) {
      return "1 minute";
    } else {
      return `${diffInMinutes} minutes`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "served":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-warm border border-coffee-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-coffee-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-coffee-900">
              Upcoming Orders
            </h2>
            <p className="text-coffee-600 text-sm">
              Orders within 30 minutes ({orders.length})
            </p>
          </div>
          <div className="w-8 h-8 bg-coffee-100 rounded-full flex items-center justify-center">
            <Coffee className="w-4 h-4 text-coffee-600" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto">
        {orders.length === 0 ? (
          <div className="p-6 text-center">
            <Coffee className="w-12 h-12 text-coffee-300 mx-auto mb-3" />
            <p className="text-coffee-600">No upcoming orders</p>
            <p className="text-coffee-500 text-sm">All orders are handled!</p>
          </div>
        ) : (
          <div className="divide-y divide-coffee-100">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 hover:bg-coffee-50 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-coffee-900">
                        {order.guestName}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-coffee-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>Table {order.table}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Ordered: {formatTime(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer className="w-4 h-4" />
                        <span className="font-medium text-coffee-700">
                          {getTimeUntilReady(order.estimatedReadyTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-coffee-900 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-coffee-900 mb-1">
                    Order Summary
                  </h4>
                  <p className="text-sm text-coffee-600 bg-coffee-50 p-2 rounded-lg">
                    {order.orderSummary || "No items ordered"}
                  </p>
                </div>

                {/* Action Button */}
                {order.status === "pending" && (
                  <button
                    onClick={() => onClear(order.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Start Preparing
                  </button>
                )}
                {order.status === "preparing" && (
                  <button
                    onClick={() => onClear(order.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Ready
                  </button>
                )}
                {order.status === "ready" && (
                  <button
                    onClick={() => onClear(order.id)}
                    className="w-full bg-coffee-600 hover:bg-coffee-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Served
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingOrders;
