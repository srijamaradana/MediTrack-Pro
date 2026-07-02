import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Pill,
  Calendar,
  FileText,
  Activity,
  Users,
  Stethoscope,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Heart,
  BarChart3,
  User,
  Clock,
  Bell,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Award,
  Target,
  Zap,
  Globe
} from 'lucide-react';
import { getUserInitials } from '../../utils/helpers';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout, isPatient, isDoctor, isAdmin } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getNavItems = () => {
    const items = [];

    if (isPatient) {
      items.push(
        { to: '/dashboard', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/medications', icon: <Pill className="w-5 h-5" />, label: 'Medications' },
        { to: '/appointments', icon: <Calendar className="w-5 h-5" />, label: 'Appointments' },
        { to: '/reports', icon: <FileText className="w-5 h-5" />, label: 'Reports' },
        { to: '/health-log', icon: <Activity className="w-5 h-5" />, label: 'Health Log' },
      );
    }

    if (isDoctor) {
      items.push(
        { to: '/doctor', icon: <Stethoscope className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/doctor/patients', icon: <Users className="w-5 h-5" />, label: 'Patients' },
        { to: '/doctor/appointments', icon: <Calendar className="w-5 h-5" />, label: 'Appointments' },
      );
    }

    if (isAdmin) {
      items.push(
        { to: '/admin', icon: <Shield className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Users' },
        { to: '/admin/doctors', icon: <Stethoscope className="w-5 h-5" />, label: 'Doctors' },
        { to: '/admin/appointments', icon: <Calendar className="w-5 h-5" />, label: 'Appointments' },
        { to: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics' },
      );
    }

    // Common items for all
    items.push(
      { to: '/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
      { to: '/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
    );

    return items;
  };

  const navItems = getNavItems();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div
      className={`hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } min-h-screen sticky top-0`}
    >
      {/* Logo */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-gray-200 dark:border-gray-700`}>
        {!isCollapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">MediTrack</span>
          </Link>
        )}
        {isCollapsed && (
          <Link to="/dashboard">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4 text-gray-400" /> : <ChevronLeft className="w-4 h-4 text-gray-400" />}
        </button>
      </div>

      {/* User Profile */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} p-4 border-b border-gray-200 dark:border-gray-700`}>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {getUserInitials(user?.name)}
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              isActive(item.to)
                ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={isCollapsed ? item.label : ''}
          >
            {item.icon}
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
        <button
          onClick={logout}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} w-full px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;