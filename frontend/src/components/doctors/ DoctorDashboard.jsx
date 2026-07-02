import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth } from '../../context/AuthContext';
import {
  Stethoscope,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  ChevronRight,
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
  Gift,
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
  Activity,
  BarChart,
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
  HelpCircle
} from 'lucide-react';
import { doctors, appointments } from '../../services/api';
import { formatDate, formatTime } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import StatsCard from '../dashboard/StatsCard';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('week');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Fetch doctor profile
  const { data: profileData, isLoading: profileLoading } = useQuery(
    ['doctor-profile'],
    () => doctors.getProfile(),
    {
      staleTime: 30000,
    }
  );

  // Fetch doctor stats
  const { data: statsData, isLoading: statsLoading } = useQuery(
    ['doctor-stats'],
    () => doctors.getStats(),
    {
      staleTime: 30000,
    }
  );

  // Fetch doctor's patients
  const { data: patientsData, isLoading: patientsLoading } = useQuery(
    ['doctor-patients'],
    () => doctors.getPatients(),
    {
      staleTime: 30000,
    }
  );

  // Fetch doctor's appointments
  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery(
    ['doctor-appointments'],
    () => doctors.getAppointments({ status: 'scheduled,confirmed', limit: 10 }),
    {
      staleTime: 30000,
    }
  );

  if (profileLoading || statsLoading || patientsLoading || appointmentsLoading) {
    return <LoadingSpinner />;
  }

  const doctor = profileData?.doctor || {};
  const stats = statsData?.stats || {};
  const patients = patientsData?.patients || [];
  const appointmentsList = appointmentsData?.data || [];

  // Calculate rating
  const rating = doctor.rating || 0;
  const totalReviews = doctor.totalReviews || 0;

  // Get greeting
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
            {getGreeting()}, Dr. {user?.name?.split(' ')[0] || 'Doctor'} 👨‍⚕️
          </h1>
          <p className="text-gray-500 mt-1">Here's your practice overview</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm">
            <CheckCircle className="w-4 h-4" />
            Available
          </span>
          <button className="btn-primary text-sm">
            <Plus className="w-4 h-4" />
            Add Patient
          </button>
        </div>
      </div>

      {/* Doctor Profile Card */}
      <div className="card bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold">
            {user?.name?.charAt(0) || 'D'}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Dr. {user?.name}</h2>
            <p className="text-teal-100">{doctor.specialization}</p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-teal-100">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                {rating.toFixed(1)} ({totalReviews} reviews)
              </span>
              <span className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {doctor.hospital?.name}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {doctor.experience} years experience
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition text-sm">
              Edit Profile
            </button>
            <button className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition text-sm">
              View Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Patients"
          value={stats.totalPatients || 0}
          icon={<Users className="w-5 h-5" />}
          trend={{ value: 12, isPositive: true }}
          color="primary"
          subtitle="Active patients"
        />

        <StatsCard
          title="Total Appointments"
          value={stats.totalAppointments || 0}
          icon={<Calendar className="w-5 h-5" />}
          trend={{ value: 8, isPositive: true }}
          color="secondary"
          subtitle="All time"
        />

        <StatsCard
          title="Completed"
          value={stats.completedAppointments || 0}
          icon={<CheckCircle className="w-5 h-5" />}
          trend={{ value: 5, isPositive: true }}
          color="success"
          subtitle="This month"
        />

        <StatsCard
          title="Upcoming"
          value={stats.upcomingAppointments || 0}
          icon={<Clock className="w-5 h-5" />}
          trend={{ value: 3, isPositive: true }}
          color="warning"
          subtitle="Next 7 days"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
              <p className="text-sm text-gray-500">Your schedule for today</p>
            </div>
            <Link to="/doctor/appointments" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              View All
            </Link>
          </div>

          {appointmentsList.length === 0 ? (
            <EmptyState
              icon={<Calendar className="w-12 h-12" />}
              title="No appointments today"
              description="You have no scheduled appointments for today"
            />
          ) : (
            <div className="space-y-3">
              {appointmentsList.slice(0, 5).map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-semibold text-primary-600">
                      {appointment.patient?.name?.charAt(0) || 'P'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{appointment.patient?.name}</p>
                    <p className="text-sm text-gray-500">
                      {appointment.type?.replace('-', ' ').toUpperCase()}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatTime(appointment.time)}
                      <span className="w-px h-3 bg-gray-300" />
                      <span className={`badge ${appointment.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-gray-200 rounded-lg transition">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-200 rounded-lg transition">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-teal-50 text-teal-700 rounded-xl hover:bg-teal-100 transition">
                <Plus className="w-5 h-5" />
                <span className="text-sm font-medium">Add Prescription</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">Schedule Follow-up</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition">
                <FileText className="w-5 h-5" />
                <span className="text-sm font-medium">Write Notes</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">View All Patients</span>
              </button>
            </div>
          </div>

          {/* Recent Patients */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Patients</h3>
              <Link to="/doctor/patients" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                View All
              </Link>
            </div>

            {patients.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No patients yet</p>
            ) : (
              <div className="space-y-2">
                {patients.slice(0, 5).map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold text-sm">
                      {p.patient?.name?.charAt(0) || 'P'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900">{p.patient?.name}</p>
                      <p className="text-xs text-gray-500">
                        Last visit: {p.lastVisit ? formatDate(p.lastVisit) : 'Never'}
                      </p>
                    </div>
                    <button className="p-1 hover:bg-gray-200 rounded-lg transition">
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating & Reviews */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Patient Reviews</h3>
          <span className="inline-flex items-center gap-1 text-sm text-yellow-600">
            <Star className="w-4 h-4 fill-yellow-500" />
            {rating.toFixed(1)} ({totalReviews} reviews)
          </span>
        </div>

        {totalReviews === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No reviews yet</p>
        ) : (
          <div className="space-y-3">
            {/* Sample reviews - replace with actual data */}
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Patient Name</span>
                  <span className="text-xs text-gray-400">2 days ago</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-3 h-3 fill-yellow-500" />
                  <Star className="w-3 h-3 fill-yellow-500" />
                  <Star className="w-3 h-3 fill-yellow-500" />
                  <Star className="w-3 h-3 fill-yellow-500" />
                  <Star className="w-3 h-3 fill-yellow-500" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">Excellent doctor! Very knowledgeable and caring.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;