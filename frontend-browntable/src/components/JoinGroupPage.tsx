import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGroupMembers } from '../context/groupMemebersContext';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Coffee, Users, Clock, MapPin, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import CoffeeLoader from './CoffeeLoader';

const JoinGroupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { joinGroupByCode, loading, error, groupInfo } = useGroupMembers();
  const { setCurrentGroupId } = useBooking();
  
  const [isJoining, setIsJoining] = useState(false);
  const [justJoined, setJustJoined] = useState(false);
  const inviteCode = searchParams.get('code');

  // Handle initial redirect for unauthenticated users
  useEffect(() => {
    if (!inviteCode) {
      navigate('/');
      return;
    }

    // If user is not authenticated, store the invite code and redirect to login
    if (!isAuthenticated) {
      console.log('🔒 User not authenticated, storing invite code and redirecting to login');
      // Store invite code in sessionStorage so we can use it after authentication
      sessionStorage.setItem('pendingInviteCode', inviteCode);
      
      // Redirect to login with the current location for redirect after login
      navigate('/auth/login', { 
        state: { 
          from: { pathname: `/join?code=${inviteCode}` },
          inviteCode: inviteCode 
        } 
      });
      return;
    }
  }, [inviteCode, isAuthenticated, navigate]);

  // Auto-join if user just authenticated and we have a pending invite code
  useEffect(() => {
    const handleAutoJoin = async () => {
      if (isAuthenticated && user && inviteCode) {
        const pendingCode = sessionStorage.getItem('pendingInviteCode');
        
        console.log('🔍 Checking for auto-join:', { pendingCode, inviteCode, isAuthenticated });
        
        // If we have a pending invite code that matches current URL, auto-join
        if (pendingCode === inviteCode) {
          console.log('✨ Auto-joining group with pending invite code');
          sessionStorage.removeItem('pendingInviteCode');
          await handleJoinGroup();
        }
      }
    };

    handleAutoJoin();
  }, [isAuthenticated, user, inviteCode]);

  // Navigate to group order page after successfully joining
  useEffect(() => {
    if (justJoined && groupInfo.id) {
      console.log('🎯 Navigating to group order page:', groupInfo.id);
      setCurrentGroupId(groupInfo.id);
      navigate(`/group-order?groupId=${groupInfo.id}`);
      setJustJoined(false);
    }
  }, [justJoined, groupInfo.id, setCurrentGroupId, navigate]);

  const handleJoinGroup = async () => {
    if (!inviteCode || !user) {
      console.error('❌ Cannot join group: missing invite code or user');
      return;
    }

    try {
      setIsJoining(true);
      console.log('🚀 Attempting to join group with code:', inviteCode);
      
      await joinGroupByCode(inviteCode);
      
      console.log('✅ Successfully joined group, setting justJoined flag');
      // Set flag to indicate we just joined - this will trigger navigation in the useEffect
      setJustJoined(true);
    } catch (error) {
      console.error('❌ Failed to join group:', error);
    } finally {
      setIsJoining(false);
    }
  };

  // Show loading while checking authentication or if no invite code
  if (loading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coffee-50 to-latte-100">
        <CoffeeLoader size="lg" message="Processing invitation..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Join Group Order
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-2">You're joining as:</p>
              <div className="flex items-center justify-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold ${user?.color || 'bg-gray-500'}`}>
                  {user?.avatar || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-sm text-gray-500">{user?.phone || ''}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleJoinGroup}
              disabled={loading || isJoining}
              className="w-full bg-[#4d3a00] text-white py-3 rounded-lg font-medium hover:bg-[#6e6240] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining || loading ? 'Joining...' : 'Join Group'}
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGroupPage; 