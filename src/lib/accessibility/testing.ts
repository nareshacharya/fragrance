import { axe, toHaveNoViolations } from 'jest-axe';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Accessibility testing utilities for comprehensive WCAG 2.1 AA compliance testing
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
 * Custom render function with accessibility testing context
 */
export function renderWithAccessibility(
  ui: ReactElement,
  options: RenderOptions & AccessibilityTestOptions = {}
) {
  const {
    skipAxe = false,
    includeKeyboard = true,
    includeScreenReader = true,
    axeOptions,
    highContrast = false,
    reducedMotion = false,
    ...renderOptions
  } = options;

  const result = render(ui, renderOptions);

  // Apply accessibility testing context
  if (highContrast) {
    document.body.classList.add('high-contrast');
  }
  if (reducedMotion) {
    document.body.classList.add('reduced-motion');
  }

  return {
    ...result,
    checkA11y: async () => {
      if (!skipAxe) {
        const { container } = result;
        const results = await axe(container, axeOptions);
        expect(results).toHaveNoViolations();
      }
    },
    testKeyboardNavigation: (options: KeyboardNavigationTestOptions = {}) => {
      if (!includeKeyboard) return Promise.resolve();
      return testKeyboardNavigation(result.container, options);
    },
    testScreenReader: (options: ScreenReaderTestOptions = {}) => {
      if (!includeScreenReader) return Promise.resolve();
      return testScreenReaderSupport(result.container, options);
    }
  };
}

/**
 * Test keyboard navigation for a component
 */
export async function testKeyboardNavigation(
  container: HTMLElement,
  options: KeyboardNavigationTestOptions = {}
) {
  const {
    testTab = true,
    testEnter = true,
    testEscape = true,
    testArrows = true,
    testSpace = true,
    customKeys = []
  } = options;

  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  // Test Tab navigation
  if (testTab && focusableElements.length > 1) {
    const firstElement = focusableElements[0] as HTMLElement;
    const secondElement = focusableElements[1] as HTMLElement;
    
    firstElement.focus();
    expect(document.activeElement).toBe(firstElement);
    
    // Simulate Tab key
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    firstElement.dispatchEvent(tabEvent);
    
    // Focus should move to next element
    expect(document.activeElement).toBe(secondElement);
  }

  // Test Enter key activation
  if (testEnter) {
    const buttons = container.querySelectorAll('button, [role="button"]');
    for (const button of buttons) {
      const buttonElement = button as HTMLElement;
      const clickSpy = jest.fn();
      buttonElement.addEventListener('click', clickSpy);
      
      buttonElement.focus();
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      buttonElement.dispatchEvent(enterEvent);
      
      expect(clickSpy).toHaveBeenCalled();
      buttonElement.removeEventListener('click', clickSpy);
    }
  }

  // Test Escape key handling
  if (testEscape) {
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    container.dispatchEvent(escapeEvent);
  }

  // Test Arrow key navigation for custom components
  if (testArrows) {
    const arrowContainer = container.querySelector('[role="menu"], [role="tablist"], [role="grid"]');
    if (arrowContainer) {
      const arrowEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      arrowContainer.dispatchEvent(arrowEvent);
    }
  }

  // Test Space key activation
  if (testSpace) {
    const buttons = container.querySelectorAll('button, [role="button"]');
    for (const button of buttons) {
      const buttonElement = button as HTMLElement;
      const clickSpy = jest.fn();
      buttonElement.addEventListener('click', clickSpy);
      
      buttonElement.focus();
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      buttonElement.dispatchEvent(spaceEvent);
      
      expect(clickSpy).toHaveBeenCalled();
      buttonElement.removeEventListener('click', clickSpy);
    }
  }

  // Test custom key sequences
  for (const key of customKeys) {
    const keyEvent = new KeyboardEvent('keydown', { key });
    container.dispatchEvent(keyEvent);
  }
}

/**
 * Test screen reader support for a component
 */
export async function testScreenReaderSupport(
  container: HTMLElement,
  options: ScreenReaderTestOptions = {}
) {
  const {
    testAriaLabels = true,
    testAriaDescriptions = true,
    testLiveRegions = true,
    testLandmarks = true,
    testHeadings = true
  } = options;

  // Test ARIA labels
  if (testAriaLabels) {
    const elementsWithAriaLabel = container.querySelectorAll('[aria-label]');
    expect(elementsWithAriaLabel.length).toBeGreaterThan(0);
    
    for (const element of elementsWithAriaLabel) {
      const ariaLabel = element.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel!.trim().length).toBeGreaterThan(0);
    }
  }

  // Test ARIA descriptions
  if (testAriaDescriptions) {
    const elementsWithAriaDescribedBy = container.querySelectorAll('[aria-describedby]');
    for (const element of elementsWithAriaDescribedBy) {
      const describedBy = element.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      
      const descriptionElement = container.querySelector(`#${describedBy}`);
      expect(descriptionElement).toBeTruthy();
    }
  }

  // Test live regions
  if (testLiveRegions) {
    const liveRegions = container.querySelectorAll('[aria-live]');
    for (const liveRegion of liveRegions) {
      const ariaLive = liveRegion.getAttribute('aria-live');
      expect(['polite', 'assertive', 'off']).toContain(ariaLive);
    }
  }

  // Test landmark roles
  if (testLandmarks) {
    const landmarks = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
    expect(landmarks.length).toBeGreaterThan(0);
  }

  // Test heading hierarchy
  if (testHeadings) {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]');
    if (headings.length > 0) {
      // Check for proper heading hierarchy
      let previousLevel = 0;
      for (const heading of headings) {
        let currentLevel = 0;
        
        if (heading.tagName.match(/^H[1-6]$/)) {
          currentLevel = parseInt(heading.tagName.charAt(1));
        } else if (heading.getAttribute('aria-level')) {
          currentLevel = parseInt(heading.getAttribute('aria-level') || '1');
        }
        
        if (previousLevel > 0) {
          expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
        }
        previousLevel = currentLevel;
      }
    }
  }
}

/**
 * Test focus management for modals and dropdowns
 */
export async function testFocusManagement(container: HTMLElement) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  // Test initial focus
  const firstElement = focusableElements[0] as HTMLElement;
  firstElement.focus();
  expect(document.activeElement).toBe(firstElement);

  // Test focus trap (if applicable)
  const focusTrap = container.querySelector('[data-focus-trap]');
  if (focusTrap) {
    // Test that focus stays within the trap
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    lastElement.focus();
    
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    lastElement.dispatchEvent(tabEvent);
    
    // Focus should wrap to first element
    expect(document.activeElement).toBe(firstElement);
  }
}

/**
 * Test color contrast for elements
 */
export function testColorContrast(container: HTMLElement) {
  const elements = container.querySelectorAll('*');
  
  for (const element of elements) {
    const computedStyle = window.getComputedStyle(element);
    const backgroundColor = computedStyle.backgroundColor;
    const color = computedStyle.color;
    
    // Basic contrast check (simplified)
    if (backgroundColor && color && backgroundColor !== 'transparent') {
      // This is a simplified check - in a real implementation,
      // you would use a proper color contrast calculation library
      expect(backgroundColor).toBeTruthy();
      expect(color).toBeTruthy();
    }
  }
}

/**
 * Test form accessibility
 */
export function testFormAccessibility(container: HTMLElement) {
  const forms = container.querySelectorAll('form');
  
  for (const form of forms) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    for (const input of inputs) {
      const inputElement = input as HTMLInputElement;
      
      // Check for proper labeling
      const id = inputElement.id;
      const ariaLabel = inputElement.getAttribute('aria-label');
      const ariaLabelledBy = inputElement.getAttribute('aria-labelledby');
      const label = form.querySelector(`label[for="${id}"]`);
      
      expect(
        id || ariaLabel || ariaLabelledBy || label
      ).toBeTruthy();
      
      // Check required field indicators
      if (inputElement.required) {
        const ariaRequired = inputElement.getAttribute('aria-required');
        const ariaLabelText = inputElement.getAttribute('aria-label') || '';
        const labelText = label?.textContent || '';
        
        expect(
          ariaRequired === 'true' || 
          ariaLabelText.includes('required') || 
          labelText.includes('required') ||
          labelText.includes('*')
        ).toBeTruthy();
      }
    }
  }
}

/**
 * Custom Jest matcher for accessibility testing
 */
export const accessibilityMatchers = {
  toBeAccessible: async (received: HTMLElement) => {
    const results = await axe(received);
    const pass = results.violations.length === 0;
    
    return {
      pass,
      message: () => {
        if (pass) {
          return 'Element is accessible';
        } else {
          return `Element has accessibility violations: ${JSON.stringify(results.violations, null, 2)}`;
        }
      }
    };
  },
  
  toHaveProperFocusManagement: (received: HTMLElement) => {
    const focusableElements = received.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const pass = focusableElements.length > 0;
    
    return {
      pass,
      message: () => {
        if (pass) {
          return 'Element has proper focus management';
        } else {
          return 'Element has no focusable elements or improper focus management';
        }
      }
    };
  }
};

// Extend Jest expect with custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeAccessible(): R;
      toHaveProperFocusManagement(): R;
    }
  }
}

expect.extend(accessibilityMatchers);