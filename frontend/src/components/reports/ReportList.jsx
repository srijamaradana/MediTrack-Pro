import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import {
  FileText,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Calendar,
  Download,
  Eye,
  Trash2,
  Share2,
  RefreshCw,
  AlertCircle,
  MoreVertical,
  Edit,
  CheckCircle,
  XCircle,
  File,
  Image,
  FileArchive,
  FileCode,
  FileJson,
  FileSpreadsheet,
  FileSymlink,
  FileTerminal,
  FileType,
  FileVideo,
  FileVolume,
  FileX,
  FilePlus,
  FileMinus,
  FileWarning,
  FileSearch,
  FileClock,
  FileSliders,
  FileCheck,
  FileX2,
  FilePen,
  FileType2,
  FileInput,
  FileOutput,
  FileCog,
  FileLock,
  FileUnlock,
  FileKey,
  FileSignature,
  FileText as FileTextIcon,
  FileQuestion,
  FileStack,
  FileBox,
  FileAxis3D,
  FilePieChart,
  FileChartColumn,
  FileChartPie,
  FileChartLine,
  FileChartScatter,
  FileChartBar,
  FileChartColumnDecreasing,
  FileChartPieDecreasing,
  FileChartLineDecreasing,
  FileChartScatterDecreasing,
  FileChartBarDecreasing,
  FileChartColumnIncreasing,
  FileChartPieIncreasing,
  FileChartLineIncreasing,
  FileChartScatterIncreasing,
  FileChartBarIncreasing,
  FileSpreadsheet as FileSpreadsheetIcon,
  FileArchive as FileArchiveIcon,
  FileCode as FileCodeIcon,
  FileJson as FileJsonIcon,
  FileSymlink as FileSymlinkIcon,
  FileTerminal as FileTerminalIcon,
  FileType as FileTypeIcon,
  FileVideo as FileVideoIcon,
  FileVolume as FileVolumeIcon,
  FileX as FileXIcon,
  FilePlus as FilePlusIcon,
  FileMinus as FileMinusIcon,
  FileWarning as FileWarningIcon,
  FileSearch as FileSearchIcon,
  FileClock as FileClockIcon,
  FileSliders as FileSlidersIcon,
  FileCheck as FileCheckIcon,
  FileX2 as FileX2Icon,
  FilePen as FilePenIcon,
  FileType2 as FileType2Icon,
  FileInput as FileInputIcon,
  FileOutput as FileOutputIcon,
  FileCog as FileCogIcon,
  FileLock as FileLockIcon,
  FileUnlock as FileUnlockIcon,
  FileKey as FileKeyIcon,
  FileSignature as FileSignatureIcon,
  FileQuestion as FileQuestionIcon,
  FileStack as FileStackIcon,
  FileBox as FileBoxIcon,
  FileAxis3D as FileAxis3DIcon,
  FilePieChart as FilePieChartIcon,
  FileChartColumn as FileChartColumnIcon,
  FileChartPie as FileChartPieIcon,
  FileChartLine as FileChartLineIcon,
  FileChartScatter as FileChartScatterIcon,
  FileChartBar as FileChartBarIcon,
  FileChartColumnDecreasing as FileChartColumnDecreasingIcon,
  FileChartPieDecreasing as FileChartPieDecreasingIcon,
  FileChartLineDecreasing as FileChartLineDecreasingIcon,
  FileChartScatterDecreasing as FileChartScatterDecreasingIcon,
  FileChartBarDecreasing as FileChartBarDecreasingIcon,
  FileChartColumnIncreasing as FileChartColumnIncreasingIcon,
  FileChartPieIncreasing as FileChartPieIncreasingIcon,
  FileChartLineIncreasing as FileChartLineIncreasingIcon,
  FileChartScatterIncreasing as FileChartScatterIncreasingIcon,
  FileChartBarIncreasing as FileChartBarIncreasingIcon,
  Download as DownloadIcon,
  Filter as FilterIcon,
  Search as SearchIcon,
  Eye as EyeIcon,
  Edit as EditIcon,
  Trash2 as Trash2Icon,
  Share2 as Share2Icon,
  RefreshCw as RefreshCwIcon,
  AlertCircle as AlertCircleIcon,
  MoreVertical as MoreVerticalIcon,
  Plus as PlusIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  File as FileIcon,
  Image as ImageIcon
} from 'lucide-react';
import { reports } from '../../services/api';
import { REPORT_TYPES } from '../../utils/constants';
import { formatDate, getFileSize } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import ReportCard from './ReportCard';
import ReportFilters from './ReportFilters';

const ReportList = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch reports
  const { data, isLoading, error, refetch } = useQuery(
    ['reports', { page, type: typeFilter, search: searchTerm }],
    () => reports.getAll({
      page,
      limit: 10,
      type: typeFilter !== 'all' ? typeFilter : undefined,
      search: searchTerm || undefined,
    }),
    {
      keepPreviousData: true,
      staleTime: 30000,
    }
  );

  // Delete report mutation
  const deleteMutation = useMutation(
    (id) => reports.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reports']);
        toast.success('Report deleted successfully');
        setShowDeleteModal(false);
      },
      onError: (error) => {
        toast.error('Failed to delete report');
        console.error('Delete error:', error);
      },
    }
  );

  const handleDelete = (report) => {
    setSelectedReport(report);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedReport) {
      deleteMutation.mutate(selectedReport._id);
    }
  };

  const reportsList = data?.data || [];
  const pagination = data?.pagination || { total: 0, pages: 1, page: 1 };

  // Calculate stats
  const stats = {
    total: pagination.total || 0,
    labReports: reportsList.filter(r => r.type === 'Lab Report').length,
    radiology: reportsList.filter(r => r.type === 'Radiology').length,
    prescriptions: reportsList.filter(r => r.type === 'Prescription').length,
    others: reportsList.filter(r => !['Lab Report', 'Radiology', 'Prescription'].includes(r.type)).length,
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Failed to load reports</h3>
        <p className="text-gray-500 mt-2">Please try again later</p>
        <button onClick={() => refetch()} className="mt-4 btn-primary">
          <RefreshCw className="w-4 h-4" />
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
          <h1 className="text-2xl font-bold text-gray-900">📄 Medical Reports</h1>
          <p className="text-gray-500 mt-1">Manage all your medical reports in one place</p>
        </div>
        <Link to="/reports/upload" className="btn-primary text-sm">
          <Plus className="w-4 h-4" />
          Upload Report
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card text-center">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Lab Reports</p>
          <p className="text-xl font-bold text-blue-600">{stats.labReports}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Radiology</p>
          <p className="text-xl font-bold text-purple-600">{stats.radiology}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Others</p>
          <p className="text-xl font-bold text-gray-600">{stats.others}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports by title, type, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <ReportFilters
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
          />
        </div>
      </div>

      {/* Report List */}
      {reportsList.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-12 h-12" />}
          title="No reports found"
          description={searchTerm ? "Try adjusting your search filters" : "Upload your first medical report"}
          action={
            <Link to="/reports/upload" className="btn-primary">
              <Plus className="w-4 h-4" />
              Upload Report
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportsList.map((report) => (
              <ReportCard
                key={report._id}
                report={report}
                onDelete={handleDelete}
                onView={() => {}}
                onShare={() => {}}
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
      {showDeleteModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Report</h3>
              <p className="text-gray-500 mt-2">
                Are you sure you want to delete <strong>{selectedReport.title}</strong>?
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

export default ReportList;