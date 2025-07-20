import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import RestaurantMenu from "./components/RestaurantMenu";
import BookingInterface from "./components/BookingInterface";
import GroupOrder from "./components/GroupOrder";
import InvitePage from "./components/InvitePage";
import Dashboard from "./components/Dashboard";
import JoinGroupPage from "./components/JoinGroupPage";
import NotificationsPage from "./components/NotificationsPage";
import GroupsPage from "./components/GroupsPage";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import { GroupMembersProvider } from "./context/groupMemebersContext";
import { AdminProvider } from "./context/AdminContext";
import { WeatherProvider } from "./context/WeatherContext";
import Cart from "./components/cart";

// Admin Components
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminMessages from "./admin/AdminMessages";

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <WeatherProvider>
          <GroupMembersProvider>
            <BookingProvider>
              <Router>
                <Routes>
                  {/* Admin Routes */}
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/messages" element={<AdminMessages />} />

                  {/* Main App Routes */}
                  <Route
                    path="/*"
                    element={
                      <div className="min-h-screen bg-coffee-50 bg-coffee-pattern">
                        <Header />
                        <main>
                          <Routes>
                            {/* Public Routes */}
                            <Route path="/auth/login" element={<LoginPage />} />
                            <Route
                              path="/auth/signup"
                              element={<SignupPage />}
                            />

                            {/* Protected Routes */}
                            <Route
                              path="/"
                              element={
                                <ProtectedRoute>
                                  <Dashboard />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/booking"
                              element={
                                <ProtectedRoute>
                                  <BookingInterface />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/menu"
                              element={
                                <ProtectedRoute>
                                  <RestaurantMenu />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/group-order"
                              element={
                                <ProtectedRoute>
                                  <GroupOrder />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/invite"
                              element={
                                <ProtectedRoute>
                                  <InvitePage />
                                </ProtectedRoute>
                              }
                            />
                            <Route path="/join" element={<JoinGroupPage />} />
                            <Route
                              path="/notifications"
                              element={
                                <ProtectedRoute>
                                  <NotificationsPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/groups"
                              element={
                                <ProtectedRoute>
                                  <GroupsPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/cart"
                              element={
                                <ProtectedRoute>
                                  <Cart />
                                </ProtectedRoute>
                              }
                            />

                            {/* Catch all redirect */}
                            <Route
                              path="*"
                              element={<Navigate to="/" replace />}
                            />
                          </Routes>
                        </main>
                      </div>
                    }
                  />
                </Routes>
              </Router>
            </BookingProvider>
          </GroupMembersProvider>
        </WeatherProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
