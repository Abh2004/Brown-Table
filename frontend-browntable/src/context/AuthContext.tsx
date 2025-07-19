import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authAPI, inviteAPI } from "../services/api";
import type { User, PendingInvite } from "../services/api";

interface AuthContextType {
  // Authentication state
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  signup: (data: {
    name: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  login: (data: { phone: string; password: string }) => Promise<void>;
  sendOTP: (data: { phone: string }) => Promise<void>;
  verifyOTP: (data: { phone: string; otp: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name: string }) => Promise<void>;
  searchUser: (phone: string) => Promise<User | null>;

  // Notifications
  pendingInvites: PendingInvite[];
  notificationCount: number;
  refreshNotifications: () => Promise<void>;

  // Clear error
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);

  // Check for existing auth on mount
  useEffect(() => {
    checkExistingAuth();
  }, []);

  // Refresh notifications when user changes
  useEffect(() => {
    if (user) {
      refreshNotifications();
    }
  }, [user]);

  const checkExistingAuth = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const savedUser = localStorage.getItem("currentUser");

      if (token && savedUser) {
        // Try to verify token with backend
        const response = await authAPI.getProfile();
        if (response.success) {
          setUser(response.data.user);
          console.log("✅ User authenticated from existing token");
        } else {
          // Token invalid, clear storage
          clearAuthStorage();
        }
      }
    } catch (error) {
      console.log("❌ Token validation failed, clearing auth");
      clearAuthStorage();
    } finally {
      setLoading(false);
    }
  };

  const clearAuthStorage = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  const signup = async (data: {
    name: string;
    phone: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.signup(data);

      if (response.success) {
        const { user: newUser, token } = response.data;

        // Store auth data
        localStorage.setItem("authToken", token);
        localStorage.setItem("currentUser", JSON.stringify(newUser));
        setUser(newUser);

        console.log("✅ User signed up successfully");
      } else {
        throw new Error(response.message || "Signup failed");
      }
    } catch (err: any) {
      console.error("❌ Signup failed:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Signup failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: { phone: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.login(data);

      if (response.success) {
        const { user: loggedInUser, token } = response.data;

        // Store auth data
        localStorage.setItem("authToken", token);
        localStorage.setItem("currentUser", JSON.stringify(loggedInUser));
        setUser(loggedInUser);

        console.log("✅ User logged in successfully");
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (err: any) {
      console.error("❌ Login failed:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async (data: { phone: string }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.sendOTP(data);

      if (response.success) {
        console.log("✅ OTP sent successfully");
      } else {
        throw new Error(response.message || "Failed to send OTP");
      }
    } catch (err: any) {
      console.error("❌ Send OTP failed:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to send OTP";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (data: { phone: string; otp: string }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.verifyOTP(data);

      if (response.success) {
        const { user: loggedInUser, token } = response.data;

        // Store auth data
        localStorage.setItem("authToken", token);
        localStorage.setItem("currentUser", JSON.stringify(loggedInUser));
        setUser(loggedInUser);

        console.log("✅ User logged in successfully with OTP");
      } else {
        throw new Error(response.message || "OTP verification failed");
      }
    } catch (err: any) {
      console.error("❌ OTP verification failed:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "OTP verification failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthStorage();
    setPendingInvites([]);
    console.log("✅ User logged out");
  };

  const updateProfile = async (data: { name: string }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.updateProfile(data);

      if (response.success) {
        const updatedUser = response.data.user;
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setUser(updatedUser);

        console.log("✅ Profile updated successfully");
      } else {
        throw new Error(response.message || "Profile update failed");
      }
    } catch (err: any) {
      console.error("❌ Profile update failed:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Profile update failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const searchUser = async (phone: string): Promise<User | null> => {
    try {
      setError(null);

      const response = await authAPI.searchUser(phone);

      if (response.success) {
        return response.data.user;
      } else {
        return null;
      }
    } catch (err: any) {
      console.error("❌ User search failed:", err);
      return null;
    }
  };

  const refreshNotifications = async () => {
    try {
      if (!user) return;

      const response = await inviteAPI.getNotifications();

      if (response.success) {
        setPendingInvites(response.data.pendingInvites);
        console.log(`📬 Loaded ${response.data.count} pending invites`);
      }
    } catch (err: any) {
      console.error("❌ Failed to load notifications:", err);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    // State
    user,
    isAuthenticated: !!user,
    loading,
    error,

    // Actions
    signup,
    login,
    sendOTP,
    verifyOTP,
    logout,
    updateProfile,
    searchUser,

    // Notifications
    pendingInvites,
    notificationCount: pendingInvites.length,
    refreshNotifications,

    // Utils
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
