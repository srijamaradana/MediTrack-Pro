import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Pill,
  FileText,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Edit,
  Plus,
  Download,
  Eye,
  Printer,
  MessageSquare,
  Stethoscope,
  Building,
  CreditCard,
  Gift,
  Star,
  Award,
  Target,
  Zap,
  Shield,
  BookOpen,
  Globe,
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
  BarChart,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Trash2,
  Settings,
  LogOut,
  Bell,
  Home,
  HelpCircle
} from 'lucide-react';
import { doctors, appointments, medications, reports } from '../../services/api';
import { formatDate, formatTime } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

const PatientView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState('');

  // Fetch patient details
  const { data: patientData, isLoading: patientLoading, error } = useQuery(
    ['patient-details', id],
    () => doctors.getPatientDetails(id),
    {
      enabled: !!id,
      staleTime: 30000,
    }
  );

  // Fetch patient's appointments
  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery(
    ['patient-appointments', id],
    () => appointments.getAll({ patient: id, limit: 20 }),
    {
      enabled: !!id,
      staleTime: 30000,
    }
  );

  // Fetch patient's medications
  const { data: medicationsData, isLoading: medicationsLoading } = useQuery(
    ['patient-medications', id],
    () => medications.getAll({ patient: id, limit: 20 }),
    {
      enabled: !!id,
      staleTime: 30000,
    }
  );

  // Fetch patient's reports
  const { data: reportsData, isLoading: reportsLoading } = useQuery(
    ['patient-reports', id],
    () => reports.getAll({ patient: id, limit: 20 }),
    {
      enabled: !!id,
      staleTime: 30000,
    }
  );

  if (patientLoading || appointmentsLoading || medicationsLoading || reportsLoading) {
    return <LoadingSpinner />;
  }

  if (error || !patientData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Failed to load patient details</h3>
        <p className="text-gray-500 mt-2">Patient not found or you don't have access</p>
        <button onClick={() => navigate('/doctor/patients')} className="mt-4 btn-primary">
          <ArrowLeft className="w-4 h-4" />
          Back to Patients
        </button>
      </div>
    );
  }

  const patient = patientData.patient || {};
  const medicalData = patientData.medicalData || {};
  const patientAppointments = appointmentsData?.data || [];
  const patientMedications = medicationsData?.data || [];
  const patientReports = reportsData?.data || [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'medications', label: 'Medications', icon: <Pill className="w-4 h-4" /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/doctor/patients')}
          className="p-2 hover:bg-gray-100 rounded-xl transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Details</h1>
          <p className="text-gray-500">View and manage patient information</p>
        </div>
        <div className="flex-1" />
        <button className="btn-primary text-sm">
          <MessageSquare className="w-4 h-4" />
          Send Message
        </button>
        <button className="btn-secondary text-sm">
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>

      {/* Patient Profile Card */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold">
            {patient.name?.charAt(0) || 'P'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
              <span className="badge-success">Active</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {patient.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {patient.profile?.phone || 'N/A'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {patient.profile?.dateOfBirth ? formatDate(patient.profile.dateOfBirth) : 'N/A'}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                Blood: {patient.profile?.bloodGroup || 'N/A'}
              </span>
            </div>
            {patient.profile?.address && (
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {patient.profile.address.street}, {patient.profile.address.city}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition text-sm font-medium">
              Add Prescription
            </button>
            <button className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition text-sm font-medium">
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition border-b-2 ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overview Content */}
            <div className="lg:col-span-2 space-y-4">
              {/* Vitals */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Vitals</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Blood Pressure</p>
                    <p className="text-lg font-bold text-gray-900">120/80</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Heart Rate</p>
                    <p className="text-lg font-bold text-gray-900">72 bpm</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Temperature</p>
                    <p className="text-lg font-bold text-gray-900">98.6°F</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Weight</p>
                    <p className="text-lg font-bold text-gray-900">70 kg</p>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
                {patient.profile?.medicalHistory ? (
                  <p className="text-gray-600">{patient.profile.medicalHistory}</p>
                ) : (
                  <p className="text-gray-500">No medical history recorded</p>
                )}
                {patient.profile?.allergies?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700">Allergies:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.profile.allergies.map((allergy, index) => (
                        <span key={index} className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-3 bg-teal-50 text-teal-700 rounded-xl hover:bg-teal-100 transition">
                    <Plus className="w-5 h-5" />
                    <span className="text-sm font-medium">Add Prescription</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-medium">Schedule Appointment</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm font-medium">Upload Report</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm font-medium">Send Message</span>
                  </button>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Total Appointments</span>
                    <span className="font-bold text-gray-900">{patientAppointments.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Active Medications</span>
                    <span className="font-bold text-gray-900">
                      {patientMedications.filter(m => m.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Medical Reports</span>
                    <span className="font-bold text-gray-900">{patientReports.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
              <button className="btn-primary text-sm">
                <Plus className="w-4 h-4" />
                Add Medication
              </button>
            </div>

            {patientMedications.length === 0 ? (
              <EmptyState
                icon={<Pill className="w-12 h-12" />}
                title="No medications"
                description="This patient has no medications prescribed"
              />
            ) : (
              <div className="space-y-3">
                {patientMedications.map((med) => (
                  <div key={med._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                      <Pill className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{med.name}</p>
                      <p className="text-sm text-gray-500">{med.dosage} • {med.frequency}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {med.times.join(', ')}
                        <span className={`badge ${med.status === 'active' ? 'badge-success' : 'badge-gray'}`}>
                          {med.status}
                        </span>
                      </div>
                    </div>
                    <button className="p-1.5 hover:bg-gray-200 rounded-lg transition">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
              <button className="btn-primary text-sm">
                <Plus className="w-4 h-4" />
                Book Appointment
              </button>
            </div>

            {patientAppointments.length === 0 ? (
              <EmptyState
                icon={<Calendar className="w-12 h-12" />}
                title="No appointments"
                description="This patient has no appointments"
              />
            ) : (
              <div className="space-y-3">
                {patientAppointments.map((appointment) => (
                  <div key={appointment._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-secondary-50 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-secondary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{formatDate(appointment.date)}</p>
                      <p className="text-sm text-gray-500">{formatTime(appointment.time)} • {appointment.duration} min</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`badge ${appointment.status === 'confirmed' ? 'badge-success' : appointment.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                          {appointment.status}
                        </span>
                        <span className="text-xs text-gray-400">{appointment.type?.replace('-', ' ').toUpperCase()}</span>
                      </div>
                    </div>
                    <button className="p-1.5 hover:bg-gray-200 rounded-lg transition">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Medical Reports</h3>
              <button className="btn-primary text-sm">
                <Plus className="w-4 h-4" />
                Upload Report
              </button>
            </div>

            {patientReports.length === 0 ? (
              <EmptyState
                icon={<FileText className="w-12 h-12" />}
                title="No reports"
                description="This patient has no medical reports"
              />
            ) : (
              <div className="space-y-3">
                {patientReports.map((report) => (
                  <div key={report._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{report.title}</p>
                      <p className="text-sm text-gray-500">{report.type}</p>
                      <p className="text-xs text-gray-400">{formatDate(report.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-200 rounded-lg transition">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 rounded-lg transition">
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
            <div className="space-y-4">
              {/* Health Logs */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Recent Health Logs</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">No health logs recorded</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Doctor Notes</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">No notes available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientView;