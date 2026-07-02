import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  X,
  Clock,
  Calendar as CalendarIcon,
  Pill,
  AlertCircle
} from 'lucide-react';
import { medications } from '../../services/api';
import { MEDICATION_FREQUENCIES } from '../../utils/constants';

// Validation schema
const medicationSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  genericName: z.string().optional(),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  times: z.array(z.string()).min(1, 'At least one time is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  duration: z.object({
    value: z.number().optional(),
    unit: z.enum(['days', 'weeks', 'months']).optional(),
  }).optional(),
  instructions: z.string().optional().max(500),
  category: z.enum(['prescription', 'over-the-counter', 'supplement', 'vaccine']).default('prescription'),
  refillReminder: z.object({
    enabled: z.boolean().default(false),
    daysBefore: z.number().min(1).max(30).optional(),
  }).optional(),
  notes: z.string().optional().max(500),
});

const AddMedication = () => {
  const navigate = useNavigate();
  const [times, setTimes] = useState(['08:00', '20:00']);
  const [newTime, setNewTime] = useState('');

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      category: 'prescription',
      frequency: 'Twice daily',
      refillReminder: { enabled: false, daysBefore: 3 },
    },
  });

  // Add medication mutation
  const mutation = useMutation(
    (data) => medications.create(data),
    {
      onSuccess: (response) => {
        toast.success('Medication added successfully! 💊');
        navigate('/medications');
      },
      onError: (error) => {
        toast.error('Failed to add medication');
        console.error('Add medication error:', error);
      },
    }
  );

  const onSubmit = (data) => {
    // Format times
    const formattedData = {
      ...data,
      times: times,
      startDate: new Date(data.startDate).toISOString(),
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
    };
    mutation.mutate(formattedData);
  };

  const addTime = () => {
    if (newTime && !times.includes(newTime)) {
      setTimes([...times, newTime].sort());
      setNewTime('');
    }
  };

  const removeTime = (time) => {
    setTimes(times.filter(t => t !== time));
  };

  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = String(h).padStart(2, '0');
      const minute = String(m).padStart(2, '0');
      timeOptions.push(`${hour}:${minute}`);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/medications')}
          className="p-2 hover:bg-gray-100 rounded-xl transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Medication</h1>
          <p className="text-gray-500">Enter the details of your medication</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Medication Name *
              </label>
              <input
                {...register('name')}
                className={`input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g., Metformin"
              />
              {errors.name && (
                <p className="text-sm text-danger-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Generic Name
              </label>
              <input
                {...register('genericName')}
                className="input"
                placeholder="e.g., Metformin Hydrochloride"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Dosage *
              </label>
              <input
                {...register('dosage')}
                className={`input ${errors.dosage ? 'input-error' : ''}`}
                placeholder="e.g., 500mg"
              />
              {errors.dosage && (
                <p className="text-sm text-danger-500 mt-1">{errors.dosage.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category
              </label>
              <select {...register('category')} className="input">
                <option value="prescription">Prescription</option>
                <option value="over-the-counter">Over-the-Counter</option>
                <option value="supplement">Supplement</option>
                <option value="vaccine">Vaccine</option>
              </select>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Frequency *
              </label>
              <select
                {...register('frequency')}
                className={`input ${errors.frequency ? 'input-error' : ''}`}
              >
                {MEDICATION_FREQUENCIES.map((freq) => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
              {errors.frequency && (
                <p className="text-sm text-danger-500 mt-1">{errors.frequency.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Times *
              </label>
              <div className="flex gap-2">
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="input flex-1"
                >
                  <option value="">Select time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addTime}
                  className="btn-primary px-4"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {errors.times && (
                <p className="text-sm text-danger-500 mt-1">{errors.times.message}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {times.map((time) => (
                  <span
                    key={time}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm"
                  >
                    <Clock className="w-3 h-3" />
                    {time}
                    <button
                      type="button"
                      onClick={() => removeTime(time)}
                      className="hover:text-danger-500 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Start Date *
              </label>
              <input
                type="date"
                {...register('startDate')}
                className={`input ${errors.startDate ? 'input-error' : ''}`}
              />
              {errors.startDate && (
                <p className="text-sm text-danger-500 mt-1">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                {...register('endDate')}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Duration</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Duration Value
              </label>
              <input
                type="number"
                {...register('duration.value', { valueAsNumber: true })}
                className="input"
                placeholder="e.g., 30"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Unit
              </label>
              <select {...register('duration.unit')} className="input">
                <option value="">Select unit</option>
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Refill Reminder */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Refill Reminder</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register('refillReminder.enabled')}
                className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Enable refill reminder</span>
            </label>
            {watch('refillReminder.enabled') && (
              <div className="ml-7">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Remind me X days before
                </label>
                <input
                  type="number"
                  {...register('refillReminder.daysBefore', { valueAsNumber: true })}
                  className="input w-32"
                  placeholder="3"
                  min="1"
                  max="30"
                />
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Instructions
              </label>
              <textarea
                {...register('instructions')}
                className="input"
                rows="2"
                placeholder="e.g., Take with food, avoid alcohol"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Notes
              </label>
              <textarea
                {...register('notes')}
                className="input"
                rows="2"
                placeholder="Any additional notes..."
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="btn-primary flex-1"
          >
            {mutation.isLoading ? (
              <>
                <div className="spinner-sm mr-2" />
                Adding...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Add Medication
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/medications')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMedication;