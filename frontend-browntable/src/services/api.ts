import axios from "axios";

// Backend API base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor for logging and auth token
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ API Response: ${response.config.method?.toUpperCase()} ${
        response.config.url
      }`,
      response.data
    );
    return response;
  },
  (error) => {
    console.error(
      "❌ API Response Error:",
      error.response?.data || error.message
    );

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

// API Types
export interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  color: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PendingInvite {
  groupId: string;
  groupName: string;
  invitedBy: string;
  invitedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "veg" | "non-veg";
  category: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: "veg" | "non-veg";
  addedBy: string;
  specialInstructions?: string;
}

export interface GroupMember {
  userId: string;
  name: string;
  avatar: string;
  color: string;
  isAdmin: boolean;
  hasAccepted: boolean;
}

export interface Group {
  id: string;
  name: string;
  groupAdminId: string;
  inviteCode: string;
  arrivalTime: string;
  departureTime: string;
  date: string;
  table?: string;
  discount?: number;
  groupMembers: GroupMember[];
  status?: string;
}

export interface GroupWithDetails extends Group {
  restaurant: string;
  memberCount: number;
  maxMembers: number;
  isAdmin: boolean;
  userRole: "admin" | "member";
  order: {
    id: string;
    totalAmount: number;
    finalAmount: number;
    status: string;
    itemCount: number;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  groupId: string;
  items: CartItem[];
  totalAmount: number;
  serviceCharge: number;
  tax: number;
  finalAmount: number;
  status: string;
}

// Authentication API
export const authAPI = {
  // Sign up new user
  signup: async (data: { name: string; phone: string; password: string }) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },

  // Login user with password
  login: async (data: { phone: string; password: string }) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  // Send OTP for login
  sendOTP: async (data: { phone: string }) => {
    const response = await api.post("/auth/send-otp", data);
    return response.data;
  },

  // Verify OTP and login
  verifyOTP: async (data: { phone: string; otp: string }) => {
    const response = await api.post("/auth/verify-otp", data);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: { name: string }) => {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },

  // Search user by phone
  searchUser: async (phone: string) => {
    const response = await api.post("/auth/search-user", { phone });
    return response.data;
  },
};

// API Services
export const groupAPI = {
  // Get all groups for current user
  getMyGroups: async () => {
    const response = await api.get("/groups/my-groups");
    return response.data;
  },

  // Create a new group
  createGroup: async (data: {
    adminName: string;
    adminId: string;
    arrivalTime: string;
    departureTime: string;
    date: string;
    guestCount?: number;
  }) => {
    const response = await api.post("/groups/create-group", data);
    return response.data;
  },

  // Get group details
  getGroup: async (groupId: string) => {
    const response = await api.get(`/groups/${groupId}`);
    return response.data;
  },

  // Update group details
  updateGroup: async (groupId: string, data: Partial<Group>) => {
    const response = await api.put(`/groups/${groupId}/update`, data);
    return response.data;
  },

  // Get group order details
  getGroupOrder: async (groupId: string) => {
    const response = await api.get(`/groups/${groupId}/group-order`);
    return response.data;
  },

  // Delete a group
  deleteGroup: async (groupId: string, userId: string) => {
    const response = await api.delete(`/groups/${groupId}`, {
      data: { userId },
    });
    return response.data;
  },
};

export const menuAPI = {
  // Get all menu items
  getMenu: async (filters?: {
    category?: string;
    type?: string;
    section?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.type) params.append("type", filters.type);
    if (filters?.section) params.append("section", filters.section);

    const response = await api.get(`/menu?${params.toString()}`);
    return response.data;
  },

  // Get specific menu sections
  getMenu1: async () => {
    const response = await api.get("/menu/menu1");
    return response.data;
  },

  getMenu2: async () => {
    const response = await api.get("/menu/menu2");
    return response.data;
  },

  getMenu3: async () => {
    const response = await api.get("/menu/menu3");
    return response.data;
  },

  // Get specific menu item
  getMenuItem: async (itemId: string) => {
    const response = await api.get(`/menu/item/${itemId}`);
    return response.data;
  },
};

export const orderAPI = {
  // Update group order
  updateOrder: async (
    groupId: string,
    data: { items: CartItem[]; userId: string }
  ) => {
    const response = await api.post(`/orders/${groupId}/update-order`, data);
    return response.data;
  },

  // Get group order
  getOrder: async (groupId: string) => {
    const response = await api.get(`/orders/${groupId}`);
    return response.data;
  },

  // Get group order with member details
  getGroupOrder: async (groupId: string) => {
    const response = await api.get(`/orders/${groupId}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (
    orderId: string,
    data: { status?: string; paymentStatus?: string }
  ) => {
    const response = await api.put(`/orders/${orderId}/status`, data);
    return response.data;
  },

  // Remove item from order
  removeItem: async (groupId: string, itemId: string, userId: string) => {
    const response = await api.delete(`/orders/${groupId}/item/${itemId}`, {
      data: { userId },
    });
    return response.data;
  },
};

export const inviteAPI = {
  // Generate invite link
  generateInvite: async (data: { groupId: string; adminId: string }) => {
    const response = await api.post("/invites/invite-member", data);
    return response.data;
  },

  // Invite user by phone
  inviteUser: async (data: { groupId: string; phone: string }) => {
    const response = await api.post("/invites/invite-user", data);
    return response.data;
  },

  // Join group using invite code
  joinGroup: async (data: { inviteCode: string }) => {
    const response = await api.post("/invites/join", data);
    return response.data;
  },

  // Get group info by invite code
  getGroupByInviteCode: async (inviteCode: string) => {
    const response = await api.get(`/invites/group/${inviteCode}`);
    return response.data;
  },

  // Accept group invitation
  acceptInvitation: async (groupId: string) => {
    const response = await api.post(`/invites/accept/${groupId}`);
    return response.data;
  },

  // Get notifications (pending invites)
  getNotifications: async () => {
    const response = await api.get("/invites/notifications");
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get("/health");
  return response.data;
};

export default api;
