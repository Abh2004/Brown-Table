import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Copy,
  Share2,
  Mail,
  MessageCircle,
  ArrowLeft,
  Check,
  ArrowRight,
  Phone,
  UserPlus,
} from "lucide-react";
import { useGroupMembers } from "../context/groupMemebersContext";
import { useAuth } from "../context/AuthContext";

const InvitePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, searchUser } = useAuth();
  const { 
    groupMembers, 
    groupInfo, 
    generateInviteLink, 
    inviteUserByPhone, 
    inviteLink, 
    loading, 
    error 
  } = useGroupMembers();
  
  const [copied, setCopied] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  // Generate invite link on component mount
  useEffect(() => {
    if (groupInfo.id && !inviteLink) {
      generateInviteLink().catch(console.error);
    }
  }, [groupInfo.id, inviteLink, generateInviteLink]);

  const handleCopyLink = async () => {
    if (!inviteLink) return;
    
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleShare = async () => {
    if (!inviteLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${groupInfo.name} at The Brown Table`,
          text: `You're invited to join our group order at The Brown Table!`,
          url: inviteLink,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback to copying
      handleCopyLink();
    }
  };

  const handleInviteByPhone = async () => {
    if (!phoneNumber.trim()) {
      setInviteError("Please enter a phone number");
      return;
    }

    try {
      setSearchingUser(true);
      setInviteError(null);
      setInviteSuccess(null);

      // Search for user by phone
      const foundUser = await searchUser(phoneNumber.trim());
      
      if (!foundUser) {
        setInviteError("No user found with this phone number. They need to sign up first.");
        return;
      }

      // Invite the user
      await inviteUserByPhone(phoneNumber.trim());
      
      setInviteSuccess(`Invitation sent to ${foundUser.name}!`);
      setPhoneNumber("");
      
    } catch (error: any) {
      setInviteError(error.message || "Failed to send invitation");
    } finally {
      setSearchingUser(false);
    }
  };

  const handleSendSMS = () => {
    if (!inviteLink) return;

    const message = `Hey! Join our group order at The Brown Table. Click here: ${inviteLink}`;
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    window.open(smsUrl);
  };

  const handleSendWhatsApp = () => {
    if (!inviteLink) return;

    const message = `Hey! Join our group order at The Brown Table. Click here: ${inviteLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/group-order")}
            className="flex items-center text-[#4d3a00] hover:text-[#6e6240] font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Group Order
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Invite Members</h1>
          <p className="text-gray-600 mt-1">
            Add people to your group order at The Brown Table
          </p>
        </div>

        {/* Current Group Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            {groupInfo.name || "Group Order"}
          </h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p>📅 {groupInfo.date} at {groupInfo.arrivalTime}</p>
            <p>👥 {groupMembers.length} member{groupMembers.length !== 1 ? 's' : ''}</p>
            {user && (
              <p>👑 Admin: {user.name}</p>
            )}
          </div>
        </div>

        {/* Invite by Phone Number */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            Invite by Phone Number
          </h3>
          
          {inviteError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {inviteError}
            </div>
          )}
          
          {inviteSuccess && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {inviteSuccess}
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4d3a00] focus:border-[#4d3a00]"
            />
            <button
              onClick={handleInviteByPhone}
              disabled={searchingUser || loading}
              className="bg-[#4d3a00] text-white px-6 py-2 rounded-lg hover:bg-[#6e6240] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {searchingUser ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              {searchingUser ? "Sending..." : "Invite"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            The person must have an account with this phone number to receive the invitation.
          </p>
        </div>

        {/* Invite Link Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Share Invite Link
          </h3>
          
          {inviteLink ? (
            <>
              {/* Link Display */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                <span className="text-sm text-gray-600 truncate flex-1 mr-3">
                  {inviteLink}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center text-[#4d3a00] hover:text-[#6e6240] font-medium"
                >
                  {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Share Options */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="w-6 h-6 text-[#4d3a00] mb-2" />
                  <span className="text-sm font-medium">Share</span>
                </button>
                
                <button
                  onClick={handleSendSMS}
                  className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle className="w-6 h-6 text-green-600 mb-2" />
                  <span className="text-sm font-medium">SMS</span>
                </button>
                
                <button
                  onClick={handleSendWhatsApp}
                  className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle className="w-6 h-6 text-green-500 mb-2" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4d3a00]"></div>
              <span className="ml-3 text-gray-600">Generating invite link...</span>
            </div>
          )}
        </div>

        {/* Current Members */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Current Members ({groupMembers.length})
          </h3>
          
          <div className="space-y-3">
            {groupMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${member.color}`}>
                    {member.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">
                      {member.isAdmin ? "Admin" : "Member"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {member.hasAccepted ? (
                    <span className="text-green-600 text-sm font-medium">Joined</span>
                  ) : (
                    <span className="text-yellow-600 text-sm font-medium">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/group-order")}
            className="bg-[#4d3a00] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#6e6240] transition-colors flex items-center mx-auto"
          >
            Continue to Order
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvitePage;
