// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
  },
  USERS: {
    ME: '/users/me',
    PROFILE: '/users/profile',
    PREFERENCES: '/users/preferences',
    CHANGE_PASSWORD: '/users/change-password',
    DASHBOARD_STATS: '/users/dashboard-stats',
    HEALTH_SUMMARY: '/users/health-summary',
  },
  DOCTORS: {
    ALL: '/doctors',
    PROFILE: '/doctors/profile',
    PATIENTS: '/doctors/patients',
    APPOINTMENTS: '/doctors/appointments',
    STATS: '/doctors/stats',
  },
  APPOINTMENTS: {
    ALL: '/appointments',
    BOOK: '/appointments',
    AVAILABLE_SLOTS: '/appointments/available-slots',
  },
  MEDICATIONS: {
    ALL: '/medications',
    ADHERENCE: '/medications/adherence',
  },
  REPORTS: {
    ALL: '/reports',
    UPLOAD: '/reports',
  },
  HEALTH_LOGS: {
    ALL: '/health-logs',
    TRENDS: '/health-logs/trends',
  },
  NOTIFICATIONS: {
    ALL: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_ALL_READ: '/notifications/mark-all-read',
  },
  ADMIN: {
    STATS: '/admin/stats',
    USERS: '/admin/users',
    DOCTORS: '/admin/doctors',
    APPOINTMENTS: '/admin/appointments',
    ANALYTICS: '/admin/analytics',
  },
};

// User roles
export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
  SUPER_ADMIN: 'superadmin',
};

// Appointment statuses
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  MISSED: 'missed',
  RESCHEDULED: 'rescheduled',
  PENDING: 'pending',
};

// Appointment types
export const APPOINTMENT_TYPES = {
  CONSULTATION: 'consultation',
  FOLLOW_UP: 'follow-up',
  EMERGENCY: 'emergency',
  CHECKUP: 'checkup',
  PROCEDURE: 'procedure',
  TELEMEDICINE: 'telemedicine',
};

// Medication frequencies
export const MEDICATION_FREQUENCIES = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every 4 hours',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'As needed',
  'Weekly',
  'Monthly',
];

// Report types
export const REPORT_TYPES = [
  'Lab Report',
  'Radiology',
  'Prescription',
  'Surgery Report',
  'Discharge Summary',
  'Vaccination Record',
  'Health Checkup',
  'Medical Certificate',
  'Insurance Document',
  'Other',
];

// Blood groups
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Genders
export const GENDERS = ['male', 'female', 'other', 'prefer-not-to-say'];

// Moods
export const MOODS = ['happy', 'neutral', 'sad', 'anxious', 'stressed', 'energetic', 'tired', 'depressed'];

// Sleep quality
export const SLEEP_QUALITY = ['excellent', 'good', 'fair', 'poor', 'very-poor'];

// Exercise types
export const EXERCISE_TYPES = ['cardiovascular', 'strength', 'flexibility', 'balance', 'none'];

// Specializations
export const SPECIALIZATIONS = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Hematology',
  'Infectious Disease',
  'Nephrology',
  'Neurology',
  'Obstetrics & Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Otolaryngology (ENT)',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Rheumatology',
  'Surgery',
  'Urology',
  'General Medicine',
  'Family Medicine',
  'Emergency Medicine',
  'Anesthesiology',
  'Pathology',
];

// Notification priorities
export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Notification types
export const NOTIFICATION_TYPES = {
  MEDICATION: 'medication',
  APPOINTMENT: 'appointment',
  REPORT: 'report',
  SYSTEM: 'system',
  REMINDER: 'reminder',
  ALERT: 'alert',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

// Theme
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  TIME_12H: 'hh:mm A',
  FULL: 'EEEE, MMMM dd, yyyy',
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMITS: [5, 10, 20, 50, 100],
};

// File upload limits
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
};

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PASSWORD: 'Password must be at least 8 characters',
  PHONE: 'Please enter a valid phone number',
  NAME: 'Name must be between 2 and 50 characters',
  DATE: 'Please enter a valid date',
  TIME: 'Please enter a valid time (HH:MM)',
  URL: 'Please enter a valid URL',
  NUMBER: 'Please enter a valid number',
  MIN: (min) => `Value must be at least ${min}`,
  MAX: (max) => `Value must be at most ${max}`,
  MIN_LENGTH: (length) => `Must be at least ${length} characters`,
  MAX_LENGTH: (length) => `Must be at most ${length} characters`,
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/dashboard',
  MEDICATIONS: '/medications',
  ADD_MEDICATION: '/medications/add',
  MEDICATION_SCHEDULE: '/medications/schedule',
  APPOINTMENTS: '/appointments',
  BOOK_APPOINTMENT: '/appointments/book',
  CALENDAR: '/appointments/calendar',
  REPORTS: '/reports',
  UPLOAD_REPORT: '/reports/upload',
  HEALTH_LOG: '/health-log',
  ADD_HEALTH_LOG: '/health-log/add',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  DOCTOR: '/doctor',
  DOCTOR_PATIENTS: '/doctor/patients',
  DOCTOR_APPOINTMENTS: '/doctor/appointments',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_DOCTORS: '/admin/doctors',
  ADMIN_APPOINTMENTS: '/admin/appointments',
  ADMIN_ANALYTICS: '/admin/analytics',
};