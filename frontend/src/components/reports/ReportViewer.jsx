import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Download,
  Share2,
  Trash2,
  Eye,
  Edit,
  Calendar,
  User,
  Clock,
  FileText,
  Image,
  File,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  MoreVertical,
  Printer,
  Mail,
  MessageSquare,
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
  Activity,
  BarChart,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Maximize,
  Minimize,
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
  Minus as MinusIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateCw as RotateCwIcon,
  RotateCcw as RotateCcwIcon,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  File as FileIcon,
  Image as ImageIcon,
  FileText as FileTextIcon
} from 'lucide-react';
import { reports } from '../../services/api';
import { formatDate, formatTime } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

const ReportViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Fetch report details
  const { data, isLoading, error, refetch } = useQuery(
    ['report', id],
    () => reports.getById(id),
    {
      enabled: !!id,
      staleTime: 30000,
    }
  );

  // Delete report mutation
  const deleteMutation = useMutation(
    () => reports.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reports']);
        toast.success('Report deleted successfully');
        navigate('/reports');
      },
      onError: (error) => {
        toast.error('Failed to delete report');
        console.error('Delete error:', error);
      },
    }
  );

  // Share report mutation
  const shareMutation = useMutation(
    (data) => reports.share(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['report', id]);
        toast.success('Report shared successfully');
        setShowShareModal(false);
      },
      onError: (error) => {
        toast.error('Failed to share report');
        console.error('Share error:', error);
      },
    }
  );

  if (isLoading) return <LoadingSpinner />;
  if (error || !data) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Failed to load report</h3>
        <p className="text-gray-500 mt-2">Report not found or you don't have access</p>
        <button onClick={() => refetch()} className="mt-4 btn-primary">
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const report = data.report;

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  const handleDownload = () => {
    window.open(report.fileUrl, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/reports')}
          className="p-2 hover:bg-gray-100 rounded-xl transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {report.type}
            </span>
            <span className="w-px h-3 bg-gray-300" />
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(report.createdAt)}
            </span>
            <span className="w-px h-3 bg-gray-300" />
            <span className={`badge ${report.reviewed ? 'badge-success' : 'badge-warning'}`}>
              {report.reviewed ? 'Reviewed' : 'Pending Review'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleDownload} className="btn-secondary text-sm">
            <Download className="w-4 h-4" />
            Download
          </button>
          <button onClick={handlePrint} className="btn-secondary text-sm">
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="btn-primary text-sm"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Document Preview</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500">{zoomLevel}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              className="border rounded-xl overflow-hidden bg-gray-50"
              style={{ minHeight: '400px' }}
            >
              {report.fileType === 'image' ? (
                <img
                  src={report.fileUrl}
                  alt={report.title}
                  className="w-full object-contain"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                />
              ) : report.fileType === 'pdf' ? (
                <iframe
                  src={`${report.fileUrl}#toolbar=0`}
                  className="w-full h-[500px]"
                  title={report.title}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-96 p-8 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500">Preview not available for this file type</p>
                  <button
                    onClick={handleDownload}
                    className="mt-4 btn-primary"
                  >
                    <Download className="w-4 h-4" />
                    Download File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Report Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Title</p>
                <p className="font-medium text-gray-900">{report.title}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Type</p>
                <p className="font-medium text-gray-900">{report.type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Uploaded By</p>
                <p className="font-medium text-gray-900">
                  {report.uploadedBy?.name || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-medium text-gray-900">
                  {formatDate(report.createdAt)}
                </p>
              </div>
              {report.tags?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {report.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Review Status */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Status</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {report.reviewed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Clock className="w-5 h-5 text-yellow-600" />
                )}
                <span className="font-medium text-gray-900">
                  {report.reviewed ? 'Reviewed' : 'Pending Review'}
                </span>
              </div>
              {report.reviewed && (
                <>
                  <div>
                    <p className="text-xs text-gray-500">Reviewed By</p>
                    <p className="font-medium text-gray-900">
                      Dr. {report.reviewedBy?.user?.name || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Review Date</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(report.reviewedAt)}
                    </p>
                  </div>
                  {report.reviewNotes && (
                    <div>
                      <p className="text-xs text-gray-500">Review Notes</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {report.reviewNotes}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Shared With */}
          {report.sharedWith?.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shared With</h3>
              <div className="space-y-2">
                {report.sharedWith.map((share, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold text-sm">
                      {share.doctor?.user?.name?.charAt(0) || 'D'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900">
                        Dr. {share.doctor?.user?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Shared {formatDate(share.sharedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {report.description && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 text-sm">{report.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Share Report</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Share this report with your healthcare providers
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Doctor
                </label>
                <select className="input">
                  <option value="">Select a doctor</option>
                  {/* Doctors list */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Permission
                </label>
                <select className="input">
                  <option value="view">View Only</option>
                  <option value="comment">Can Comment</option>
                  <option value="edit">Can Edit</option>
                </select>
              </div>
              <button
                onClick={() => {
                  // Share logic
                  setShowShareModal(false);
                  toast.success('Report shared successfully');
                }}
                className="w-full btn-primary"
              >
                <Share2 className="w-4 h-4" />
                Share Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Report</h3>
              <p className="text-gray-500 mt-2">
                Are you sure you want to delete <strong>{report.title}</strong>?
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
                  onClick={() => deleteMutation.mutate()}
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

export default ReportViewer;