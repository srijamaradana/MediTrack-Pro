import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Stethoscope,
  Calendar,
  Pill,
  FileText,
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
  RefreshCw,
  Settings,
  Bell,
  Menu,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Home,
  LogOut,
  User,
  HelpCircle,
  Shield,
  Zap,
  Target,
  Award,
  BookOpen,
  Globe,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Gift,
  Star,
  Heart,
  Smile,
  Frown,
  Meh,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Snowflake,
  Wind,
  Droplet,
  Thermometer,
  Activity as ActivityIcon,
  BarChart,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Download as DownloadIcon,
  Filter as FilterIcon,
  Search as SearchIcon,
  Eye as EyeIcon,
  Edit as EditIcon,
  Trash2 as Trash2Icon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  Clock as ClockIcon,
  AlertCircle as AlertCircleIcon,
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon2,
  LineChart as LineChartIcon2,
  DollarSign as DollarSignIcon,
  RefreshCw as RefreshCwIcon,
  Settings as SettingsIcon,
  Bell as BellIcon,
  Menu as MenuIcon,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  LogOut as LogOutIcon,
  User as UserIcon,
  HelpCircle as HelpCircleIcon,
  Shield as ShieldIcon,
  Zap as ZapIcon,
  Target as TargetIcon,
  Award as AwardIcon,
  BookOpen as BookOpenIcon,
  Globe as GlobeIcon,
  MessageSquare as MessageSquareIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Building as BuildingIcon,
  CreditCard as CreditCardIcon,
  Gift as GiftIcon,
  Star as StarIcon,
  Heart as HeartIcon,
  Smile as SmileIcon,
  Frown as FrownIcon,
  Meh as MehIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Cloud as CloudIcon,
  CloudRain as CloudRainIcon,
  Snowflake as SnowflakeIcon,
  Wind as WindIcon,
  Droplet as DropletIcon,
  Thermometer as ThermometerIcon,
  Activity as ActivityIcon2
} from 'lucide-react';
import { admin } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import StatCard from './StatCard';
import RecentActivity from './RecentActivity';
import AppointmentChart from './AppointmentChart';
import UserGrowthChart from './UserGrowthChart';
import AnalyticsOverview from './AnalyticsOverview';

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Fetch admin stats
  const { data: statsData, isLoading, error, refetch } = useQuery(
    ['admin-stats', dateRange],
    () => admin.getStats({ period: dateRange }),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 15000,
    }
  );

  // Fetch analytics data
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery(
    ['admin-analytics', dateRange],
    () => admin.getAnalytics({ period: dateRange }),
    {
      staleTime: 60000,
    }
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Failed to load dashboard</h3>
        <p className="text-gray-500 mt-2">Please try again later</p>
        <button onClick={() => refetch()} className="mt-4 btn-primary">
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const stats = statsData?.stats || {};
  const analytics = analyticsData?.analytics || {};

  // Calculate trends
  const getTrend = (current, previous) => {
    if (!previous || previous === 0) return { value: 0, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(Math.round(change)),
      isPositive: change >= 0,
    };
  };

  const userTrend = getTrend(stats.totalUsers || 0, stats.previousUsers || 0);
  const appointmentTrend = getTrend(stats.totalAppointments || 0, stats.previousAppointments || 0);
  const revenueTrend = getTrend(stats.totalRevenue || 0, stats.previousRevenue || 0);

  // Format numbers
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📊 Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of platform performance and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input py-2 text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn-secondary text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button onClick={() => refetch()} className="btn-secondary text-sm">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers || 0}
          icon={<Users className="w-5 h-5" />}
          trend={userTrend}
          color="primary"
          subtitle={`${stats.newUsers || 0} new this ${dateRange}`}
        />

        <StatCard
          title="Total Doctors"
          value={stats.totalDoctors || 0}
          icon={<Stethoscope className="w-5 h-5" />}
          trend={{ value: 12, isPositive: true }}
          color="success"
          subtitle={`${stats.activeDoctors || 0} active`}
        />

        <StatCard
          title="Appointments"
          value={stats.totalAppointments || 0}
          icon={<Calendar className="w-5 h-5" />}
          trend={appointmentTrend}
          color="secondary"
          subtitle={`${stats.pendingAppointments || 0} pending`}
        />

        <StatCard
          title="Revenue"
          value={formatCurrency(stats.totalRevenue || 0)}
          icon={<DollarSign className="w-5 h-5" />}
          trend={revenueTrend}
          color="warning"
          subtitle={`${stats.paidAppointments || 0} paid appointments`}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Pill className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Medications</p>
              <p className="text-lg font-bold text-gray-900">{stats.totalMedications || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Reports</p>
              <p className="text-lg font-bold text-gray-900">{stats.totalReports || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Health Logs</p>
              <p className="text-lg font-bold text-gray-900">{stats.totalHealthLogs || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-lg font-bold text-gray-900">{stats.activeUsers || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Trends</h3>
          <div className="h-72">
            <AppointmentChart data={analytics.appointmentTrends || []} />
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <div className="h-72">
            <UserGrowthChart data={analytics.userGrowth || []} />
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Analytics</h3>
          <AnalyticsOverview data={analytics} />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Specializations</h3>
          <div className="space-y-3">
            {(analytics.popularSpecializations || []).slice(0, 5).map((spec, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="text-sm text-gray-900">{spec._id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{spec.count}</span>
                  <span className="text-xs text-gray-500">doctors</span>
                  <span className="inline-flex items-center gap-1 text-xs text-yellow-600">
                    <Star className="w-3 h-3" />
                    {spec.avgRating?.toFixed(1) || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <RecentActivity activities={stats.recentActivities || []} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/admin/users" className="card hover:shadow-md transition text-center">
          <Users className="w-6 h-6 text-primary-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">Manage Users</p>
        </Link>

        <Link to="/admin/doctors" className="card hover:shadow-md transition text-center">
          <Stethoscope className="w-6 h-6 text-success-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">Manage Doctors</p>
        </Link>

        <Link to="/admin/appointments" className="card hover:shadow-md transition text-center">
          <Calendar className="w-6 h-6 text-secondary-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">Appointments</p>
        </Link>

        <Link to="/admin/analytics" className="card hover:shadow-md transition text-center">
          <BarChart3 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">Analytics</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;