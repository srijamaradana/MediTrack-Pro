import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
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
  Phone,
  Mail,
  Building,
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
  Activity,
  BarChart,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Search,
  RefreshCw,
  Calendar as CalendarIcon,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MapPin as MapPinIcon,
  CreditCard,
  Gift,
  Award,
  Target,
  Zap,
  Shield,
  BookOpen,
  Globe,
  MessageSquare,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Building as BuildingIcon,
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
  Activity as ActivityIcon,
  BarChart as BarChartIcon,
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
  RefreshCw as RefreshCwIcon,
  Calendar as CalendarIcon2,
  Users as UsersIcon,
  DollarSign as DollarSignIcon,
  ArrowUpRight as ArrowUpRightIcon,
  ArrowDownRight as ArrowDownRightIcon,
  MapPin as MapPinIcon2,
  CreditCard as CreditCardIcon,
  Gift as GiftIcon,
  Award as AwardIcon,
  Target as TargetIcon,
  Zap as ZapIcon,
  Shield as ShieldIcon,
  BookOpen as BookOpenIcon,
  Globe as GlobeIcon
} from 'lucide-react';
import { formatDate, formatTime, getStatusBadgeClass } from '../../utils/helpers';

const AppointmentCard = ({ appointment, onCancel, onReschedule, onView }) => {
  const {
    _id,
    doctor,
    patient,
    date,
    time,
    duration,
    type,
    status,
    isVirtual,
    symptoms,
    notes,
    vitals,
    diagnosis,
    treatmentPlan,
  } = appointment;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-4 h-4 text-secondary-600" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-primary-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-danger-600" />;
      case 'missed':
        return <AlertCircle className="w-4 h-4 text-warning-600" />;
      case 'rescheduled':
        return <RefreshCw className="w-4 h-4 text-warning-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'consultation':
        return <User className="w-4 h-4" />;
      case 'follow-up':
        return <RefreshCw className="w-4 h-4" />;
      case 'emergency':
        return <AlertCircle className="w-4 h-4" />;
      case 'checkup':
        return <Heart className="w-4 h-4" />;
      case 'procedure':
        return <Activity className="w-4 h-4" />;
      case 'telemedicine':
        return <Video className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const isUpcoming = ['scheduled', 'confirmed'].includes(status);
  const isPast = ['completed', 'cancelled', 'missed'].includes(status);

  return (
    <div className="card hover:shadow-md transition group">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {doctor?.user?.name?.charAt(0) || 'D'}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Dr. {doctor?.user?.name}</h3>
            <p className="text-sm text-gray-500">{doctor?.specialization}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge ${getStatusBadgeClass(status)}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
              {isVirtual && (
                <span className="badge-primary">
                  <Video className="w-3 h-3 inline mr-1" />
                  Virtual
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="relative">
          <button className="p-1 hover:bg-gray-100 rounded-lg transition">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Date & Time */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          {formatDate(date)}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-gray-400" />
          {formatTime(time)} ({duration} min)
        </div>
      </div>

      {/* Type & Location */}
      <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          {getTypeIcon(type)}
          {type.replace('-', ' ').toUpperCase()}
        </span>
        {doctor?.hospital?.name && (
          <span className="flex items-center gap-1">
            <Building className="w-3 h-3" />
            {doctor.hospital.name}
          </span>
        )}
      </div>

      {/* Symptoms */}
      {symptoms && symptoms.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {symptoms.slice(0, 3).map((symptom, index) => (
            <span key={index} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
              {symptom}
            </span>
          ))}
          {symptoms.length > 3 && (
            <span className="text-xs text-gray-400">+{symptoms.length - 3} more</span>
          )}
        </div>
      )}

      {/* Notes */}
      {notes && (
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          📝 {notes}
        </p>
      )}

      {/* Actions */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
        <Link
          to={`/appointments/${_id}`}
          className="btn-secondary text-sm flex-1"
        >
          <Eye className="w-4 h-4" />
          View Details
        </Link>
        {isUpcoming && (
          <>
            <button
              onClick={() => onReschedule(appointment)}
              className="btn-secondary text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Reschedule
            </button>
            <button
              onClick={() => onCancel(appointment)}
              className="p-2 text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;