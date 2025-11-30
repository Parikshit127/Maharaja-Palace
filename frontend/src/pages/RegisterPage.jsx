import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, Crown, Sparkles, Check } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Registration failed',
      });
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-400' };
    if (strength <= 3) return { strength, label: 'Medium', color: 'bg-yellow-400' };
    return { strength, label: 'Strong', color: 'bg-green-400' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
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
              <span className="text-sm tracking-widest text-[#D4AF37]">JOIN THE ELITE</span>
            </div>
            <h2 className="text-5xl font-serif leading-tight">
              Begin Your<br />
              <span className="text-[#D4AF37]">Royal Journey</span>
            </h2>
            <p className="text-white/70 text-lg max-w-md">
              Create your exclusive account and unlock a world of unparalleled luxury and personalized experiences.
            </p>
            
            {/* Benefits */}
            <div className="space-y-3 pt-4">
              {[
                'Exclusive member-only rates',
                'Priority booking access',
                'Personalized concierge service',
                'Complimentary room upgrades',
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#D4AF37]" />
                  </div>
                  <span className="text-white/80">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Bottom Stats */}
          <div className="flex gap-12">
            <div>
              <p className="text-3xl font-serif text-[#D4AF37]">10K+</p>
              <p className="text-sm text-white/60">Happy Guests</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-[#D4AF37]">98%</p>
              <p className="text-sm text-white/60">Satisfaction</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-[#D4AF37]">5★</p>
              <p className="text-sm text-white/60">Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 bg-gradient-to-br from-[#FBF9F4] to-[#F5F0E6] overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <Crown className="w-8 h-8 text-[#B8860B]" />
            <div>
              <h1 className="text-xl font-serif tracking-wider text-[#1a1a1a]">MAHARAJA</h1>
              <p className="text-[10px] tracking-[0.3em] text-[#B8860B]">PALACE</p>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-serif text-[#1a1a1a] mb-2">Create Account</h2>
            <p className="text-[#6a6a6a]">Join our exclusive community of distinguished guests</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#2a2a2a]">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-[#B8860B]" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 rounded-xl text-[#1a1a1a] placeholder-[#9a9a9a] transition-all duration-300 focus:outline-none focus:ring-0 ${
                      errors.firstName 
                        ? 'border-red-400 focus:border-red-500' 
                        : 'border-[#E5E0D8] focus:border-[#B8860B] hover:border-[#D4AF37]/50'
                    }`}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-xs">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#2a2a2a]">Last Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl text-[#1a1a1a] placeholder-[#9a9a9a] transition-all duration-300 focus:outline-none focus:ring-0 ${
                      errors.lastName 
                        ? 'border-red-400 focus:border-red-500' 
                        : 'border-[#E5E0D8] focus:border-[#B8860B] hover:border-[#D4AF37]/50'
                    }`}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-xs">{errors.lastName}</p>
                )}
              </div>
            </div>

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
                  className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 rounded-xl text-[#1a1a1a] placeholder-[#9a9a9a] transition-all duration-300 focus:outline-none focus:ring-0 ${
                    errors.email 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-[#E5E0D8] focus:border-[#B8860B] hover:border-[#D4AF37]/50'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#2a2a2a]">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-[#B8860B]" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  maxLength={10}
                  className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 rounded-xl text-[#1a1a1a] placeholder-[#9a9a9a] transition-all duration-300 focus:outline-none focus:ring-0 ${
                    errors.phone 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-[#E5E0D8] focus:border-[#B8860B] hover:border-[#D4AF37]/50'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
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
                  placeholder="Min. 6 characters"
                  className={`w-full pl-12 pr-12 py-3.5 bg-white border-2 rounded-xl text-[#1a1a1a] placeholder-[#9a9a9a] transition-all duration-300 focus:outline-none focus:ring-0 ${
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
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${
                    passwordStrength.strength <= 2 ? 'text-red-500' : 
                    passwordStrength.strength <= 3 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    Password strength: {passwordStrength.label}
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#2a2a2a]">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-[#B8860B]" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`w-full pl-12 pr-12 py-3.5 bg-white border-2 rounded-xl text-[#1a1a1a] placeholder-[#9a9a9a] transition-all duration-300 focus:outline-none focus:ring-0 ${
                    errors.confirmPassword 
                      ? 'border-red-400 focus:border-red-500' 
                      : formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-green-400'
                        : 'border-[#E5E0D8] focus:border-[#B8860B] hover:border-[#D4AF37]/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9a9a9a] hover:text-[#B8860B] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-green-600 text-xs flex items-center gap-1">
                  <Check className="w-3 h-3" /> Passwords match
                </p>
              )}
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                required
                className="w-4 h-4 mt-0.5 rounded border-2 border-[#E5E0D8] text-[#B8860B] focus:ring-[#B8860B] focus:ring-offset-0"
              />
              <span className="text-sm text-[#6a6a6a]">
                I agree to the{' '}
                <a href="#" className="text-[#B8860B] hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[#B8860B] hover:underline">Privacy Policy</a>
              </span>
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
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E5E0D8] to-transparent"></div>
            <span className="text-sm text-[#9a9a9a]">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E5E0D8] to-transparent"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-[#6a6a6a]">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-[#B8860B] font-semibold hover:text-[#8B6914] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-4">
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
