import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { groupAPI, inviteAPI } from "../services/api";
import { useAuth } from "./AuthContext";
import type { Group, GroupMember as APIGroupMember } from "../services/api";

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isAdmin: boolean;
  hasAccepted: boolean;
}

interface GroupMembersContextType {
  groupMembers: GroupMember[];
  addGroupMember: (member: GroupMember) => void;
  groupInfo: GroupInfo;
  setGroupInfo: (info: GroupInfo) => void;
  // Backend integration methods
  createGroup: (data: CreateGroupData) => Promise<string>;
  loadGroup: (groupId: string) => Promise<void>;
  joinGroupByCode: (inviteCode: string) => Promise<void>;
  generateInviteLink: () => Promise<string>;
  inviteUserByPhone: (phone: string) => Promise<void>;
  deleteGroup: (groupId: string, userId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  inviteLink: string | null;
}

interface GroupInfo {
  id: string;
  name: string;
  arrivalTime: string;
  table?: string;
  departureTime: string;
  date: string;
  discount?: number;
  groupMembers: GroupMember[];
  groupAdminId?: string;
  inviteCode?: string;
}

interface CreateGroupData {
  adminName: string;
  adminId: string;
  arrivalTime: string;
  departureTime: string;
  date: string;
  guestCount?: number;
}

const GroupMembersContext = createContext<GroupMembersContextType | undefined>(
  undefined
);

export const useGroupMembers = () => {
  const context = useContext(GroupMembersContext);
  if (!context) {
    throw new Error(
      "useGroupMembers must be used within a GroupMembersProvider"
    );
  }
  return context;
};

interface GroupMembersProviderProps {
  children: ReactNode;
}

export const GroupMembersProvider: React.FC<GroupMembersProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [groupInfo, setGroupInfo] = useState<GroupInfo>({
    id: "",
    name: "",
    arrivalTime: "",
    table: "",
    departureTime: "",
    date: "",
    discount: 0,
    groupMembers: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const addGroupMember = (member: GroupMember) => {
    setGroupMembers((prev) => [...prev, member]);
  };

  // Convert API GroupMember to local format
  const convertAPIGroupMember = (apiMember: APIGroupMember): GroupMember => ({
    id: apiMember.userId,
    name: apiMember.name,
    avatar: apiMember.avatar,
    color: apiMember.color,
    isAdmin: apiMember.isAdmin,
    hasAccepted: apiMember.hasAccepted,
  });

  // Convert API Group to local GroupInfo format
  const convertAPIGroup = (apiGroup: Group): GroupInfo => ({
    id: apiGroup.id,
    name: apiGroup.name,
    arrivalTime: apiGroup.arrivalTime,
    departureTime: apiGroup.departureTime,
    date: apiGroup.date,
    table: apiGroup.table,
    discount: apiGroup.discount,
    groupAdminId: apiGroup.groupAdminId,
    inviteCode: apiGroup.inviteCode,
    groupMembers: apiGroup.groupMembers.map(convertAPIGroupMember),
  });

  const createGroup = async (data: CreateGroupData): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      const response = await groupAPI.createGroup(data);

      if (response.success) {
        const group = response.data.group;
        const newGroupInfo = convertAPIGroup(group);

        setGroupInfo(newGroupInfo);
        setGroupMembers(newGroupInfo.groupMembers);

        // Set invite link
        if (group.inviteLink) {
          setInviteLink(group.inviteLink);
        }

        console.log("✅ Group created successfully:", group.id);
        return group.id;
      } else {
        throw new Error(response.message || "Failed to create group");
      }
    } catch (err: any) {
      console.error("❌ Failed to create group:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to create group";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadGroup = async (groupId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await groupAPI.getGroup(groupId);

      if (response.success) {
        const group = response.data.group;
        const newGroupInfo = convertAPIGroup(group);

        setGroupInfo(newGroupInfo);
        setGroupMembers(newGroupInfo.groupMembers);

        console.log("✅ Group loaded successfully:", groupId);
      } else {
        throw new Error(response.message || "Failed to load group");
      }
    } catch (err: any) {
      console.error("❌ Failed to load group:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to load group";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const joinGroupByCode = async (inviteCode: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await inviteAPI.joinGroup({ inviteCode });

      if (response.success) {
        const group = response.data.group;
        const newGroupInfo = convertAPIGroup(group);

        setGroupInfo(newGroupInfo);
        setGroupMembers(newGroupInfo.groupMembers);

        console.log("✅ Successfully joined group:", group.id);
      } else {
        throw new Error(response.message || "Failed to join group");
      }
    } catch (err: any) {
      console.error("❌ Failed to join group:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to join group";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generateInviteLink = async (): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      if (!groupInfo.id || !user?.id) {
        throw new Error("Group ID and User authentication are required");
      }

      const response = await inviteAPI.generateInvite({
        groupId: groupInfo.id,
        adminId: user.id,
      });

      if (response.success) {
        const link = response.data.inviteLink;
        setInviteLink(link);
        console.log("✅ Invite link generated successfully");
        return link;
      } else {
        throw new Error(response.message || "Failed to generate invite link");
      }
    } catch (err: any) {
      console.error("❌ Failed to generate invite link:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to generate invite link";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inviteUserByPhone = async (phone: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      if (!groupInfo.id) {
        throw new Error("No active group to invite to");
      }

      const response = await inviteAPI.inviteUser({
        groupId: groupInfo.id,
        phone: phone,
      });

      if (response.success) {
        console.log(
          "✅ User invited successfully:",
          response.data.invitedUser.name
        );
      } else {
        throw new Error(response.message || "Failed to invite user");
      }
    } catch (err: any) {
      console.error("❌ Failed to invite user:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to invite user";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (
    groupId: string,
    userId: string
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await groupAPI.deleteGroup(groupId, userId);

      if (response.success) {
        console.log("✅ Group deleted successfully");
      } else {
        throw new Error(response.message || "Failed to delete group");
      }
    } catch (err: any) {
      console.error("❌ Failed to delete group:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to delete group";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GroupMembersContext.Provider
      value={{
        groupMembers,
        addGroupMember,
        groupInfo,
        setGroupInfo,
        createGroup,
        loadGroup,
        joinGroupByCode,
        generateInviteLink,
        inviteUserByPhone,
        deleteGroup,
        loading,
        error,
        inviteLink,
      }}
    >
      {children}
    </GroupMembersContext.Provider>
  );
};
