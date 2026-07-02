import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  UserPlus,
  Calendar,
  Pill,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Users,
  Stethoscope,
  AlertCircle,
  Heart,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Gift,
  Star,
  Award,
  Target,
  Zap,
  Shield,
  BookOpen,
  Globe
} from 'lucide-react';

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registered':
        return <UserPlus className="w-4 h-4 text-primary-600" />;
      case 'appointment_booked':
        return <Calendar className="w-4 h-4 text-secondary-600" />;
      case 'appointment_completed':
        return <CheckCircle className="w-4 h-4 text-success-600" />;
      case 'medication_added':
        return <Pill className="w-4 h-4 text-purple-600" />;
      case 'report_uploaded':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'doctor_assigned':
        return <Stethoscope className="w-4 h-4 text-green-600" />;
      case 'health_logged':
        return <Activity className="w-4 h-4 text-orange-600" />;
      case 'prescription_issued':
        return <FileText className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user_registered':
        return 'bg-primary-50 dark:bg-primary-900/20';
      case 'appointment_booked':
        return 'bg-secondary-50 dark:bg-secondary-900/20';
      case 'appointment_completed':
        return 'bg-success-50 dark:bg-success-900/20';
      case 'medication_added':
        return 'bg-purple-50 dark:bg-purple-900/20';
      case 'report_uploaded':
        return 'bg-blue-50 dark:bg-blue-900/20';
      case 'doctor_assigned':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'health_logged':
        return 'bg-orange-50 dark:bg-orange-900/20';
      case 'prescription_issued':
        return 'bg-red-50 dark:bg-red-900/20';
      default:
        return 'bg-gray-50 dark:bg-gray-800/50';
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">Your activity will appear here</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.slice(0, 10).map((activity, index) => (
          <li key={index}>
            <div className="relative pb-8">
              {index < activities.slice(0, 10).length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex items-start gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;