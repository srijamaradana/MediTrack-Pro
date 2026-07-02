import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Pill,
  ChevronLeft,
  ChevronRight,
  Bell
} from 'lucide-react';
import { medications } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const MedicationSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch medications
  const { data, isLoading, error } = useQuery(
    ['medications', { status: 'active' }],
    () => medications.getAll({ status: 'active', limit: 100 }),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  const medicationsList = data?.data || [];

  // Get week days
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Get medications for selected date
  const getMedicationsForDate = (date) => {
    return medicationsList.filter(med => {
      const medDate = new Date(med.startDate);
      return isSameDay(medDate, date) || (med.endDate && new Date(med.endDate) >= date);
    });
  };

  // Get today's medications with times
  const getTodayMedications = () => {
    const todayMeds = getMedicationsForDate(new Date());
    return todayMeds.sort((a, b) => {
      const timeA = a.times[0] || '23:59';
      const timeB = b.times[0] || '23:59';
      return timeA.localeCompare(timeB);
    });
  };

  // Get medication status for today
  const getMedicationStatus = (med) => {
    const today = new Date();
    const todayAdherence = med.adherence?.filter(a => 
      isSameDay(new Date(a.date), today)
    ) || [];
    
    if (todayAdherence.length === 0) return 'pending';
    const allTaken = todayAdherence.every(a => a.taken);
    return allTaken ? 'taken' : 'partial';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'taken': return 'text-success-600 bg-success-50';
      case 'partial': return 'text-warning-600 bg-warning-50';
      default: return 'text-gray-400 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'taken': return <CheckCircle className="w-4 h-4" />;
      case 'partial': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Failed to load schedule</h3>
      </div>
    );
  }

  const todayMeds = getTodayMedications();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📅 Medication Schedule</h1>
          <p className="text-gray-500 mt-1">View and manage your medication schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="btn-secondary text-sm"
          >
            Today
          </button>
        </div>
      </div>

      {/* Week Calendar */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentDate(prev => {
              const newDate = new Date(prev);
              newDate.setDate(newDate.getDate() - 7);
              return newDate;
            })}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-gray-900">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </span>
          <button
            onClick={() => setCurrentDate(prev => {
              const newDate = new Date(prev);
              newDate.setDate(newDate.getDate() + 7);
              return newDate;
            })}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const dayMeds = getMedicationsForDate(day);
            const isToday = isToday(day);
            
            return (
              <div
                key={day.toISOString()}
                className={`
                  p-3 rounded-xl text-center cursor-pointer transition
                  ${isToday ? 'bg-primary-50 border-2 border-primary-500' : 'hover:bg-gray-50'}
                  ${selectedDate && isSameDay(day, selectedDate) ? 'bg-primary-50 border-2 border-primary-500' : ''}
                `}
                onClick={() => setSelectedDate(day)}
              >
                <div className="text-xs font-medium text-gray-500">
                  {format(day, 'EEE')}
                </div>
                <div className={`
                  text-lg font-semibold mt-1
                  ${isToday ? 'text-primary-700' : 'text-gray-900'}
                `}>
                  {format(day, 'd')}
                </div>
                {dayMeds.length > 0 && (
                  <div className="mt-1">
                    <span className="inline-flex items-center gap-1 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                      <Pill className="w-3 h-3" />
                      {dayMeds.length}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Medications */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Today's Medications
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({todayMeds.length} medications)
          </span>
        </h2>

        {todayMeds.length === 0 ? (
          <div className="card text-center py-8">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No medications scheduled for today</p>
            <p className="text-sm text-gray-400">Enjoy your day! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayMeds.map((med) => {
              const status = getMedicationStatus(med);
              const statusColor = getStatusColor(status);
              
              return (
                <div key={med._id} className="card hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusColor}`}>
                        {getStatusIcon(status)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{med.name}</h3>
                        <p className="text-sm text-gray-500">
                          {med.dosage} • {med.frequency}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {med.times.join(', ')}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor}`}>
                            {status === 'taken' ? '✓ Taken' : 
                             status === 'partial' ? '⚠️ Partial' : 
                             '⏳ Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {status !== 'taken' && (
                      <button
                        onClick={() => console.log('Mark taken:', med._id)}
                        className="btn-success text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Taken
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Adherence Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Adherence Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-xl font-bold text-primary-600">
              {todayMeds.filter(m => getMedicationStatus(m) === 'taken').length}/{todayMeds.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">This Week</p>
            <p className="text-xl font-bold text-success-600">
              {Math.round(medicationsList.reduce((acc, m) => acc + (m.adherenceRate || 0), 0) / (medicationsList.length || 1))}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-xl font-bold text-primary-600">
              {medicationsList.filter(m => m.status === 'active').length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-xl font-bold text-success-600">
              {medicationsList.filter(m => m.status === 'completed').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationSchedule;