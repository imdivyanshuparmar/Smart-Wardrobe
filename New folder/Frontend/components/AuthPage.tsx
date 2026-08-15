import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Card } from './Card';
import { PixelImage } from './ui/PixelImage';
import landing from "@/image/new.jpeg";
import slim from "@/image/slim.jpeg";
import heavy from "@/image/heavy.jpeg";
import athelatic from "@/image/athelatic.jpeg"
import { ShimmerButton } from "@/components/ui/Shimmer-button";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Ruler,
  Eye,
  EyeOff,
  Check,
  Heart,
  Shield,
  Zap,
  Palette,
  Maximize2,
  Users
} from 'lucide-react';
import { registerUser, AppDispatch, RootState } from '../authSlice'; // Make sure to export these types

// Types
type SkinTone = 'Fair' | 'Wheatish' | 'Dark';
type BodyType = 'Athletic' | 'Slim' | 'Heavy';
type Gender = 'male' | 'female' | 'other';

interface UserProfile {
  name: string;
  emailId: string;
  password: string;
  skinTone: SkinTone;
  height: number;
  bodyType: BodyType;
  gender: Gender;
}

// Constants
const SKIN_TONES = [
  { id: 'Fair' as SkinTone, label: 'Fair', color: '#FDE1D3' },
  { id: 'Wheatish' as SkinTone, label: 'Wheatish', color: '#E9C5A3'},
  { id: 'Dark' as SkinTone, label: 'Dark', color: '#8B5A2B',},
];

const BODY_TYPES = [
  { id: 'Athletic' as BodyType, label: 'Athletic', icon: athelatic, description: 'Muscular Build' },
  { id: 'Slim' as BodyType, label: 'Slim', icon: slim, description: 'Lean Frame' },
  { id: 'Heavy' as BodyType, label: 'Heavy', icon: heavy, description: 'Strong Build' },
];

const GENDER_OPTIONS = [
  { id: 'male' as Gender, label: 'Male', icon: '👨' },
  { id: 'female' as Gender, label: 'Female', icon: '👩' },
  { id: 'other' as Gender, label: 'Other', icon: '🧑' },
];

const FEATURES = [
  { icon: <Heart className="w-5 h-5" />, text: 'AI-Powered Styling' },
  { icon: <Palette className="w-5 h-5" />, text: 'Color Analysis' },
  { icon: <Zap className="w-5 h-5" />, text: 'Instant Outfits' },
  { icon: <Users className="w-5 h-5" />, text: 'Style Community' },
];

interface AuthPageProps {
  onComplete?: (profile: UserProfile) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onComplete }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);
  
  const [step, setStep] = useState<'auth' | 'profile'>('auth');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Form state - Updated to use emailId to match backend
  const [formData, setFormData] = useState({
    name: '',
    emailId: '', // Changed from email to emailId
    password: ''
  });
  
  // Profile setup state
  const [profileStep, setProfileStep] = useState(1);
  const [skinTone, setSkinTone] = useState<SkinTone>('Fair');
  const [height, setHeight] = useState(170);
  const [bodyType, setBodyType] = useState<BodyType>('Slim');
  const [gender, setGender] = useState<Gender>('male');
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

  const validateAuthForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.emailId) {
      newErrors.emailId = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      newErrors.emailId = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Must contain uppercase, lowercase & number';
    }
    
    if (!agreedToTerms) {
      newErrors.terms = 'Please agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAuthForm()) {
      return;
    }

    setStep('profile');
  };

  const handleProfileNext = async () => {
    if (profileStep < 4) {
      setProfileStep(profileStep + 1);
    } else {
      try {
        const completeProfileData = {
          name: formData.name,
          emailId: formData.emailId,
          password: formData.password,
          skinTone,
          height,
          bodyType,
          gender
        };

        // ✅ FIXED: Using Redux thunk instead of direct axios call
        const resultAction = await dispatch(registerUser(completeProfileData));
        
        // Check if registration was successful using Redux's matcher
        if (registerUser.fulfilled.match(resultAction)) {
          // Success! Redux state is now updated with user
          // isAuthenticated becomes true, user data is stored
          
          // Optional: Store any additional data if needed
          // (But Redux already has the user data)
          
          // Navigate to Home page
          navigate("/", {
            replace: true,
            state: { message: "Welcome to Clozzy! Your style journey begins now." }
          });
        } else {
          // Handle registration error from Redux
          const error = resultAction.payload as any;
          if (error?.status === 400) {
            alert(error?.message || "Email already registered");
            navigate("/login");
          } else {
            alert(error?.message || "Registration failed. Please try again.");
          }
        }

      } catch (error: any) {
        console.error('Registration error:', error);
        alert(error?.message || "Registration failed. Please try again.");
      }
    }
  };

  const handleProfileBack = () => setProfileStep(profileStep - 1);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // Render authentication screen
  if (step === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="flex min-h-screen">
          {/* Left Side - Image with Pixel Effect */}
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

          {/* Right Side - Card-based Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md"
            >
              <Card className="p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                {/* Logo */}
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center gap-2 text-2xl font-light tracking-wider text-gray-800">
                    <Sparkles className="w-5 h-5 text-gray-600" />
                    <h1 className="text-2xl font-light text-gray-900">Create Account</h1>
                  </div>
                </div>
                {/* Form */}
                <form onSubmit={handleAuthSubmit} className="space-y-5">
                  {/* Name Field */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`w-full pl-9 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none transition-all text-sm ${
                          errors.name 
                            ? 'border-red-300 bg-red-50/50' 
                            : 'border-gray-200 focus:border-gray-400 focus:bg-white'
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>

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
                        placeholder="Create a strong password"
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
                    {errors.password ? (
                      <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-400">
                        Min. 8 chars with uppercase, lowercase & number
                      </p>
                    )}
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="w-4 h-4 text-gray-700 bg-gray-50 border-gray-300 rounded focus:ring-gray-500"
                      />
                    </div>
                    <div className="text-xs">
                      <label className="text-gray-600">
                        I agree to the{' '}
                        <a href="#" className="text-gray-900 hover:underline font-medium">Terms</a>
                        {' '}and{' '}
                        <a href="#" className="text-gray-900 hover:underline font-medium">Privacy Policy</a>
                      </label>
                      {errors.terms && (
                        <p className="text-red-500 mt-1">{errors.terms}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <ShimmerButton 
                    type="submit"
                    className="w-full shadow-10xl"
                  >
                    <span className="text-center text-sm tracking-tight whitespace-pre-wrap text-white flex items-center justify-center gap-2">
                      Create Account
                      <ArrowRight className="w-4 h-4" />
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

                  {/* Login Link */}
                  <p className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Render profile setup screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="flex min-h-screen">
        {/* Left Side - Progress */}
        <div className="hidden lg:flex lg:w-1/3 bg-gradient-to-br from-gray-900 to-slate-800 p-12 flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-white mb-12">
              <Sparkles className="w-5 h-5 text-gray-300" />
              <span className="text-lg font-light tracking-wider">CLOZZY</span>
            </div>
            
            <h2 className="text-3xl font-light text-white mb-4">
              Complete Your Profile
            </h2>
            <p className="text-gray-400 text-sm mb-12">
              Help us understand your style preferences for personalized recommendations.
            </p>

            {/* Progress Steps */}
            <div className="space-y-6">
              {[
                { step: 1, title: 'Gender', description: 'Select your gender' },
                { step: 2, title: 'Skin Tone', description: 'Select your complexion' },
                { step: 3, title: 'Height', description: 'For perfect fit' },
                { step: 4, title: 'Body Type', description: 'Better size matching' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
                    profileStep > item.step 
                      ? 'bg-gray-500 text-white'
                      : profileStep === item.step
                      ? 'bg-white text-gray-900'
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    {profileStep > item.step ? <Check className="w-4 h-4" /> : item.step}
                  </div>
                  <div>
                    <h3 className={`text-sm font-medium ${
                      profileStep >= item.step ? 'text-white' : 'text-gray-500'
                    }`}>
                      {item.title}
                    </h3>
                    <p className={`text-xs ${
                      profileStep >= item.step ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-gray-500 text-xs">
            <p>Your data is secure and private</p>
            <div className="flex items-center gap-2 mt-2">
              <Shield className="w-3 h-3" />
              <span>256-bit encryption</span>
            </div>
          </div>
        </div>

        {/* Right Side - Profile Setup */}
        <div className="w-full lg:w-2/3 flex items-center justify-center p-8">
          <motion.div 
            key={profileStep}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-2xl"
          >
            <Card className="p-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              {/* Mobile Progress */}
              <div className="lg:hidden mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Step {profileStep} of 4
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    {Math.round((profileStep / 4) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-gray-900 rounded-full transition-all duration-500"
                    style={{ width: `${(profileStep / 4) * 100}%` }}
                  />
                </div>
              </div>

              <h2 className="text-2xl font-light text-gray-900 mb-2">
                {profileStep === 1 && "What's your gender?"}
                {profileStep === 2 && "What's your skin tone?"}
                {profileStep === 3 && "How tall are you?"}
                {profileStep === 4 && "Describe your build"}
              </h2>
              <p className="text-sm text-gray-500 mb-8">
                {profileStep === 1 && "This helps us personalize your style recommendations."}
                {profileStep === 2 && "This helps us recommend colors that complement you best."}
                {profileStep === 3 && "For accurate size recommendations and fit."}
                {profileStep === 4 && "To find clothes that match your body type."}
              </p>

              {/* Step 1: Gender */}
              {profileStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {GENDER_OPTIONS.map((option) => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setGender(option.id)}
                      className={`group relative p-6 rounded-xl transition-all ${
                        gender === option.id 
                          ? 'bg-gray-900 text-white shadow-lg' 
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="text-3xl mb-3">{option.icon}</div>
                      <span className={`text-sm font-medium ${
                        gender === option.id ? 'text-white' : 'text-gray-700'
                      }`}>
                        {option.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Step 2: Skin Tone */}
              {profileStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SKIN_TONES.map((tone) => (
                    <motion.button
                      key={tone.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSkinTone(tone.id)}
                      className={`group relative p-6 rounded-xl transition-all ${
                        skinTone === tone.id 
                          ? 'bg-gray-900 text-white shadow-lg' 
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                     
                      <div 
                        className="w-10 h-10 rounded-full mx-auto mb-3 border-2 border-white shadow-sm"
                        style={{ backgroundColor: tone.color }}
                      />
                      <span className={`text-xs font-medium ${
                        skinTone === tone.id ? 'text-white' : 'text-gray-700'
                      }`}>
                        {tone.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Step 3: Height */}
              {profileStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <span className="text-5xl font-light text-gray-900">
                      {height}
                    </span>
                    <span className="text-lg text-gray-400 ml-2">cm</span>
                  </div>
                  
                  <div className="relative px-2">
                    <input
                      type="range"
                      min="140"
                      max="210"
                      value={height}
                      onChange={(e) => setHeight(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #111827, #4B5563)`,
                      }}
                    />
                    <div className="flex justify-between mt-3">
                      <span className="text-xs text-gray-400">140cm</span>
                      <span className="text-xs text-gray-400">175cm</span>
                      <span className="text-xs text-gray-400">210cm</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 p-5 bg-gray-50 rounded-xl">
                    <Maximize2 className="w-4 h-4 text-gray-600" />
                    <p className="text-xs text-gray-600">
                      {height < 160 && "Petite frame - we'll find perfect fits for you"}
                      {height >= 160 && height < 180 && "Average height - most styles will work great"}
                      {height >= 180 && "Tall frame - we'll focus on longer cuts"}
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Body Type */}
              {profileStep === 4 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {BODY_TYPES.map((type) => (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setBodyType(type.id)}
                      className={`p-5 rounded-xl text-left transition-all ${
                        bodyType === type.id 
                          ? 'bg-gray-900 text-white shadow-lg' 
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
<div className="flex gap-3">
  <div className="flex-shrink-0">
    <img 
      src={type.icon} 
      alt={type.name} 
      className="w-8 h-8 object-contain"
    />
  </div>  
</div>                   <h3 className={`text-sm font-medium mb-1 ${
                        bodyType === type.id ? 'text-white' : 'text-gray-900'
                      }`}>
                        {type.label}
                      </h3>
                      <p className={`text-xs ${
                        bodyType === type.id ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {type.description}
                      </p>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-10 flex justify-between items-center">
                {profileStep > 1 ? (
                  <button
                    onClick={handleProfileBack}
                    className="flex items-center gap-1 px-5 py-2 text-xs text-gray-600 font-medium hover:text-gray-900 transition-colors group"
                  >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                  </button>
                ) : (
                  <div />
                )}
                
                <ShimmerButton
                  onClick={handleProfileNext}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : profileStep === 4 ? (
                    <span className="flex items-center gap-2">
                      Complete Setup
                      <Sparkles className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  )}
                </ShimmerButton>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};