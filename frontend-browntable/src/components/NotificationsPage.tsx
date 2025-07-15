import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { inviteAPI } from '../services/api';
import { Users, Clock, MapPin } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { pendingInvites, refreshNotifications, user } = useAuth();
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});

  const handleAcceptInvite = async (groupId: string) => {
    try {
      setLoadingActions(prev => ({ ...prev, [groupId]: true }));
      
      const response = await inviteAPI.acceptInvitation(groupId);
      
      if (response.success) {
        await refreshNotifications();
        console.log('✅ Invite accepted successfully');
        // Navigate to group order page
        navigate('/group-order');
      }
    } catch (error: any) {
      console.error('❌ Failed to accept invite:', error);
    } finally {
      setLoadingActions(prev => ({ ...prev, [groupId]: false }));
    }
  };

  const handleDeclineInvite = async (groupId: string) => {
    try {
      setLoadingActions(prev => ({ ...prev, [groupId]: true }));
      
      // For now, we'll just refresh notifications to remove from pending
      // In a real app, you'd have a decline endpoint
      await refreshNotifications();
      
      console.log('✅ Invite declined');
    } catch (error: any) {
      console.error('❌ Failed to decline invite:', error);
    } finally {
      setLoadingActions(prev => ({ ...prev, [groupId]: false }));
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {pendingInvites.length > 0 
              ? `You have ${pendingInvites.length} pending invite${pendingInvites.length !== 1 ? 's' : ''}`
              : 'No new notifications'
            }
          </p>
        </div>

        {pendingInvites.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending invites</h3>
            <p className="text-gray-500">When someone invites you to a group order, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingInvites.map((invite) => (
              <div key={invite.groupId} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Header with icon */}
                <div className="bg-[#4d3a00] px-6 py-4 text-white">
                  <div className="flex items-center">
                    <Users className="w-6 h-6 mr-3" />
                    <h2 className="text-lg font-semibold">
                      Join Group Order from {invite.invitedBy}
                    </h2>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    {invite.invitedBy} is inviting you to pre-order from
                  </p>
                  <h3 className="text-xl font-bold text-center text-gray-900 mb-6">
                    {invite.groupName}
                  </h3>

                  {/* Restaurant Card */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-4">
                      {/* Restaurant Image Placeholder */}
                      <div className="w-16 h-16 bg-amber-900 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">TB</span>
                      </div>
                      
                      {/* Restaurant Info */}
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900">The Brown Table</h4>
                        
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center">
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                              4.5 ⭐
                            </span>
                            <span className="text-gray-500 text-sm ml-2">1.2K reviews</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-2">
                          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded mr-2">
                            Open
                          </span>
                          <span className="text-gray-500 text-sm">Closes at 11:00 PM</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mt-1">
                          Bakery • Coffee • Cafe
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleAcceptInvite(invite.groupId)}
                      disabled={loadingActions[invite.groupId]}
                      className="w-full bg-[#88b88a] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#769a78] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingActions[invite.groupId] ? 'Joining...' : 'Join Order'}
                    </button>
                    
                    <button
                      onClick={() => navigate('/menu')}
                      className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      View Menu & Add Items
                    </button>
                  </div>

                  {/* Invite details */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Invited {new Date(invite.invitedAt).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={() => handleDeclineInvite(invite.groupId)}
                      disabled={loadingActions[invite.groupId]}
                      className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-[#4d3a00] hover:text-[#6e6240] font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage; 