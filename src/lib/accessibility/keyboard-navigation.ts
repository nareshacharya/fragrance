/**
 * Keyboard navigation utilities for handling complex keyboard interactions and navigation patterns
 */

export interface KeyboardHandler {
  key: string;
  handler: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

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

export interface ArrowNavigationOptions {
  /** Orientation of navigation */
  orientation?: 'horizontal' | 'vertical' | 'both';
  /** Whether to wrap around when reaching the end */
  wrap?: boolean;
  /** Whether to skip disabled elements */
  skipDisabled?: boolean;
  /** Custom selector for focusable elements */
  selector?: string;
}

/**
 * Standard keyboard codes
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
  END: 'End'
} as const;

/**
 * Create a keyboard navigation manager for an element
 */
export function createKeyboardNavigation(
  element: HTMLElement,
  options: KeyboardNavigationOptions = {}
): () => void {
  const {
    handleTab = false,
    handleEnter = true,
    handleEscape = true,
    handleArrows = true,
    handleSpace = true,
    customHandlers = [],
    preventDefault = true,
    stopPropagation = false
  } = options;

  const handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event;

    // Handle custom keyboard shortcuts
    for (const handler of customHandlers) {
      if (handler.key === key) {
        handler.handler(event);
        
        if (handler.preventDefault !== false) {
          event.preventDefault();
        }
        if (handler.stopPropagation) {
          event.stopPropagation();
        }
        return;
      }
    }

    // Handle standard keys
    switch (key) {
      case KEYBOARD_CODES.TAB:
        if (handleTab) {
          handleTabNavigation(event);
        }
        break;
      case KEYBOARD_CODES.ENTER:
        if (handleEnter) {
          handleEnterKey(event);
        }
        break;
      case KEYBOARD_CODES.ESCAPE:
        if (handleEscape) {
          handleEscapeKey(event);
        }
        break;
      case KEYBOARD_CODES.SPACE:
        if (handleSpace) {
          handleSpaceKey(event);
        }
        break;
      case KEYBOARD_CODES.ARROW_UP:
      case KEYBOARD_CODES.ARROW_DOWN:
      case KEYBOARD_CODES.ARROW_LEFT:
      case KEYBOARD_CODES.ARROW_RIGHT:
        if (handleArrows) {
          handleArrowKeys(event);
        }
        break;
    }

    // Apply default behavior control
    if (preventDefault && shouldPreventDefault(key)) {
      event.preventDefault();
    }
    if (stopPropagation && shouldStopPropagation(key)) {
      event.stopPropagation();
    }
  };

  const shouldPreventDefault = (key: string): boolean => {
    const preventDefaultKeys = [
      KEYBOARD_CODES.SPACE,
      KEYBOARD_CODES.ARROW_UP,
      KEYBOARD_CODES.ARROW_DOWN,
      KEYBOARD_CODES.ARROW_LEFT,
      KEYBOARD_CODES.ARROW_RIGHT
    ];
    return preventDefaultKeys.includes(key as any);
  };

  const shouldStopPropagation = (key: string): boolean => {
    const stopPropagationKeys = [
      KEYBOARD_CODES.ARROW_UP,
      KEYBOARD_CODES.ARROW_DOWN,
      KEYBOARD_CODES.ARROW_LEFT,
      KEYBOARD_CODES.ARROW_RIGHT,
      KEYBOARD_CODES.HOME,
      KEYBOARD_CODES.END
    ];
    return stopPropagationKeys.includes(key as any);
  };

  const handleTabNavigation = (event: KeyboardEvent) => {
    // Tab navigation is typically handled by the browser
  };

  const handleEnterKey = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    
    if (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') {
      target.click();
    } else if (target.tagName === 'A' && target.getAttribute('href')) {
      target.click();
    }
  };

  const handleEscapeKey = (event: KeyboardEvent) => {
    const escapeEvent = new CustomEvent('keyboard-escape', {
      detail: { originalEvent: event },
      bubbles: true
    });
    element.dispatchEvent(escapeEvent);
  };

  const handleSpaceKey = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    
    if (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') {
      target.click();
    } else if (target.tagName === 'A' && target.getAttribute('href')) {
      target.click();
    }
  };

  const handleArrowKeys = (event: KeyboardEvent) => {
    const { key } = event;
    
    const arrowEvent = new CustomEvent(`keyboard-arrow-${key.toLowerCase()}`, {
      detail: { originalEvent: event },
      bubbles: true
    });
    element.dispatchEvent(arrowEvent);
  };

  // Add event listener
  element.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Create arrow key navigation for a list or grid of elements
 */
export function createArrowNavigation(
  container: HTMLElement,
  options: ArrowNavigationOptions = {}
): () => void {
  const {
    orientation = 'both',
    wrap = false,
    skipDisabled = true,
    selector = 'button, [role="button"], [role="menuitem"], [role="option"], [tabindex]:not([tabindex="-1"])'
  } = options;

  let currentIndex = 0;
  let focusableElements: HTMLElement[] = [];

  const updateFocusableElements = () => {
    const elements = Array.from(container.querySelectorAll(selector)) as HTMLElement[];
    focusableElements = skipDisabled 
      ? elements.filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-disabled'))
      : elements;
    
    if (currentIndex >= focusableElements.length) {
      currentIndex = Math.max(0, focusableElements.length - 1);
    }
  };

  const focusElement = (index: number) => {
    if (focusableElements[index]) {
      focusableElements[index].focus();
      currentIndex = index;
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event;
    
    if (!focusableElements.length) return;

    switch (key) {
      case KEYBOARD_CODES.ARROW_UP:
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          if (currentIndex > 0) {
            focusElement(currentIndex - 1);
          } else if (wrap) {
            focusElement(focusableElements.length - 1);
          }
        }
        break;
      case KEYBOARD_CODES.ARROW_DOWN:
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          if (currentIndex < focusableElements.length - 1) {
            focusElement(currentIndex + 1);
          } else if (wrap) {
            focusElement(0);
          }
        }
        break;
      case KEYBOARD_CODES.ARROW_LEFT:
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          if (currentIndex > 0) {
            focusElement(currentIndex - 1);
          } else if (wrap) {
            focusElement(focusableElements.length - 1);
          }
        }
        break;
      case KEYBOARD_CODES.ARROW_RIGHT:
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          if (currentIndex < focusableElements.length - 1) {
            focusElement(currentIndex + 1);
          } else if (wrap) {
            focusElement(0);
          }
        }
        break;
      case KEYBOARD_CODES.HOME:
        event.preventDefault();
        focusElement(0);
        break;
      case KEYBOARD_CODES.END:
        event.preventDefault();
        focusElement(focusableElements.length - 1);
        break;
    }
  };

  const handleFocus = (event: FocusEvent) => {
    const target = event.target as HTMLElement;
    const index = focusableElements.indexOf(target);
    if (index !== -1) {
      currentIndex = index;
    }
  };

  // Initialize
  updateFocusableElements();

  // Add event listeners
  container.addEventListener('keydown', handleKeyDown);
  container.addEventListener('focusin', handleFocus);

  // Update focusable elements when DOM changes
  const observer = new MutationObserver(updateFocusableElements);
  observer.observe(container, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['disabled', 'aria-disabled', 'tabindex']
  });

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
    container.removeEventListener('focusin', handleFocus);
    observer.disconnect();
  };
}

/**
 * Handle keyboard navigation for modal dialogs
 */
export function createModalKeyboardNavigation(
  modalElement: HTMLElement,
  onClose: () => void
): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case KEYBOARD_CODES.ESCAPE:
        onClose();
        break;
    }
  };

  modalElement.addEventListener('keydown', handleKeyDown);

  return () => {
    modalElement.removeEventListener('keydown', handleKeyDown);
  };
}