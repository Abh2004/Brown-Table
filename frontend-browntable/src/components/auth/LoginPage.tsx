import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Coffee, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Get redirect path from location state
  const from = location.state?.from?.pathname || '/';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.password) {
      return;
    }

    try {
      await login(formData);
      
      // Check for pending invite code after successful login
      const pendingInviteCode = sessionStorage.getItem('pendingInviteCode');
      console.log('🔑 Login successful, checking for pending invite:', pendingInviteCode);
      
      if (pendingInviteCode) {
        console.log('🎫 Found pending invite code, redirecting to join page');
        // Redirect to join page with the invite code
        navigate(`/join?code=${pendingInviteCode}`, { replace: true });
      } else {
        console.log('🏠 No pending invite, using normal redirect:', from);
        // Use the original redirect logic
        navigate(from, { replace: true });
      }
    } catch (error) {
      // Error is handled by context
    }
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
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-slide-up">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-coffee-800 mb-2">
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
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-coffee-800 mb-2">
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
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !formData.phone || !formData.password}
                className="w-full bg-coffee-gradient text-white py-3 px-4 rounded-xl font-semibold hover:shadow-warm-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-coffee-600">
                Don't have an account?{' '}
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