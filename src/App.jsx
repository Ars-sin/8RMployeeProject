import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import AdminDashboard from './pages/Admin/AdminDashboard';
import HRDashboard from './pages/HR/HRDashboard';
import AccountingDashboard from './pages/Accounting/AccountingDashboard';
import { sendOTP, verifyOTP } from './OTPService';
import { loginUser } from './services/authService';

const BRMSystem = () => {
  // Feature flag for OTP - set to false to disable OTP during development
  const ENABLE_OTP = false; // Set to true during deployment
  
  const [currentView, setCurrentView] = useState('login'); // 'login', 'verification', 'dashboard'
  const [dashboardType, setDashboardType] = useState('employee'); // 'employee', 'hr', 'accounting'
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    verificationCode: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateLogin = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password or Employee ID is required';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Must be at least 3 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVerification = () => {
    const newErrors = {};
    
    if (!formData.verificationCode) {
      newErrors.verificationCode = 'Verification code is required';
    } else if (formData.verificationCode.length !== 6) {
      newErrors.verificationCode = 'Code must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (validateLogin()) {
      setIsLoading(true);
      
      // Verify credentials (admin or employee)
      const loginResult = await loginUser(formData.email, formData.password);
      
      if (loginResult.success) {
        setLoggedInUser(loginResult.user);
        setDashboardType(loginResult.dashboardType);
        
        // Check if OTP is enabled
        if (ENABLE_OTP) {
          // Send OTP to user's email
          const otpResult = await sendOTP(formData.email);
          
          if (otpResult.success) {
            setIsLoading(false);
            setCurrentView('verification');
          } else {
            setIsLoading(false);
            setErrors({ email: otpResult.message || 'Failed to send OTP' });
          }
        } else {
          // Skip OTP verification - go directly to dashboard
          setIsLoading(false);
          setCurrentView('dashboard');
        }
      } else {
        setIsLoading(false);
        setErrors({ password: loginResult.message || 'Invalid credentials' });
      }
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    
    if (validateVerification()) {
      setIsLoading(true);
      
      // Verify OTP with backend
      const result = await verifyOTP(formData.email, formData.verificationCode);
      
      if (result.success) {
        setIsLoading(false);
        setCurrentView('dashboard');
      } else {
        setIsLoading(false);
        setErrors({ verificationCode: result.message || 'Invalid OTP' });
      }
    }
  };

  const handleLogout = () => {
    setCurrentView('login');
    setLoggedInUser(null);
    setDashboardType('employee');
    setFormData({
      email: '',
      password: '',
      verificationCode: '',
      rememberMe: false
    });
    setErrors({});
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    
    // Resend OTP
    const result = await sendOTP(formData.email);
    
    if (result.success) {
      setIsLoading(false);
      alert('Verification code resent to your email!');
    } else {
      setIsLoading(false);
      alert('Failed to resend code. Please try again.');
    }
  };

  return (
    <>
      {currentView === 'dashboard' ? (
        <>
          {dashboardType === 'hr' && <HRDashboard user={loggedInUser} onLogout={handleLogout} />}
          {dashboardType === 'accounting' && <AccountingDashboard user={loggedInUser} onLogout={handleLogout} />}
          {dashboardType === 'employee' && <AdminDashboard onLogout={handleLogout} />}
        </>
      ) : (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md px-2 sm:px-4">
          {/* Logo */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-2">
              <div className="relative">
                <svg width="40" height="40" viewBox="0 0 50 50" fill="none" className="sm:w-[50px] sm:h-[50px]">
                  <path d="M10 35 L10 20 L20 10 L30 20 L30 35" stroke="#888" strokeWidth="2" fill="none"/>
                  <rect x="15" y="25" width="10" height="10" fill="#888"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  <span className="text-green-600">8</span>
                  <span className="text-blue-900">RM</span>
                </h1>
                <p className="text-xs text-gray-600">Utility Projects Construction</p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          {currentView === 'login' && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8">Welcome back!</h2>
              
              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="ambrad.assistant@gmail.com"
                      className={`w-full px-4 py-2.5 sm:py-3 pr-12 border-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                        errors.email ? 'border-red-500' : formData.email ? 'border-blue-500' : 'border-gray-300'
                      }`}
                    />
                    {formData.email && !errors.email && (
                      <CheckCircle2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Password / Employee ID Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Password / Employee ID
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password or Employee ID"
                      className={`w-full px-4 py-2.5 sm:py-3 pr-12 border-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      style={{ WebkitTextSecurity: showPassword ? 'none' : 'disc' }}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Remember me?</span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Forget Password
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 sm:py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>

                {/* Sign Up Link */}
                <div className="text-center mt-4 sm:mt-6">
                  
                </div>
              </form>
            </div>
          )}

          {/* Verification Form */}
          {currentView === 'verification' && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Verification</h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm">
                We've sent a verification code to your email
              </p>
              
              <form onSubmit={handleVerification} className="space-y-4 sm:space-y-6">
                {/* Verification Code Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Code
                  </label>
                  <input
                    type="text"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className={`w-full px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 text-center text-xl sm:text-2xl tracking-widest transition-colors ${
                      errors.verificationCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.verificationCode && (
                    <p className="mt-1 text-sm text-red-500">{errors.verificationCode}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 sm:py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  {isLoading ? 'Verifying...' : 'Verify'}
                </button>

                {/* Resend Link */}
                <div className="text-center mt-4 sm:mt-6">
                  <p className="text-sm text-gray-600">
                    Didn't receive the code?{' '}
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                      disabled={isLoading}
                    >
                      Resend
                    </button>
                  </p>
                </div>

                {/* Back to Login */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setCurrentView('login')}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    ← Back to login
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 items-center justify-center p-8 xl:p-16 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'}}>
        {/* Decorative Polygons - Top Right */}
        <div className="absolute top-4 xl:top-8 right-4 xl:right-8">
          <svg width="140" height="140" viewBox="0 0 180 180" fill="none" className="opacity-30 xl:w-[180px] xl:h-[180px]">
            <path d="M20 0 L80 20 L70 80 L30 70 Z" fill="white" fillOpacity="0.3"/>
            <path d="M90 10 L150 30 L140 90 L80 70 Z" fill="white" fillOpacity="0.2"/>
          </svg>
        </div>

        {/* Decorative Polygons - Top Left */}
        <div className="absolute top-0 left-0">
          <svg width="100" height="100" viewBox="0 0 120 120" fill="none" className="opacity-30 xl:w-[120px] xl:h-[120px]">
            <path d="M0 40 L60 20 L80 80 L20 100 Z" fill="white" fillOpacity="0.2"/>
          </svg>
        </div>

        {/* Decorative Polygons - Bottom Right */}
        <div className="absolute bottom-0 right-0">
          <svg width="130" height="130" viewBox="0 0 160 160" fill="none" className="opacity-30 xl:w-[160px] xl:h-[160px]">
            <path d="M100 100 L160 120 L140 160 L80 140 Z" fill="white" fillOpacity="0.25"/>
          </svg>
        </div>

        {/* Decorative Polygons - Bottom Left */}
        <div className="absolute bottom-8 xl:bottom-16 left-4 xl:left-8">
          <svg width="180" height="180" viewBox="0 0 220 220" fill="none" className="opacity-40 xl:w-[220px] xl:h-[220px]">
            <path d="M20 120 L100 140 L80 200 L0 180 Z" fill="white" fillOpacity="0.15"/>
            <path d="M100 140 L180 160 L160 220 L80 200 Z" fill="white" fillOpacity="0.25"/>
          </svg>
        </div>
        
        <div className="relative z-10 text-center max-w-2xl px-4 xl:px-8">
          {/* Building Image with Frame */}
          <div className="mb-8 xl:mb-12 flex justify-center">
            <div className="relative w-full max-w-xl">
              <div className="bg-gradient-to-br from-blue-300/40 to-blue-400/30 backdrop-blur-sm rounded-2xl xl:rounded-3xl shadow-2xl p-1">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl xl:rounded-3xl p-4 xl:p-6">
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&h=600&fit=crop&q=80"
                    alt="Modern Building Construction - 8RM Project"
                    className="w-full h-60 xl:h-80 object-cover rounded-xl xl:rounded-2xl shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <h2 className="text-3xl xl:text-5xl font-bold text-white mb-4 xl:mb-6 leading-tight">
            Powerful Dashboard for<br />
            Managing 8RM Utility Project<br />
            Construction
          </h2>
          <p className="text-blue-50 text-base xl:text-lg leading-relaxed max-w-2xl mx-auto mb-6 xl:mb-10" style={{lineHeight: '1.8'}}>
            Simplify your construction operations with 8RM's centralized management system.
            Track projects, monitor utilities, manage resources, and oversee progress in real time
            for faster, smarter, and more efficient decision-making.
          </p>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2.5">
            <div className="w-8 xl:w-10 h-2 xl:h-2.5 bg-white rounded-full shadow-sm"></div>
            <div className="w-2 xl:w-2.5 h-2 xl:h-2.5 bg-white/50 rounded-full"></div>
            <div className="w-2 xl:w-2.5 h-2 xl:h-2.5 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
      )}
    </>
  );
};

export default BRMSystem;
