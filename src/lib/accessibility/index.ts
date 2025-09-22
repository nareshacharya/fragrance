/**
 * Accessibility utilities index file for easy imports of all accessibility utilities, hooks, and constants
 */

// Testing utilities
export * from './testing';

// Focus management utilities
export * from './focus-management';

// Screen reader utilities
export * from './screen-reader';

// Keyboard navigation utilities
export * from './keyboard-navigation';

// Accessibility constants
export * from './constants';

// Accessibility hooks
export * from './hooks';

// Re-export commonly used utilities for convenience from their correct source modules
export {
  // Testing utilities
  renderWithAccessibility,
  testKeyboardNavigation,
  testScreenReaderSupport,
  testFocusManagement,
  testColorContrast,
  testFormAccessibility,
  accessibilityMatchers
} from './testing';

export {
  // Screen reader utilities
  announce,
  createLiveRegion,
  updateLiveRegion,
  removeLiveRegion,
  announceFormStatus,
  announceNavigation,
  createScreenReaderOnly,
  clearAllAnnouncements,
  clearAnnouncementsByPriority
} from './screen-reader';

export {
  // Keyboard navigation
  createKeyboardNavigation,
  createArrowNavigation,
  createModalKeyboardNavigation
} from './keyboard-navigation';

export {
  // Constants
  ARIA_ATTRIBUTES,
  ARIA_ROLES,
  KEYBOARD_CODES,
  KEYBOARD_SHORTCUTS,
  ARIA_LABELS,
  STANDARD_LABELS,
  WCAG_LEVELS,
  CONTRAST_RATIOS,
  FOCUS_INDICATORS,
  SCREEN_READER_ONLY_CLASS,
  SKIP_LINKS,
  LIVE_REGION_PRIORITIES,
  FORM_DESCRIPTIONS,
  LANDMARK_ROLES,
  HEADING_LEVELS,
  A11Y_TEST_CONFIG,
  A11Y_ERROR_MESSAGES,
  A11Y_SUCCESS_MESSAGES,
  DEFAULT_A11Y_CONFIG
} from './constants';

export {
  // Hooks
  useAnnouncement,
  useFocusTrap,
  useKeyboardNavigation,
  useArrowNavigation,
  useModalKeyboardNavigation,
  useLiveRegion,
  useAccessibleForm,
  useAccessibilityState,
  useSkipLinks
} from './hooks';

// Export types for TypeScript users
export type {
  AccessibilityTestOptions,
  KeyboardNavigationTestOptions,
  ScreenReaderTestOptions
} from './testing';

export type {
  FocusTrapOptions,
  FocusManager
} from './focus-management';

export type {
  AnnouncementOptions,
  LiveRegionOptions,
  AnnouncementPriority
} from './screen-reader';

export type {
  KeyboardHandler,
  KeyboardNavigationOptions,
  ArrowNavigationOptions
} from './keyboard-navigation';

export type {
  UseAnnouncementOptions,
  UseFocusTrapOptions,
  UseKeyboardNavigationOptions,
  UseArrowNavigationOptions,
  UseAccessibleFormOptions
} from './hooks';