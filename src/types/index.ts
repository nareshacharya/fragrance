/**
 * Common TypeScript interfaces and types for the Fragrance Management System
 */

// User and Authentication Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: UserRole
  department: Department
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export type UserRole = 'administrator' | 'lab_manager' | 'project_manager' | 'palette_manager' | 'perfumer'

export type Department = 'research' | 'development' | 'quality' | 'marketing' | 'sales' | 'management'

// Authentication Types - Import from auth system
export type {
  AuthState,
  User as AuthUser,
  Permission,
  Role,
  Session,
  AuthCredentials,
  AuthResponse,
  LoginFormState,
  UserProfileUpdate,
  PasswordChange,
  AuthContextType,
  PermissionCheck,
  RouteProtection,
  ComponentProtection,
  AuthError,
  SessionTimeoutConfig,
  UserActivityEvent,
  UseAuthReturn,
  UseUserReturn,
  UsePermissionsReturn,
  UseSessionReturn,
  UserRole as AuthUserRole,
  PermissionAction,
  PermissionResource,
  AuthEventType,
  AuthEvent,
  AuthMiddlewareContext,
  ProtectedRouteProps,
  RoleGuardProps,
  PermissionGuardProps,
  AuthStatusProps,
  UserProfileProps,
  LoginFormProps,
  LogoutButtonProps,
  TokenData,
  UserInfo
} from '@/lib/auth'

// Perfume and Formula Types
export interface Perfume {
  id: string
  name: string
  description: string
  category: PerfumeCategory
  status: PerfumeStatus
  formula: Formula
  notes: string[]
  tags: string[]
  createdBy: string
  createdAt: string
  updatedAt: string
  version: number
}

export type PerfumeCategory = 
  | 'fresh' 
  | 'floral' 
  | 'oriental' 
  | 'woody' 
  | 'citrus' 
  | 'gourmand' 
  | 'aquatic' 
  | 'spicy'

export type PerfumeStatus = 
  | 'draft' 
  | 'in_review' 
  | 'approved' 
  | 'in_production' 
  | 'discontinued'

export interface Formula {
  id: string
  name: string
  ingredients: FormulaIngredient[]
  totalWeight: number
  concentration: number
  ph: number
  alcoholContent: number
  notes: string
  createdAt: string
  updatedAt: string
}

export interface FormulaIngredient {
  id: string
  name: string
  type: IngredientType
  concentration: number
  weight: number
  unit: WeightUnit
  supplier: string
  cost: number
  notes?: string
}

export type IngredientType = 
  | 'essential_oil' 
  | 'synthetic' 
  | 'natural_extract' 
  | 'fixative' 
  | 'solvent' 
  | 'additive'

export type WeightUnit = 'mg' | 'g' | 'kg' | 'ml' | 'l'

// Project and Case Management Types
export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  priority: Priority
  assignedTo: string[]
  perfumes: string[]
  startDate: string
  endDate?: string
  budget: number
  progress: number
  createdAt: string
  updatedAt: string
}

export type ProjectStatus = 
  | 'planning' 
  | 'active' 
  | 'on_hold' 
  | 'completed' 
  | 'cancelled'

export type Priority = 'low' | 'medium' | 'high' | 'critical'

export interface Case {
  id: string
  title: string
  description: string
  status: CaseStatus
  priority: Priority
  assignedTo: string
  projectId?: string
  perfumeId?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export type CaseStatus = 
  | 'open' 
  | 'in_progress' 
  | 'pending_review' 
  | 'resolved' 
  | 'closed'

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: string
}

// Form and Input Types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file'
  required: boolean
  placeholder?: string
  options?: SelectOption[]
  validation?: ValidationRule[]
}

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'url'
  value?: any
  message: string
}

// Search and Filter Types
export interface SearchParams {
  query?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
}

export interface FilterOption {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'number' | 'boolean'
  options?: SelectOption[]
}

// Notification Types
export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  userId: string
  createdAt: string
  actionUrl?: string
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

// File Upload Types
export interface FileUpload {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
  uploadedBy: string
}

export interface UploadProgress {
  fileId: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
}

// Analytics and Reporting Types
export interface AnalyticsData {
  period: string
  metrics: Record<string, number>
  trends: TrendData[]
}

export interface TrendData {
  date: string
  value: number
  label?: string
}

export interface Report {
  id: string
  name: string
  type: ReportType
  parameters: Record<string, any>
  generatedAt: string
  generatedBy: string
  fileUrl?: string
}

export type ReportType = 
  | 'formula_summary' 
  | 'project_progress' 
  | 'cost_analysis' 
  | 'ingredient_usage' 
  | 'performance_metrics'

// Configuration Types
export interface AppConfig {
  features: FeatureFlags
  limits: SystemLimits
  integrations: IntegrationConfig
}

export interface FeatureFlags {
  pegaIntegration: boolean
  advancedAnalytics: boolean
  realTimeUpdates: boolean
  fileUpload: boolean
  notifications: boolean
}

export interface SystemLimits {
  maxFileSize: number
  maxFilesPerUpload: number
  maxFormulasPerProject: number
  maxUsersPerDepartment: number
}

export interface IntegrationConfig {
  pega: PegaConfig
  email: EmailConfig
  storage: StorageConfig
}

export interface PegaConfig {
  apiUrl: string
  apiKey: string
  clientId: string
  clientSecret: string
  enabled: boolean
}

export interface EmailConfig {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPass: string
  fromAddress: string
  enabled: boolean
}

export interface StorageConfig {
  provider: 'local' | 'aws' | 'azure' | 'gcp'
  bucket: string
  region: string
  accessKey?: string
  secretKey?: string
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type NonNullable<T> = T extends null | undefined ? never : T

// Event Types
export interface BaseEvent {
  id: string
  type: string
  timestamp: string
  userId?: string
}

export interface PerfumeEvent extends BaseEvent {
  type: 'perfume.created' | 'perfume.updated' | 'perfume.deleted'
  perfumeId: string
  data: Partial<Perfume>
}

export interface ProjectEvent extends BaseEvent {
  type: 'project.created' | 'project.updated' | 'project.completed'
  projectId: string
  data: Partial<Project>
}

export interface UserEvent extends BaseEvent {
  type: 'user.login' | 'user.logout' | 'user.created' | 'user.updated'
  userId: string
  data: Partial<User>
}

export type SystemEvent = PerfumeEvent | ProjectEvent | UserEvent

// Navigation Types - Import from navigation.ts
export type {
  NavigationItem,
  ModuleConfig,
  CaseAction,
  ActionCondition,
  BreadcrumbItem,
  LayoutConfig,
  NavigationState,
  SidebarState,
  CaseManagementContext,
  NavigationProviderProps,
  CaseManagementLayoutProps,
  NavigationSidebarProps,
  NavigationMenuProps,
  NavigationHeaderProps,
  ActionPanelProps,
  CaseStatusProps,
  QuickActionsProps,
  BreadcrumbProps,
  UseNavigationReturn,
  UseSidebarStateReturn,
  UseBreadcrumbsReturn,
  RouteMatch,
  NavigationPermissionCheck,
  NavigationEvent,
  LayoutPreset,
  ResponsiveConfig,
  NavigationAnimationConfig,
  NavigationAccessibilityConfig,
  NavigationThemeConfig,
  NavigationConfig,
} from './navigation'

// Theme Types - Import from theme.ts
export type {
  ThemeMode,
  ThemeConfig,
  ThemeColors,
  Typography,
  SpacingScale,
  BorderRadius,
  Shadows,
  Animations,
  ButtonVariant,
  ButtonSize,
  BadgeVariant,
  BadgeSize,
  InputVariant,
  InputSize,
  ThemeContextType,
  ThemeProviderProps,
  UseThemeReturn,
  ThemeCustomization,
} from './theme'

// API Types - Import from api.ts
export type {
  AuthToken,
  ApiRequestMetadata,
  ApiResponseMetadata,
  PaginationRequest,
  PaginationResponse,
  SearchRequest,
  FilterCondition,
  SortCondition,
  ApiErrorDetails,
  ValidationError as ApiValidationError,
  ApiResponse as ApiResponseType,
  PaginatedApiResponse,
  FileUploadResponse,
  BulkOperationResult,
  ApiHealthCheck,
  ApiMetrics,
  WebhookPayload,
  WebhookSubscription,
  ApiRateLimit,
  ApiClientInstance,
  ServiceMethod,
  CrudServiceInterface,
  AuthServiceInterface,
  CaseServiceInterface,
  UserServiceInterface,
  DataServiceInterface,
  WorkflowServiceInterface,
  ApiServiceRegistry,
  ApiMiddleware,
  ApiPlugin,
  ApiEvent,
  ApiEventListener,
  ApiCache,
  ApiRetryConfig,
  ApiTimeoutConfig,
  ApiLoggingConfig,
} from './api'

// Ingredient Types - Import from ingredient.ts with explicit names
export type {
  Ingredient as InventoryIngredient,
  CreateIngredientRequest,
  UpdateIngredientRequest,
  IngredientSearchParams,
  IngredientImportData,
  IngredientExportOptions,
  IngredientStockUpdate,
  IngredientSupplier,
  IngredientUsage,
  IngredientBatchOperation,
  IngredientValidationResult,
  IngredientImportResult,
  IngredientStatistics,
  STOCK_STATUS,
  STOCK_STATUS_LABELS,
  STOCK_STATUS_COLORS,
  INGREDIENT_CATEGORIES,
  INGREDIENT_CATEGORY_LABELS,
  INGREDIENT_CATEGORY_COLORS,
} from './ingredient'

// Accessibility Types - Import from accessibility.ts
export type {
  AnnouncementPriority,
  NavigationOrientation,
  ValidationType,
  FocusTrapOptions,
  KeyboardNavigationOptions,
  KeyboardHandler,
  ArrowNavigationOptions,
  AnnouncementOptions,
  LiveRegionOptions,
  AccessibilityTestOptions,
  KeyboardNavigationTestOptions,
  ScreenReaderTestOptions,
  AccessibleFormOptions,
  AccessibilityState,
  SkipLink,
  AccessibilityComponentProps,
  ModalAccessibilityProps,
  DropdownAccessibilityProps,
  FormFieldAccessibilityProps,
  LoadingAccessibilityProps,
  NavigationAccessibilityProps,
  AriaAttributes,
  KeyboardShortcut,
  FocusManager,
  AccessibilityConfig,
  AccessibilityViolation,
  AccessibilityTestResult,
  UseAnnouncementReturn,
  UseFocusTrapReturn,
  UseKeyboardNavigationReturn,
  UseArrowNavigationReturn,
  UseModalKeyboardNavigationReturn,
  UseLiveRegionReturn,
  UseAccessibleFormReturn,
  UseAccessibilityStateReturn,
  UseSkipLinksReturn,
} from './accessibility'

// Error Types
export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface BusinessError {
  code: string
  message: string
  details?: Record<string, any>
}

// Status Types
export interface Status {
  id: string
  name: string
  color: string
  description?: string
}

// Audit Types
export interface AuditLog {
  id: string
  action: string
  entityType: string
  entityId: string
  userId: string
  changes: Record<string, any>
  timestamp: string
  ipAddress?: string
  userAgent?: string
}

// Configuration Types - Import from config
export type {
  FeatureConfigs,
  FeatureName,
  Environment,
  ValidationResult as ConfigValidationResult,
  ValidationError as ConfigValidationError,
  ConfigLoadOptions,
  ConfigCacheInfo as ConfigCacheOptions,
  ConfigChangeEvent,
  HealthCheckResult,
  FeatureFlag,
} from '@/config'

// Individual feature config types - Import from features
export type {
  AuthConfig,
  ApiConfig,
  DatabaseConfig,
  UiConfig,
  IngredientsConfig,
  CaseManagementConfig,
  MonitoringConfig,
  SecurityConfig,
  FilesConfig,
  NotificationsConfig,
  FeatureFlagsConfig,
  DevToolsConfig,
} from '@/config/features'
