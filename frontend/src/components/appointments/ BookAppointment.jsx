import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  Video,
  Search,
  CheckCircle,
  AlertCircle,
  Loader,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  MessageSquare,
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
  Eye,
  Edit,
  Trash2,
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
  MessageSquare as MessageSquareIcon,
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
  Eye as EyeIcon,
  Edit as EditIcon,
  Trash2 as Trash2Icon,
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
import { doctors, appointments } from '../../services/api';
import { APPOINTMENT_TYPES } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';

// Validation schema
const appointmentSchema = z.object({
  doctorId: z.string().min(1, 'Please select a doctor'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  duration: z.number().min(15).max(120).default(30),
  type: z.string().min(1, 'Please select appointment type'),
  symptoms: z.array(z.string()).optional(),
  notes: z.string().optional(),
  isVirtual: z.boolean().default(false),
});

const BookAppointment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      duration: 30,
      type: 'consultation',
      isVirtual: false,
    },
  });

  const isVirtual = watch('isVirtual');

  // Fetch doctors
  const { data: doctorsData, isLoading: doctorsLoading } = useQuery(
    ['doctors', { search: searchTerm, specialization }],
    () => doctors.getAll({ search: searchTerm || undefined, specialization: specialization || undefined, limit: 20 }),
    {
      staleTime: 60000,
    }
  );

  // Fetch available slots
  const { data: slotsData, refetch: refetchSlots } = useQuery(
    ['available-slots', selectedDoctor?._id, selectedDate],
    () => appointments.getAvailableSlots(selectedDoctor?._id, selectedDate),
    {
      enabled: !!selectedDoctor && !!selectedDate,
      staleTime: 30000,
    }
  );

  // Book appointment mutation
  const bookMutation = useMutation(
    (data) => appointments.book(data),
    {
      onSuccess: (response) => {
        toast.success('Appointment booked successfully! 🎉');
        navigate(`/appointments/${response.appointment._id}`);
      },
      onError: (error) => {
        toast.error('Failed to book appointment');
        console.error('Book error:', error);
      },
    }
  );

  useEffect(() => {
    if (slotsData) {
      setAvailableSlots(slotsData.slots || []);
    }
  }, [slotsData]);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    refetchSlots();
    setStep(3);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setValue('time', time);
  };

  const onSubmit = (data) => {
    const appointmentData = {
      ...data,
      doctorId: selectedDoctor._id,
      date: selectedDate,
      time: selectedTime,
      symptoms: data.symptoms ? data.symptoms.split(',').map(s => s.trim()) : [],
    };
    bookMutation.mutate(appointmentData);
  };

  // Generate date options (next 30 days)
  const dateOptions = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dateOptions.push(date.toISOString().split('T')[0]);
  }

  if (doctorsLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/appointments')}
          className="p-2 hover:bg-gray-100 rounded-xl transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="text-gray-500">Schedule a consultation with a doctor</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s === step ? 'bg-primary-600 text-white' :
                s < step ? 'bg-success-500 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {s < step ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              <span className={`text-sm font-medium ${
                s === step ? 'text-gray-900' :
                s < step ? 'text-success-600' :
                'text-gray-400'
              }`}>
                {s === 1 && 'Select Doctor'}
                {s === 2 && 'Choose Date'}
                {s === 3 && 'Pick Time'}
                {s === 4 && 'Confirm'}
              </span>
            </div>
            {s < 4 && <div className={`flex-1 h-0.5 ${
              s < step ? 'bg-success-500' : 'bg-gray-200'
            }`} />}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Select Doctor */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="card">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by doctor name or hospital..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                </div>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="input sm:w-48"
                >
                  <option value="">All Specializations</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Gynecology">Gynecology</option>
                </select>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(doctorsData?.data || []).map((doctor) => (
                  <div
                    key={doctor._id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-sm transition cursor-pointer"
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                        {doctor.user?.name?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Dr. {doctor.user?.name}</p>
                        <p className="text-sm text-gray-500">{doctor.specialization}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            {doctor.rating?.toFixed(1) || 'New'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {doctor.hospital?.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {doctor.experience} years
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary-600">₹{doctor.consultationFee}</p>
                      <p className="text-xs text-gray-400">Consultation fee</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Select Date */}
        {step === 2 && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
              {dateOptions.map((date) => {
                const isSelected = selectedDate === date;
                const isToday = new Date(date).toDateString() === new Date().toDateString();
                const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
                const dayNumber = new Date(date).getDate();
                
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => handleDateSelect(date)}
                    className={`p-3 rounded-xl text-center transition ${
                      isSelected
                        ? 'bg-primary-600 text-white'
                        : isToday
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <p className={`text-xs font-medium ${isSelected ? 'text-primary-100' : 'text-gray-500'}`}>
                      {dayName}
                    </p>
                    <p className={`text-lg font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                      {dayNumber}
                    </p>
                    {isToday && (
                      <p className={`text-xs ${isSelected ? 'text-primary-100' : 'text-primary-600'}`}>
                        Today
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Select Time */}
        {step === 3 && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time</h3>
            {availableSlots.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No available slots for this date</p>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="mt-3 text-primary-600 font-medium hover:text-primary-700"
                >
                  Choose another date
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleTimeSelect(slot)}
                    className={`p-3 rounded-xl border-2 text-center transition ${
                      selectedTime === slot
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <Clock className={`w-4 h-4 mx-auto mb-1 ${
                      selectedTime === slot ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    <span className="font-medium">{slot}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Confirm Details */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
              
              <div className="space-y-4">
                {/* Doctor Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-xl flex-shrink-0">
                    {selectedDoctor?.user?.name?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Dr. {selectedDoctor?.user?.name}</p>
                    <p className="text-sm text-gray-500">{selectedDoctor?.specialization}</p>
                    <p className="text-sm text-gray-400">{selectedDoctor?.hospital?.name}</p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedDate)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">{selectedTime}</p>
                  </div>
                </div>

                {/* Appointment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Appointment Type
                  </label>
                  <select {...register('type')} className="input">
                    {Object.entries(APPOINTMENT_TYPES).map(([key, value]) => (
                      <option key={key} value={value}>
                        {value.replace('-', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Duration (minutes)
                  </label>
                  <select {...register('duration', { valueAsNumber: true })} className="input">
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">60 min</option>
                  </select>
                </div>

                {/* Virtual Consultation */}
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    {...register('isVirtual')}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Virtual Consultation</span>
                  {isVirtual && (
                    <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                      <Video className="w-3 h-3 inline mr-1" />
                      Video call
                    </span>
                  )}
                </label>

                {/* Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Symptoms (comma separated)
                  </label>
                  <input
                    {...register('symptoms')}
                    className="input"
                    placeholder="e.g., fever, headache, cough"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Additional Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    className="input"
                    rows="3"
                    placeholder="Any additional information for the doctor..."
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-secondary"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={bookMutation.isLoading}
                className="btn-primary flex-1"
              >
                {bookMutation.isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirm Booking
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 4 && (
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => {
                if (step === 1 && selectedDoctor) setStep(2);
                else if (step === 2 && selectedDate) setStep(3);
                else if (step === 3 && selectedTime) setStep(4);
              }}
              disabled={
                (step === 1 && !selectedDoctor) ||
                (step === 2 && !selectedDate) ||
                (step === 3 && !selectedTime)
              }
              className="btn-primary"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default BookAppointment;