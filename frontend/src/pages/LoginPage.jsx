import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, Crown, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      const user = response.data.user;
      login(user, response.data.token);
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Login failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a]/90 via-[#1a1a1a]/70 to-[#B8860B]/30" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Crown className="w-10 h-10 text-[#D4AF37]" />
            <div>
              <h1 className="text-2xl font-serif tracking-wider">MAHARAJA</h1>
              <p className="text-xs tracking-[0.3em] text-[#D4AF37]">PALACE</p>
            </div>
          </div>
          
          {/* Middle Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm tracking-widest text-[#D4AF37]">LUXURY REDEFINED</span>
            </div>
            <h2 className="text-5xl font-serif leading-tight">
              Welcome Back to<br />
              <span className="text-[#D4AF37]">Royal Excellence</span>
            </h2>
            <p className="text-white/70 text-lg max-w-md">
              Experience the pinnacle of hospitality. Your journey to unparalleled luxury begins here.
            </p>
          </div>
          
          {/* Bottom Stats */}
          <div className="flex gap-12">
            <div>
              <p className="text-3xl font-serif text-[#D4AF37]">7★</p>
              <p className="text-sm text-white/60">Luxury Rating</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-[#D4AF37]">50+</p>
              <p className="text-sm text-white/60">Royal Suites</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-[#D4AF37]">24/7</p>
              <p className="text-sm text-white/60">Concierge</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-[#FBF9F4] to-[#F5F0E6]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Crown className="w-8 h-8 text-[#B8860B]" />
            <div>
              <h1 className="text-xl font-serif tracking-wider text-[#1a1a1a]">MAHARAJA</h1>
              <p className="text-[10px] tracking-[0.3em] text-[#B8860B]">PALACE</p>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-serif text-[#1a1a1a] mb-3">Welcome Back</h2>
            <p className="text-[#6a6a6a]">Sign in to access your royal account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#2a2a2a]">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-[#B8860B]" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-xl text-[#1a1a1a] placeholder-[#9a9a9a] transition-all duration-300 focus:outline-none focus:ring-0 ${
                    errors.email 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-[#E5E0D8] focus:border-[#B8860B] hover:border-[#D4AF37]/50'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#2a2a2a]">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-[#B8860B]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-4 bg-white border-2 rounded-xl text-[#1a1a1a] placeholder-[#9a9a9a] transition-all duration-300 focus:outline-none focus:ring-0 ${
                    errors.password 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-[#E5E0D8] focus:border-[#B8860B] hover:border-[#D4AF37]/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9a9a9a] hover:text-[#B8860B] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-2 border-[#E5E0D8] text-[#B8860B] focus:ring-[#B8860B] focus:ring-offset-0"
                />
                <span className="text-sm text-[#6a6a6a] group-hover:text-[#2a2a2a] transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#B8860B] hover:text-[#8B6914] font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white font-semibold rounded-xl shadow-lg shadow-[#B8860B]/25 hover:shadow-xl hover:shadow-[#B8860B]/30 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E5E0D8] to-transparent"></div>
            <span className="text-sm text-[#9a9a9a]">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E5E0D8] to-transparent"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-[#6a6a6a]">
              New to Maharaja Palace?{' '}
              <Link 
                to="/register" 
                className="text-[#B8860B] font-semibold hover:text-[#8B6914] transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-[#9a9a9a] hover:text-[#B8860B] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
