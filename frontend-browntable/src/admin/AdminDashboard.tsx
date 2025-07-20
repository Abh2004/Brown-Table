import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Coffee,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  RefreshCw,
  LogOut,
  MessageSquare,
  Sun,
  Cloud,
  CloudRain,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { useWeather } from "../context/WeatherContext";
import adminAPI from "../services/adminApi";
import TableOverview from "../admin/components/TableOverview";
import ReservationRequests from "../admin/components/ReservationRequests";
import UpcomingOrders from "../admin/components/UpcomingOrders";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface DashboardData {
  tables: any[];
  reservations: any[];
  upcomingOrders: any[];
  stats: {
    freeTables: number;
    pendingRequests: number;
    reservedTables: number;
    occupiedTables: number;
    maintenanceTables: number;
  };
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { admin, token, logout, isAuthenticated } = useAdmin();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { weather, updateWeather, isLoading: weatherLoading } = useWeather();
  const [viewMode, setViewMode] = useState<"tab" | "map">("tab");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin-login");
    }
  }, [isAuthenticated, navigate]);

  // Handle table status update
  const handleTableStatusUpdate = async (
    tableId: string,
    status: string,
    currentGuests?: number
  ) => {
    if (!token) {
      toast.error("Admin not logged in");
      return;
    }

    try {
      const response = await adminAPI.updateTableStatus(
        token,
        tableId,
        status,
        currentGuests
      );

      if (response.success) {
        toast.success("Table status updated successfully");
        // Refresh dashboard data
        loadDashboardData();
      } else {
        toast.error(response.message || "Failed to update table status");
      }
    } catch (err: any) {
      console.error("Failed to update table status:", err);
      toast.error(
        err.response?.data?.message || "Failed to update table status"
      );
    }
  };

  // Handle reservation confirmation
  const handleReservationConfirm = async (groupId: string) => {
    if (!token) {
      toast.error("Admin not logged in");
      return;
    }

    try {
      const response = await adminAPI.confirmReservation(token, groupId);

      if (response.success) {
        toast.success("Reservation confirmed successfully");
        // Refresh dashboard data
        loadDashboardData();
      } else {
        toast.error(response.message || "Failed to confirm reservation");
      }
    } catch (err: any) {
      console.error("Failed to confirm reservation:", err);
      toast.error(
        err.response?.data?.message || "Failed to confirm reservation"
      );
    }
  };

  // Handle reservation cancellation
  const handleReservationCancel = async (groupId: string) => {
    if (!token) {
      toast.error("Admin not logged in");
      return;
    }

    try {
      const response = await adminAPI.cancelReservation(token, groupId);

      if (response.success) {
        toast.success("Reservation cancelled successfully");
        // Refresh dashboard data
        loadDashboardData();
      } else {
        toast.error(response.message || "Failed to cancel reservation");
      }
    } catch (err: any) {
      console.error("Failed to cancel reservation:", err);
      toast.error(
        err.response?.data?.message || "Failed to cancel reservation"
      );
    }
  };

  const handleOrderStatusUpdate = async (orderId: string) => {
    if (!token) {
      toast.error("Admin not logged in");
      return;
    }

    try {
      // Find the current order to determine next status
      const currentOrder = dashboardData?.upcomingOrders.find(
        (order) => order.id === orderId
      );

      if (!currentOrder) {
        toast.error("Order not found");
        return;
      }

      let newStatus = "served";
      if (currentOrder.status === "pending") {
        newStatus = "preparing";
      } else if (currentOrder.status === "preparing") {
        newStatus = "ready";
      } else if (currentOrder.status === "ready") {
        newStatus = "served";
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/order/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        toast.success(`Order marked as ${newStatus}`);
        loadDashboardData(); // Refresh data
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Update order status error:", error);
      toast.error("Failed to update order status");
    }
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load dashboard data
  const loadDashboardData = async () => {
    if (!token) {
      setError("Admin not logged in");
      toast.error("Admin not logged in");
      navigate("/admin-login");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await adminAPI.getDashboard(token);

      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError(response.message || "Failed to load dashboard data");
      }
    } catch (err: any) {
      console.error("Failed to load dashboard data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and refresh every 30 seconds
  useEffect(() => {
    loadDashboardData();

    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  const toggleWeather = async () => {
    const weatherStates: ("sunny" | "cloudy" | "rainy")[] = [
      "sunny",
      "cloudy",
      "rainy",
    ];
    const currentIndex = weatherStates.indexOf(weather);
    const nextIndex = (currentIndex + 1) % weatherStates.length;
    try {
      await updateWeather(weatherStates[nextIndex]);
    } catch (error) {
      console.error("Failed to update weather:", error);
    }
  };

  const getWeatherIcon = () => {
    switch (weather) {
      case "sunny":
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case "cloudy":
        return <Cloud className="w-5 h-5 text-gray-500" />;
      case "rainy":
        return <CloudRain className="w-5 h-5 text-blue-500" />;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 via-latte-50 to-cream-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-coffee-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - App title and time */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-coffee-gradient rounded-full flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-coffee-900">
                    The Brown Table
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2 text-coffee-700">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour12: true,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Right side - Weather and logout */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleWeather}
                disabled={weatherLoading}
                className="p-2 hover:bg-coffee-50 rounded-lg transition-colors disabled:opacity-50"
                title="Toggle weather"
              >
                {weatherLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-coffee-600" />
                ) : (
                  getWeatherIcon()
                )}
              </button>

              <button
                onClick={() => navigate("/admin/messages")}
                className="p-2 hover:bg-coffee-50 rounded-lg transition-colors text-coffee-600"
                title="Messages & Notifications"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              <button
                onClick={loadDashboardData}
                disabled={loading}
                className="p-2 hover:bg-coffee-50 rounded-lg transition-colors text-coffee-600 disabled:opacity-50"
                title="Refresh dashboard"
              >
                <RefreshCw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>

              <div className="h-6 w-px bg-coffee-200"></div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-coffee-700">
                  Welcome, {admin?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-8 mb-4">
            <div className="bg-white rounded-xl p-6 shadow-warm border border-coffee-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-coffee-600">Free Tables</p>
                  <p className="text-2xl font-bold text-coffee-900">
                    {dashboardData.stats.freeTables}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-warm border border-coffee-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-coffee-600">Reserved Tables</p>
                  <p className="text-2xl font-bold text-coffee-900">
                    {dashboardData.stats.reservedTables}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-warm border border-coffee-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-coffee-600">Occupied Tables</p>
                  <p className="text-2xl font-bold text-coffee-900">
                    {dashboardData.stats.occupiedTables}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-warm border border-coffee-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-coffee-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-coffee-900">
                    {dashboardData.stats.pendingRequests}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-warm border border-coffee-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-coffee-600">Maintenance</p>
                  <p className="text-2xl font-bold text-coffee-900">
                    {dashboardData.stats.maintenanceTables || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Loading and Error States */}
        {loading && !dashboardData ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-coffee-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-coffee-600">Loading dashboard...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Center Panel - Table Overview */}
            <div className="lg:col-span-2">
              <TableOverview
                data={dashboardData?.tables || []}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                countFreeTables={dashboardData?.stats.freeTables || 0}
                countReservedTables={dashboardData?.stats.reservedTables || 0}
                countOccupiedTables={dashboardData?.stats.occupiedTables || 0}
                onTableStatusUpdate={handleTableStatusUpdate}
              />
            </div>

            {/* Right Sidebar - Reservation Requests */}
            <div className="space-y-6">
              <ReservationRequests
                reservations={dashboardData?.reservations || []}
                countPendingReservations={
                  dashboardData?.stats.pendingRequests || 0
                }
                onConfirm={handleReservationConfirm}
                onCancel={handleReservationCancel}
              />

              <UpcomingOrders
                orders={dashboardData?.upcomingOrders || []}
                onClear={handleOrderStatusUpdate}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
