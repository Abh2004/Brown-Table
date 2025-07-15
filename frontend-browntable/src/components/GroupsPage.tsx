import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Star, 
  ChevronRight,
  Badge,
  Crown,
  Loader2,
  Plus,
  DollarSign,
  FileText,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { groupAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { GroupWithDetails } from "../services/api";
import CoffeeLoader from "./CoffeeLoader";

const GroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [groups, setGroups] = useState<GroupWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserGroups();
  }, []);

  const loadUserGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await groupAPI.getMyGroups();
      
      if (response.success) {
        setGroups(response.data.groups);
        console.log(`✅ Loaded ${response.data.count} groups`);
      } else {
        throw new Error(response.message || "Failed to load groups");
      }
    } catch (err: any) {
      console.error("❌ Failed to load groups:", err);
      setError(err.response?.data?.message || err.message || "Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(':');
    const hour12 = parseInt(hour);
    const period = hour12 >= 12 ? 'PM' : 'AM';
    const displayHour = hour12 > 12 ? hour12 - 12 : (hour12 === 0 ? 12 : hour12);
    return `${displayHour}:${minute} ${period}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGroupClick = (groupId: string) => {
    navigate(`/group-order?groupId=${groupId}`);
  };

  const handleCreateNewGroup = () => {
    navigate('/booking');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coffee-50 to-latte-100">
        <CoffeeLoader size="lg" message="Loading your groups..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Error Loading Groups</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button
              onClick={loadUserGroups}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Groups</h1>
              <p className="text-gray-600 mt-1">
                View and manage your dining groups
              </p>
            </div>
            <button
              onClick={handleCreateNewGroup}
              className="bg-[#4d3a00] text-white px-4 py-2 rounded-lg hover:bg-[#6e6240] transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Group</span>
            </button>
          </div>
        </div>

        {/* Groups List */}
        {groups.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Groups Yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first dining group to start ordering with friends and family.
            </p>
            <button
              onClick={handleCreateNewGroup}
              className="bg-[#4d3a00] text-white px-6 py-3 rounded-lg hover:bg-[#6e6240] transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Group</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => handleGroupClick(group.id)}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {group.name}
                      </h3>
                      {group.isAdmin && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {group.restaurant}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(group.status || 'active')}`}>
                      {(group.status || 'active').charAt(0).toUpperCase() + (group.status || 'active').slice(1)}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatDate(group.date)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatTime(group.arrivalTime)} - {formatTime(group.departureTime)}
                    </span>
                  </div>
                </div>

                {/* Members and Table */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {group.memberCount} / {group.maxMembers} members
                    </span>
                  </div>
                  {group.table && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Table {group.table}
                      </span>
                    </div>
                  )}
                </div>

                {/* Order Information */}
                {group.order && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <FileText className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Items</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {group.order.itemCount}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <DollarSign className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Total</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          ₹{group.order.finalAmount.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Badge className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Status</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {group.order.status.charAt(0).toUpperCase() + group.order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Member Avatars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Members:</span>
                    <div className="flex -space-x-2">
                      {group.groupMembers.slice(0, 4).map((member, index) => (
                        <div
                          key={member.userId}
                          className={`w-8 h-8 rounded-full ${member.color} border-2 border-white flex items-center justify-center text-white text-xs font-medium`}
                          title={member.name}
                        >
                          {member.avatar}
                        </div>
                      ))}
                      {group.groupMembers.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-gray-600 text-xs font-medium">
                          +{group.groupMembers.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {group.discount && group.discount > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-600">
                        {group.discount}% off
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsPage; 