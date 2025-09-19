/**
 * Test utilities index - exports all testing utilities for easy imports
 */

// Re-export everything from render utilities
export * from './render';

// Re-export everything from mocks
export * from './mocks';

// Re-export everything from factories
export * from './factories';

// Re-export everything from helpers
export * from './helpers';

// Re-export MSW server for tests to use server.use(...)
export { mockServer as server } from './msw-server';

// Export default render function as the main render
export { render as default } from './render';

// Export commonly used testing library utilities
export {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  fireEvent,
  act,
  cleanup,
  configure,
  getByRole,
  getByText,
  getByLabelText,
  getByPlaceholderText,
  getByTestId,
  getByDisplayValue,
  getByAltText,
  getByTitle,
  getAllByRole,
  getAllByText,
  getAllByLabelText,
  getAllByPlaceholderText,
  getAllByTestId,
  getAllByDisplayValue,
  getAllByAltText,
  getAllByTitle,
  queryByRole,
  queryByText,
  queryByLabelText,
  queryByPlaceholderText,
  queryByTestId,
  queryByDisplayValue,
  queryByAltText,
  queryByTitle,
  queryAllByRole,
  queryAllByText,
  queryAllByLabelText,
  queryAllByPlaceholderText,
  queryAllByTestId,
  queryAllByDisplayValue,
  queryAllByAltText,
  queryAllByTitle,
  findByRole,
  findByText,
  findByLabelText,
  findByPlaceholderText,
  findByTestId,
  findByDisplayValue,
  findByAltText,
  findByTitle,
  findAllByRole,
  findAllByText,
  findAllByLabelText,
  findAllByPlaceholderText,
  findAllByTestId,
  findAllByDisplayValue,
  findAllByAltText,
  findAllByTitle,
  prettyDOM,
  logRoles,
  within,
} from '@testing-library/react';

// Export user-event
export { default as userEvent } from '@testing-library/user-event';

// Export jest matchers
import '@testing-library/jest-dom';

// Custom test utilities
export const testUtils = {
  // Setup and teardown
  setup: () => {
    // Global test setup if needed
  },
  teardown: () => {
    // Global test teardown if needed
    cleanup();
  },
  
  // Common test patterns
  expectToBeInDocument: (element: HTMLElement | null) => {
    expect(element).toBeInTheDocument();
  },
  
  expectNotToBeInDocument: (element: HTMLElement | null) => {
    expect(element).not.toBeInTheDocument();
  },
  
  expectToHaveClass: (element: HTMLElement, className: string) => {
    expect(element).toHaveClass(className);
  },
  
  expectToBeVisible: (element: HTMLElement) => {
    expect(element).toBeVisible();
  },
  
  expectToBeDisabled: (element: HTMLElement) => {
    expect(element).toBeDisabled();
  },
  
  expectToBeEnabled: (element: HTMLElement) => {
    expect(element).toBeEnabled();
  },
  
  expectToHaveValue: (element: HTMLElement, value: string | number) => {
    expect(element).toHaveValue(value);
  },
  
  expectToHaveTextContent: (element: HTMLElement, text: string) => {
    expect(element).toHaveTextContent(text);
  },
  
  expectToHaveAttribute: (element: HTMLElement, attribute: string, value?: string) => {
    if (value !== undefined) {
      expect(element).toHaveAttribute(attribute, value);
    } else {
      expect(element).toHaveAttribute(attribute);
    }
  },
  
  expectToHaveFocus: (element: HTMLElement) => {
    expect(element).toHaveFocus();
  },
  
  expectToBeChecked: (element: HTMLElement) => {
    expect(element).toBeChecked();
  },
  
  expectNotToBeChecked: (element: HTMLElement) => {
    expect(element).not.toBeChecked();
  },
  
  expectToBePartiallyChecked: (element: HTMLElement) => {
    expect(element).toBePartiallyChecked();
  },
  
  expectToBeInvalid: (element: HTMLElement) => {
    expect(element).toBeInvalid();
  },
  
  expectToBeValid: (element: HTMLElement) => {
    expect(element).toBeValid();
  },
  
  expectToBeRequired: (element: HTMLElement) => {
    expect(element).toBeRequired();
  },
  
  expectToHaveDescription: (element: HTMLElement, description: string) => {
    expect(element).toHaveDescription(description);
  },
  
  expectToHaveAccessibleName: (element: HTMLElement, name: string) => {
    expect(element).toHaveAccessibleName(name);
  },
  
  expectToHaveAccessibleDescription: (element: HTMLElement, description: string) => {
    expect(element).toHaveAccessibleDescription(description);
  },
  
  expectToHaveStyle: (element: HTMLElement, styles: Record<string, any>) => {
    expect(element).toHaveStyle(styles);
  },
  
  expectToHaveDisplayValue: (element: HTMLElement, value: string) => {
    expect(element).toHaveDisplayValue(value);
  },
  
  expectToBeEmpty: (element: HTMLElement) => {
    expect(element).toBeEmptyDOMElement();
  },
  
  expectToContainElement: (container: HTMLElement, element: HTMLElement) => {
    expect(container).toContainElement(element);
  },
  
  expectToContainHTML: (container: HTMLElement, html: string) => {
    expect(container).toContainHTML(html);
  },
  
  expectToHaveFormValues: (form: HTMLElement, values: Record<string, any>) => {
    expect(form).toHaveFormValues(values);
  },
};

// Common test data
export const testData = {
  users: {
    admin: {
      id: 'admin-1',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'administrator' as const,
      department: 'management' as const,
      isActive: true,
    },
    manager: {
      id: 'manager-1',
      email: 'manager@example.com',
      firstName: 'Manager',
      lastName: 'User',
      role: 'lab_manager' as const,
      department: 'research' as const,
      isActive: true,
    },
    user: {
      id: 'user-1',
      email: 'user@example.com',
      firstName: 'Regular',
      lastName: 'User',
      role: 'perfumer' as const,
      department: 'research' as const,
      isActive: true,
    },
  },
  
  credentials: {
    valid: {
      email: 'test@example.com',
      password: 'TestPassword123!',
    },
    invalid: {
      email: 'invalid-email',
      password: '123',
    },
  },
  
  ingredients: {
    essential_oil: {
      id: 'ingredient-1',
      name: 'Lavender Essential Oil',
      type: 'essential_oil' as const,
      supplier: 'Natural Oils Inc',
      cost: 25.50,
      stockLevel: 100,
      unit: 'ml' as const,
    },
    synthetic: {
      id: 'ingredient-2',
      name: 'Synthetic Vanillin',
      type: 'synthetic' as const,
      supplier: 'Chemical Solutions',
      cost: 15.00,
      stockLevel: 500,
      unit: 'g' as const,
    },
  },
  
  forms: {
    valid: {
      name: 'Test Item',
      email: 'test@example.com',
      description: 'This is a test description',
    },
    invalid: {
      name: '',
      email: 'invalid-email',
      description: '',
    },
  },
};

// Test configuration
export const testConfig = {
  defaultTimeout: 5000,
  longTimeout: 10000,
  animationTimeout: 1000,
  
  // Feature flags for testing
  features: {
    enableAnimations: false,
    enableRealTimeUpdates: false,
    enableMockData: true,
  },
  
  // API endpoints for testing
  endpoints: {
    api: 'http://localhost:3000/api',
    auth: 'http://localhost:3000/api/auth',
    ingredients: 'http://localhost:3000/api/ingredients',
  },
  
  // User roles for testing
  roles: {
    admin: ['admin', 'manager', 'user'],
    manager: ['manager', 'user'],
    user: ['user'],
  },
  
  // Permissions for testing
  permissions: {
    admin: ['read', 'write', 'delete', 'admin'],
    manager: ['read', 'write', 'manage'],
    user: ['read'],
  },
};

// Test helpers for common patterns
export const testHelpers = {
  // Simulate network delay
  delay: (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Create mock event
  createMockEvent: (type: string, properties: any = {}) => ({
    type,
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    target: {},
    currentTarget: {},
    ...properties,
  }),
  
  // Create mock file
  createMockFile: (name: string = 'test.jpg', type: string = 'image/jpeg') => 
    new File([''], name, { type }),
  
  // Mock console methods
  mockConsole: () => {
    const originalConsole = { ...console };
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
    console.info = jest.fn();
    
    return {
      restore: () => {
        Object.assign(console, originalConsole);
      },
    };
  },
  
  // Mock window methods
  mockWindow: (properties: any = {}) => {
    const originalWindow = { ...window };
    Object.assign(window, properties);
    
    return {
      restore: () => {
        Object.assign(window, originalWindow);
      },
    };
  },
  
  // Mock local storage
  mockLocalStorage: () => {
    const mockStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true,
    });
    
    return mockStorage;
  },
  
  // Mock fetch
  mockFetch: (response: any = {}, ok: boolean = true) => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
      status: ok ? 200 : 400,
      statusText: ok ? 'OK' : 'Bad Request',
    });
    
    global.fetch = mockFetch;
    return mockFetch;
  },
};

// Performance testing utilities
export const performanceUtils = {
  // Measure render time
  measureRender: async (renderFn: () => void) => {
    const start = performance.now();
    renderFn();
    await waitFor(() => {});
    const end = performance.now();
    return end - start;
  },
  
  // Check if render is under threshold
  expectRenderTimeUnder: async (renderFn: () => void, threshold: number = 100) => {
    const renderTime = await performanceUtils.measureRender(renderFn);
    expect(renderTime).toBeLessThan(threshold);
  },
};

// Accessibility testing utilities
export const a11yUtils = {
  // Check for accessibility violations (would integrate with jest-axe)
  expectNoA11yViolations: async (container: HTMLElement) => {
    // This would use jest-axe or similar
    // For now, just check basic accessibility
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('type');
    });
    
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });
  },
  
  // Check keyboard navigation
  expectKeyboardNavigation: async (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    expect(focusableElements.length).toBeGreaterThan(0);
    
    // Each focusable element should be reachable by tab
    for (const element of Array.from(focusableElements)) {
      expect(element).not.toHaveAttribute('tabindex', '-1');
    }
  },
  
  // Check ARIA labels
  expectAriaLabels: (container: HTMLElement) => {
    const interactiveElements = container.querySelectorAll(
      'button, [role="button"], input, select, textarea'
    );
    
    interactiveElements.forEach(element => {
      const hasLabel = element.hasAttribute('aria-label') || 
                      element.hasAttribute('aria-labelledby') ||
                      element.querySelector('label');
      
      expect(hasLabel).toBeTruthy();
    });
  },
};

// Export all utilities as a single object for convenience
export const testingUtils = {
  ...testUtils,
  ...testHelpers,
  ...performanceUtils,
  ...a11yUtils,
  testData,
  testConfig,
};
