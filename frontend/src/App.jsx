import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages for better performance
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('./components/auth/VerifyEmail'));

const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));

// Patient Pages
const MedicationList = lazy(() => import('./components/medications/MedicationList'));
const AddMedication = lazy(() => import('./components/medications/AddMedication'));
const MedicationSchedule = lazy(() => import('./components/medications/MedicationSchedule'));
const MedicationDetails = lazy(() => import('./components/medications/MedicationDetails'));

const AppointmentList = lazy(() => import('./components/appointments/AppointmentList'));
const BookAppointment = lazy(() => import('./components/appointments/BookAppointment'));
const CalendarView = lazy(() => import('./components/appointments/CalendarView'));
const AppointmentDetails = lazy(() => import('./components/appointments/AppointmentDetails'));

const ReportList = lazy(() => import('./components/reports/ReportList'));
const UploadReport = lazy(() => import('./components/reports/UploadReport'));
const ReportViewer = lazy(() => import('./components/reports/ReportViewer'));

const HealthLog = lazy(() => import('./components/health/HealthLog'));
const AddHealthLog = lazy(() => import('./components/health/AddHealthLog'));

const Profile = lazy(() => import('./components/profile/Profile'));
const Settings = lazy(() => import('./components/profile/Settings'));

// Doctor Pages
const DoctorDashboard = lazy(() => import('./components/doctors/DoctorDashboard'));
const PatientView = lazy(() => import('./components/doctors/PatientView'));
const DoctorAppointments = lazy(() => import('./components/doctors/DoctorAppointments'));
const DoctorPatients = lazy(() => import('./components/doctors/DoctorPatients'));

// Admin Pages
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const UserManagement = lazy(() => import('./components/admin/UserManagement'));
const DoctorManagement = lazy(() => import('./components/admin/DoctorManagement'));
const AppointmentManagement = lazy(() => import('./components/admin/AppointmentManagement'));
const SystemAnalytics = lazy(() => import('./components/admin/SystemAnalytics'));

// Not Found
const NotFound = lazy(() => import('./components/common/NotFound'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#ffffff',
                    color: '#1A202C',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    padding: '16px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#0A6E79',
                      secondary: '#ffffff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#ffffff',
                    },
                  },
                }}
              />

              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/verify-email/:token" element={<VerifyEmail />} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />

                  {/* Protected Routes with Layout */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                      {/* Dashboard */}
                      <Route path="/dashboard" element={<Dashboard />} />

                      {/* Patient Routes */}
                      <Route path="/medications" element={<MedicationList />} />
                      <Route path="/medications/add" element={<AddMedication />} />
                      <Route path="/medications/schedule" element={<MedicationSchedule />} />
                      <Route path="/medications/:id" element={<MedicationDetails />} />

                      <Route path="/appointments" element={<AppointmentList />} />
                      <Route path="/appointments/book" element={<BookAppointment />} />
                      <Route path="/appointments/calendar" element={<CalendarView />} />
                      <Route path="/appointments/:id" element={<AppointmentDetails />} />

                      <Route path="/reports" element={<ReportList />} />
                      <Route path="/reports/upload" element={<UploadReport />} />
                      <Route path="/reports/:id" element={<ReportViewer />} />

                      <Route path="/health-log" element={<HealthLog />} />
                      <Route path="/health-log/add" element={<AddHealthLog />} />

                      <Route path="/profile" element={<Profile />} />
                      <Route path="/settings" element={<Settings />} />

                      {/* Doctor Routes */}
                      <Route path="/doctor" element={<DoctorDashboard />} />
                      <Route path="/doctor/patients" element={<DoctorPatients />} />
                      <Route path="/doctor/patients/:id" element={<PatientView />} />
                      <Route path="/doctor/appointments" element={<DoctorAppointments />} />

                      {/* Admin Routes */}
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/users" element={<UserManagement />} />
                      <Route path="/admin/doctors" element={<DoctorManagement />} />
                      <Route path="/admin/appointments" element={<AppointmentManagement />} />
                      <Route path="/admin/analytics" element={<SystemAnalytics />} />
                    </Route>
                  </Route>

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;