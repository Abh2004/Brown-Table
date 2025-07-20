import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Coffee,
  ArrowLeft,
  Send,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";

interface Message {
  id: string;
  type: "confirmation" | "cancellation" | "notification";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const AdminMessages: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdmin();

  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<
    "all" | "confirmation" | "cancellation" | "notification"
  >("all");
  const [newMessage, setNewMessage] = useState("");
  const [selectedTime, setSelectedTime] = useState("30");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin-login");
    }
  }, [isAuthenticated, navigate]);

  // Mock messages data
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: "1",
        type: "confirmation",
        title: "Reservation Confirmed",
        message:
          "Table 3 reservation for John Doe (4 guests) at 7:00 PM has been confirmed.",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: "2",
        type: "cancellation",
        title: "Reservation Cancelled",
        message:
          "Table 5 reservation for Jane Smith (2 guests) at 8:30 PM has been cancelled.",
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        read: true,
      },
      {
        id: "3",
        type: "notification",
        title: "New Order Received",
        message: "New order received from Table 2: Cappuccino x2, Croissant x1",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: "4",
        type: "confirmation",
        title: "Reservation Confirmed",
        message:
          "Table 1 reservation for Mike Johnson (6 guests) at 6:00 PM has been confirmed.",
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        read: true,
      },
    ];
    setMessages(mockMessages);
  }, []);

  const filteredMessages = messages.filter(
    (message) => filter === "all" || message.type === filter
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "confirmation":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "cancellation":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "notification":
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "confirmation":
        return "bg-green-100 text-green-800";
      case "cancellation":
        return "bg-red-100 text-red-800";
      case "notification":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      type: "notification",
      title: "Admin Message",
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => [message, ...prev]);
    setNewMessage("");
  };

  const markAsRead = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 via-latte-50 to-cream-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-coffee-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin")}
                className="p-2 hover:bg-coffee-50 rounded-lg transition-colors text-coffee-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-coffee-gradient rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-coffee-900">
                    Messages & Notifications
                  </h1>
                  <p className="text-sm text-coffee-600">
                    Manage communications and updates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-warm border border-coffee-100 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-coffee-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-coffee-900">
                      Recent Messages
                    </h2>
                    <p className="text-coffee-600 text-sm">
                      {filteredMessages.length} message
                      {filteredMessages.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-coffee-600" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as any)}
                      className="border border-coffee-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
                    >
                      <option value="all">All</option>
                      <option value="confirmation">Confirmations</option>
                      <option value="cancellation">Cancellations</option>
                      <option value="notification">Notifications</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="max-h-96 overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-coffee-300 mx-auto mb-3" />
                    <p className="text-coffee-600">No messages</p>
                    <p className="text-coffee-500 text-sm">All caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-coffee-100">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 hover:bg-coffee-50 transition-colors cursor-pointer ${
                          !message.read ? "bg-blue-50" : ""
                        }`}
                        onClick={() => markAsRead(message.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getTypeIcon(message.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-coffee-900">
                                {message.title}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                                  message.type
                                )}`}
                              >
                                {message.type}
                              </span>
                              {!message.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>

                            <p className="text-sm text-coffee-600 mb-2">
                              {message.message}
                            </p>

                            <div className="flex items-center gap-1 text-xs text-coffee-500">
                              <Clock className="w-3 h-3" />
                              <span>{formatTime(message.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Send Message Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-warm border border-coffee-100 p-6">
              <h3 className="text-lg font-bold text-coffee-900 mb-4">
                Send Message
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-2">
                    Filter by Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full border border-coffee-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
                  >
                    <option value="15">Last 15 minutes</option>
                    <option value="30">Last 30 minutes</option>
                    <option value="60">Last hour</option>
                    <option value="1440">Last 24 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Enter your message..."
                    rows={4}
                    className="w-full border border-coffee-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 resize-none"
                  />
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="w-full bg-coffee-600 hover:bg-coffee-700 disabled:bg-coffee-300 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </div>

              <div className="mt-6 p-4 bg-coffee-50 rounded-lg">
                <h4 className="text-sm font-medium text-coffee-900 mb-2">
                  Message Types
                </h4>
                <div className="space-y-2 text-xs text-coffee-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Confirmations - Reservation confirmations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-3 h-3 text-red-600" />
                    <span>Cancellations - Reservation cancellations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3 h-3 text-blue-600" />
                    <span>Notifications - General updates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMessages;
