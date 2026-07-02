import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth } from '../../context/AuthContext';
import {
  Heart,
  Pill,
  Calendar,
  FileText,
  Activity,
  Users,
  Stethoscope,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Eye,
  ChevronRight,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Filter,
  Search,
  RefreshCw,
  MoreVertical,
  Edit,
  Trash2,
  User,
  Settings,
  LogOut,
  Bell,
  Home,
  HelpCircle,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Snowflake,
  Wind,
  Droplet,
  Thermometer,
  Smile,
  Frown,
  Meh,
  Star,
  Award,
  Target,
  Zap,
  Shield,
  BookOpen,
  Globe,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Gift
} from 'lucide-react';
import { users, appointments, medications, reports } from '../../services/api';
import { formatDate, formatTime } from '../../utils/helpers';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

const Dashboard = () => {
  const { user, isPatient, isDoctor, isAdmin } = useAuth();
  const [dateRange, setDateRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Fetch dashboard stats
  const { data: statsData, isLoading: statsLoading, error: statsError, refetch } = useQuery(
    ['dashboard-stats'],
    () => users.getDashboardStats(),
    {
      staleTime: 30000,
      retry: 1,
    }
  );

  // Fetch upcoming appointments
  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery(
    ['upcoming-appointments'],
    () => appointments.getAll({ status: 'scheduled,confirmed', limit: 5 }),
    {
      staleTime: 30000,
    }
  );

  // Fetch recent medications
  const { data: medicationsData, isLoading: medicationsLoading } = useQuery(
    ['recent-medications'],
    () => medications.getAll({ status: 'active', limit: 5 }),
    {
      staleTime: 30000,
    }
  );

  // Fetch recent reports
  const { data: reportsData, isLoading: reportsLoading } = useQuery(
    ['recent-reports'],
    () => reports.getAll({ limit: 3 }),
    {
      staleTime: 30000,
    }
  );

  // Loading state
  if (statsLoading || appointmentsLoading || medicationsLoading || reportsLoading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (statsError) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
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
  const upcomingAppointments = appointmentsData?.data || [];
  const recentMedications = medicationsData?.data || [];
  const recentReports = reportsData?.data || [];

  // Calculate adherence rate
  const adherenceRate = stats.adherenceRate || 0;

  // Welcome message based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's your health overview for today</p>
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
          </select>
          <button onClick={() => refetch()} className="btn-secondary text-sm">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Medications"
          value={stats.activeMedications || 0}
          icon={<Pill className="w-5 h-5" />}
          trend={{ value: 12, isPositive: true }}
          color="primary"
          subtitle="Currently active"
        />

        <StatsCard
          title="Upcoming Appointments"
          value={stats.upcomingAppointments || 0}
          icon={<Calendar className="w-5 h-5" />}
          trend={{ value: 8, isPositive: true }}
          color="secondary"
          subtitle="Scheduled this week"
        />

        <StatsCard
          title="Medical Reports"
          value={stats.totalReports || 0}
          icon={<FileText className="w-5 h-5" />}
          trend={{ value: 5, isPositive: true }}
          color="purple"
          subtitle="Total uploaded"
        />

        <StatsCard
          title="Adherence Rate"
          value={`${Math.round(adherenceRate)}%`}
          icon={<Activity className="w-5 h-5" />}
          trend={{ value: 3, isPositive: adherenceRate >= 70 }}
          color={adherenceRate >= 70 ? 'success' : 'warning'}
          subtitle={adherenceRate >= 70 ? 'Good job!' : 'Needs improvement'}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/medications/add" className="card hover:shadow-md transition text-center">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Plus className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-sm font-medium text-gray-900">Add Medication</p>
        </Link>

        <Link to="/appointments/book" className="card hover:shadow-md transition text-center">
          <div className="w-10 h-10 bg-secondary-50 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Calendar className="w-5 h-5 text-secondary-600" />
          </div>
          <p className="text-sm font-medium text-gray-900">Book Appointment</p>
        </Link>

        <Link to="/reports/upload" className="card hover:shadow-md transition text-center">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-2">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-sm font-medium text-gray-900">Upload Report</p>
        </Link>

        <Link to="/health-log/add" className="card hover:shadow-md transition text-center">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm font-medium text-gray-900">Log Health</p>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
              <p className="text-sm text-gray-500">Your scheduled appointments</p>
            </div>
            <Link to="/appointments" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <EmptyState
              icon={<Calendar className="w-12 h-12" />}
              title="No upcoming appointments"
              description="Book your next appointment today"
              action={
                <Link to="/appointments/book" className="btn-primary text-sm">
                  <Plus className="w-4 h-4" />
                  Book Now
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 5).map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Dr. {appointment.doctor?.user?.name || 'Doctor'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {appointment.doctor?.specialization || 'General'}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatDate(appointment.date)} at {formatTime(appointment.time)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${appointment.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                      {appointment.status}
                    </span>
                    <Link
                      to={`/appointments/${appointment._id}`}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Adherence Rate */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medication Adherence</h3>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-32 h-32 -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#0A6E79"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${adherenceRate * 3.52} 352`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(adherenceRate)}%</p>
                    <p className="text-xs text-gray-500">Adherence</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                {adherenceRate >= 80
                  ? 'Excellent! Keep up the good work! 🌟'
                  : adherenceRate >= 60
                  ? 'Good progress! Keep going! 💪'
                  : 'Try to be more consistent with your medications'}
              </p>
            </div>
          </div>

          {/* Recent Medications */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Medications</h3>
              <Link to="/medications" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View All
              </Link>
            </div>

            {recentMedications.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No active medications</p>
            ) : (
              <div className="space-y-2">
                {recentMedications.slice(0, 3).map((med) => (
                  <div
                    key={med._id}
                    className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <Pill className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{med.name}</p>
                      <p className="text-xs text-gray-500">{med.dosage} • {med.frequency}</p>
                    </div>
                    <span className="badge-success text-xs">{med.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Reports */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
              <Link to="/reports" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View All
              </Link>
            </div>

            {recentReports.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No recent reports</p>
            ) : (
              <div className="space-y-2">
                {recentReports.slice(0, 3).map((report) => (
                  <div
                    key={report._id}
                    className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{report.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(report.createdAt)}</p>
                    </div>
                    <Link
                      to={`/reports/${report._id}`}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                      <Eye className="w-3 h-3 text-gray-400" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;