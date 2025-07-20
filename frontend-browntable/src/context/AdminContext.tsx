import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import adminAPI from "../services/adminApi";

interface Admin {
  id: string;
  username: string;
  role: string;
}

interface AdminContextType {
  admin: Admin | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing admin session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    const savedAdmin = localStorage.getItem("adminData");

    if (savedToken && savedAdmin) {
      try {
        setToken(savedToken);
        setAdmin(JSON.parse(savedAdmin));
      } catch (error) {
        console.error("Failed to restore admin session:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
      }
    }
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminAPI.login(username, password);

      if (response.success) {
        const { admin: adminData, token: adminToken } = response.data;

        setAdmin(adminData);
        setToken(adminToken);

        // Save to localStorage
        localStorage.setItem("adminToken", adminToken);
        localStorage.setItem("adminData", JSON.stringify(adminData));

        return true;
      } else {
        setError(response.message || "Login failed");
        return false;
      }
    } catch (err: any) {
      console.error("Admin login error:", err);
      setError(err.response?.data?.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    setError(null);

    // Clear localStorage
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
  };

  const value: AdminContextType = {
    admin,
    token,
    login,
    logout,
    isAuthenticated: !!admin && !!token,
    loading,
    error,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
