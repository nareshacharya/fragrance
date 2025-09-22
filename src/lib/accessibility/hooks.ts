/**
 * Accessibility hooks for React components including useAnnouncement, useFocusTrap, useKeyboardNavigation, and useAccessibleForm
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { createFocusTrap, FocusManager } from './focus-management';
import { announce, createLiveRegion, updateLiveRegion, removeLiveRegion } from './screen-reader';
import { createKeyboardNavigation, createArrowNavigation, createModalKeyboardNavigation } from './keyboard-navigation';
import { ARIA_LABELS, LIVE_REGION_PRIORITIES, A11Y_SUCCESS_MESSAGES, A11Y_ERROR_MESSAGES } from './constants';

export interface UseAnnouncementOptions {
  /** Priority of announcements */
  priority?: 'polite' | 'assertive' | 'off';
  /** Whether to clear previous announcements */
  clearPrevious?: boolean;
  /** Whether to persist announcements */
  persistent?: boolean;
}

export interface UseFocusTrapOptions {
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

export interface UseKeyboardNavigationOptions {
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
  customHandlers?: Array<{
    key: string;
    handler: (event: KeyboardEvent) => void;
    preventDefault?: boolean;
    stopPropagation?: boolean;
  }>;
  /** Whether to prevent default behavior for handled keys */
  preventDefault?: boolean;
  /** Whether to stop propagation for handled keys */
  stopPropagation?: boolean;
}

export interface UseArrowNavigationOptions {
  /** Orientation of navigation */
  orientation?: 'horizontal' | 'vertical' | 'both';
  /** Whether to wrap around when reaching the end */
  wrap?: boolean;
  /** Whether to skip disabled elements */
  skipDisabled?: boolean;
  /** Custom selector for focusable elements */
  selector?: string;
}

export interface UseAccessibleFormOptions {
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
 * Hook for managing screen reader announcements
 */
export function useAnnouncement(options: UseAnnouncementOptions = {}) {
  const {
    priority = LIVE_REGION_PRIORITIES.POLITE,
    clearPrevious = false,
    persistent = false
  } = options;

  const announceMessage = useCallback((message: string, customOptions?: Partial<UseAnnouncementOptions>) => {
    announce(message, {
      priority: customOptions?.priority || priority,
      clearPrevious: customOptions?.clearPrevious ?? clearPrevious,
      persistent: customOptions?.persistent ?? persistent
    });
  }, [priority, clearPrevious, persistent]);

  const announceError = useCallback((message: string) => {
    announce(message, {
      priority: LIVE_REGION_PRIORITIES.ASSERTIVE,
      clearPrevious: true
    });
  }, []);

  const announceSuccess = useCallback((message: string) => {
    announce(message, {
      priority: LIVE_REGION_PRIORITIES.POLITE
    });
  }, []);

  const announceInfo = useCallback((message: string) => {
    announce(message, {
      priority: LIVE_REGION_PRIORITIES.POLITE
    });
  }, []);

  const announceLoading = useCallback((message = 'Loading...') => {
    announce(message, {
      priority: LIVE_REGION_PRIORITIES.POLITE,
      persistent: true
    });
  }, []);

  const announceLoadingComplete = useCallback((message = 'Loading complete') => {
    announce(message, {
      priority: LIVE_REGION_PRIORITIES.POLITE,
      clearPrevious: true
    });
  }, []);

  return {
    announce: announceMessage,
    announceError,
    announceSuccess,
    announceInfo,
    announceLoading,
    announceLoadingComplete
  };
}

/**
 * Hook for managing focus traps
 */
export function useFocusTrap(options: UseFocusTrapOptions = {}) {
  const containerRef = useRef<HTMLElement>(null);
  const focusManagerRef = useRef<FocusManager | null>(null);
  const [isActive, setIsActive] = useState(false);

  const activate = useCallback(() => {
    if (containerRef.current && !isActive) {
      focusManagerRef.current = createFocusTrap(containerRef.current, options);
      focusManagerRef.current.activate();
      setIsActive(true);
    }
  }, [options, isActive]);

  const deactivate = useCallback(() => {
    if (focusManagerRef.current && isActive) {
      focusManagerRef.current.deactivate();
      focusManagerRef.current = null;
      setIsActive(false);
    }
  }, [isActive]);

  const focusFirst = useCallback(() => {
    if (focusManagerRef.current) {
      return focusManagerRef.current.focusFirst();
    }
    return false;
  }, []);

  const focusLast = useCallback(() => {
    if (focusManagerRef.current) {
      return focusManagerRef.current.focusLast();
    }
    return false;
  }, []);

  const focusNext = useCallback(() => {
    if (focusManagerRef.current) {
      return focusManagerRef.current.focusNext();
    }
    return false;
  }, []);

  const focusPrevious = useCallback(() => {
    if (focusManagerRef.current) {
      return focusManagerRef.current.focusPrevious();
    }
    return false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (focusManagerRef.current) {
        focusManagerRef.current.deactivate();
      }
    };
  }, []);

  return {
    containerRef,
    isActive,
    activate,
    deactivate,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious
  };
}

/**
 * Hook for managing keyboard navigation
 */
export function useKeyboardNavigation(options: UseKeyboardNavigationOptions = {}) {
  const containerRef = useRef<HTMLElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const setupKeyboardNavigation = useCallback(() => {
    if (containerRef.current && !cleanupRef.current) {
      cleanupRef.current = createKeyboardNavigation(containerRef.current, options);
    }
  }, [options]);

  const teardownKeyboardNavigation = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
  }, []);

  // Setup keyboard navigation when options change
  useEffect(() => {
    setupKeyboardNavigation();
    return teardownKeyboardNavigation;
  }, [setupKeyboardNavigation, teardownKeyboardNavigation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      teardownKeyboardNavigation();
    };
  }, [teardownKeyboardNavigation]);

  return {
    containerRef,
    setupKeyboardNavigation,
    teardownKeyboardNavigation
  };
}

/**
 * Hook for managing arrow key navigation
 */
export function useArrowNavigation(options: UseArrowNavigationOptions = {}) {
  const containerRef = useRef<HTMLElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const setupArrowNavigation = useCallback(() => {
    if (containerRef.current && !cleanupRef.current) {
      cleanupRef.current = createArrowNavigation(containerRef.current, options);
    }
  }, [options]);

  const teardownArrowNavigation = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
  }, []);

  // Setup arrow navigation when options change
  useEffect(() => {
    setupArrowNavigation();
    return teardownArrowNavigation;
  }, [setupArrowNavigation, teardownArrowNavigation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      teardownArrowNavigation();
    };
  }, [teardownArrowNavigation]);

  return {
    containerRef,
    setupArrowNavigation,
    teardownArrowNavigation
  };
}

/**
 * Hook for managing modal keyboard navigation
 */
export function useModalKeyboardNavigation(onClose: () => void) {
  const modalRef = useRef<HTMLElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const setupModalNavigation = useCallback(() => {
    if (modalRef.current && !cleanupRef.current) {
      cleanupRef.current = createModalKeyboardNavigation(modalRef.current, onClose);
    }
  }, [onClose]);

  const teardownModalNavigation = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
  }, []);

  // Setup modal navigation when onClose changes
  useEffect(() => {
    setupModalNavigation();
    return teardownModalNavigation;
  }, [setupModalNavigation, teardownModalNavigation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      teardownModalNavigation();
    };
  }, [teardownModalNavigation]);

  return {
    modalRef,
    setupModalNavigation,
    teardownModalNavigation
  };
}

/**
 * Hook for managing live regions
 */
export function useLiveRegion(priority: 'polite' | 'assertive' | 'off' = 'polite') {
  const liveRegionRef = useRef<HTMLElement | null>(null);

  const createRegion = useCallback(() => {
    if (!liveRegionRef.current) {
      liveRegionRef.current = createLiveRegion({ priority });
    }
    return liveRegionRef.current;
  }, [priority]);

  const updateRegion = useCallback((content: string, clearFirst = false) => {
    const region = liveRegionRef.current || createRegion();
    updateLiveRegion(region, content, clearFirst);
  }, [createRegion]);

  const removeRegion = useCallback(() => {
    if (liveRegionRef.current) {
      removeLiveRegion(liveRegionRef.current);
      liveRegionRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      removeRegion();
    };
  }, [removeRegion]);

  return {
    liveRegionRef,
    createRegion,
    updateRegion,
    removeRegion
  };
}

/**
 * Hook for managing accessible forms
 */
export function useAccessibleForm(options: UseAccessibleFormOptions = {}) {
  const {
    announceErrors = true,
    announceSuccess = true,
    announceRequired = true,
    customErrorMessages = {},
    customSuccessMessages = {}
  } = options;

  const { announce, announceError, announceSuccess } = useAnnouncement();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successes, setSuccesses] = useState<Record<string, string>>({});

  const setFieldError = useCallback((fieldName: string, errorMessage: string) => {
    const message = customErrorMessages[fieldName] || errorMessage;
    setErrors(prev => ({ ...prev, [fieldName]: message }));
    
    if (announceErrors) {
      announceError(`${fieldName}: ${message}`);
    }
  }, [customErrorMessages, announceErrors, announceError]);

  const setFieldSuccess = useCallback((fieldName: string, successMessage: string) => {
    const message = customSuccessMessages[fieldName] || successMessage;
    setSuccesses(prev => ({ ...prev, [fieldName]: message }));
    
    if (announceSuccess) {
      announceSuccess(`${fieldName}: ${message}`);
    }
  }, [customSuccessMessages, announceSuccess, announceSuccess]);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const clearFieldSuccess = useCallback((fieldName: string) => {
    setSuccesses(prev => {
      const newSuccesses = { ...prev };
      delete newSuccesses[fieldName];
      return newSuccesses;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearAllSuccesses = useCallback(() => {
    setSuccesses({});
  }, []);

  const getFieldError = useCallback((fieldName: string) => {
    return errors[fieldName];
  }, [errors]);

  const getFieldSuccess = useCallback((fieldName: string) => {
    return successes[fieldName];
  }, [successes]);

  const hasErrors = Object.keys(errors).length > 0;
  const hasSuccesses = Object.keys(successes).length > 0;

  const announceFormStatus = useCallback((status: 'success' | 'error' | 'info', message: string) => {
    if (status === 'error') {
      announceError(message);
    } else if (status === 'success') {
      announceSuccess(message);
    } else {
      announce(message);
    }
  }, [announce, announceError, announceSuccess]);

  const announceRequiredField = useCallback((fieldName: string) => {
    if (announceRequired) {
      announce(`${fieldName} is a required field`);
    }
  }, [announceRequired, announce]);

  return {
    errors,
    successes,
    hasErrors,
    hasSuccesses,
    setFieldError,
    setFieldSuccess,
    clearFieldError,
    clearFieldSuccess,
    clearAllErrors,
    clearAllSuccesses,
    getFieldError,
    getFieldSuccess,
    announceFormStatus,
    announceRequiredField
  };
}

/**
 * Hook for managing accessibility state
 */
export function useAccessibilityState() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);

  useEffect(() => {
    // Check for high contrast mode
    const checkHighContrast = () => {
      const mediaQuery = window.matchMedia('(prefers-contrast: high)');
      setIsHighContrast(mediaQuery.matches);
      
      mediaQuery.addEventListener('change', (e) => {
        setIsHighContrast(e.matches);
      });
    };

    // Check for reduced motion preference
    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mediaQuery.matches);
      
      mediaQuery.addEventListener('change', (e) => {
        setIsReducedMotion(e.matches);
      });
    };

    // Basic screen reader detection
    const checkScreenReader = () => {
      const hasScreenReader = 
        'speechSynthesis' in window ||
        'webkitSpeechSynthesis' in window ||
        document.querySelector('[aria-live]') !== null;
      
      setIsScreenReaderActive(hasScreenReader);
    };

    checkHighContrast();
    checkReducedMotion();
    checkScreenReader();

    return () => {
      // Cleanup listeners if needed
    };
  }, []);

  return {
    isHighContrast,
    isReducedMotion,
    isScreenReaderActive,
    setIsHighContrast,
    setIsReducedMotion,
    setIsScreenReaderActive
  };
}

/**
 * Hook for managing skip links
 */
export function useSkipLinks() {
  const [activeSkipLink, setActiveSkipLink] = useState<string | null>(null);

  const skipTo = useCallback((targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
      setActiveSkipLink(targetId);
      
      // Clear active state after a delay
      setTimeout(() => {
        setActiveSkipLink(null);
      }, 2000);
    }
  }, []);

  const skipToMain = useCallback(() => {
    skipTo('main-content');
  }, [skipTo]);

  const skipToNav = useCallback(() => {
    skipTo('main-navigation');
  }, [skipTo]);

  const skipToSearch = useCallback(() => {
    skipTo('search-input');
  }, [skipTo]);

  return {
    activeSkipLink,
    skipTo,
    skipToMain,
    skipToNav,
    skipToSearch
  };
}