import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, getDay } from 'date-fns';
import {
  Calendar,
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
  Plus,
  Search,
  Filter,
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
import { formatTime, getStatusBadgeClass } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import AppointmentCard from './AppointmentCard';

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch appointments for the month
  const { data, isLoading, error, refetch } = useQuery(
    ['appointments', { month: format(currentMonth, 'yyyy-MM') }],
    () => appointments.getAll({
      startDate: format(startOfMonth(currentMonth), 'yyyy-MM-dd'),
      endDate: format(endOfMonth(currentMonth), 'yyyy-MM-dd'),
      limit: 100,
    }),
    {
      staleTime: 30000,
    }
  );

  const appointmentsList = data?.data || [];

  // Group appointments by date
  const appointmentsByDate = {};
  appointmentsList.forEach((appt) => {
    const dateKey = format(new Date(appt.date), 'yyyy-MM-dd');
    if (!appointmentsByDate[dateKey]) {
      appointmentsByDate[dateKey] = [];
    }
    appointmentsByDate[dateKey].push(appt);
  });

  // Get selected date appointments
  const selectedDateAppointments = appointmentsList.filter((appt) =>
    isSameDay(new Date(appt.date), selectedDate)
  );

  // Calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day of week offset
  const startOffset = getDay(monthStart);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Failed to load calendar</h3>
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
          <h1 className="text-2xl font-bold text-gray-900">📅 Calendar View</h1>
          <p className="text-gray-500 mt-1">View all appointments in calendar format</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/appointments" className="btn-secondary text-sm">
            <List className="w-4 h-4" />
            List View
          </Link>
          <Link to="/appointments/book" className="btn-primary text-sm">
            <Plus className="w-4 h-4" />
            Book Appointment
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for start offset */}
            {Array.from({ length: startOffset }).map((_, index) => (
              <div key={`empty-${index}`} className="min-h-[80px] bg-gray-50 rounded-xl" />
            ))}

            {days.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayAppointments = appointmentsByDate[dateKey] || [];
              const isToday = isToday(day);
              const isSelected = isSameDay(day, selectedDate);

              return (
                <div
                  key={day.toISOString()}
                  className={`
                    min-h-[80px] p-2 rounded-xl cursor-pointer transition
                    ${isSelected ? 'bg-primary-50 border-2 border-primary-500' : ''}
                    ${isToday ? 'bg-primary-50' : 'hover:bg-gray-50'}
                  `}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="flex items-center justify-between">
                    <span className={`
                      text-sm font-medium
                      ${isToday ? 'text-primary-600' : 'text-gray-700'}
                      ${!isSameMonth(day, currentMonth) ? 'text-gray-300' : ''}
                    `}>
                      {format(day, 'd')}
                    </span>
                    {dayAppointments.length > 0 && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full">
                        {dayAppointments.length}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {dayAppointments.slice(0, 2).map((appt) => (
                      <div
                        key={appt._id}
                        className="text-xs truncate px-1.5 py-0.5 bg-primary-50 text-primary-700 rounded"
                      >
                        {formatTime(appt.time)} - {appt.doctor?.user?.name}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-400 px-1.5">
                        +{dayAppointments.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected date appointments */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          {selectedDateAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No appointments</p>
              <p className="text-sm text-gray-400">for this day</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {selectedDateAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="p-3 border border-gray-100 rounded-xl hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{appointment.doctor?.user?.name}</p>
                      <p className="text-sm text-gray-500">{appointment.doctor?.specialization}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatTime(appointment.time)}
                        <span className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/appointments/${appointment._id}`}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                    >
                      <Eye className="w-4 h-4 text-gray-400" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;