/**
 * Application-wide constants for the Fragrance Management System
 */

// User Roles and Permissions
export const USER_ROLES = {
  ADMINISTRATOR: 'administrator',
  LAB_MANAGER: 'lab_manager',
  PROJECT_MANAGER: 'project_manager',
  PALETTE_MANAGER: 'palette_manager',
  PERFUMER: 'perfumer',
} as const

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMINISTRATOR]: 'Administrator',
  [USER_ROLES.LAB_MANAGER]: 'Lab Manager',
  [USER_ROLES.PROJECT_MANAGER]: 'Project Manager',
  [USER_ROLES.PALETTE_MANAGER]: 'Palette Manager',
  [USER_ROLES.PERFUMER]: 'Perfumer',
} as const

export const USER_ROLE_HIERARCHY = [
  USER_ROLES.PERFUMER,
  USER_ROLES.PALETTE_MANAGER,
  USER_ROLES.PROJECT_MANAGER,
  USER_ROLES.LAB_MANAGER,
  USER_ROLES.ADMINISTRATOR,
] as const

// Departments
export const DEPARTMENTS = {
  RESEARCH: 'research',
  DEVELOPMENT: 'development',
  QUALITY: 'quality',
  MARKETING: 'marketing',
  SALES: 'sales',
  MANAGEMENT: 'management',
} as const

export const DEPARTMENT_LABELS = {
  [DEPARTMENTS.RESEARCH]: 'Research',
  [DEPARTMENTS.DEVELOPMENT]: 'Development',
  [DEPARTMENTS.QUALITY]: 'Quality Control',
  [DEPARTMENTS.MARKETING]: 'Marketing',
  [DEPARTMENTS.SALES]: 'Sales',
  [DEPARTMENTS.MANAGEMENT]: 'Management',
} as const

// Perfume Categories
export const PERFUME_CATEGORIES = {
  FRESH: 'fresh',
  FLORAL: 'floral',
  ORIENTAL: 'oriental',
  WOODY: 'woody',
  CITRUS: 'citrus',
  GOURMAND: 'gourmand',
  AQUATIC: 'aquatic',
  SPICY: 'spicy',
} as const

export const PERFUME_CATEGORY_LABELS = {
  [PERFUME_CATEGORIES.FRESH]: 'Fresh',
  [PERFUME_CATEGORIES.FLORAL]: 'Floral',
  [PERFUME_CATEGORIES.ORIENTAL]: 'Oriental',
  [PERFUME_CATEGORIES.WOODY]: 'Woody',
  [PERFUME_CATEGORIES.CITRUS]: 'Citrus',
  [PERFUME_CATEGORIES.GOURMAND]: 'Gourmand',
  [PERFUME_CATEGORIES.AQUATIC]: 'Aquatic',
  [PERFUME_CATEGORIES.SPICY]: 'Spicy',
} as const

export const PERFUME_CATEGORY_COLORS = {
  [PERFUME_CATEGORIES.FRESH]: '#10b981',
  [PERFUME_CATEGORIES.FLORAL]: '#ec4899',
  [PERFUME_CATEGORIES.ORIENTAL]: '#f59e0b',
  [PERFUME_CATEGORIES.WOODY]: '#92400e',
  [PERFUME_CATEGORIES.CITRUS]: '#f97316',
  [PERFUME_CATEGORIES.GOURMAND]: '#8b5cf6',
  [PERFUME_CATEGORIES.AQUATIC]: '#06b6d4',
  [PERFUME_CATEGORIES.SPICY]: '#dc2626',
} as const

// Perfume Status
export const PERFUME_STATUS = {
  DRAFT: 'draft',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  IN_PRODUCTION: 'in_production',
  DISCONTINUED: 'discontinued',
} as const

export const PERFUME_STATUS_LABELS = {
  [PERFUME_STATUS.DRAFT]: 'Draft',
  [PERFUME_STATUS.IN_REVIEW]: 'In Review',
  [PERFUME_STATUS.APPROVED]: 'Approved',
  [PERFUME_STATUS.IN_PRODUCTION]: 'In Production',
  [PERFUME_STATUS.DISCONTINUED]: 'Discontinued',
} as const

export const PERFUME_STATUS_COLORS = {
  [PERFUME_STATUS.DRAFT]: '#6b7280',
  [PERFUME_STATUS.IN_REVIEW]: '#f59e0b',
  [PERFUME_STATUS.APPROVED]: '#10b981',
  [PERFUME_STATUS.IN_PRODUCTION]: '#3b82f6',
  [PERFUME_STATUS.DISCONTINUED]: '#ef4444',
} as const

// Project Status
export const PROJECT_STATUS = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.PLANNING]: 'Planning',
  [PROJECT_STATUS.ACTIVE]: 'Active',
  [PROJECT_STATUS.ON_HOLD]: 'On Hold',
  [PROJECT_STATUS.COMPLETED]: 'Completed',
  [PROJECT_STATUS.CANCELLED]: 'Cancelled',
} as const

export const PROJECT_STATUS_COLORS = {
  [PROJECT_STATUS.PLANNING]: '#6b7280',
  [PROJECT_STATUS.ACTIVE]: '#10b981',
  [PROJECT_STATUS.ON_HOLD]: '#f59e0b',
  [PROJECT_STATUS.COMPLETED]: '#3b82f6',
  [PROJECT_STATUS.CANCELLED]: '#ef4444',
} as const

// Case Status
export const CASE_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  PENDING_REVIEW: 'pending_review',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const

export const CASE_STATUS_LABELS = {
  [CASE_STATUS.OPEN]: 'Open',
  [CASE_STATUS.IN_PROGRESS]: 'In Progress',
  [CASE_STATUS.PENDING_REVIEW]: 'Pending Review',
  [CASE_STATUS.RESOLVED]: 'Resolved',
  [CASE_STATUS.CLOSED]: 'Closed',
} as const

export const CASE_STATUS_COLORS = {
  [CASE_STATUS.OPEN]: '#6b7280',
  [CASE_STATUS.IN_PROGRESS]: '#3b82f6',
  [CASE_STATUS.PENDING_REVIEW]: '#f59e0b',
  [CASE_STATUS.RESOLVED]: '#10b981',
  [CASE_STATUS.CLOSED]: '#ef4444',
} as const

// Priority Levels
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const

export const PRIORITY_LABELS = {
  [PRIORITY.LOW]: 'Low',
  [PRIORITY.MEDIUM]: 'Medium',
  [PRIORITY.HIGH]: 'High',
  [PRIORITY.CRITICAL]: 'Critical',
} as const

export const PRIORITY_COLORS = {
  [PRIORITY.LOW]: '#10b981',
  [PRIORITY.MEDIUM]: '#f59e0b',
  [PRIORITY.HIGH]: '#ef4444',
  [PRIORITY.CRITICAL]: '#dc2626',
} as const

// Ingredient Types
export const INGREDIENT_TYPES = {
  ESSENTIAL_OIL: 'essential_oil',
  SYNTHETIC: 'synthetic',
  NATURAL_EXTRACT: 'natural_extract',
  FIXATIVE: 'fixative',
  SOLVENT: 'solvent',
  ADDITIVE: 'additive',
} as const

export const INGREDIENT_TYPE_LABELS = {
  [INGREDIENT_TYPES.ESSENTIAL_OIL]: 'Essential Oil',
  [INGREDIENT_TYPES.SYNTHETIC]: 'Synthetic',
  [INGREDIENT_TYPES.NATURAL_EXTRACT]: 'Natural Extract',
  [INGREDIENT_TYPES.FIXATIVE]: 'Fixative',
  [INGREDIENT_TYPES.SOLVENT]: 'Solvent',
  [INGREDIENT_TYPES.ADDITIVE]: 'Additive',
} as const

// Weight Units
export const WEIGHT_UNITS = {
  MG: 'mg',
  G: 'g',
  KG: 'kg',
  ML: 'ml',
  L: 'l',
} as const

export const WEIGHT_UNIT_LABELS = {
  [WEIGHT_UNITS.MG]: 'Milligrams',
  [WEIGHT_UNITS.G]: 'Grams',
  [WEIGHT_UNITS.KG]: 'Kilograms',
  [WEIGHT_UNITS.ML]: 'Milliliters',
  [WEIGHT_UNITS.L]: 'Liters',
} as const

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const

export const NOTIFICATION_TYPE_LABELS = {
  [NOTIFICATION_TYPES.INFO]: 'Information',
  [NOTIFICATION_TYPES.SUCCESS]: 'Success',
  [NOTIFICATION_TYPES.WARNING]: 'Warning',
  [NOTIFICATION_TYPES.ERROR]: 'Error',
} as const

// Report Types
export const REPORT_TYPES = {
  FORMULA_SUMMARY: 'formula_summary',
  PROJECT_PROGRESS: 'project_progress',
  COST_ANALYSIS: 'cost_analysis',
  INGREDIENT_USAGE: 'ingredient_usage',
  PERFORMANCE_METRICS: 'performance_metrics',
} as const

export const REPORT_TYPE_LABELS = {
  [REPORT_TYPES.FORMULA_SUMMARY]: 'Formula Summary',
  [REPORT_TYPES.PROJECT_PROGRESS]: 'Project Progress',
  [REPORT_TYPES.COST_ANALYSIS]: 'Cost Analysis',
  [REPORT_TYPES.INGREDIENT_USAGE]: 'Ingredient Usage',
  [REPORT_TYPES.PERFORMANCE_METRICS]: 'Performance Metrics',
} as const

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    REGISTER: '/api/auth/register',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  
  // Users
  USERS: {
    LIST: '/api/users',
    CREATE: '/api/users',
    GET: '/api/users/:id',
    UPDATE: '/api/users/:id',
    DELETE: '/api/users/:id',
    PROFILE: '/api/users/profile',
  },
  
  // Perfumes
  PERFUMES: {
    LIST: '/api/perfumes',
    CREATE: '/api/perfumes',
    GET: '/api/perfumes/:id',
    UPDATE: '/api/perfumes/:id',
    DELETE: '/api/perfumes/:id',
    SEARCH: '/api/perfumes/search',
  },
  
  // Formulas
  FORMULAS: {
    LIST: '/api/formulas',
    CREATE: '/api/formulas',
    GET: '/api/formulas/:id',
    UPDATE: '/api/formulas/:id',
    DELETE: '/api/formulas/:id',
    VALIDATE: '/api/formulas/:id/validate',
  },
  
  // Projects
  PROJECTS: {
    LIST: '/api/projects',
    CREATE: '/api/projects',
    GET: '/api/projects/:id',
    UPDATE: '/api/projects/:id',
    DELETE: '/api/projects/:id',
    ASSIGN: '/api/projects/:id/assign',
  },
  
  // Cases
  CASES: {
    LIST: '/api/cases',
    CREATE: '/api/cases',
    GET: '/api/cases/:id',
    UPDATE: '/api/cases/:id',
    DELETE: '/api/cases/:id',
    ASSIGN: '/api/cases/:id/assign',
  },
  
  // Ingredients
  INGREDIENTS: {
    LIST: '/api/ingredients',
    CREATE: '/api/ingredients',
    GET: '/api/ingredients/:id',
    UPDATE: '/api/ingredients/:id',
    DELETE: '/api/ingredients/:id',
    SEARCH: '/api/ingredients/search',
    IMPORT: '/api/ingredients/import',
    VALIDATE: '/api/ingredients/validate',
    EXPORT: '/api/ingredients/export',
    SUPPLIERS: '/api/ingredients/suppliers',
    USAGE: '/api/ingredients/:id/usage',
    STOCK: '/api/ingredients/:id/stock',
    STATISTICS: '/api/ingredients/statistics',
    BATCH: '/api/ingredients/batch',
    SUPPLIER_CODE: '/api/ingredients/supplier-code/:code',
    CAS_NUMBER: '/api/ingredients/cas-number/:number',
    INCI_NAME: '/api/ingredients/inci-name/:name',
    RECOMMENDATIONS: '/api/ingredients/:id/recommendations',
    IMPORT_TEMPLATE: '/api/ingredients/import-template',
  },
  
  // Reports
  REPORTS: {
    LIST: '/api/reports',
    CREATE: '/api/reports',
    GET: '/api/reports/:id',
    GENERATE: '/api/reports/generate',
    DOWNLOAD: '/api/reports/:id/download',
  },
  
  // Files
  FILES: {
    UPLOAD: '/api/files/upload',
    DOWNLOAD: '/api/files/:id/download',
    DELETE: '/api/files/:id',
    LIST: '/api/files',
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    MARK_READ: '/api/notifications/:id/read',
    MARK_ALL_READ: '/api/notifications/read-all',
    DELETE: '/api/notifications/:id',
  },
} as const

// Pega DX API Endpoints
export const PEGA_API_ENDPOINTS = {
  // Authentication
  AUTH: {
    TOKEN: '/oauth/token',
    REFRESH: '/oauth/refresh',
    REVOKE: '/oauth/revoke',
    USERINFO: '/oauth/userinfo',
  },
  
  // Case Management
  CASES: {
    LIST: '/api/v1/cases',
    CREATE: '/api/v1/cases',
    GET: '/api/v1/cases/:id',
    UPDATE: '/api/v1/cases/:id',
    DELETE: '/api/v1/cases/:id',
    ASSIGN: '/api/v1/cases/:id/assign',
    RESOLVE: '/api/v1/cases/:id/resolve',
    COMMENTS: '/api/v1/cases/:id/comments',
    ATTACHMENTS: '/api/v1/cases/:id/attachments',
    HISTORY: '/api/v1/cases/:id/history',
    STATISTICS: '/api/v1/cases/statistics',
    BULK_UPDATE: '/api/v1/cases/bulk-update',
    BULK_ASSIGN: '/api/v1/cases/bulk-assign',
  },
  
  // User Management
  USERS: {
    LIST: '/api/v1/users',
    CREATE: '/api/v1/users',
    GET: '/api/v1/users/:id',
    UPDATE: '/api/v1/users/:id',
    DELETE: '/api/v1/users/:id',
    PROFILE: '/api/v1/users/profile',
    ROLES: '/api/v1/users/:id/roles',
    PERMISSIONS: '/api/v1/users/:id/permissions',
    GROUPS: '/api/v1/users/:id/groups',
    ACTIVATE: '/api/v1/users/:id/activate',
    DEACTIVATE: '/api/v1/users/:id/deactivate',
    RESET_PASSWORD: '/api/v1/users/:id/reset-password',
    CHANGE_PASSWORD: '/api/v1/users/change-password',
    ACTIVITY: '/api/v1/users/:id/activity',
  },
  
  // Data Management
  DATA: {
    PAGES: '/api/v1/data/pages',
    REPORTS: '/api/v1/data/reports',
    ANALYTICS: '/api/v1/data/analytics',
    EXPORT: '/api/v1/data/export',
    IMPORT: '/api/v1/data/import',
    VALIDATE: '/api/v1/data/validate',
    AVAILABLE_PAGES: '/api/v1/data/pages/available',
    REPORT_TYPES: '/api/v1/data/reports/types',
  },
  
  // Workflow Management
  WORKFLOWS: {
    LIST: '/api/v1/workflows',
    START: '/api/v1/workflows/start',
    GET: '/api/v1/workflows/:id',
    UPDATE: '/api/v1/workflows/:id',
    COMPLETE: '/api/v1/workflows/:id/complete',
    CANCEL: '/api/v1/workflows/:id/cancel',
    ASSIGNMENTS: '/api/v1/workflows/:id/assignments',
    HISTORY: '/api/v1/workflows/:id/history',
  },
  
  // Decision Management
  DECISIONS: {
    LIST: '/api/v1/decisions',
    EXECUTE: '/api/v1/decisions/execute',
    GET: '/api/v1/decisions/:id',
    HISTORY: '/api/v1/decisions/:id/history',
    TEST: '/api/v1/decisions/:id/test',
  },
  
  // Integration Management
  INTEGRATIONS: {
    WEBHOOKS: '/api/v1/integrations/webhooks',
    CONNECTORS: '/api/v1/integrations/connectors',
    EVENTS: '/api/v1/integrations/events',
    MAPPINGS: '/api/v1/integrations/mappings',
  },
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.csv', '.xls', '.xlsx'],
} as const

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  SHORT: 'MM/dd/yyyy',
  LONG: 'EEEE, MMMM dd, yyyy',
  TIME: 'HH:mm',
  TIME_WITH_SECONDS: 'HH:mm:ss',
} as const

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 1000,
  NOTES_MAX_LENGTH: 500,
} as const

// Cache Keys
export const CACHE_KEYS = {
  USERS: 'users',
  PERFUMES: 'perfumes',
  FORMULAS: 'formulas',
  PROJECTS: 'projects',
  CASES: 'cases',
  INGREDIENTS: 'ingredients',
  REPORTS: 'reports',
  NOTIFICATIONS: 'notifications',
} as const

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const

// Error Codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  PERFUME_CREATED: 'Perfume created successfully',
  PERFUME_UPDATED: 'Perfume updated successfully',
  PERFUME_DELETED: 'Perfume deleted successfully',
  FORMULA_CREATED: 'Formula created successfully',
  FORMULA_UPDATED: 'Formula updated successfully',
  FORMULA_DELETED: 'Formula deleted successfully',
  PROJECT_CREATED: 'Project created successfully',
  PROJECT_UPDATED: 'Project updated successfully',
  PROJECT_DELETED: 'Project deleted successfully',
  CASE_CREATED: 'Case created successfully',
  CASE_UPDATED: 'Case updated successfully',
  CASE_DELETED: 'Case deleted successfully',
  FILE_UPLOADED: 'File uploaded successfully',
  FILE_DELETED: 'File deleted successfully',
  REPORT_GENERATED: 'Report generated successfully',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  PERFUME_NOT_FOUND: 'Perfume not found',
  FORMULA_NOT_FOUND: 'Formula not found',
  PROJECT_NOT_FOUND: 'Project not found',
  CASE_NOT_FOUND: 'Case not found',
  FILE_NOT_FOUND: 'File not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  EXTERNAL_API_ERROR: 'External API error',
  FILE_UPLOAD_FAILED: 'File upload failed',
  DATABASE_ERROR: 'Database error',
} as const

// Authentication Constants
export const AUTH_CONSTANTS = {
  // Redirect URLs
  LOGIN_REDIRECT: '/',
  LOGOUT_REDIRECT: '/login',
  UNAUTHORIZED_REDIRECT: '/unauthorized',
  FORBIDDEN_REDIRECT: '/forbidden',
  
  // Session Configuration
  SESSION_TIMEOUT: {
    WARNING_TIME: 5, // minutes before expiry to show warning
    MAX_INACTIVE_TIME: 30, // minutes of inactivity before logout
    EXTEND_ON_ACTIVITY: true, // whether to extend session on user activity
  },
  
  // Token Configuration
  TOKEN_REFRESH_THRESHOLD: 5, // minutes before expiry to refresh
  MAX_CONCURRENT_SESSIONS: 3,
  
  // Authentication Features
  ENABLE_SESSION_PERSISTENCE: true,
  ENABLE_CROSS_TAB_SYNC: true,
  ENABLE_ACTIVITY_TRACKING: true,
  
  // Password Requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SYMBOLS: true,
  
  // Account Security
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15, // minutes
  REQUIRE_EMAIL_VERIFICATION: true,
  REQUIRE_TWO_FACTOR: false,
  
  // Remember Me
  REMEMBER_ME_DURATION: 30, // days
  
  // CSRF Protection
  CSRF_TOKEN_LENGTH: 32,
  CSRF_TOKEN_EXPIRY: 3600, // seconds
  
  // Rate Limiting
  LOGIN_RATE_LIMIT: {
    MAX_ATTEMPTS: 5,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  },
  
  // Session Storage Keys
  STORAGE_KEYS: {
    SESSION: 'fragrance_session',
    TOKEN: 'fragrance_token',
    USER: 'fragrance_user',
    PERMISSIONS: 'fragrance_permissions',
    ACTIVITY: 'fragrance_activity',
    CSRF_TOKEN: 'fragrance_csrf',
  },
  
  // Authentication Events
  EVENTS: {
    LOGIN: 'auth.login',
    LOGOUT: 'auth.logout',
    TOKEN_REFRESH: 'auth.token_refresh',
    SESSION_EXPIRE: 'auth.session_expire',
    PERMISSION_DENIED: 'auth.permission_denied',
    PASSWORD_CHANGE: 'auth.password_change',
    PROFILE_UPDATE: 'auth.profile_update',
  },
  
  // Error Codes
  ERROR_CODES: {
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    TOKEN_INVALID: 'TOKEN_INVALID',
    SESSION_EXPIRED: 'SESSION_EXPIRED',
    PERMISSION_DENIED: 'PERMISSION_DENIED',
    NETWORK_ERROR: 'NETWORK_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  },
  
  // Success Messages
  SUCCESS_MESSAGES: {
    LOGIN_SUCCESS: 'Successfully signed in',
    LOGOUT_SUCCESS: 'Successfully signed out',
    PASSWORD_CHANGED: 'Password changed successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    SESSION_EXTENDED: 'Session extended successfully',
  },
} as const

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#0ea5e9',
  SECONDARY: '#d946ef',
  ACCENT: '#f97316',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
  NEUTRAL: '#6b7280',
} as const

// Component Variants
export const COMPONENT_VARIANTS = {
  BUTTON: {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    OUTLINE: 'outline',
    GHOST: 'ghost',
    LINK: 'link',
    DESTRUCTIVE: 'destructive',
  },
  BADGE: {
    DEFAULT: 'default',
    SECONDARY: 'secondary',
    DESTRUCTIVE: 'destructive',
    OUTLINE: 'outline',
    SUCCESS: 'success',
    WARNING: 'warning',
    INFO: 'info',
  },
  INPUT: {
    DEFAULT: 'default',
    ERROR: 'error',
    SUCCESS: 'success',
  },
} as const

// Design System Tokens
export const DESIGN_TOKENS = {
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '2rem',
    '2XL': '3rem',
    '3XL': '4rem',
  },
  BORDER_RADIUS: {
    NONE: '0',
    SM: '0.125rem',
    MD: '0.375rem',
    LG: '0.5rem',
    XL: '0.75rem',
    '2XL': '1rem',
    FULL: '9999px',
  },
  SHADOWS: {
    SM: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    MD: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    LG: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    XL: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  TYPOGRAPHY: {
    FONT_SIZES: {
      XS: '0.75rem',
      SM: '0.875rem',
      BASE: '1rem',
      LG: '1.125rem',
      XL: '1.25rem',
      '2XL': '1.5rem',
      '3XL': '1.875rem',
      '4XL': '2.25rem',
    },
    FONT_WEIGHTS: {
      LIGHT: 300,
      NORMAL: 400,
      MEDIUM: 500,
      SEMIBOLD: 600,
      BOLD: 700,
    },
  },
} as const

// Breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: '150ms',
  NORMAL: '300ms',
  SLOW: '500ms',
} as const

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const

// Layout Constants
export const LAYOUT_CONSTANTS = {
  SIDEBAR_WIDTH: 280,
  SIDEBAR_COLLAPSED_WIDTH: 64,
  HEADER_HEIGHT: 64,
  ACTION_PANEL_HEIGHT: 56,
  BREADCRUMB_HEIGHT: 40,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
} as const

// Navigation Icons Mapping
export const NAVIGATION_ICONS = {
  // Layout & Navigation
  LayoutDashboard: 'LayoutDashboard',
  BarChart3: 'BarChart3',
  TrendingUp: 'TrendingUp',
  FileText: 'FileText',
  Briefcase: 'Briefcase',
  List: 'List',
  User: 'User',
  Users: 'Users',
  Workflow: 'Workflow',
  Settings: 'Settings',
  
  // Case Management
  Beaker: 'Beaker',
  Shield: 'Shield',
  Leaf: 'Leaf',
  PlayCircle: 'PlayCircle',
  FileTemplate: 'FileTemplate',
  Clock: 'Clock',
  Cog: 'Cog',
  Plug: 'Plug',
  
  // Actions
  UserPlus: 'UserPlus',
  RefreshCw: 'RefreshCw',
  CheckCircle: 'CheckCircle',
  XCircle: 'XCircle',
  MessageSquare: 'MessageSquare',
  Paperclip: 'Paperclip',
  History: 'History',
  Copy: 'Copy',
  Trash2: 'Trash2',
  
  // UI Elements
  ChevronRight: 'ChevronRight',
  ChevronDown: 'ChevronDown',
  Menu: 'Menu',
  X: 'X',
  Search: 'Search',
  Filter: 'Filter',
  MoreHorizontal: 'MoreHorizontal',
  Plus: 'Plus',
  Edit: 'Edit',
  Eye: 'Eye',
  Download: 'Download',
  Upload: 'Upload',
} as const

// Action Types
export const ACTION_TYPES = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
  GHOST: 'ghost',
  DESTRUCTIVE: 'destructive',
} as const

// Ingredient Management Constants
export const INGREDIENT_EXPORT_FIELDS = [
  'name',
  'type',
  'category',
  'supplier',
  'supplierCode',
  'cost',
  'currency',
  'stockLevel',
  'minStockLevel',
  'maxStockLevel',
  'unit',
  'casNumber',
  'inciName',
  'einECSNumber',
  'description',
  'notes',
  'tags',
  'isActive',
  'createdAt',
  'updatedAt',
] as const

export const INGREDIENT_IMPORT_RULES = {
  REQUIRED_FIELDS: ['name', 'type', 'supplier', 'cost', 'stockLevel', 'unit'],
  OPTIONAL_FIELDS: ['category', 'supplierCode', 'currency', 'minStockLevel', 'casNumber', 'inciName', 'description', 'notes', 'tags'],
  VALIDATION_RULES: {
    name: { minLength: 2, maxLength: 100 },
    supplier: { minLength: 2, maxLength: 100 },
    cost: { min: 0 },
    stockLevel: { min: 0 },
    minStockLevel: { min: 0 },
  },
  SUPPORTED_TYPES: ['essential_oil', 'synthetic', 'natural_extract', 'fixative', 'solvent', 'additive'],
  SUPPORTED_UNITS: ['mg', 'g', 'kg', 'ml', 'l'],
  SUPPORTED_CURRENCIES: ['USD', 'EUR', 'GBP'],
} as const

export const INGREDIENT_ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  IMPORT: 'import',
  EXPORT: 'export',
  UPDATE_STOCK: 'update_stock',
  BULK_DELETE: 'bulk_delete',
  BULK_UPDATE: 'bulk_update',
  BULK_TOGGLE_ACTIVE: 'bulk_toggle_active',
  SEARCH: 'search',
  FILTER: 'filter',
  SORT: 'sort',
} as const

export const INGREDIENT_PERMISSIONS = {
  VIEW: 'ingredients:view',
  CREATE: 'ingredients:create',
  UPDATE: 'ingredients:update',
  DELETE: 'ingredients:delete',
  IMPORT: 'ingredients:import',
  EXPORT: 'ingredients:export',
  MANAGE_STOCK: 'ingredients:manage_stock',
  BULK_OPERATIONS: 'ingredients:bulk_operations',
} as const
