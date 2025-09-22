/**
 * Focus management utilities for handling focus traps, focus restoration, and keyboard navigation
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
 * CSS selector for focusable elements
 */
export const FOCUSABLE_SELECTOR = `
  button:not([disabled]),
  [href],
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  [tabindex]:not([tabindex="-1"]):not([disabled]),
  details,
  summary,
  [contenteditable="true"]:not([disabled])
`.replace(/\s+/g, ' ').trim();

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
  
  // Filter out elements that are not visible or are in hidden containers
  return elements.filter((element) => {
    const el = element as HTMLElement;
    const style = window.getComputedStyle(el);
    
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      !el.hasAttribute('aria-hidden') &&
      !isElementHidden(el)
    );
  }) as HTMLElement[];
}

/**
 * Check if an element is hidden (including in hidden parents)
 */
export function isElementHidden(element: HTMLElement): boolean {
  let current = element;
  
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return true;
    }
    current = current.parentElement as HTMLElement;
  }
  
  return false;
}

/**
 * Create a focus trap manager for a container element
 */
export function createFocusTrap(
  container: HTMLElement,
  options: FocusTrapOptions = {}
): FocusManager {
  const {
    trapFocus = true,
    restoreFocus = true,
    initialFocus,
    finalFocus,
    preventScroll = false
  } = options;

  let isActive = false;
  let previouslyFocusedElement: HTMLElement | null = null;
  let focusableElements: HTMLElement[] = [];
  let currentIndex = -1;

  /**
   * Update the list of focusable elements
   */
  function updateFocusableElements() {
    focusableElements = getFocusableElements(container);
    currentIndex = -1;
  }

  /**
   * Handle keydown events for focus management
   */
  function handleKeyDown(event: KeyboardEvent) {
    if (!isActive || focusableElements.length === 0) return;

    const { key } = event;

    switch (key) {
      case 'Tab':
        event.preventDefault();
        if (event.shiftKey) {
          focusPrevious();
        } else {
          focusNext();
        }
        break;
      case 'Home':
        event.preventDefault();
        focusFirst();
        break;
      case 'End':
        event.preventDefault();
        focusLast();
        break;
    }
  }

  /**
   * Focus the first focusable element
   */
  function focusFirst(): boolean {
    if (focusableElements.length === 0) return false;
    
    const firstElement = focusableElements[0];
    firstElement.focus({ preventScroll });
    currentIndex = 0;
    return true;
  }

  /**
   * Focus the last focusable element
   */
  function focusLast(): boolean {
    if (focusableElements.length === 0) return false;
    
    const lastElement = focusableElements[focusableElements.length - 1];
    lastElement.focus({ preventScroll });
    currentIndex = focusableElements.length - 1;
    return true;
  }

  /**
   * Focus the next focusable element
   */
  function focusNext(): boolean {
    if (focusableElements.length === 0) return false;
    
    currentIndex = (currentIndex + 1) % focusableElements.length;
    const nextElement = focusableElements[currentIndex];
    nextElement.focus({ preventScroll });
    return true;
  }

  /**
   * Focus the previous focusable element
   */
  function focusPrevious(): boolean {
    if (focusableElements.length === 0) return false;
    
    currentIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
    const previousElement = focusableElements[currentIndex];
    previousElement.focus({ preventScroll });
    return true;
  }

  /**
   * Focus a specific element
   */
  function focusElement(element: HTMLElement): boolean {
    if (!focusableElements.includes(element)) return false;
    
    element.focus({ preventScroll });
    currentIndex = focusableElements.indexOf(element);
    return true;
  }

  /**
   * Activate the focus trap
   */
  function activate() {
    if (isActive) return;
    
    isActive = true;
    
    // Store the currently focused element
    previouslyFocusedElement = document.activeElement as HTMLElement;
    
    // Update focusable elements
    updateFocusableElements();
    
    // Add event listeners
    if (trapFocus) {
      container.addEventListener('keydown', handleKeyDown);
    }
    
    // Focus initial element
    if (initialFocus) {
      const elementToFocus = typeof initialFocus === 'function' ? initialFocus() : initialFocus;
      if (elementToFocus && focusElement(elementToFocus)) {
        return;
      }
    }
    
    // Fallback to first focusable element
    if (focusableElements.length > 0) {
      focusFirst();
    }
  }

  /**
   * Deactivate the focus trap
   */
  function deactivate() {
    if (!isActive) return;
    
    isActive = false;
    
    // Remove event listeners
    container.removeEventListener('keydown', handleKeyDown);
    
    // Restore focus
    if (restoreFocus && previouslyFocusedElement) {
      previouslyFocusedElement.focus({ preventScroll });
    } else if (finalFocus) {
      const elementToFocus = typeof finalFocus === 'function' ? finalFocus() : finalFocus;
      if (elementToFocus) {
        elementToFocus.focus({ preventScroll });
      }
    }
    
    // Clean up
    focusableElements = [];
    currentIndex = -1;
    previouslyFocusedElement = null;
  }

  return {
    activate,
    deactivate,
    updateFocusableElements,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious
  };
}

/**
 * Restore focus to a specific element
 */
export function restoreFocus(element: HTMLElement | null, preventScroll = false) {
  if (!element) return;
  
  // Ensure the element is still in the DOM
  if (!document.body.contains(element)) return;
  
  element.focus({ preventScroll });
}

/**
 * Store the currently focused element for later restoration
 */
export function storeFocusedElement(): HTMLElement | null {
  return document.activeElement as HTMLElement;
}

/**
 * Check if an element can receive focus
 */
export function canReceiveFocus(element: HTMLElement): boolean {
  if (isElementHidden(element)) return false;
  
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  
  // Check if element is focusable
  return element.matches(FOCUSABLE_SELECTOR);
}

/**
 * Get the next focusable element in the document
 */
export function getNextFocusableElement(
  currentElement: HTMLElement,
  container?: HTMLElement
): HTMLElement | null {
  const searchContainer = container || document.body;
  const focusableElements = getFocusableElements(searchContainer);
  const currentIndex = focusableElements.indexOf(currentElement);
  
  if (currentIndex === -1 || currentIndex === focusableElements.length - 1) {
    return null;
  }
  
  return focusableElements[currentIndex + 1];
}

/**
 * Get the previous focusable element in the document
 */
export function getPreviousFocusableElement(
  currentElement: HTMLElement,
  container?: HTMLElement
): HTMLElement | null {
  const searchContainer = container || document.body;
  const focusableElements = getFocusableElements(searchContainer);
  const currentIndex = focusableElements.indexOf(currentElement);
  
  if (currentIndex === -1 || currentIndex === 0) {
    return null;
  }
  
  return focusableElements[currentIndex - 1];
}

/**
 * Focus the first focusable element in a container
 */
export function focusFirstInContainer(container: HTMLElement, preventScroll = false): boolean {
  const focusableElements = getFocusableElements(container);
  
  if (focusableElements.length === 0) return false;
  
  focusableElements[0].focus({ preventScroll });
  return true;
}

/**
 * Focus the last focusable element in a container
 */
export function focusLastInContainer(container: HTMLElement, preventScroll = false): boolean {
  const focusableElements = getFocusableElements(container);
  
  if (focusableElements.length === 0) return false;
  
  focusableElements[focusableElements.length - 1].focus({ preventScroll });
  return true;
}

/**
 * Handle escape key to close modals/dropdowns
 */
export function createEscapeHandler(
  callback: () => void,
  container?: HTMLElement
): (event: KeyboardEvent) => void {
  return (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (container) {
        // Only trigger if the escape key was pressed within the container
        if (container.contains(event.target as Node)) {
          callback();
        }
      } else {
        callback();
      }
    }
  };
}

/**
 * Focus management for modal dialogs
 */
export function createModalFocusManager(
  modalElement: HTMLElement,
  triggerElement?: HTMLElement
): FocusManager {
  return createFocusTrap(modalElement, {
    trapFocus: true,
    restoreFocus: true,
    initialFocus: () => {
      // Try to focus the first focusable element in the modal
      const focusableElements = getFocusableElements(modalElement);
      return focusableElements.length > 0 ? focusableElements[0] : modalElement;
    },
    finalFocus: triggerElement
  });
}

/**
 * Focus management for dropdown menus
 */
export function createDropdownFocusManager(
  dropdownElement: HTMLElement,
  triggerElement?: HTMLElement
): FocusManager {
  return createFocusTrap(dropdownElement, {
    trapFocus: true,
    restoreFocus: true,
    initialFocus: () => {
      // For dropdowns, focus the first menu item
      const menuItems = dropdownElement.querySelectorAll('[role="menuitem"], [role="option"]');
      return menuItems.length > 0 ? menuItems[0] as HTMLElement : dropdownElement;
    },
    finalFocus: triggerElement
  });
}