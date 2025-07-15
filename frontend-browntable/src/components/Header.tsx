import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Bell, 
  LogOut, 
  UserPlus, 
  Menu as MenuIcon,
  X,
  Home,
  ChefHat,
  Coffee
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, notificationCount } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentView = location.pathname === "/" ? "main-menu" : location.pathname.slice(1);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
    setIsMobileMenuOpen(false);
  };

  const isAuthPage = location.pathname.startsWith('/auth');

  // Don't show header on auth pages
  if (isAuthPage) {
    return null;
  }

  const navigationItems = [
    { path: "/", label: "Home", key: "main-menu" },
    { path: "/menu", label: "Menu", key: "menu" },
    { path: "/booking", label: "Book Table", key: "booking" },
    { path: "/groups", label: "My Groups", key: "groups" },
    { path: "/notifications", label: "Notifications", key: "notifications", badge: notificationCount },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-coffee-900/95 backdrop-blur-sm shadow-warm z-50 border-b border-coffee-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Header Layout */}
          <div className="lg:hidden flex justify-between items-center h-20">
            {/* Mobile Logo */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-3 text-xl font-bold text-white hover:text-cream transition-colors group"
            >
              <img 
                src="/coffee.png" 
                alt="Coffee Cup" 
                className="w-24 h-24 object-contain group-hover:scale-110 transition-transform"
              />
              <span className="font-serif text-cream group-hover:text-white transition-colors">
                The Brown Table
              </span>
            </button>

            {/* Mobile User Menu */}
            {isAuthenticated && (
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${user?.color || 'bg-coffee-600'}`}>
                  {user?.avatar || user?.name?.charAt(0) || 'U'}
                </div>
                
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 text-cream hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
              </div>
            )}
          </div>

          {/* Desktop Header Layout */}
          <div className="hidden lg:flex flex-col">
            {/* Top section with logo centered */}
            <div className="flex justify-center items-center h-20">
              {/* Centered Logo */}
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-4 text-3xl font-bold text-white hover:text-cream transition-colors group"
              >
                <img 
                  src="/coffee.png" 
                  alt="Coffee Cup" 
                  className="w-24 h-24 object-contain group-hover:scale-110 transition-transform"
                />
                <span className="font-serif text-cream group-hover:text-white transition-colors">
                  The Brown Table
                </span>
              </button>
            </div>

            {/* Navigation below logo */}
            <nav className="flex items-center justify-center space-x-8 pb-4 border-t border-coffee-700/30 pt-4">
              {navigationItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavigation(item.path)}
                  className={`relative px-4 py-2 text-sm font-medium tracking-wide uppercase transition-all duration-200 ${
                    currentView === item.key
                      ? "text-white"
                      : "text-cream hover:text-white"
                  }`}
                >
                  {item.label}
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                  {/* Active indicator */}
                  {currentView === item.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cream"></div>
                  )}
                </button>
              ))}

              {/* Desktop User Menu inline with navigation */}
              {isAuthenticated && (
                <>
                  <div className="h-6 w-px bg-coffee-700/30 mx-4"></div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${user?.color || 'bg-coffee-600'}`}>
                      {user?.avatar || user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-cream text-sm font-medium">
                      {user?.name || 'User'}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-cream hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && isAuthenticated && (
          <div className="lg:hidden bg-coffee-800/95 backdrop-blur-sm border-t border-coffee-700/30">
            <nav className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    currentView === item.key
                      ? "bg-white/20 text-white"
                      : "text-cream hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </button>
              ))}
              
              {/* Mobile User Info */}
              <div className="pt-4 mt-4 border-t border-coffee-700/30">
                <div className="flex items-center space-x-3 px-4 py-2 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${user?.color || 'bg-coffee-600'}`}>
                    {user?.avatar || user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-cream truncate">
                      {user?.phone || ''}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-cream hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer for fixed header - increased height for desktop with navigation below */}
      <div className="h-20 lg:h-40"></div>
    </>
  );
};

export default Header;
