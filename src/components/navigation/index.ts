/**
 * Navigation components index file for easy imports
 */

// Main navigation components
export {
  NavigationSidebar,
  MobileSidebarTrigger,
  ResponsiveSidebar,
  SidebarProvider,
  useSidebar,
  sidebarVariants,
  sidebarHeaderVariants,
  sidebarContentVariants,
  sidebarFooterVariants,
} from './sidebar'

export {
  NavigationMenu,
  CollapsibleMenuItem,
  MenuGroup,
  MenuSearch,
  menuVariants,
  menuItemVariants,
  menuItemContentVariants,
  menuItemIconVariants,
  menuItemLabelVariants,
  menuItemBadgeVariants,
  submenuVariants,
  expandButtonVariants,
} from './nav-menu'

export {
  NavigationHeader,
  CompactNavigationHeader,
  LargeNavigationHeader,
  SearchableNavigationHeader,
  headerVariants,
  headerContentVariants,
  headerLeftVariants,
  headerCenterVariants,
  headerRightVariants,
  breadcrumbContainerVariants,
  searchButtonVariants,
  notificationButtonVariants,
} from './nav-header'

// Re-export types for convenience
export type {
  NavigationSidebarProps,
  NavigationMenuProps,
  NavigationHeaderProps,
} from '@/types/navigation'
