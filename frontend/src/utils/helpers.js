import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';
import { DATE_FORMATS } from './constants';

// Date helpers
export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY) => {
  if (!date) return 'N/A';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatStr);
  } catch {
    return 'Invalid Date';
  }
};

export const formatTime = (time) => {
  if (!time) return 'N/A';
  try {
    return format(new Date(`2000-01-01T${time}`), DATE_FORMATS.TIME_12H);
  } catch {
    return time;
  }
};

export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (isToday(parsedDate)) return 'Today';
    if (isTomorrow(parsedDate)) return 'Tomorrow';
    if (isYesterday(parsedDate)) return 'Yesterday';
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  } catch {
    return 'Invalid Date';
  }
};

export const isDateInPast = (date) => {
  if (!date) return false;
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return new Date() > parsedDate;
  } catch {
    return false;
  }
};

export const isDateInFuture = (date) => {
  if (!date) return false;
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return new Date() < parsedDate;
  } catch {
    return false;
  }
};

// String helpers
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.split(' ').map(capitalize).join(' ');
};

export const truncate = (str, length = 50) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Number helpers
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatPercentage = (num) => {
  if (num === undefined || num === null) return '0%';
  return `${Math.round(num)}%`;
};

export const getRandomColor = () => {
  const colors = [
    '#0A6E79', '#2D9CDB', '#27AE60', '#F2994A',
    '#EB5757', '#9B51E0', '#2F80ED', '#219653',
    '#F2C94C', '#EB5757', '#6FCF97', '#BB6BD9',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Array helpers
export const groupBy = (array, key) => {
  if (!array) return {};
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, order = 'asc') => {
  if (!array) return [];
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal === bVal) return 0;
    if (order === 'asc') return aVal < bVal ? -1 : 1;
    return aVal > bVal ? -1 : 1;
  });
};

export const unique = (array) => [...new Set(array)];

// Object helpers
export const pick = (obj, keys) => {
  if (!obj) return {};
  return keys.reduce((result, key) => {
    if (obj[key] !== undefined) result[key] = obj[key];
    return result;
  }, {});
};

export const omit = (obj, keys) => {
  if (!obj) return {};
  return Object.keys(obj).reduce((result, key) => {
    if (!keys.includes(key)) result[key] = obj[key];
    return result;
  }, {});
};

// Color helpers
export const getStatusColor = (status) => {
  const colors = {
    scheduled: 'primary',
    confirmed: 'success',
    completed: 'success',
    cancelled: 'danger',
    missed: 'warning',
    rescheduled: 'warning',
    pending: 'warning',
    active: 'success',
    discontinued: 'danger',
    paused: 'warning',
  };
  return colors[status] || 'gray';
};

export const getStatusBadgeClass = (status) => {
  const color = getStatusColor(status);
  return `badge-${color}`;
};

// File helpers
export const getFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileType = (filename) => {
  if (!filename) return 'unknown';
  const ext = filename.split('.').pop().toLowerCase();
  const types = {
    pdf: 'pdf',
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    svg: 'image',
    doc: 'doc',
    docx: 'doc',
    txt: 'text',
    csv: 'csv',
    xls: 'excel',
    xlsx: 'excel',
  };
  return types[ext] || 'unknown';
};

export const isImageFile = (filename) => {
  const type = getFileType(filename);
  return type === 'image';
};

// Validation helpers
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

export const isValidPassword = (password) => {
  return password && password.length >= 8;
};

// URL helpers
export const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
};

export const buildUrl = (base, params) => {
  if (!params) return base;
  const queryString = Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  return queryString ? `${base}?${queryString}` : base;
};

// Error helpers
export const getErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred';
  if (typeof error === 'string') return error;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return 'An unexpected error occurred';
};

export const isNetworkError = (error) => {
  return !error.response && error.message === 'Network Error';
};

// Console helpers (for development only)
export const log = (message, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔵 ${message}:`, data);
  }
};

export const logError = (message, error) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`🔴 ${message}:`, error);
  }
};

export default {
  formatDate,
  formatTime,
  formatRelativeTime,
  isDateInPast,
  isDateInFuture,
  capitalize,
  capitalizeWords,
  truncate,
  slugify,
  formatNumber,
  formatPercentage,
  getRandomColor,
  groupBy,
  sortBy,
  unique,
  pick,
  omit,
  getStatusColor,
  getStatusBadgeClass,
  getFileSize,
  getFileType,
  isImageFile,
  isValidEmail,
  isValidPhone,
  isValidPassword,
  getUrlParams,
  buildUrl,
  getErrorMessage,
  isNetworkError,
  log,
  logError,
};