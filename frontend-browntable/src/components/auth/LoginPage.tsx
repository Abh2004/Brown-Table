import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Coffee,
  Eye,
  EyeOff,
  Smartphone,
  Lock,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, sendOTP, verifyOTP, loading, error, clearError } = useAuth();

  const [loginMethod, setLoginMethod] = useState<"password" | "otp">(
    "password"
  );
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    otp: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "unknown" | "connected" | "disconnected"
  >("unknown");

  // Get redirect path from location state
  const from = location.state?.from?.pathname || "/";

  // Test backend connection on component mount
  useEffect(() => {
    testBackendConnection();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const testBackendConnection = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/health");
      if (response.ok) {
        setConnectionStatus("connected");
        console.log("✅ Backend connection successful");
      } else {
        setConnectionStatus("disconnected");
        console.log("❌ Backend responded with error");
      }
    } catch (error) {
      setConnectionStatus("disconnected");
      console.log("❌ Backend connection failed:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // For phone number, only allow digits and limit to 10 characters
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSendOTP = async () => {
    if (!formData.phone || formData.phone.length !== 10) {
      return;
    }

    // Check backend connection first
    if (connectionStatus === "disconnected") {
      console.log("❌ Backend is not connected, testing connection...");
      await testBackendConnection();
      if (connectionStatus === "disconnected") {
        return;
      }
    }

    try {
      setSendingOTP(true);
      clearError(); // Clear any previous errors
      console.log("📱 Sending OTP to:", formData.phone);
      await sendOTP({ phone: formData.phone });
      setOtpSent(true);
      setCountdown(60); // Start 1-minute countdown
      console.log("✅ OTP sent successfully, showing input field");
    } catch (error: any) {
      console.error("❌ Failed to send OTP:", error);
      // Error is handled by context
    } finally {
      setSendingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    await handleSendOTP();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loginMethod === "password") {
      if (!formData.phone || !formData.password) {
        return;
      }

      try {
        await login({ phone: formData.phone, password: formData.password });

        // Check for pending invite code after successful login
        const pendingInviteCode = sessionStorage.getItem("pendingInviteCode");
        console.log(
          "🔑 Login successful, checking for pending invite:",
          pendingInviteCode
        );

        if (pendingInviteCode) {
          console.log("🎫 Found pending invite code, redirecting to join page");
          // Redirect to join page with the invite code
          navigate(`/join?code=${pendingInviteCode}`, { replace: true });
        } else {
          console.log("🏠 No pending invite, using normal redirect:", from);
          // Use the original redirect logic
          navigate(from, { replace: true });
        }
      } catch (error) {
        // Error is handled by context
      }
    } else {
      // OTP login
      if (!formData.phone || !formData.otp) {
        return;
      }

      try {
        await verifyOTP({ phone: formData.phone, otp: formData.otp });

        // Check for pending invite code after successful login
        const pendingInviteCode = sessionStorage.getItem("pendingInviteCode");
        console.log(
          "🔑 OTP Login successful, checking for pending invite:",
          pendingInviteCode
        );

        if (pendingInviteCode) {
          console.log("🎫 Found pending invite code, redirecting to join page");
          // Redirect to join page with the invite code
          navigate(`/join?code=${pendingInviteCode}`, { replace: true });
        } else {
          console.log("🏠 No pending invite, using normal redirect:", from);
          // Use the original redirect logic
          navigate(from, { replace: true });
        }
      } catch (error) {
        // Error is handled by context
      }
    }
  };

  const switchLoginMethod = (method: "password" | "otp") => {
    setLoginMethod(method);
    setOtpSent(false);
    setCountdown(0);
    setFormData((prev) => ({ ...prev, password: "", otp: "" }));
    clearError();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-coffee-50 bg-coffee-pattern flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card p-8 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-coffee-gradient rounded-full flex items-center justify-center">
                <Coffee className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-coffee-900 font-serif">
              Welcome back
            </h2>
            <p className="mt-2 text-coffee-600">
              Sign in to your account and continue your dining journey
            </p>
          </div>

          {/* Connection Status */}
          {connectionStatus !== "unknown" && (
            <div
              className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
                connectionStatus === "connected"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {connectionStatus === "connected" ? (
                <Wifi className="w-4 h-4" />
              ) : (
                <WifiOff className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {connectionStatus === "connected"
                  ? "Server connected"
                  : "Server disconnected - Please start the backend server"}
              </span>
              {connectionStatus === "disconnected" && (
                <button
                  onClick={testBackendConnection}
                  className="ml-auto text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {/* Login Method Toggle */}
          <div className="flex bg-coffee-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => switchLoginMethod("password")}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                loginMethod === "password"
                  ? "bg-white text-coffee-700 shadow-sm"
                  : "text-coffee-600 hover:text-coffee-700"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Password</span>
            </button>
            <button
              type="button"
              onClick={() => switchLoginMethod("otp")}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                loginMethod === "otp"
                  ? "bg-white text-coffee-700 shadow-sm"
                  : "text-coffee-600 hover:text-coffee-700"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>OTP</span>
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-slide-up">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-coffee-800 mb-2"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-coffee"
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                />
                {loginMethod === "otp" &&
                  formData.phone.length > 0 &&
                  formData.phone.length < 10 && (
                    <p className="text-sm text-red-600 mt-1">
                      Please enter a complete 10-digit phone number
                    </p>
                  )}
              </div>

              {loginMethod === "password" ? (
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-coffee-800 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input-coffee pr-12"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-coffee-400 hover:text-coffee-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-coffee-800 mb-2"
                  >
                    OTP
                  </label>
                  <div className="space-y-3">
                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={
                          sendingOTP ||
                          formData.phone.length !== 10 ||
                          connectionStatus === "disconnected"
                        }
                        className="w-full px-4 py-3 bg-coffee-600 text-white rounded-xl font-medium hover:bg-coffee-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sendingOTP ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Sending OTP...</span>
                          </div>
                        ) : connectionStatus === "disconnected" ? (
                          "Server Disconnected"
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex space-x-2">
                          <input
                            id="otp"
                            name="otp"
                            type="text"
                            required
                            value={formData.otp}
                            onChange={handleInputChange}
                            className="input-coffee flex-1"
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={
                              countdown > 0 ||
                              sendingOTP ||
                              connectionStatus === "disconnected"
                            }
                            className="text-sm text-coffee-600 hover:text-coffee-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {countdown > 0
                              ? `Resend in ${formatTime(countdown)}`
                              : "Resend OTP"}
                          </button>
                          <p className="text-sm text-coffee-600">
                            Use{" "}
                            <span className="font-mono font-semibold">
                              123456
                            </span>{" "}
                            for testing
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={
                  loading ||
                  !formData.phone ||
                  (loginMethod === "password"
                    ? !formData.password
                    : !formData.otp) ||
                  connectionStatus === "disconnected"
                }
                className="w-full bg-coffee-gradient text-white py-3 px-4 rounded-xl font-semibold hover:shadow-warm-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-coffee-600">
                Don't have an account?{" "}
                <Link
                  to="/auth/signup"
                  state={location.state}
                  className="font-medium text-coffee-700 hover:text-coffee-800 underline underline-offset-2 transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
