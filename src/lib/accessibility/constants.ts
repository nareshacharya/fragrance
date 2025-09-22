/**
 * Accessibility constants and configuration including ARIA attributes, keyboard codes, accessibility roles, and WCAG compliance settings
 */

/**
 * Standard ARIA attributes for common UI patterns
 */
export const ARIA_ATTRIBUTES = {
  // Live regions
  LIVE_POLITE: 'polite',
  LIVE_ASSERTIVE: 'assertive',
  LIVE_OFF: 'off',
  
  // States
  STATE_EXPANDED: 'aria-expanded',
  STATE_SELECTED: 'aria-selected',
  STATE_CHECKED: 'aria-checked',
  STATE_PRESSED: 'aria-pressed',
  STATE_DISABLED: 'aria-disabled',
  STATE_HIDDEN: 'aria-hidden',
  STATE_INVALID: 'aria-invalid',
  STATE_REQUIRED: 'aria-required',
  STATE_READONLY: 'aria-readonly',
  
  // Properties
  PROP_LABEL: 'aria-label',
  PROP_LABELLEDBY: 'aria-labelledby',
  PROP_DESCRIBEDBY: 'aria-describedby',
  PROP_CONTROLS: 'aria-controls',
  PROP_OWNS: 'aria-owns',
  PROP_FLOWTO: 'aria-flowto',
  PROP_ACTIVEDESCENDANT: 'aria-activedescendant',
  
  // Roles
  ROLE_BUTTON: 'button',
  ROLE_LINK: 'link',
  ROLE_IMG: 'img',
  ROLE_HEADING: 'heading',
  ROLE_LIST: 'list',
  ROLE_LISTITEM: 'listitem',
  ROLE_MENU: 'menu',
  ROLE_MENUITEM: 'menuitem',
  ROLE_MENUBAR: 'menubar',
  ROLE_DIALOG: 'dialog',
  ROLE_MODAL: 'modal',
  ROLE_ALERT: 'alert',
  ROLE_ALERTDIALOG: 'alertdialog',
  ROLE_TAB: 'tab',
  ROLE_TABLIST: 'tablist',
  ROLE_TABPANEL: 'tabpanel',
  ROLE_GRID: 'grid',
  ROLE_GRIDCELL: 'gridcell',
  ROLE_TABLE: 'table',
  ROLE_ROW: 'row',
  ROLE_COLUMNHEADER: 'columnheader',
  ROLE_ROWHEADER: 'rowheader',
  ROLE_CELL: 'cell',
  ROLE_PROGRESSBAR: 'progressbar',
  ROLE_SLIDER: 'slider',
  ROLE_SPINBUTTON: 'spinbutton',
  ROLE_CHECKBOX: 'checkbox',
  ROLE_RADIO: 'radio',
  ROLE_RADIOGROUP: 'radiogroup',
  ROLE_SWITCH: 'switch',
  ROLE_TOGGLE: 'toggle',
  ROLE_COMBOBOX: 'combobox',
  ROLE_LISTBOX: 'listbox',
  ROLE_OPTION: 'option',
  ROLE_TEXTBOX: 'textbox',
  ROLE_SEARCH: 'search',
  ROLE_NAVIGATION: 'navigation',
  ROLE_MAIN: 'main',
  ROLE_BANNER: 'banner',
  ROLE_CONTENTINFO: 'contentinfo',
  ROLE_COMPLEMENTARY: 'complementary',
  ROLE_REGION: 'region',
  ROLE_LANDMARK: 'landmark',
  ROLE_LOG: 'log',
  ROLE_MARQUEE: 'marquee',
  ROLE_STATUS: 'status',
  ROLE_TIMER: 'timer',
  ROLE_TOOLTIP: 'tooltip',
  ROLE_TREE: 'tree',
  ROLE_TREEITEM: 'treeitem',
  ROLE_GROUP: 'group',
  ROLE_RADIOGROUP: 'radiogroup',
  ROLE_SEPARATOR: 'separator',
  ROLE_PRESENTATION: 'presentation',
  ROLE_NONE: 'none'
} as const;

/**
 * ARIA roles map for easy access
 */
export const ARIA_ROLES = {
  BUTTON: 'button',
  LINK: 'link',
  IMG: 'img',
  HEADING: 'heading',
  LIST: 'list',
  LISTITEM: 'listitem',
  MENU: 'menu',
  MENUITEM: 'menuitem',
  MENUBAR: 'menubar',
  DIALOG: 'dialog',
  MODAL: 'modal',
  ALERT: 'alert',
  ALERTDIALOG: 'alertdialog',
  TAB: 'tab',
  TABLIST: 'tablist',
  TABPANEL: 'tabpanel',
  GRID: 'grid',
  GRIDCELL: 'gridcell',
  TABLE: 'table',
  ROW: 'row',
  COLUMNHEADER: 'columnheader',
  ROWHEADER: 'rowheader',
  CELL: 'cell',
  PROGRESSBAR: 'progressbar',
  SLIDER: 'slider',
  SPINBUTTON: 'spinbutton',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  RADIOGROUP: 'radiogroup',
  SWITCH: 'switch',
  TOGGLE: 'toggle',
  COMBOBOX: 'combobox',
  LISTBOX: 'listbox',
  OPTION: 'option',
  TEXTBOX: 'textbox',
  SEARCH: 'search',
  NAVIGATION: 'navigation',
  MAIN: 'main',
  BANNER: 'banner',
  CONTENTINFO: 'contentinfo',
  COMPLEMENTARY: 'complementary',
  REGION: 'region',
  LANDMARK: 'landmark',
  LOG: 'log',
  MARQUEE: 'marquee',
  STATUS: 'status',
  TIMER: 'timer',
  TOOLTIP: 'tooltip',
  TREE: 'tree',
  TREEITEM: 'treeitem',
  GROUP: 'group',
  SEPARATOR: 'separator',
  PRESENTATION: 'presentation',
  NONE: 'none'
} as const;

/**
 * Standard keyboard codes for accessibility
 */
export const KEYBOARD_CODES = {
  TAB: 'Tab',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
  DELETE: 'Delete',
  BACKSPACE: 'Backspace',
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
  F5: 'F5',
  F6: 'F6',
  F7: 'F7',
  F8: 'F8',
  F9: 'F9',
  F10: 'F10',
  F11: 'F11',
  F12: 'F12'
} as const;

/**
 * Standard keyboard shortcuts for common actions
 */
export const KEYBOARD_SHORTCUTS = {
  // Navigation
  SKIP_TO_MAIN: 'Alt+1',
  SKIP_TO_NAV: 'Alt+2',
  SKIP_TO_SEARCH: 'Alt+3',
  
  // Form actions
  SUBMIT_FORM: 'Enter',
  RESET_FORM: 'Escape',
  NEXT_FIELD: 'Tab',
  PREVIOUS_FIELD: 'Shift+Tab',
  
  // List navigation
  NEXT_ITEM: 'ArrowDown',
  PREVIOUS_ITEM: 'ArrowUp',
  FIRST_ITEM: 'Home',
  LAST_ITEM: 'End',
  
  // Modal actions
  CLOSE_MODAL: 'Escape',
  CONFIRM_ACTION: 'Enter',
  CANCEL_ACTION: 'Escape',
  
  // Menu navigation
  OPEN_MENU: 'Enter',
  CLOSE_MENU: 'Escape',
  NEXT_MENU_ITEM: 'ArrowDown',
  PREVIOUS_MENU_ITEM: 'ArrowUp',
  
  // Tab navigation
  NEXT_TAB: 'ArrowRight',
  PREVIOUS_TAB: 'ArrowLeft',
  FIRST_TAB: 'Home',
  LAST_TAB: 'End'
} as const;

/**
 * Standard ARIA labels for common UI elements
 */
export const ARIA_LABELS = {
  // Navigation
  MAIN_NAVIGATION: 'Main navigation',
  BREADCRUMB_NAVIGATION: 'Breadcrumb navigation',
  SKIP_TO_MAIN: 'Skip to main content',
  SKIP_TO_NAV: 'Skip to navigation',
  SKIP_TO_SEARCH: 'Skip to search',
  
  // Actions
  CLOSE: 'Close',
  OPEN: 'Open',
  EXPAND: 'Expand',
  COLLAPSE: 'Collapse',
  SHOW_MORE: 'Show more',
  SHOW_LESS: 'Show less',
  LOADING: 'Loading',
  SAVING: 'Saving',
  SUBMIT: 'Submit',
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  EDIT: 'Edit',
  SAVE: 'Save',
  RESET: 'Reset',
  CLEAR: 'Clear',
  SEARCH: 'Search',
  FILTER: 'Filter',
  SORT: 'Sort',
  REFRESH: 'Refresh',
  BACK: 'Back',
  NEXT: 'Next',
  PREVIOUS: 'Previous',
  
  // Form elements
  REQUIRED_FIELD: 'Required field',
  OPTIONAL_FIELD: 'Optional field',
  FIELD_ERROR: 'Field error',
  FIELD_SUCCESS: 'Field success',
  FORM_ERROR: 'Form error',
  FORM_SUCCESS: 'Form success',
  
  // Status messages
  SUCCESS_MESSAGE: 'Success message',
  ERROR_MESSAGE: 'Error message',
  WARNING_MESSAGE: 'Warning message',
  INFO_MESSAGE: 'Information message',
  
  // Table elements
  SORT_ASCENDING: 'Sort ascending',
  SORT_DESCENDING: 'Sort descending',
  SORTABLE_COLUMN: 'Sortable column',
  SELECT_ALL: 'Select all',
  SELECT_ROW: 'Select row',
  SELECT_COLUMN: 'Select column',
  
  // Modal and dialog
  MODAL_TITLE: 'Modal title',
  DIALOG_TITLE: 'Dialog title',
  MODAL_CONTENT: 'Modal content',
  DIALOG_CONTENT: 'Dialog content',
  
  // Pagination
  FIRST_PAGE: 'First page',
  LAST_PAGE: 'Last page',
  NEXT_PAGE: 'Next page',
  PREVIOUS_PAGE: 'Previous page',
  CURRENT_PAGE: 'Current page',
  
  // Loading states
  LOADING_CONTENT: 'Loading content',
  LOADING_MORE: 'Loading more',
  LOADING_COMPLETE: 'Loading complete',
  
  // Menu items
  MENU_ITEM: 'Menu item',
  SUBMENU_ITEM: 'Submenu item',
  DROPDOWN_ITEM: 'Dropdown item',
  
  // Tooltips and help
  SHOW_TOOLTIP: 'Show tooltip',
  HIDE_TOOLTIP: 'Hide tooltip',
  SHOW_HELP: 'Show help',
  HIDE_HELP: 'Hide help'
} as const;

/**
 * Standard labels for common UI elements (alias for ARIA_LABELS)
 */
export const STANDARD_LABELS = ARIA_LABELS;

/**
 * WCAG compliance levels and requirements
 */
export const WCAG_LEVELS = {
  A: 'A',
  AA: 'AA',
  AAA: 'AAA'
} as const;

/**
 * Color contrast ratios for WCAG compliance
 */
export const CONTRAST_RATIOS = {
  NORMAL_TEXT_AA: 4.5,
  LARGE_TEXT_AA: 3.0,
  NORMAL_TEXT_AAA: 7.0,
  LARGE_TEXT_AAA: 4.5,
  UI_COMPONENTS_AA: 3.0,
  UI_COMPONENTS_AAA: 4.5
} as const;

/**
 * Focus indicator styles for accessibility
 */
export const FOCUS_INDICATORS = {
  OUTLINE_WIDTH: '2px',
  OUTLINE_STYLE: 'solid',
  OUTLINE_COLOR: '#005fcc',
  OUTLINE_OFFSET: '2px',
  MINIMUM_CONTRAST: 3.0
} as const;

/**
 * Screen reader only CSS class
 */
export const SCREEN_READER_ONLY_CLASS = 'sr-only';

/**
 * Skip link configuration
 */
export const SKIP_LINKS = {
  MAIN_CONTENT: 'main-content',
  NAVIGATION: 'main-navigation',
  SEARCH: 'search-input'
} as const;

/**
 * Live region priorities
 */
export const LIVE_REGION_PRIORITIES = {
  POLITE: 'polite',
  ASSERTIVE: 'assertive',
  OFF: 'off'
} as const;

/**
 * Common ARIA descriptions for form validation
 */
export const FORM_DESCRIPTIONS = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',
  PASSWORD_REQUIREMENTS: 'Password must be at least 8 characters long',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_DATE: 'Please enter a valid date',
  INVALID_NUMBER: 'Please enter a valid number',
  FIELD_TOO_SHORT: 'This field is too short',
  FIELD_TOO_LONG: 'This field is too long',
  INVALID_FORMAT: 'Please enter the correct format'
} as const;

/**
 * Standard landmark roles for page structure
 */
export const LANDMARK_ROLES = {
  BANNER: 'banner',
  NAVIGATION: 'navigation',
  MAIN: 'main',
  COMPLEMENTARY: 'complementary',
  CONTENTINFO: 'contentinfo',
  SEARCH: 'search',
  FORM: 'form',
  REGION: 'region'
} as const;

/**
 * Standard heading levels for proper hierarchy
 */
export const HEADING_LEVELS = {
  H1: 1,
  H2: 2,
  H3: 3,
  H4: 4,
  H5: 5,
  H6: 6
} as const;

/**
 * Accessibility testing configuration
 */
export const A11Y_TEST_CONFIG = {
  // Axe-core configuration
  AXE_RULES: {
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'focus-management': { enabled: true },
    'aria-attributes': { enabled: true },
    'semantic-html': { enabled: true },
    'landmark-roles': { enabled: true }
  },
  
  // Test timeouts
  TIMEOUTS: {
    KEYBOARD_NAVIGATION: 1000,
    FOCUS_MANAGEMENT: 500,
    SCREEN_READER: 2000,
    COLOR_CONTRAST: 1000
  },
  
  // Test thresholds
  THRESHOLDS: {
    MAX_VIOLATIONS: 0,
    MIN_COLOR_CONTRAST: 4.5,
    MAX_FOCUS_TIME: 300
  }
} as const;

/**
 * Accessibility error messages
 */
export const A11Y_ERROR_MESSAGES = {
  MISSING_ARIA_LABEL: 'Element is missing an accessible name',
  MISSING_ROLE: 'Element is missing a proper role',
  INVALID_ARIA_ATTRIBUTE: 'Invalid ARIA attribute value',
  MISSING_FORM_LABEL: 'Form control is missing a label',
  INVALID_HEADING_HIERARCHY: 'Heading hierarchy is not properly structured',
  MISSING_LANDMARK_ROLES: 'Page is missing landmark roles',
  INVALID_COLOR_CONTRAST: 'Color contrast does not meet WCAG standards',
  MISSING_FOCUS_INDICATORS: 'Interactive elements are missing focus indicators',
  INVALID_KEYBOARD_NAVIGATION: 'Keyboard navigation is not properly implemented',
  MISSING_SCREEN_READER_SUPPORT: 'Element is not accessible to screen readers'
} as const;

/**
 * Accessibility success messages
 */
export const A11Y_SUCCESS_MESSAGES = {
  PROPER_ARIA_LABELS: 'All elements have proper accessible names',
  CORRECT_ROLES: 'All elements have correct roles',
  VALID_ATTRIBUTES: 'All ARIA attributes are valid',
  LABELED_FORMS: 'All form controls are properly labeled',
  VALID_HEADINGS: 'Heading hierarchy is properly structured',
  LANDMARK_ROLES: 'Page has proper landmark roles',
  GOOD_CONTRAST: 'Color contrast meets WCAG standards',
  FOCUS_INDICATORS: 'All interactive elements have focus indicators',
  KEYBOARD_NAVIGATION: 'Keyboard navigation is properly implemented',
  SCREEN_READER_SUPPORT: 'All elements are accessible to screen readers'
} as const;

/**
 * Default accessibility configuration
 */
export const DEFAULT_A11Y_CONFIG = {
  // Focus management
  FOCUS_TRAP_ENABLED: true,
  RESTORE_FOCUS_ENABLED: true,
  
  // Screen reader announcements
  ANNOUNCEMENTS_ENABLED: true,
  DEFAULT_PRIORITY: LIVE_REGION_PRIORITIES.POLITE,
  
  // Keyboard navigation
  KEYBOARD_NAVIGATION_ENABLED: true,
  ARROW_NAVIGATION_ENABLED: true,
  ESCAPE_TO_CLOSE_ENABLED: true,
  
  // Color and contrast
  HIGH_CONTRAST_MODE_SUPPORTED: true,
  REDUCED_MOTION_SUPPORTED: true,
  
  // Testing
  AUTOMATED_TESTING_ENABLED: true,
  MANUAL_TESTING_REQUIRED: true,
  
  // WCAG compliance
  TARGET_LEVEL: WCAG_LEVELS.AA,
  STRICT_MODE: false
} as const;