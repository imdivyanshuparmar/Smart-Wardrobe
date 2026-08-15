import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Card } from './Card';
import landing from "@/image/new.jpeg";
import { ShimmerButton } from "@/components/ui/Shimmer-button";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';
import { loginUser, AppDispatch, RootState } from '../authSlice';

interface LoginFormData {
  emailId: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    emailId: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.emailId) {
      newErrors.emailId = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      newErrors.emailId = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // ✅ FIXED: Using Redux thunk instead of direct axios call + separate dispatch
      const resultAction = await dispatch(loginUser({
        emailId: formData.emailId,
        password: formData.password
      }));
      
      // Check if login was successful using Redux's matcher
      if (loginUser.fulfilled.match(resultAction)) {
        // Success! Redux state is now updated with user
        // isAuthenticated becomes true, user data is stored
        
        // Navigate to dashboard
        navigate('/', { 
          replace: true,
          state: { message: 'Welcome back to Clozzy!' }
        });
      } else {
        // Handle login errors from Redux
        const error = resultAction.payload as any;
        if (error?.status === 401) {
          alert('Invalid email or password');
        } else if (error?.status === 404) {
          alert('User not found. Please register first.');
          navigate('/signup');
        } else {
          alert(error?.message || 'Login failed. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="flex min-h-screen">
        {/* Left Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-gray-900 to-slate-800 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={landing}
              className="w-full h-full object-cover scale-105"
              alt="Fashion Style"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
          </div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-gray-300" />
              <span className="text-xl font-light tracking-wider">CLOZZY</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <Card className="p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              {/* Logo for mobile */}
              <div className="lg:hidden flex justify-center mb-8">
                <div className="flex items-center gap-2 text-2xl font-light tracking-wider text-gray-800">
                  <Sparkles className="w-5 h-5 text-gray-600" />
                  <span>CLOZZY</span>
                </div>
              </div>

              {/* Header */}
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-light text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-sm text-gray-500">
                  Sign in to continue your style journey
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="emailId"
                      value={formData.emailId}
                      onChange={handleInputChange}
                      placeholder="hello@example.com"
                      className={`w-full pl-9 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none transition-all text-sm ${
                        errors.emailId 
                          ? 'border-red-300 bg-red-50/50' 
                          : 'border-gray-200 focus:border-gray-400 focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.emailId && (
                    <p className="mt-1 text-xs text-red-500">{errors.emailId}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className={`w-full pl-9 pr-10 py-3 bg-gray-50 border rounded-lg focus:outline-none transition-all text-sm ${
                        errors.password 
                          ? 'border-red-300 bg-red-50/50' 
                          : 'border-gray-200 focus:border-gray-400 focus:bg-white'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-xs text-gray-500 hover:text-gray-900 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Button */}
                <ShimmerButton 
                  type="submit"
                  className="w-full shadow-10xl"
                  disabled={loading}
                >
                  <span className="text-center text-sm tracking-tight whitespace-pre-wrap text-white flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </ShimmerButton>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-white text-gray-400">Or continue with</span>
                  </div>
                </div>

                {/* Register Link */}
                <p className="text-center text-sm text-gray-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="font-medium text-gray-900 hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              </form>

              {/* Security Note */}
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <Shield className="w-3 h-3" />
                <span>Your data is secure and encrypted</span>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;