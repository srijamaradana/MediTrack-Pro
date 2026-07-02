import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Image,
  File,
  Calendar,
  Clock,
  Eye,
  Download,
  Share2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
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
  RefreshCw,
  AlertCircle as AlertCircleIcon,
  MoreVertical as MoreVerticalIcon,
  Plus,
  Minus,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Maximize,
  Minimize,
  Calendar as CalendarIcon,
  User as UserIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  File as FileIcon,
  Image as ImageIcon,
  FileText as FileTextIcon
} from 'lucide-react';
import { formatDate, getFileSize } from '../../utils/helpers';

const ReportCard = ({ report, onDelete, onView, onShare }) => {
  const {
    _id,
    title,
    type,
    description,
    fileUrl,
    fileType,
    fileSize,
    createdAt,
    reviewed,
    tags,
  } = report;

  const getFileIcon = () => {
    if (fileType === 'image') return <Image className="w-5 h-5 text-teal-600" />;
    if (fileType === 'pdf') return <FileText className="w-5 h-5 text-red-600" />;
    return <File className="w-5 h-5 text-blue-600" />;
  };

  const getTypeColor = () => {
    switch (type) {
      case 'Lab Report':
        return 'bg-blue-50 text-blue-700';
      case 'Radiology':
        return 'bg-purple-50 text-purple-700';
      case 'Prescription':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="card hover:shadow-md transition group">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
            {getFileIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-1">{title}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeColor()}`}>
                {type}
              </span>
              <span className={`badge ${reviewed ? 'badge-success' : 'badge-warning'}`}>
                {reviewed ? 'Reviewed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-lg transition">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Description */}
      {description && (
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{description}</p>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-xs text-gray-400">+{tags.length - 3} more</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(createdAt)}
          </span>
          {fileSize && (
            <span className="flex items-center gap-1">
              <File className="w-3 h-3" />
              {getFileSize(fileSize)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Link
            to={`/reports/${_id}`}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => window.open(fileUrl, '_blank')}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onShare && onShare(report)}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete && onDelete(report)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;