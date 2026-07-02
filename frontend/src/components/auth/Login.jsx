import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Heart, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Star
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const from = location.state?.from?.pathname || '/dashboard';

  const demoCredentials = [
    { label: 'Patient', email: 'patient@meditrack.com', password: 'password123' },
    { label: 'Doctor', email: 'doctor@meditrack.com', password: 'password123' },
    { label: 'Admin', email: 'admin@meditrack.com', password: 'password123' },
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (email, password) => {
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');
    if (emailInput) {
      emailInput.value = email;
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (passwordInput) {
      passwordInput.value = password;
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50+', label: 'Partner Doctors' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support' },
  ];

  const features = [
    { icon: <Shield className="w-4 h-4" />, text: 'HIPAA Compliant' },
    { icon: <Lock className="w-4 h-4" />, text: 'Encrypted' },
    { icon: <Heart className="w-4 h-4" />, text: '24/7 Support' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-700 to-teal-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10" />
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white/20 rounded-2xl backdrop-blur flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">MediTrack Pro</span>
          </div>

          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Your Health,
            <br />
            <span className="text-teal-200">Reimagined</span>
          </h1>
          <p className="text-lg text-teal-100/80 max-w-md leading-relaxed">
            Experience healthcare management like never before. 
            Smart, secure, and always by your side.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm bg-white/10 backdrop-blur px-3 py-1.5 rounded-full">
                {feature.icon}
                {feature.text}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-4 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10 text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-teal-100/70">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4 text-sm text-teal-100/60">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>Secure</span>
            </div>
            <div className="w-px h-4 bg-teal-100/20" />
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>Verified</span>
            </div>
            <div className="w-px h-4 bg-teal-100/20" />
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>Trusted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">MediTrack Pro</span>
            </div>
            <p className="text-sm text-gray-500">Your Personal Healthcare Companion</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-500 mt-1">Sign in to continue managing your health</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('email')}
                      type="email"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      {...register('rememberMe')}
                      type="checkbox"
                      className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                    />
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading || authLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading || authLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Sign In
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <p className="text-xs text-gray-400 text-center mb-3">Quick Demo Access</p>
              <div className="grid grid-cols-3 gap-2">
                {demoCredentials.map((demo, index) => (
                  <button
                    key={index}
                    onClick={() => fillDemoCredentials(demo.email, demo.password)}
                    className="px-3 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-gray-900 border border-gray-200"
                  >
                    {demo.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-teal-600 font-medium hover:text-teal-700">
                  Create one now
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Protected by industry-grade encryption 🔒
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;