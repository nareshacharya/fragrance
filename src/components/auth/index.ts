// Authentication components
export { LoginForm, LoginFormWithLoading, CompactLoginForm } from './login-form'
export { LogoutButton, SimpleLogoutButton, LogoutIconButton, LogoutLink, LogoutButtonWithMessage } from './logout-button'
export { 
  ProtectedRoute, 
  withProtectedRoute,
  RoleProtectedRoute,
  PermissionProtectedRoute,
  AdminProtectedRoute,
  LabManagerProtectedRoute,
  ProjectManagerProtectedRoute
} from './protected-route'
export { 
  UserProfile, 
  CompactUserProfile, 
  UserProfileSummary, 
  EditableUserProfile 
} from './user-profile'
export { 
  AuthStatus, 
  CompactAuthStatus, 
  DetailedAuthStatus, 
  AuthStatusBadge, 
  SessionTimer, 
  UserRoleIndicator 
} from './auth-status'
export { 
  RoleGuard, 
  PermissionGuard,
  AdminGuard,
  LabManagerGuard,
  ProjectManagerGuard,
  PaletteManagerGuard,
  PerfumerGuard,
  UserManagementGuard,
  PerfumeManagementGuard,
  FormulaManagementGuard,
  ProjectManagementGuard,
  CaseManagementGuard,
  IngredientManagementGuard,
  ReportManagementGuard,
  SystemAdminGuard,
  withRoleGuard,
  withPermissionGuard
} from './role-guard'

// Re-export types
export type {
  LoginFormProps,
  LogoutButtonProps,
  ProtectedRouteProps,
  UserProfileProps,
  AuthStatusProps,
  RoleGuardProps
} from '@/lib/auth'
