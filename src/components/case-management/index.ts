/**
 * Case management components index file for easy imports
 */

// Main case management components
export {
  ActionPanel,
  CompactActionPanel,
  FloatingActionPanel,
  SearchableActionPanel,
  actionPanelVariants,
  actionGroupVariants,
  actionButtonVariants,
  bulkActionsVariants,
} from './action-panel'

export {
  CaseStatus,
  CaseStatusBadge,
  CaseStatusIndicator,
  CaseStatusList,
  CaseStatusProgress,
  statusVariants,
  statusIconVariants,
  statusLabelVariants,
  pulseVariants,
} from './case-status'

export {
  QuickActions,
  CompactQuickActions,
  VerticalQuickActions,
  GridQuickActions,
  FloatingQuickActions,
  SearchableQuickActions,
  quickActionsVariants,
  actionButtonVariants as quickActionButtonVariants,
  dropdownButtonVariants,
} from './quick-actions'

// Re-export types for convenience
export type {
  ActionPanelProps,
  CaseStatusProps,
  QuickActionsProps,
} from '@/types/navigation'
