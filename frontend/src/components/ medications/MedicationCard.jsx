import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2,
  Pill,
  Calendar
} from 'lucide-react';
import { formatDate, formatTime } from '../../utils/helpers';

const MedicationCard = ({ medication, onMarkTaken, onDelete, onEdit }) => {
  const { 
    _id,
    name,
    dosage,
    frequency,
    times,
    startDate,
    endDate,
    status,
    adherence,
    instructions,
    category,
  } = medication;

  const today = new Date();
  const todayAdherence = adherence?.filter(a => 
    new Date(a.date).toDateString() === today.toDateString()
  ) || [];

  const isTakenToday = todayAdherence.length > 0 && todayAdherence.every(a => a.taken);
  const isPartialToday = todayAdherence.length > 0 && !isTakenToday;

  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <span className="badge-success">Active</span>;
      case 'completed':
        return <span className="badge-gray">Completed</span>;
      case 'discontinued':
        return <span className="badge-danger">Discontinued</span>;
      case 'paused':
        return <span className="badge-warning">Paused</span>;
      default:
        return <span className="badge-gray">{status}</span>;
    }
  };

  const getTodayStatus = () => {
    if (isTakenToday) {
      return {
        label: 'Taken Today ✅',
        className: 'text-success-600 bg-success-50',
        icon: <CheckCircle className="w-4 h-4" />
      };
    }
    if (isPartialToday) {
      return {
        label: 'Partial Taken ⚠️',
        className: 'text-warning-600 bg-warning-50',
        icon: <AlertCircle className="w-4 h-4" />
      };
    }
    return {
      label: 'Not Taken Yet ⏳',
      className: 'text-gray-500 bg-gray-50',
      icon: <Clock className="w-4 h-4" />
    };
  };

  const todayStatus = getTodayStatus();

  return (
    <div className="card hover:shadow-md transition group">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Pill className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-1">{name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-gray-500">{dosage}</span>
              <span className="text-xs text-gray-300">•</span>
              <span className="text-sm text-gray-500">{frequency}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <div className="relative">
            <button className="p-1 hover:bg-gray-100 rounded-lg transition">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Times */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {times.map((time, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 rounded-lg text-xs text-gray-600"
          >
            <Clock className="w-3 h-3" />
            {formatTime(time)}
          </span>
        ))}
      </div>

      {/* Today's Status */}
      <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${todayStatus.className}`}>
        {todayStatus.icon}
        {todayStatus.label}
      </div>

      {/* Dates */}
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Started: {formatDate(startDate)}
        </span>
        {endDate && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Ends: {formatDate(endDate)}
          </span>
        )}
      </div>

      {/* Instructions */}
      {instructions && (
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          📝 {instructions}
        </p>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 pt-3 border-t border-gray-100">
        {!isTakenToday && status === 'active' && (
          <button
            onClick={() => onMarkTaken(_id)}
            className="btn-success text-sm flex-1"
          >
            <CheckCircle className="w-4 h-4" />
            Mark Taken
          </button>
        )}
        <Link
          to={`/medications/${_id}`}
          className="btn-secondary text-sm"
        >
          View Details
        </Link>
        <button
          onClick={() => onDelete(_id)}
          className="p-2 text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MedicationCard;