/**
 * Accessibility types and interfaces for proper TypeScript integration across the application
 */

import { ReactNode } from 'react';

/**
 * Announcement priority levels for screen reader announcements
 */
export type AnnouncementPriority = 'polite' | 'assertive' | 'off';

/**
 * Keyboard navigation orientation
 */
export type NavigationOrientation = 'horizontal' | 'vertical' | 'both';

/**
 * Form validation types
 */
export type ValidationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Focus management options
 */
export interface FocusTrapOptions {
  /** Whether to trap focus within the element */
  trapFocus?: boolean;
  /** Whether to restore focus when the trap is deactivated */
  restoreFocus?: boolean;
  /** Element to focus when the trap is activated */
  initialFocus?: HTMLElement | (() => HTMLElement);
  /** Element to focus when the trap is deactivated */
  finalFocus?: HTMLElement | (() => HTMLElement);
  /** Whether to prevent scrolling when focusing elements */
  preventScroll?: boolean;
}

/**
 * Keyboard navigation options
 */
export interface KeyboardNavigationOptions {
  /** Whether to handle Tab navigation */
  handleTab?: boolean;
  /** Whether to handle Enter key */
  handleEnter?: boolean;
  /** Whether to handle Escape key */
  handleEscape?: boolean;
  /** Whether to handle Arrow keys */
  handleArrows?: boolean;
  /** Whether to handle Space key */
  handleSpace?: boolean;
  /** Custom keyboard handlers */
  customHandlers?: KeyboardHandler[];
  /** Whether to prevent default behavior for handled keys */
  preventDefault?: boolean;
  /** Whether to stop propagation for handled keys */
  stopPropagation?: boolean;
}

/**
 * Keyboard handler interface
 */
export interface KeyboardHandler {
  /** Key to handle */
  key: string;
  /** Handler function */
  handler: (event: KeyboardEvent) => void;
  /** Whether to prevent default behavior */
  preventDefault?: boolean;
  /** Whether to stop propagation */
  stopPropagation?: boolean;
}

/**
 * Arrow navigation options
 */
export interface ArrowNavigationOptions {
  /** Orientation of navigation */
  orientation?: NavigationOrientation;
  /** Whether to wrap around when reaching the end */
  wrap?: boolean;
  /** Whether to skip disabled elements */
  skipDisabled?: boolean;
  /** Custom selector for focusable elements */
  selector?: string;
}

/**
 * Announcement options
 */
export interface AnnouncementOptions {
  /** Priority of the announcement */
  priority?: AnnouncementPriority;
  /** Whether to clear previous announcements */
  clearPrevious?: boolean;
  /** Custom ID for the announcement element */
  id?: string;
  /** Whether to persist the announcement */
  persistent?: boolean;
  /** Custom CSS class for styling */
  className?: string;
}

/**
 * Live region options
 */
export interface LiveRegionOptions {
  /** Priority of the live region */
  priority?: AnnouncementPriority;
  /** Whether the region is atomic */
  atomic?: boolean;
  /** Whether the region is relevant */
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  /** Custom ID for the live region */
  id?: string;
  /** Custom CSS class for styling */
  className?: string;
}

/**
 * Accessibility test options
 */
export interface AccessibilityTestOptions {
  /** Skip axe-core accessibility testing */
  skipAxe?: boolean;
  /** Include keyboard navigation testing */
  includeKeyboard?: boolean;
  /** Include screen reader testing */
  includeScreenReader?: boolean;
  /** Custom axe-core options */
  axeOptions?: any;
  /** Test with high contrast mode */
  highContrast?: boolean;
  /** Test with reduced motion */
  reducedMotion?: boolean;
}

/**
 * Keyboard navigation test options
 */
export interface KeyboardNavigationTestOptions {
  /** Test Tab navigation */
  testTab?: boolean;
  /** Test Enter key activation */
  testEnter?: boolean;
  /** Test Escape key handling */
  testEscape?: boolean;
  /** Test Arrow key navigation */
  testArrows?: boolean;
  /** Test Space key activation */
  testSpace?: boolean;
  /** Custom key sequences to test */
  customKeys?: string[];
}

/**
 * Screen reader test options
 */
export interface ScreenReaderTestOptions {
  /** Test ARIA labels */
  testAriaLabels?: boolean;
  /** Test ARIA descriptions */
  testAriaDescriptions?: boolean;
  /** Test live regions */
  testLiveRegions?: boolean;
  /** Test landmark roles */
  testLandmarks?: boolean;
  /** Test heading hierarchy */
  testHeadings?: boolean;
}

/**
 * Accessible form options
 */
export interface AccessibleFormOptions {
  /** Whether to announce validation errors */
  announceErrors?: boolean;
  /** Whether to announce successful validation */
  announceSuccess?: boolean;
  /** Whether to announce required field indicators */
  announceRequired?: boolean;
  /** Custom error messages */
  customErrorMessages?: Record<string, string>;
  /** Custom success messages */
  customSuccessMessages?: Record<string, string>;
}

/**
 * Accessibility state interface
 */
export interface AccessibilityState {
  /** Whether high contrast mode is active */
  isHighContrast: boolean;
  /** Whether reduced motion is preferred */
  isReducedMotion: boolean;
  /** Whether screen reader is active */
  isScreenReaderActive: boolean;
  /** Set high contrast mode */
  setIsHighContrast: (value: boolean) => void;
  /** Set reduced motion */
  setIsReducedMotion: (value: boolean) => void;
  /** Set screen reader active state */
  setIsScreenReaderActive: (value: boolean) => void;
}

/**
 * Skip link interface
 */
export interface SkipLink {
  /** Unique identifier for the skip link */
  id: string;
  /** Label for the skip link */
  label: string;
  /** Target href */
  href?: string;
}

/**
 * Accessibility component props base interface
 */
export interface AccessibilityComponentProps {
  /** Custom CSS class */
  className?: string;
  /** Whether the component is visible */
  visible?: boolean;
  /** Custom test ID */
  testId?: string;
}

/**
 * Modal accessibility props
 */
export interface ModalAccessibilityProps extends AccessibilityComponentProps {
  /** Modal title for accessibility */
  title?: string;
  /** Whether the modal is open */
  open?: boolean;
  /** Callback when modal should close */
  onClose?: () => void;
}

/**
 * Dropdown accessibility props
 */
export interface DropdownAccessibilityProps extends AccessibilityComponentProps {
  /** Whether the dropdown is open */
  open?: boolean;
  /** Callback when dropdown should close */
  onClose?: () => void;
  /** Role of the dropdown */
  role?: 'menu' | 'listbox' | 'grid' | 'tree';
}

/**
 * Form field accessibility props
 */
export interface FormFieldAccessibilityProps extends AccessibilityComponentProps {
  /** Field name */
  fieldName: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Info message */
  info?: string;
  /** Warning message */
  warning?: string;
  /** Whether to announce */
  announce?: boolean;
}

/**
 * Loading accessibility props
 */
export interface LoadingAccessibilityProps extends AccessibilityComponentProps {
  /** Loading message */
  message?: string;
  /** Whether currently loading */
  isLoading?: boolean;
  /** Completion message */
  completionMessage?: string;
}

/**
 * Navigation accessibility props
 */
export interface NavigationAccessibilityProps extends AccessibilityComponentProps {
  /** Page title */
  pageTitle: string;
  /** Section name */
  section?: string;
  /** Whether to announce */
  announce?: boolean;
}

/**
 * ARIA attributes interface
 */
export interface AriaAttributes {
  /** ARIA label */
  'aria-label'?: string;
  /** ARIA labelled by */
  'aria-labelledby'?: string;
  /** ARIA described by */
  'aria-describedby'?: string;
  /** ARIA controls */
  'aria-controls'?: string;
  /** ARIA owns */
  'aria-owns'?: string;
  /** ARIA flow to */
  'aria-flowto'?: string;
  /** ARIA active descendant */
  'aria-activedescendant'?: string;
  /** ARIA expanded */
  'aria-expanded'?: boolean | string;
  /** ARIA selected */
  'aria-selected'?: boolean | string;
  /** ARIA checked */
  'aria-checked'?: boolean | string;
  /** ARIA pressed */
  'aria-pressed'?: boolean | string;
  /** ARIA disabled */
  'aria-disabled'?: boolean | string;
  /** ARIA hidden */
  'aria-hidden'?: boolean | string;
  /** ARIA invalid */
  'aria-invalid'?: boolean | string;
  /** ARIA required */
  'aria-required'?: boolean | string;
  /** ARIA readonly */
  'aria-readonly'?: boolean | string;
  /** ARIA live */
  'aria-live'?: AnnouncementPriority;
  /** ARIA atomic */
  'aria-atomic'?: boolean | string;
  /** ARIA relevant */
  'aria-relevant'?: string;
  /** ARIA busy */
  'aria-busy'?: boolean | string;
}

/**
 * Keyboard shortcut interface
 */
export interface KeyboardShortcut {
  /** Key combination */
  key: string;
  /** Description of the shortcut */
  description: string;
  /** Handler function */
  handler: (event: KeyboardEvent) => void;
  /** Whether the shortcut is global */
  global?: boolean;
}

/**
 * Focus management interface
 */
export interface FocusManager {
  /** Activate focus management */
  activate: () => void;
  /** Deactivate focus management */
  deactivate: () => void;
  /** Update the focusable elements */
  updateFocusableElements: () => void;
  /** Focus the first focusable element */
  focusFirst: () => boolean;
  /** Focus the last focusable element */
  focusLast: () => boolean;
  /** Focus the next focusable element */
  focusNext: () => boolean;
  /** Focus the previous focusable element */
  focusPrevious: () => boolean;
}

/**
 * Accessibility configuration interface
 */
export interface AccessibilityConfig {
  /** Focus management settings */
  focusManagement: {
    /** Whether focus trapping is enabled */
    trapFocus: boolean;
    /** Whether focus restoration is enabled */
    restoreFocus: boolean;
  };
  /** Screen reader announcements settings */
  announcements: {
    /** Whether announcements are enabled */
    enabled: boolean;
    /** Default priority for announcements */
    defaultPriority: AnnouncementPriority;
  };
  /** Keyboard navigation settings */
  keyboardNavigation: {
    /** Whether keyboard navigation is enabled */
    enabled: boolean;
    /** Whether arrow navigation is enabled */
    arrowNavigation: boolean;
    /** Whether escape to close is enabled */
    escapeToClose: boolean;
  };
  /** Color and contrast settings */
  colorContrast: {
    /** Whether high contrast mode is supported */
    highContrastModeSupported: boolean;
    /** Whether reduced motion is supported */
    reducedMotionSupported: boolean;
  };
  /** Testing settings */
  testing: {
    /** Whether automated testing is enabled */
    automatedTestingEnabled: boolean;
    /** Whether manual testing is required */
    manualTestingRequired: boolean;
  };
  /** WCAG compliance settings */
  wcag: {
    /** Target WCAG level */
    targetLevel: 'A' | 'AA' | 'AAA';
    /** Whether strict mode is enabled */
    strictMode: boolean;
  };
}

/**
 * Accessibility violation interface
 */
export interface AccessibilityViolation {
  /** ID of the violation */
  id: string;
  /** Impact level */
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  /** Description of the violation */
  description: string;
  /** Help text for fixing the violation */
  help: string;
  /** Help URL for more information */
  helpUrl: string;
  /** Nodes that violate the rule */
  nodes: Array<{
    /** HTML of the violating node */
    html: string;
    /** Target selector */
    target: string[];
    /** Failure summary */
    failureSummary?: string;
  }>;
}

/**
 * Accessibility test result interface
 */
export interface AccessibilityTestResult {
  /** Whether the test passed */
  passed: boolean;
  /** Number of violations */
  violations: AccessibilityViolation[];
  /** Number of passes */
  passes: number;
  /** Number of incomplete tests */
  incomplete: number;
  /** Number of inapplicable tests */
  inapplicable: number;
  /** Test URL */
  url?: string;
  /** Timestamp */
  timestamp: string;
}

/**
 * Accessibility hook return types
 */
export interface UseAnnouncementReturn {
  announce: (message: string, options?: AnnouncementOptions) => void;
  announceError: (message: string) => void;
  announceSuccess: (message: string) => void;
  announceInfo: (message: string) => void;
  announceLoading: (message?: string) => void;
  announceLoadingComplete: (message?: string) => void;
}

export interface UseFocusTrapReturn {
  containerRef: React.RefObject<HTMLElement>;
  isActive: boolean;
  activate: () => void;
  deactivate: () => void;
  focusFirst: () => boolean;
  focusLast: () => boolean;
  focusNext: () => boolean;
  focusPrevious: () => boolean;
}

export interface UseKeyboardNavigationReturn {
  containerRef: React.RefObject<HTMLElement>;
  setupKeyboardNavigation: () => void;
  teardownKeyboardNavigation: () => void;
}

export interface UseArrowNavigationReturn {
  containerRef: React.RefObject<HTMLElement>;
  setupArrowNavigation: () => void;
  teardownArrowNavigation: () => void;
}

export interface UseModalKeyboardNavigationReturn {
  modalRef: React.RefObject<HTMLElement>;
  setupModalNavigation: () => void;
  teardownModalNavigation: () => void;
}

export interface UseLiveRegionReturn {
  liveRegionRef: React.RefObject<HTMLElement>;
  createRegion: () => HTMLElement;
  updateRegion: (content: string, clearFirst?: boolean) => void;
  removeRegion: () => void;
}

export interface UseAccessibleFormReturn {
  errors: Record<string, string>;
  successes: Record<string, string>;
  hasErrors: boolean;
  hasSuccesses: boolean;
  setFieldError: (fieldName: string, errorMessage: string) => void;
  setFieldSuccess: (fieldName: string, successMessage: string) => void;
  clearFieldError: (fieldName: string) => void;
  clearFieldSuccess: (fieldName: string) => void;
  clearAllErrors: () => void;
  clearAllSuccesses: () => void;
  getFieldError: (fieldName: string) => string | undefined;
  getFieldSuccess: (fieldName: string) => string | undefined;
  announceFormStatus: (status: ValidationType, message: string) => void;
  announceRequiredField: (fieldName: string) => void;
}

export interface UseAccessibilityStateReturn extends AccessibilityState {}

export interface UseSkipLinksReturn {
  activeSkipLink: string | null;
  skipTo: (targetId: string) => void;
  skipToMain: () => void;
  skipToNav: () => void;
  skipToSearch: () => void;
}

