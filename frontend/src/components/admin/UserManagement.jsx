import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Shield,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  UserPlus,
  UserMinus,
  Lock,
  Unlock,
  Ban,
  Award,
  Star,
  Clock,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
  Settings,
  Bell,
  Menu,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  Home,
  LogOut,
  User as UserIcon,
  HelpCircle,
  Shield as ShieldIcon,
  Zap,
  Target,
  Award as AwardIcon,
  BookOpen,
  Globe,
  MessageSquare,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin,
  Building,
  CreditCard,
  Gift,
  Star as StarIcon,
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
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
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
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon2,
  LineChart as LineChartIcon2,
  DollarSign as DollarSignIcon,
  RefreshCw as RefreshCwIcon,
  Settings as SettingsIcon,
  Bell as BellIcon,
  Menu as MenuIcon,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon2,
  ChevronLeft as ChevronLeftIcon2,
  Home as HomeIcon,
  LogOut as LogOutIcon,
  User as UserIcon2,
  HelpCircle as HelpCircleIcon,
  Shield as ShieldIcon2,
  Zap as ZapIcon,
  Target as TargetIcon,
  Award as AwardIcon2,
  BookOpen as BookOpenIcon,
  Globe as GlobeIcon,
  MessageSquare as MessageSquareIcon,
  Mail as MailIcon2,
  Phone as PhoneIcon2,
  MapPin as MapPinIcon,
  Building as BuildingIcon,
  CreditCard as CreditCardIcon,
  Gift as GiftIcon,
  Star as StarIcon2,
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
  Activity as ActivityIcon3
} from 'lucide-react';
import { admin } from '../../services/api';
import { USER_ROLES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import UserFilters from './UserFilters';
import UserModal from './UserModal';

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch users
  const { data, isLoading, error, refetch } = useQuery(
    ['admin-users', { page, role: roleFilter, status: statusFilter, search: searchTerm }],
    () => admin.getUsers({
      page,
      limit: 10,
      role: roleFilter !== 'all' ? roleFilter : undefined,
      isActive: statusFilter !== 'all' ? statusFilter === 'active' : undefined,
      search: searchTerm || undefined,
    }),
    {
      keepPreviousData: true,
      staleTime: 30000,
    }
  );

  // Update user mutation
  const updateMutation = useMutation(
    ({ id, data }) => admin.updateUser(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-users']);
        toast.success('User updated successfully');
        setShowModal(false);
      },
      onError: (error) => {
        toast.error('Failed to update user');
        console.error('Update error:', error);
      },
    }
  );

  // Delete user mutation
  const deleteMutation = useMutation(
    (id) => admin.deleteUser(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-users']);
        toast.success('User deleted successfully');
        setShowDeleteModal(false);
      },
      onError: (error) => {
        toast.error('Failed to delete user');
        console.error('Delete error:', error);
      },
    }
  );

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser._id);
    }
  };

  const handleUpdate = (formData) => {
    if (selectedUser) {
      updateMutation.mutate({ id: selectedUser._id, data: formData });
    }
  };

  const handleToggleStatus = (user) => {
    updateMutation.mutate({
      id: user._id,
      data: { isActive: !user.isActive },
    });
  };

  const users = data?.data || [];
  const pagination = data?.pagination || { total: 0, pages: 1, page: 1 };

  // Calculate stats
  const stats = {
    total: pagination.total || 0,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    patients: users.filter(u => u.role === 'patient').length,
    doctors: users.filter(u => u.role === 'doctor').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Failed to load users</h3>
        <p className="text-gray-500 mt-2">Please try again later</p>
        <button onClick={() => refetch()} className="mt-4 btn-primary">
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const getRoleBadge = (role) => {
    const colors = {
      patient: 'bg-blue-50 text-blue-700',
      doctor: 'bg-green-50 text-green-700',
      admin: 'bg-purple-50 text-purple-700',
      superadmin: 'bg-red-50 text-red-700',
    };
    return colors[role] || 'bg-gray-50 text-gray-700';
  };

  const getStatusBadge = (isActive) => {
    return isActive
      ? 'bg-success-50 text-success-700'
      : 'bg-danger-50 text-danger-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">👥 User Management</h1>
          <p className="text-gray-500 mt-1">Manage all users on the platform</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="btn-primary text-sm">
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="card text-center">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-xl font-bold text-success-600">{stats.active}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Inactive</p>
          <p className="text-xl font-bold text-danger-600">{stats.inactive}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Patients</p>
          <p className="text-xl font-bold text-blue-600">{stats.patients}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Doctors</p>
          <p className="text-xl font-bold text-green-600">{stats.doctors}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Admins</p>
          <p className="text-xl font-bold text-purple-600">{stats.admins}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <UserFilters
            roleFilter={roleFilter}
            onRoleChange={setRoleFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(user.isActive)}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1.5 text-gray-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-1.5 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * 10) + 1} to{' '}
              {Math.min(pagination.page * 10, pagination.total)} of {pagination.total}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-2 text-sm font-medium text-gray-700">
                Page {page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Modal */}
      {showModal && selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onSave={handleUpdate}
          isLoading={updateMutation.isLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="text-center">
              <div className="w-12 h-12 bg-danger-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-danger-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete User</h3>
              <p className="text-gray-500 mt-2">
                Are you sure you want to delete <strong>{selectedUser.name}</strong>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteMutation.isLoading}
                  className="flex-1 btn-danger"
                >
                  {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;