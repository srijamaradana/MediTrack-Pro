import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Upload,
  File,
  Image,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Loader,
  Plus,
  Trash2,
  Eye,
  Download,
  Share2,
  Calendar,
  User,
  Clock,
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
  MoreVertical,
  Plus as PlusIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  XCircle,
  File as FileIcon,
  Image as ImageIcon,
  FileText as FileTextIcon
} from 'lucide-react';
import { reports, doctors } from '../../services/api';
import { REPORT_TYPES } from '../../utils/constants';
import { getFileSize } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';

// Validation schema
const uploadSchema = z.object({
  title: z.string().min(2, 'Title is required').max(100),
  type: z.string().min(1, 'Report type is required'),
  description: z.string().optional().max(500),
  doctorId: z.string().optional(),
  tags: z.string().optional(),
  isShared: z.boolean().default(false),
});

const UploadReport = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      type: '',
      description: '',
      doctorId: '',
      tags: '',
      isShared: false,
    },
  });

  // Fetch doctors for sharing
  const { data: doctorsData, isLoading: doctorsLoading } = useQuery(
    ['doctors-list'],
    () => doctors.getAll({ limit: 100 }),
    {
      staleTime: 60000,
    }
  );

  // Upload mutation
  const uploadMutation = useMutation(
    (data) => reports.upload(data),
    {
      onSuccess: (response) => {
        toast.success('Report uploaded successfully! 🎉');
        navigate('/reports');
      },
      onError: (error) => {
        toast.error('Failed to upload report');
        console.error('Upload error:', error);
        setIsUploading(false);
      },
    }
  );

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'pending',
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
  });

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const onSubmit = async (data) => {
    if (files.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    setIsUploading(true);

    try {
      // Upload each file
      for (const fileObj of files) {
        const formData = {
          title: data.title || fileObj.name,
          type: data.type,
          description: data.description,
          doctorId: data.doctorId || undefined,
          tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
          file: fileObj.file,
          isShared: data.isShared,
        };

        await uploadMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const isSubmitting = uploadMutation.isLoading || isUploading;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/reports')}
          className="p-2 hover:bg-gray-100 rounded-xl transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload Medical Report</h1>
          <p className="text-gray-500">Upload and manage your medical reports</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* File Upload Area */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h3>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
              isDragActive
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-teal-600" />
              </div>
              <p className="text-gray-700 font-medium">
                {isDragActive ? 'Drop your files here' : 'Drag & drop your files here'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or click to browse files
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Supports: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)
              </p>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((fileObj) => (
                <div
                  key={fileObj.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    {fileObj.type?.startsWith('image/') ? (
                      <Image className="w-5 h-5 text-teal-600" />
                    ) : fileObj.type === 'application/pdf' ? (
                      <FileText className="w-5 h-5 text-red-600" />
                    ) : (
                      <File className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileObj.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getFileSize(fileObj.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(fileObj.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Report Details */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Title *
              </label>
              <input
                {...register('title')}
                className={`input ${errors.title ? 'input-error' : ''}`}
                placeholder="e.g., Blood Test Report"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Report Type *
              </label>
              <select
                {...register('type')}
                className={`input ${errors.type ? 'input-error' : ''}`}
              >
                <option value="">Select type</option>
                {REPORT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.type && (
                <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                {...register('description')}
                className="input"
                rows="3"
                placeholder="Brief description of the report..."
              />
            </div>

            {/* Share with Doctor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Share with Doctor (Optional)
              </label>
              <select
                {...register('doctorId')}
                className="input"
              >
                <option value="">Select a doctor</option>
                {doctorsLoading ? (
                  <option disabled>Loading doctors...</option>
                ) : (
                  doctorsData?.data?.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.user?.name} - {doctor.specialization}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tags (comma separated)
              </label>
              <input
                {...register('tags')}
                className="input"
                placeholder="e.g., blood-test, annual-checkup"
              />
            </div>
          </div>

          {/* Share Checkbox */}
          <div className="mt-4">
            <label className="flex items-center gap-3">
              <input
                {...register('isShared')}
                type="checkbox"
                className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">
                Make this report accessible to my healthcare providers
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting || files.length === 0}
            className="btn-primary flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Report{files.length > 1 ? 's' : ''}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/reports')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>

        {files.length === 0 && !isSubmitting && (
          <p className="text-sm text-amber-600 text-center">
            Please select at least one file to upload
          </p>
        )}
      </form>
    </div>
  );
};

export default UploadReport;