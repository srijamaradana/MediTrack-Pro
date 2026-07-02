import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Stethoscope,
  MapPin,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  Calendar as CalendarIcon,
  Users,
  FileText,
  Pill,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Phone,
  Mail,
  MapPin as MapPinIcon,
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
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
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
  RefreshCw as RefreshCwIcon,
  Calendar as CalendarIcon2,
  Users as UsersIcon,
  Stethoscope as StethoscopeIcon,
  MapPin as MapPinIcon2,
  Video as VideoIcon,
  MessageSquare as MessageSquareIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
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
  Activity as ActivityIcon2,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Download as DownloadIcon2,
  Filter as FilterIcon2,
  Search as SearchIcon2,
  Eye as EyeIcon2,
  Edit as EditIcon2,
  Trash2 as TrashIcon2,
  CheckCircle as CheckCircleIcon2,
  XCircle as XCircleIcon2,
  Clock as ClockIcon2,
  AlertCircle as AlertCircleIcon2,
  RefreshCw as RefreshCwIcon2,
  Calendar as CalendarIcon3,
  Users as UsersIcon2,
  Stethoscope as StethoscopeIcon2,
  MapPin as MapPinIcon3,
  Video as VideoIcon2
} from 'lucide-react';
import { appointments } from '../../services/api';
import { APPOINTMENT_STATUS, APPOINTMENT_TYPES } from '../../utils/constants';
import { formatDate, formatTime, getStatusBadgeClass } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import AppointmentCard from './AppointmentCard';
import AppointmentFilters from './AppointmentFilters';

const AppointmentList = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  // Fetch appointments
  const { data, isLoading, error, refetch } = useQuery(
    ['appointments', { page, status: statusFilter, type: typeFilter, search: searchTerm }],
    () => appointments.getAll({
      page,
      limit: 10,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchTerm || undefined,
    }),
    {
      keepPreviousData: true,
      staleTime: 30000,
    }
  );

  // Cancel appointment mutation
  const cancelMutation = useMutation(
    ({ id, reason }) => appointments.cancel(id, reason),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['appointments']);
        toast.success('Appointment cancelled successfully');
        setShowCancelModal(false);
      },
      onError: (error) => {
        toast.error('Failed to cancel appointment');
        console.error('Cancel error:', error);
      },
    }
  );

  // Reschedule appointment mutation
  const rescheduleMutation = useMutation(
    ({ id, data }) => appointments.reschedule(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['appointments']);
        toast.success('Appointment rescheduled successfully');
        setShowRescheduleModal(false);
      },
      onError: (error) => {
        toast.error('Failed to reschedule appointment');
        console.error('Reschedule error:', error);
      },
    }
  );

  const handleCancel = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (selectedAppointment) {
      cancelMutation.mutate({
        id: selectedAppointment._id,
        reason: 'Cancelled by user',
      });
    }
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const appointmentsList = data?.data || [];
  const pagination = data?.pagination || { total: 0, pages: 1, page: 1 };

  // Calculate stats
  const stats = {
    total: pagination.total || 0,
    scheduled: appointmentsList.filter(a => a.status === 'scheduled').length,
    confirmed: appointmentsList.filter(a => a.status === 'confirmed').length,
    completed: appointmentsList.filter(a => a.status === 'completed').length,
    cancelled: appointmentsList.filter(a => a.status === 'cancelled').length,
    missed: appointmentsList.filter(a => a.status === 'missed').length,
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Failed to load appointments</h3>
        <p className="text-gray-500 mt-2">Please try again later</p>
        <button onClick={() => refetch()} className="mt-4 btn-primary">
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📅 Appointments</h1>
          <p className="text-gray-500 mt-1">Manage all your appointments in one place</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/appointments/calendar" className="btn-secondary text-sm">
            <Calendar className="w-4 h-4" />
            Calendar View
          </Link>
          <Link to="/appointments/book" className="btn-primary text-sm">
            <Plus className="w-4 h-4" />
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="card text-center">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Scheduled</p>
          <p className="text-xl font-bold text-secondary-600">{stats.scheduled}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="text-xl font-bold text-primary-600">{stats.confirmed}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-xl font-bold text-success-600">{stats.completed}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="text-xl font-bold text-danger-600">{stats.cancelled}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Missed</p>
          <p className="text-xl font-bold text-warning-600">{stats.missed}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments by doctor or patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <AppointmentFilters
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
          />
        </div>
      </div>

      {/* Appointment List */}
      {appointmentsList.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-12 h-12" />}
          title="No appointments found"
          description={searchTerm ? "Try adjusting your search filters" : "Book your first appointment today"}
          action={
            <Link to="/appointments/book" className="btn-primary">
              <Plus className="w-4 h-4" />
              Book Appointment
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {appointmentsList.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                onCancel={handleCancel}
                onReschedule={handleReschedule}
                onView={() => {}}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-100">
              <div className="text-sm text-gray-500">
                Showing {((pagination.page - 1) * 10) + 1} to{' '}
                {Math.min(pagination.page * 10, pagination.total)} of {pagination.total}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-2 text-sm font-medium text-gray-700">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="text-center">
              <div className="w-12 h-12 bg-danger-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-6 h-6 text-danger-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Cancel Appointment</h3>
              <p className="text-gray-500 mt-2">
                Are you sure you want to cancel this appointment with{' '}
                <strong>{selectedAppointment.doctor?.user?.name || 'Doctor'}</strong>?
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Keep Appointment
                </button>
                <button
                  onClick={confirmCancel}
                  disabled={cancelMutation.isLoading}
                  className="flex-1 btn-danger"
                >
                  {cancelMutation.isLoading ? 'Cancelling...' : 'Cancel Appointment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;