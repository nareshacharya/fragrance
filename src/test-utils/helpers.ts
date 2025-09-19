import { ReactElement } from 'react';
import { screen, within, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// User event helpers
export const createUserEvent = () => userEvent.setup();

// Form helpers
export const fillInput = async (labelOrPlaceholder: string, value: string) => {
  const user = createUserEvent();
  let input: HTMLElement;
  
  try {
    input = screen.queryByLabelText(labelOrPlaceholder) || screen.queryByPlaceholderText(labelOrPlaceholder);
    if (!input) {
      // If no match and the provided string equals 'textbox' (case-insensitive), call screen.getByRole('textbox') without a name
      if (labelOrPlaceholder.toLowerCase() === 'textbox') {
        input = screen.getByRole('textbox');
      } else {
        // If still no match, try screen.getByRole('textbox', { name: labelOrPlaceholder })
        input = screen.getByRole('textbox', { name: labelOrPlaceholder });
      }
    }
  } catch {
    // Final fallback - try to get any textbox
    input = screen.getByRole('textbox');
  }
  
  await user.clear(input);
  await user.type(input, value);
  return input;
};

export const selectOption = async (labelOrRole: string, optionText: string) => {
  const user = createUserEvent();
  let select: HTMLElement;
  
  try {
    select = screen.getByLabelText(labelOrRole);
  } catch {
    select = screen.getByRole('combobox', { name: labelOrRole });
  }
  
  await user.click(select);
  const option = screen.getByRole('option', { name: optionText });
  await user.click(option);
  return option;
};

export const checkCheckbox = async (labelOrRole: string) => {
  const user = createUserEvent();
  let checkbox: HTMLElement;
  
  try {
    checkbox = screen.getByLabelText(labelOrRole);
  } catch {
    checkbox = screen.getByRole('checkbox', { name: labelOrRole });
  }
  
  await user.click(checkbox);
  return checkbox;
};

export const submitForm = async (formName?: string) => {
  const user = createUserEvent();
  let form: HTMLElement;
  
  try {
    if (formName) {
      form = screen.getByRole('form', { name: formName });
    } else {
      form = screen.getByRole('form');
    }
  } catch {
    // Fallback to finding form by data-testid or DOM query
    const formElement = document.querySelector('form[data-testid="form"]') || document.querySelector('form');
    if (!formElement) {
      throw new Error('No form element found. Please ensure a form element exists with data-testid="form" or use a proper form role.');
    }
    form = formElement as HTMLElement;
  }
  
  const submitButton = within(form).getByRole('button', { name: /submit|save|create|update/i });
  await user.click(submitButton);
  return form;
};

// Button and interaction helpers
export const clickButton = async (buttonName: string) => {
  const user = createUserEvent();
  const button = screen.getByRole('button', { name: buttonName });
  await user.click(button);
  return button;
};

export const clickLink = async (linkName: string) => {
  const user = createUserEvent();
  const link = screen.getByRole('link', { name: linkName });
  await user.click(link);
  return link;
};

export const hoverElement = async (element: HTMLElement) => {
  const user = createUserEvent();
  await user.hover(element);
  return element;
};

export const focusElement = async (element: HTMLElement) => {
  const user = createUserEvent();
  await user.click(element);
  return element;
};

// Keyboard helpers
export const pressKey = async (key: string, element?: HTMLElement) => {
  const user = createUserEvent();
  if (element) {
    await user.type(element, `{${key}}`);
  } else {
    await user.keyboard(`{${key}}`);
  }
};

export const pressEscape = async () => pressKey('Escape');
export const pressEnter = async () => pressKey('Enter');
export const pressTab = async () => pressKey('Tab');
export const pressSpace = async () => pressKey(' ');

// File upload helpers
export const uploadFile = async (inputLabel: string, file: File) => {
  const user = createUserEvent();
  const input = screen.getByLabelText(inputLabel) as HTMLInputElement;
  await user.upload(input, file);
  return input;
};

export const createMockFile = (name: string = 'test.jpg', type: string = 'image/jpeg', size: number = 1024): File => {
  return new File(['mock file content'], name, { type, lastModified: Date.now() });
};

// Wait helpers
export const waitForElement = async (
  callback: () => HTMLElement | Promise<HTMLElement>,
  options?: { timeout?: number }
) => {
  return waitFor(callback, options);
};

export const waitForElementToBeRemoved = async (
  element: HTMLElement | (() => HTMLElement),
  options?: { timeout?: number }
) => {
  return waitFor(() => {
    const el = typeof element === 'function' ? element() : element;
    expect(el).not.toBeInTheDocument();
  }, options);
};

export const waitForLoadingToFinish = async () => {
  await waitFor(() => {
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });
};

// Table helpers
export const getTableRow = (text: string) => {
  return screen.getByRole('row', { name: new RegExp(text, 'i') });
};

export const getTableCell = (row: HTMLElement, columnName: string) => {
  return within(row).getByRole('cell', { name: new RegExp(columnName, 'i') });
};

export const getTableHeaders = (table?: HTMLElement) => {
  const tableElement = table || screen.getByRole('table');
  return within(tableElement).getAllByRole('columnheader');
};

export const getTableRows = (table?: HTMLElement) => {
  const tableElement = table || screen.getByRole('table');
  const allRows = within(tableElement).getAllByRole('row');
  // Remove header row
  return allRows.slice(1);
};

export const sortTable = async (columnName: string) => {
  const user = createUserEvent();
  const header = screen.getByRole('columnheader', { name: new RegExp(columnName, 'i') });
  const sortButton = within(header).getByRole('button');
  await user.click(sortButton);
  return header;
};

// Modal helpers
export const openModal = async (triggerText: string) => {
  const user = createUserEvent();
  const trigger = screen.getByText(triggerText);
  await user.click(trigger);
  
  return waitFor(() => {
    return screen.getByRole('dialog');
  });
};

export const closeModal = async () => {
  const user = createUserEvent();
  const closeButton = screen.getByRole('button', { name: /close|cancel|×/i });
  await user.click(closeButton);
  
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
};

// Dropdown/Select helpers
export const openDropdown = async (triggerText: string) => {
  const user = createUserEvent();
  const trigger = screen.getByRole('button', { name: new RegExp(triggerText, 'i') });
  await user.click(trigger);
  
  return waitFor(() => {
    try {
      return screen.getByRole('menu');
    } catch {
      return screen.getByRole('listbox');
    }
  });
};

export const selectDropdownOption = async (optionText: string) => {
  const user = createUserEvent();
  let option: HTMLElement;
  
  try {
    option = screen.getByRole('menuitem', { name: new RegExp(optionText, 'i') });
  } catch {
    option = screen.getByRole('option', { name: new RegExp(optionText, 'i') });
  }
  
  await user.click(option);
  return option;
};

// Search helpers
export const performSearch = async (searchTerm: string, inputLabel: string = 'Search') => {
  const user = createUserEvent();
  let searchInput: HTMLElement;
  
  try {
    searchInput = screen.getByLabelText(searchTerm);
  } catch {
    try {
      searchInput = screen.getByPlaceholderText(searchTerm);
    } catch {
      searchInput = screen.getByRole('searchbox');
    }
  }
  
  await user.clear(searchInput);
  await user.type(searchInput, searchTerm);
  
  // Look for search button or submit on enter
  const searchButton = screen.queryByRole('button', { name: /search/i });
  if (searchButton) {
    await user.click(searchButton);
  } else {
    await user.keyboard('{Enter}');
  }
  
  return searchInput;
};

export const clearSearch = async (inputLabel: string = 'Search') => {
  const user = createUserEvent();
  let searchInput: HTMLElement;
  
  try {
    searchInput = screen.getByLabelText(inputLabel);
  } catch {
    try {
      searchInput = screen.getByPlaceholderText(inputLabel);
    } catch {
      searchInput = screen.getByRole('searchbox');
    }
  }
  
  await user.clear(searchInput);
  
  // Look for clear button
  const clearButton = screen.queryByRole('button', { name: /clear/i });
  if (clearButton) {
    await user.click(clearButton);
  }
  
  return searchInput;
};

// Filter helpers
export const applyFilter = async (filterName: string, filterValue: string) => {
  const user = createUserEvent();
  
  // Open filter dropdown
  const filterButton = screen.getByRole('button', { name: new RegExp(filterName, 'i') });
  await user.click(filterButton);
  
  // Select filter value
  let option: HTMLElement;
  try {
    option = screen.getByRole('menuitem', { name: new RegExp(filterValue, 'i') });
  } catch {
    option = screen.getByRole('option', { name: new RegExp(filterValue, 'i') });
  }
  
  await user.click(option);
  return option;
};

export const clearFilters = async () => {
  const user = createUserEvent();
  const clearButton = screen.getByRole('button', { name: /clear filters|reset/i });
  await user.click(clearButton);
  return clearButton;
};

// Pagination helpers
export const goToPage = async (pageNumber: number) => {
  const user = createUserEvent();
  const pageButton = screen.getByRole('button', { name: String(pageNumber) });
  await user.click(pageButton);
  return pageButton;
};

export const goToNextPage = async () => {
  const user = createUserEvent();
  const nextButton = screen.getByRole('button', { name: /next/i });
  await user.click(nextButton);
  return nextButton;
};

export const goToPreviousPage = async () => {
  const user = createUserEvent();
  const prevButton = screen.getByRole('button', { name: /previous/i });
  await user.click(prevButton);
  return prevButton;
};

// Accessibility helpers
export const checkAccessibility = (element: HTMLElement) => {
  // Check for aria labels
  const hasAriaLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');
  
  // Check for proper roles
  const hasRole = element.hasAttribute('role');
  
  // Check for keyboard accessibility
  const isFocusable = element.tabIndex >= 0 || 
                     ['button', 'input', 'select', 'textarea', 'a'].includes(element.tagName.toLowerCase());
  
  return {
    hasAriaLabel,
    hasRole,
    isFocusable,
    isAccessible: hasAriaLabel && isFocusable,
  };
};

export const checkKeyboardNavigation = async (elements: HTMLElement[]) => {
  const user = createUserEvent();
  
  for (let i = 0; i < elements.length; i++) {
    await user.tab();
    expect(elements[i]).toHaveFocus();
  }
};

// Error helpers
export const expectError = (errorMessage: string) => {
  let errorElement: HTMLElement;
  
  try {
    errorElement = screen.getByRole('alert');
  } catch {
    try {
      errorElement = screen.getByText(errorMessage);
    } catch {
      errorElement = screen.getByTestId('error');
    }
  }
  
  expect(errorElement).toBeInTheDocument();
  return errorElement;
};

export const expectNoError = () => {
  const errorElement = screen.queryByRole('alert') || screen.queryByTestId('error');
  expect(errorElement).not.toBeInTheDocument();
};

// Loading helpers
export const expectLoading = () => {
  let loadingElement: HTMLElement;
  
  try {
    loadingElement = screen.getByTestId('loading');
  } catch {
    try {
      loadingElement = screen.getByText(/loading/i);
    } catch {
      loadingElement = screen.getByRole('progressbar');
    }
  }
  
  expect(loadingElement).toBeInTheDocument();
  return loadingElement;
};

export const expectNotLoading = () => {
  const loadingElement = screen.queryByTestId('loading') || 
                        screen.queryByText(/loading/i) ||
                        screen.queryByRole('progressbar');
  expect(loadingElement).not.toBeInTheDocument();
};

// Custom matchers
export const toBeInViewport = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Test data helpers
export const generateTestId = (prefix: string = 'test'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateTestEmail = (prefix: string = 'test'): string => {
  return `${prefix}-${Date.now()}@example.com`;
};

export const generateTestName = (prefix: string = 'Test'): string => {
  return `${prefix} ${Date.now()}`;
};

// Mock function helpers
export const createMockFunction = <T extends (...args: any[]) => any>(
  returnValue?: ReturnType<T>
): jest.MockedFunction<T> => {
  const mockFn = jest.fn() as jest.MockedFunction<T>;
  if (returnValue !== undefined) {
    mockFn.mockReturnValue(returnValue);
  }
  return mockFn;
};

export const createAsyncMockFunction = <T extends (...args: any[]) => Promise<any>>(
  returnValue?: Awaited<ReturnType<T>>
): jest.MockedFunction<T> => {
  const mockFn = jest.fn() as jest.MockedFunction<T>;
  if (returnValue !== undefined) {
    mockFn.mockResolvedValue(returnValue);
  }
  return mockFn;
};

// Utility function to simulate delays in tests
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Debug helpers
export const debugElement = (element: HTMLElement) => {
  console.log('Element:', element);
  console.log('InnerHTML:', element.innerHTML);
  console.log('Attributes:', element.attributes);
  console.log('Classes:', element.className);
};

export const debugScreen = () => {
  screen.debug();
};

export const logTestInfo = (testName: string, additionalInfo?: any) => {
  console.log(`\n--- Test: ${testName} ---`);
  if (additionalInfo) {
    console.log('Additional Info:', additionalInfo);
  }
};

// Component testing helpers
export const expectComponentToRender = (component: ReactElement) => {
  expect(component).toBeTruthy();
};

export const expectComponentToHaveProps = (component: ReactElement, props: object) => {
  expect(component.props).toMatchObject(props);
};

// Snapshot testing helpers
export const expectMatchesSnapshot = (component: ReactElement) => {
  expect(component).toMatchSnapshot();
};

export const expectMatchesInlineSnapshot = (component: ReactElement, snapshot?: string) => {
  if (snapshot) {
    expect(component).toMatchInlineSnapshot(snapshot);
  } else {
    expect(component).toMatchInlineSnapshot();
  }
};

export default {
  // User events
  createUserEvent,
  
  // Form helpers
  fillInput,
  selectOption,
  checkCheckbox,
  submitForm,
  
  // Interaction helpers
  clickButton,
  clickLink,
  hoverElement,
  focusElement,
  
  // Keyboard helpers
  pressKey,
  pressEscape,
  pressEnter,
  pressTab,
  pressSpace,
  
  // File upload helpers
  uploadFile,
  createMockFile,
  
  // Wait helpers
  waitForElement,
  waitForElementToBeRemoved,
  waitForLoadingToFinish,
  
  // Table helpers
  getTableRow,
  getTableCell,
  getTableHeaders,
  getTableRows,
  sortTable,
  
  // Modal helpers
  openModal,
  closeModal,
  
  // Dropdown helpers
  openDropdown,
  selectDropdownOption,
  
  // Search helpers
  performSearch,
  clearSearch,
  
  // Filter helpers
  applyFilter,
  clearFilters,
  
  // Pagination helpers
  goToPage,
  goToNextPage,
  goToPreviousPage,
  
  // Accessibility helpers
  checkAccessibility,
  checkKeyboardNavigation,
  
  // Error helpers
  expectError,
  expectNoError,
  
  // Loading helpers
  expectLoading,
  expectNotLoading,
  
  // Test data helpers
  generateTestId,
  generateTestEmail,
  generateTestName,
  
  // Mock helpers
  createMockFunction,
  createAsyncMockFunction,
  
  // Utility helpers
  delay,
  
  // Debug helpers
  debugElement,
  debugScreen,
  logTestInfo,
  
  // Component testing helpers
  expectComponentToRender,
  expectComponentToHaveProps,
  expectMatchesSnapshot,
  expectMatchesInlineSnapshot,
};
