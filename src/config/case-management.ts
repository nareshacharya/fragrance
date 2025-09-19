/**
 * Case Management Layout Configuration System
 */

import { 
  USER_ROLES, 
  CASE_STATUS, 
  PRIORITY,
  PEGA_API_ENDPOINTS,
  BREAKPOINTS,
  ANIMATION_DURATIONS,
  Z_INDEX,
  DESIGN_TOKENS,
  LAYOUT_CONSTANTS,
  NAVIGATION_ICONS,
  ACTION_TYPES,
  INGREDIENT_PERMISSIONS
} from './constants'

import type { 
  ModuleConfig, 
  NavigationItem, 
  CaseAction, 
  LayoutConfig,
  ActionCondition,
  LayoutPreset,
  ResponsiveConfig,
  NavigationAnimationConfig,
  NavigationAccessibilityConfig,
  NavigationThemeConfig
} from '@/types/navigation'

// Case Types Configuration
export const CASE_TYPES = {
  FORMULA_REVIEW: 'formula_review',
  INGREDIENT_APPROVAL: 'ingredient_approval',
  QUALITY_CONTROL: 'quality_control',
  PROJECT_ASSIGNMENT: 'project_assignment',
  COST_ANALYSIS: 'cost_analysis',
  COMPLIANCE_CHECK: 'compliance_check',
  SUPPLIER_APPROVAL: 'supplier_approval',
  BATCH_PROCESSING: 'batch_processing',
} as const

export const CASE_TYPE_LABELS = {
  [CASE_TYPES.FORMULA_REVIEW]: 'Formula Review',
  [CASE_TYPES.INGREDIENT_APPROVAL]: 'Ingredient Approval',
  [CASE_TYPES.QUALITY_CONTROL]: 'Quality Control',
  [CASE_TYPES.PROJECT_ASSIGNMENT]: 'Project Assignment',
  [CASE_TYPES.COST_ANALYSIS]: 'Cost Analysis',
  [CASE_TYPES.COMPLIANCE_CHECK]: 'Compliance Check',
  [CASE_TYPES.SUPPLIER_APPROVAL]: 'Supplier Approval',
  [CASE_TYPES.BATCH_PROCESSING]: 'Batch Processing',
} as const

// Case Modules Configuration
export const CASE_MODULES = {
  DASHBOARD: {
    id: 'dashboard',
    name: 'Dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    description: 'Overview and analytics',
    color: '#3b82f6',
    order: 1,
    permissions: ['cases:read'],
    roles: Object.values(USER_ROLES),
    items: [
      {
        id: 'overview',
        label: 'Overview',
        href: '/case-management',
        icon: 'BarChart3',
        order: 1,
      },
      {
        id: 'analytics',
        label: 'Analytics',
        href: '/case-management/analytics',
        icon: 'TrendingUp',
        order: 2,
      },
      {
        id: 'reports',
        label: 'Reports',
        href: '/case-management/reports',
        icon: 'FileText',
        order: 3,
      },
    ],
    collapsible: false,
    defaultExpanded: true,
  },
  CASE_MANAGEMENT: {
    id: 'case_management',
    name: 'Case Management',
    label: 'Cases',
    icon: 'Briefcase',
    description: 'Manage all case types',
    color: '#10b981',
    order: 2,
    permissions: ['cases:read'],
    roles: Object.values(USER_ROLES),
    items: [
      {
        id: 'all_cases',
        label: 'All Cases',
        href: '/case-management/cases',
        icon: 'List',
        order: 1,
      },
      {
        id: 'my_cases',
        label: 'My Cases',
        href: '/case-management/cases/my',
        icon: 'User',
        order: 2,
      },
      {
        id: 'assigned_cases',
        label: 'Assigned Cases',
        href: '/case-management/cases/assigned',
        icon: 'Users',
        order: 3,
      },
      {
        id: 'formula_review',
        label: 'Formula Review',
        href: '/case-management/cases/formula-review',
        icon: 'Beaker',
        order: 4,
        permissions: ['formulas:read'],
        roles: [USER_ROLES.LAB_MANAGER, USER_ROLES.PROJECT_MANAGER, USER_ROLES.PERFUMER],
      },
      {
        id: 'quality_control',
        label: 'Quality Control',
        href: '/case-management/cases/quality-control',
        icon: 'Shield',
        order: 5,
        permissions: ['quality:read'],
        roles: [USER_ROLES.LAB_MANAGER, USER_ROLES.PALETTE_MANAGER],
      },
      {
        id: 'ingredient_approval',
        label: 'Ingredient Approval',
        href: '/case-management/cases/ingredient-approval',
        icon: 'Leaf',
        order: 6,
        permissions: ['ingredients:read'],
        roles: [USER_ROLES.LAB_MANAGER, USER_ROLES.PALETTE_MANAGER],
      },
    ],
    collapsible: true,
    defaultExpanded: true,
  },
  WORKFLOWS: {
    id: 'workflows',
    name: 'Workflows',
    label: 'Workflows',
    icon: 'Workflow',
    description: 'Process automation and workflows',
    color: '#8b5cf6',
    order: 3,
    permissions: ['workflows:read'],
    roles: [USER_ROLES.ADMINISTRATOR, USER_ROLES.LAB_MANAGER, USER_ROLES.PROJECT_MANAGER],
    items: [
      {
        id: 'active_workflows',
        label: 'Active Workflows',
        href: '/case-management/workflows',
        icon: 'PlayCircle',
        order: 1,
      },
      {
        id: 'workflow_templates',
        label: 'Templates',
        href: '/case-management/workflows/templates',
        icon: 'FileTemplate',
        order: 2,
      },
      {
        id: 'workflow_history',
        label: 'History',
        href: '/case-management/workflows/history',
        icon: 'Clock',
        order: 3,
      },
    ],
    collapsible: true,
    defaultExpanded: false,
  },
  INGREDIENT_MANAGEMENT: {
    id: 'ingredient_management',
    name: 'Ingredient Management',
    label: 'Ingredients',
    icon: 'Leaf',
    description: 'Manage fragrance ingredients and suppliers',
    color: '#10b981',
    order: 4,
    permissions: [INGREDIENT_PERMISSIONS.VIEW],
    roles: [USER_ROLES.ADMINISTRATOR, USER_ROLES.LAB_MANAGER, USER_ROLES.PALETTE_MANAGER, USER_ROLES.PERFUMER],
    items: [
      {
        id: 'all_ingredients',
        label: 'All Ingredients',
        href: '/ingredients',
        icon: 'List',
        order: 1,
        permissions: [INGREDIENT_PERMISSIONS.VIEW],
      },
      {
        id: 'create_ingredient',
        label: 'Add Ingredient',
        href: '/ingredients/create',
        icon: 'Plus',
        order: 2,
        permissions: [INGREDIENT_PERMISSIONS.CREATE],
      },
      {
        id: 'import_ingredients',
        label: 'Import',
        href: '/ingredients/import',
        icon: 'Upload',
        order: 3,
        permissions: [INGREDIENT_PERMISSIONS.IMPORT],
      },
      {
        id: 'export_ingredients',
        label: 'Export',
        href: '/ingredients/export',
        icon: 'Download',
        order: 4,
        permissions: [INGREDIENT_PERMISSIONS.EXPORT],
      },
      {
        id: 'suppliers',
        label: 'Suppliers',
        href: '/ingredients/suppliers',
        icon: 'Truck',
        order: 5,
        permissions: [INGREDIENT_PERMISSIONS.VIEW],
      },
      {
        id: 'stock_management',
        label: 'Stock Management',
        href: '/ingredients/stock',
        icon: 'Package',
        order: 6,
        permissions: [INGREDIENT_PERMISSIONS.MANAGE_STOCK],
      },
    ],
    collapsible: true,
    defaultExpanded: true,
  },
  ADMINISTRATION: {
    id: 'administration',
    name: 'Administration',
    label: 'Admin',
    icon: 'Settings',
    description: 'System administration and configuration',
    color: '#f59e0b',
    order: 5,
    permissions: ['admin:read'],
    roles: [USER_ROLES.ADMINISTRATOR],
    items: [
      {
        id: 'users',
        label: 'Users',
        href: '/case-management/admin/users',
        icon: 'Users',
        order: 1,
      },
      {
        id: 'roles',
        label: 'Roles & Permissions',
        href: '/case-management/admin/roles',
        icon: 'Shield',
        order: 2,
      },
      {
        id: 'settings',
        label: 'Settings',
        href: '/case-management/admin/settings',
        icon: 'Cog',
        order: 3,
      },
      {
        id: 'integrations',
        label: 'Integrations',
        href: '/case-management/admin/integrations',
        icon: 'Plug',
        order: 4,
      },
    ],
    collapsible: true,
    defaultExpanded: false,
  },
} as const

// Case Actions Configuration
export const CASE_ACTIONS = {
  // Primary Actions
  ASSIGN: {
    id: 'assign',
    label: 'Assign',
    description: 'Assign case to team member',
    icon: 'UserPlus',
    variant: 'primary' as const,
    permissions: ['cases:assign'],
    roles: [USER_ROLES.ADMINISTRATOR, USER_ROLES.LAB_MANAGER, USER_ROLES.PROJECT_MANAGER],
    conditions: [
      {
        field: 'status',
        operator: 'in',
        value: [CASE_STATUS.OPEN, CASE_STATUS.PENDING_REVIEW],
      },
    ],
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to assign this case?',
    bulkAction: true,
  },
  UPDATE_STATUS: {
    id: 'update_status',
    label: 'Update Status',
    description: 'Change case status',
    icon: 'RefreshCw',
    variant: 'primary' as const,
    permissions: ['cases:update'],
    roles: Object.values(USER_ROLES),
    conditions: [
      {
        field: 'status',
        operator: 'not_equals',
        value: CASE_STATUS.CLOSED,
      },
    ],
  },
  RESOLVE: {
    id: 'resolve',
    label: 'Resolve',
    description: 'Mark case as resolved',
    icon: 'CheckCircle',
    variant: 'primary' as const,
    permissions: ['cases:resolve'],
    roles: [USER_ROLES.ADMINISTRATOR, USER_ROLES.LAB_MANAGER, USER_ROLES.PROJECT_MANAGER],
    conditions: [
      {
        field: 'status',
        operator: 'in',
        value: [CASE_STATUS.IN_PROGRESS, CASE_STATUS.PENDING_REVIEW],
      },
    ],
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to resolve this case?',
  },
  CLOSE: {
    id: 'close',
    label: 'Close',
    description: 'Close the case',
    icon: 'XCircle',
    variant: 'primary' as const,
    permissions: ['cases:close'],
    roles: [USER_ROLES.ADMINISTRATOR, USER_ROLES.LAB_MANAGER],
    conditions: [
      {
        field: 'status',
        operator: 'equals',
        value: CASE_STATUS.RESOLVED,
      },
    ],
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to close this case? This action cannot be undone.',
  },

  // Secondary Actions
  ADD_COMMENT: {
    id: 'add_comment',
    label: 'Add Comment',
    description: 'Add a comment to the case',
    icon: 'MessageSquare',
    variant: 'secondary' as const,
    permissions: ['cases:comment'],
    roles: Object.values(USER_ROLES),
  },
  ATTACH_FILE: {
    id: 'attach_file',
    label: 'Attach File',
    description: 'Upload files to the case',
    icon: 'Paperclip',
    variant: 'secondary' as const,
    permissions: ['cases:attach'],
    roles: Object.values(USER_ROLES),
  },
  VIEW_HISTORY: {
    id: 'view_history',
    label: 'View History',
    description: 'View case history and audit trail',
    icon: 'History',
    variant: 'secondary' as const,
    permissions: ['cases:read'],
    roles: Object.values(USER_ROLES),
  },
  DUPLICATE: {
    id: 'duplicate',
    label: 'Duplicate',
    description: 'Create a copy of this case',
    icon: 'Copy',
    variant: 'secondary' as const,
    permissions: ['cases:create'],
    roles: [USER_ROLES.ADMINISTRATOR, USER_ROLES.LAB_MANAGER, USER_ROLES.PROJECT_MANAGER],
  },

  // Bulk Actions
  BULK_ASSIGN: {
    id: 'bulk_assign',
    label: 'Bulk Assign',
    description: 'Assign multiple cases',
    icon: 'Users',
    variant: 'outline' as const,
    permissions: ['cases:assign'],
    roles: [USER_ROLES.ADMINISTRATOR, USER_ROLES.LAB_MANAGER, USER_ROLES.PROJECT_MANAGER],
    bulkAction: true,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to assign the selected cases?',
  },
  BULK_UPDATE_STATUS: {
    id: 'bulk_update_status',
    label: 'Bulk Update Status',
    description: 'Update status of multiple cases',
    icon: 'RefreshCw',
    variant: 'outline' as const,
    permissions: ['cases:update'],
    roles: [USER_ROLES.ADMINISTRATOR, USER_ROLES.LAB_MANAGER, USER_ROLES.PROJECT_MANAGER],
    bulkAction: true,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to update the status of selected cases?',
  },
  BULK_DELETE: {
    id: 'bulk_delete',
    label: 'Bulk Delete',
    description: 'Delete multiple cases',
    icon: 'Trash2',
    variant: 'destructive' as const,
    permissions: ['cases:delete'],
    roles: [USER_ROLES.ADMINISTRATOR, USER_ROLES.LAB_MANAGER],
    bulkAction: true,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to delete the selected cases? This action cannot be undone.',
  },

  // Destructive Actions
  DELETE: {
    id: 'delete',
    label: 'Delete',
    description: 'Delete this case',
    icon: 'Trash2',
    variant: 'destructive' as const,
    permissions: ['cases:delete'],
    roles: [USER_ROLES.ADMINISTRATOR, USER_ROLES.LAB_MANAGER],
    conditions: [
      {
        field: 'status',
        operator: 'equals',
        value: CASE_STATUS.CLOSED,
      },
    ],
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to delete this case? This action cannot be undone.',
  },
} as const

// Module Navigation Configuration
export const MODULE_NAVIGATION: Record<string, ModuleConfig> = CASE_MODULES

// Layout Configuration
export const LAYOUT_CONFIG: LayoutConfig = {
  sidebar: {
    collapsed: false,
    width: 280,
    collapsedWidth: 64,
    defaultCollapsed: false,
    collapsible: true,
  },
  header: {
    height: 64,
    showBreadcrumbs: true,
    showUserMenu: true,
    showNotifications: true,
  },
  actionPanel: {
    visible: true,
    position: 'top',
    collapsible: true,
    defaultCollapsed: false,
  },
  responsive: {
    mobileBreakpoint: BREAKPOINTS.SM,
    tabletBreakpoint: BREAKPOINTS.MD,
    desktopBreakpoint: BREAKPOINTS.LG,
  },
}


// Layout Presets
export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: 'default',
    name: 'Default Layout',
    description: 'Standard layout for all users',
    config: LAYOUT_CONFIG,
    applicableRoles: Object.values(USER_ROLES),
  },
  {
    id: 'administrator',
    name: 'Administrator Layout',
    description: 'Full-featured layout for administrators',
    config: {
      ...LAYOUT_CONFIG,
      sidebar: {
        ...LAYOUT_CONFIG.sidebar,
        defaultCollapsed: false,
      },
      actionPanel: {
        ...LAYOUT_CONFIG.actionPanel,
        visible: true,
      },
    },
    applicableRoles: [USER_ROLES.ADMINISTRATOR],
  },
  {
    id: 'manager',
    name: 'Manager Layout',
    description: 'Optimized layout for managers',
    config: {
      ...LAYOUT_CONFIG,
      sidebar: {
        ...LAYOUT_CONFIG.sidebar,
        defaultCollapsed: true,
      },
      actionPanel: {
        ...LAYOUT_CONFIG.actionPanel,
        position: 'floating',
      },
    },
    applicableRoles: [USER_ROLES.LAB_MANAGER, USER_ROLES.PROJECT_MANAGER],
  },
  {
    id: 'perfumer',
    name: 'Perfumer Layout',
    description: 'Focused layout for perfumers',
    config: {
      ...LAYOUT_CONFIG,
      sidebar: {
        ...LAYOUT_CONFIG.sidebar,
        width: 240,
      },
      actionPanel: {
        ...LAYOUT_CONFIG.actionPanel,
        visible: false,
      },
    },
    applicableRoles: [USER_ROLES.PERFUMER, USER_ROLES.PALETTE_MANAGER],
  },
  {
    id: 'mobile',
    name: 'Mobile Layout',
    description: 'Mobile-optimized layout',
    config: {
      ...LAYOUT_CONFIG,
      sidebar: {
        ...LAYOUT_CONFIG.sidebar,
        collapsed: true,
        width: 0,
        collapsedWidth: 0,
      },
      header: {
        ...LAYOUT_CONFIG.header,
        height: 56,
      },
      actionPanel: {
        ...LAYOUT_CONFIG.actionPanel,
        position: 'bottom',
      },
    },
    applicableRoles: Object.values(USER_ROLES),
  },
]

// Responsive Configuration
export const RESPONSIVE_CONFIG: ResponsiveConfig = {
  mobile: {
    breakpoint: BREAKPOINTS.SM,
    sidebarCollapsed: true,
    showActionPanel: true,
  },
  tablet: {
    breakpoint: BREAKPOINTS.MD,
    sidebarCollapsed: true,
    showActionPanel: true,
  },
  desktop: {
    breakpoint: BREAKPOINTS.LG,
    sidebarCollapsed: false,
    showActionPanel: true,
  },
}

// Animation Configuration
export const ANIMATION_CONFIG: NavigationAnimationConfig = {
  sidebar: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    properties: ['width', 'transform', 'opacity'],
  },
  breadcrumb: {
    duration: 200,
    easing: 'ease-in-out',
    properties: ['opacity', 'transform'],
  },
  actionPanel: {
    duration: 250,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    properties: ['height', 'opacity', 'transform'],
  },
}

// Accessibility Configuration
export const ACCESSIBILITY_CONFIG: NavigationAccessibilityConfig = {
  skipLinks: true,
  keyboardNavigation: true,
  screenReaderSupport: true,
  focusManagement: true,
  ariaLabels: {
    sidebar: 'Main navigation',
    breadcrumb: 'Breadcrumb navigation',
    actionPanel: 'Case actions',
    menuToggle: 'Toggle navigation menu',
    userMenu: 'User account menu',
  },
}

// Theme Configuration
export const THEME_CONFIG: NavigationThemeConfig = {
  colors: {
    primary: '#0ea5e9',
    secondary: '#64748b',
    background: '#ffffff',
    text: '#0f172a',
    border: '#e2e8f0',
    hover: '#f1f5f9',
    active: '#e0f2fe',
    disabled: '#94a3b8',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '1.5',
  },
  spacing: {
    padding: DESIGN_TOKENS.SPACING.MD,
    margin: DESIGN_TOKENS.SPACING.SM,
    gap: DESIGN_TOKENS.SPACING.SM,
  },
  borderRadius: DESIGN_TOKENS.BORDER_RADIUS.MD,
  shadows: [DESIGN_TOKENS.SHADOWS.SM, DESIGN_TOKENS.SHADOWS.MD],
}

// Breadcrumb Templates
export const BREADCRUMB_TEMPLATES = {
  '/case-management': [
    { label: 'Case Management', href: '/case-management', current: true },
  ],
  '/case-management/cases': [
    { label: 'Case Management', href: '/case-management' },
    { label: 'All Cases', href: '/case-management/cases', current: true },
  ],
  '/case-management/cases/formula-review': [
    { label: 'Case Management', href: '/case-management' },
    { label: 'Cases', href: '/case-management/cases' },
    { label: 'Formula Review', href: '/case-management/cases/formula-review', current: true },
  ],
  '/case-management/workflows': [
    { label: 'Case Management', href: '/case-management' },
    { label: 'Workflows', href: '/case-management/workflows', current: true },
  ],
  '/case-management/admin': [
    { label: 'Case Management', href: '/case-management' },
    { label: 'Administration', href: '/case-management/admin', current: true },
  ],
  '/ingredients': [
    { label: 'Ingredients', href: '/ingredients', current: true },
  ],
  '/ingredients/create': [
    { label: 'Ingredients', href: '/ingredients' },
    { label: 'Add Ingredient', href: '/ingredients/create', current: true },
  ],
  '/ingredients/import': [
    { label: 'Ingredients', href: '/ingredients' },
    { label: 'Import', href: '/ingredients/import', current: true },
  ],
  '/ingredients/export': [
    { label: 'Ingredients', href: '/ingredients' },
    { label: 'Export', href: '/ingredients/export', current: true },
  ],
} as const

// Case-Specific Action Configurations
export const CASE_ACTION_CONFIGS = {
  [CASE_TYPES.FORMULA_REVIEW]: [
    CASE_ACTIONS.ASSIGN,
    CASE_ACTIONS.UPDATE_STATUS,
    CASE_ACTIONS.ADD_COMMENT,
    CASE_ACTIONS.ATTACH_FILE,
    CASE_ACTIONS.VIEW_HISTORY,
  ],
  [CASE_TYPES.QUALITY_CONTROL]: [
    CASE_ACTIONS.ASSIGN,
    CASE_ACTIONS.UPDATE_STATUS,
    CASE_ACTIONS.RESOLVE,
    CASE_ACTIONS.ADD_COMMENT,
    CASE_ACTIONS.ATTACH_FILE,
  ],
  [CASE_TYPES.INGREDIENT_APPROVAL]: [
    CASE_ACTIONS.ASSIGN,
    CASE_ACTIONS.UPDATE_STATUS,
    CASE_ACTIONS.ADD_COMMENT,
    CASE_ACTIONS.ATTACH_FILE,
    CASE_ACTIONS.VIEW_HISTORY,
  ],
  [CASE_TYPES.PROJECT_ASSIGNMENT]: [
    CASE_ACTIONS.ASSIGN,
    CASE_ACTIONS.UPDATE_STATUS,
    CASE_ACTIONS.RESOLVE,
    CASE_ACTIONS.CLOSE,
    CASE_ACTIONS.DUPLICATE,
  ],
} as const

// Quick Actions Configuration
export const QUICK_ACTIONS_CONFIG = {
  [USER_ROLES.ADMINISTRATOR]: [
    CASE_ACTIONS.ASSIGN,
    CASE_ACTIONS.UPDATE_STATUS,
    CASE_ACTIONS.RESOLVE,
    CASE_ACTIONS.CLOSE,
    CASE_ACTIONS.BULK_ASSIGN,
  ],
  [USER_ROLES.LAB_MANAGER]: [
    CASE_ACTIONS.ASSIGN,
    CASE_ACTIONS.UPDATE_STATUS,
    CASE_ACTIONS.RESOLVE,
    CASE_ACTIONS.ADD_COMMENT,
    CASE_ACTIONS.ATTACH_FILE,
  ],
  [USER_ROLES.PROJECT_MANAGER]: [
    CASE_ACTIONS.UPDATE_STATUS,
    CASE_ACTIONS.ADD_COMMENT,
    CASE_ACTIONS.ATTACH_FILE,
    CASE_ACTIONS.VIEW_HISTORY,
  ],
  [USER_ROLES.PALETTE_MANAGER]: [
    CASE_ACTIONS.UPDATE_STATUS,
    CASE_ACTIONS.ADD_COMMENT,
    CASE_ACTIONS.VIEW_HISTORY,
  ],
  [USER_ROLES.PERFUMER]: [
    CASE_ACTIONS.ADD_COMMENT,
    CASE_ACTIONS.ATTACH_FILE,
    CASE_ACTIONS.VIEW_HISTORY,
  ],
} as const

// Export all configurations
export const CASE_MANAGEMENT_CONFIG = {
  caseTypes: CASE_TYPES,
  caseTypeLabels: CASE_TYPE_LABELS,
  modules: CASE_MODULES,
  actions: CASE_ACTIONS,
  moduleNavigation: MODULE_NAVIGATION,
  layout: LAYOUT_CONFIG,
  constants: LAYOUT_CONSTANTS,
  icons: NAVIGATION_ICONS,
  actionTypes: ACTION_TYPES,
  presets: LAYOUT_PRESETS,
  responsive: RESPONSIVE_CONFIG,
  animation: ANIMATION_CONFIG,
  accessibility: ACCESSIBILITY_CONFIG,
  theme: THEME_CONFIG,
  breadcrumbTemplates: BREADCRUMB_TEMPLATES,
  caseActionConfigs: CASE_ACTION_CONFIGS,
  quickActionsConfig: QUICK_ACTIONS_CONFIG,
} as const

export default CASE_MANAGEMENT_CONFIG
