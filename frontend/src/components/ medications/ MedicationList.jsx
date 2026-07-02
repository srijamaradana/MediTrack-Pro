import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Pill,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye
} from 'lucide-react';
import { medications } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import MedicationCard from './MedicationCard';
import MedicationFilters from './MedicationFilters';

const MedicationList = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch medications
  const { data, isLoading, error } = useQuery(
    ['medications', { page, status: statusFilter, search: searchTerm }],
    () => medications.getAll({ page, limit: 10, status: statusFilter, search: searchTerm }),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Delete medication mutation
  const deleteMutation = useMutation(
    (id) => medications.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['medications']);
        toast.success('Medication deleted successfully');
        setShowDeleteModal(false);
      },
      onError: (error) => {
        toast.error('Failed to delete medication');
        console.error('Delete error:', error);
      },
    }
  );

  // Mark as taken mutation
  const markTakenMutation = useMutation(
    ({ id, time }) => medications.markAsTaken(id, { time }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['medications']);
        toast.success('Medication marked as taken ✅');
      },
      onError: (error) => {
        toast.error('Failed to mark as taken');
        console.error('Mark taken error:', error);
      },
    }
  );

  const handleDelete = (id) => {
    setSelectedMedication(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedMedication) {
      deleteMutation.mutate(selectedMedication);
    }
  };

  const handleMarkTaken = (id) => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    markTakenMutation.mutate({ id, time });
  };

  const medicationsList = data?.data || [];
  const pagination = data?.pagination || { total: 0, pages: 1, page: 1 };

  // Calculate statistics
  const stats = {
    total: medicationsList.length,
    active: medicationsList.filter(m => m.status === 'active').length,
    completed: medicationsList.filter(m => m.status === 'completed').length,
    adherence: medicationsList.reduce((acc, m) => acc + (m.adherenceRate || 0), 0) / (medicationsList.length || 1),
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Failed to load medications</h3>
        <p className="text-gray-500 mt-2">Please try again later</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">💊 Medications</h1>
          <p className="text-gray-500 mt-1">Manage your medication schedule and adherence</p>
        </div>
        <Link to="/medications/add" className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Medication
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Medications</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total || 0}</p>
            </div>
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
              <Pill className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-success-600">{stats.active}</p>
            </div>
            <div className="w-10 h-10 bg-success-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
            </div>
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Adherence Rate</p>
              <p className="text-2xl font-bold text-primary-600">
                {Math.round(stats.adherence)}%
              </p>
            </div>
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search medications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <MedicationFilters 
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </div>
      </div>

      {/* Medication List */}
      {medicationsList.length === 0 ? (
        <EmptyState
          icon={<Pill className="w-12 h-12" />}
          title="No medications found"
          description={searchTerm ? "Try adjusting your search filters" : "Start by adding your first medication"}
          action={
            <Link to="/medications/add" className="btn-primary">
              <Plus className="w-4 h-4" />
              Add Medication
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medicationsList.map((medication) => (
              <MedicationCard
                key={medication._id}
                medication={medication}
                onMarkTaken={handleMarkTaken}
                onDelete={handleDelete}
                onEdit={() => {}}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-100">
              <div className="text-sm text-gray-500">
                Showing {((pagination.page - 1) * 10) + 1} to{' '}
                {Math.min(pagination.page * 10, pagination.total)} of {pagination.total}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-2 text-sm font-medium text-gray-700">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="text-center">
              <div className="w-12 h-12 bg-danger-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-danger-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Medication</h3>
              <p className="text-gray-500 mt-2">
                Are you sure you want to delete this medication? This action cannot be undone.
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

export default MedicationList;