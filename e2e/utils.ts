import { Page, BrowserContext, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { IngredientsPage } from './pages/ingredients.page';
import { NavigationPage } from './pages/navigation.page';

/**
 * E2E test utilities and helpers
 */

// Page object factory
export const createPageObjects = (page: Page) => ({
  login: new LoginPage(page),
  ingredients: new IngredientsPage(page),
  navigation: new NavigationPage(page),
});

// Authentication helpers
export const authHelpers = {
  /**
   * Login with valid credentials
   */
  async loginAs(page: Page, userType: 'admin' | 'manager' | 'user' = 'user') {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    const credentials = {
      admin: { email: 'admin@example.com', password: 'AdminPassword123!' },
      manager: { email: 'manager@example.com', password: 'ManagerPassword123!' },
      user: { email: 'user@example.com', password: 'UserPassword123!' },
    };
    
    await loginPage.login(credentials[userType].email, credentials[userType].password);
    await expect(page).toHaveURL(/.*dashboard/);
  },

  /**
   * Login with invalid credentials
   */
  async loginWithInvalidCredentials(page: Page) {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithInvalidCredentials('invalid@example.com', 'wrongpassword');
  },

  /**
   * Logout from the application
   */
  async logout(page: Page) {
    const navigationPage = new NavigationPage(page);
    await navigationPage.logout();
    await expect(page).toHaveURL(/.*login/);
  },

  /**
   * Check if user is logged in
   */
  async isLoggedIn(page: Page): Promise<boolean> {
    try {
      await page.waitForSelector('[data-testid="user-menu"]', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Clear authentication state
   */
  async clearAuthState(page: Page) {
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  },
};

// Data helpers
export const dataHelpers = {
  /**
   * Generate test ingredient data
   */
  generateTestIngredient(overrides: any = {}) {
    return {
      id: `test-ingredient-${Date.now()}`,
      name: `Test Ingredient ${Date.now()}`,
      type: 'essential_oil',
      supplier: 'Test Supplier',
      cost: 25.50,
      stockLevel: 100,
      unit: 'ml',
      description: 'Test ingredient description',
      notes: 'Test notes',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides,
    };
  },

  /**
   * Generate test user data
   */
  generateTestUser(overrides: any = {}) {
    return {
      id: `test-user-${Date.now()}`,
      username: `testuser${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      roles: ['perfumer'],
      permissions: ['read', 'write'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides,
    };
  },

  /**
   * Generate test case data
   */
  generateTestCase(overrides: any = {}) {
    return {
      id: `test-case-${Date.now()}`,
      name: `Test Case ${Date.now()}`,
      status: 'draft',
      description: 'Test case description',
      ingredients: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides,
    };
  },
};

// Network helpers
export const networkHelpers = {
  /**
   * Mock successful API response
   */
  async mockApiResponse(page: Page, endpoint: string, data: any, status = 200) {
    await page.route(`**/api${endpoint}`, route => {
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(data),
      });
    });
  },

  /**
   * Mock API error response
   */
  async mockApiError(page: Page, endpoint: string, error = 'Internal server error', status = 500) {
    await page.route(`**/api${endpoint}`, route => {
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify({ error }),
      });
    });
  },

  /**
   * Mock network failure
   */
  async mockNetworkFailure(page: Page, endpoint: string) {
    await page.route(`**/api${endpoint}`, route => {
      route.abort('failed');
    });
  },

  /**
   * Mock slow response
   */
  async mockSlowResponse(page: Page, endpoint: string, delay = 5000) {
    await page.route(`**/api${endpoint}`, route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      }, delay);
    });
  },

  /**
   * Clear all route mocks
   */
  async clearMocks(page: Page) {
    await page.unroute('**/api/**');
  },
};

// File helpers
export const fileHelpers = {
  /**
   * Create test file for upload
   */
  async createTestFile(page: Page, fileName: string, content: string, mimeType = 'text/plain') {
    const buffer = Buffer.from(content);
    await page.evaluate(({ fileName, buffer, mimeType }) => {
      const blob = new Blob([buffer], { type: mimeType });
      const file = new File([blob], fileName, { type: mimeType });
      
      // Store file in window for test access
      (window as any).testFile = file;
    }, { fileName, buffer, mimeType });
  },

  /**
   * Upload test file
   */
  async uploadTestFile(page: Page, inputSelector: string, fileName: string, content: string) {
    await this.createTestFile(page, fileName, content);
    
    const fileInput = page.locator(inputSelector);
    await fileInput.setInputFiles({
      name: fileName,
      mimeType: 'text/plain',
      buffer: Buffer.from(content),
    });
  },

  /**
   * Download file and get content
   */
  async downloadFile(page: Page, downloadSelector: string): Promise<string> {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click(downloadSelector),
    ]);
    
    const path = await download.path();
    return await page.readFile(path);
  },
};

// Form helpers
export const formHelpers = {
  /**
   * Fill form with data
   */
  async fillForm(page: Page, formData: Record<string, string>) {
    for (const [field, value] of Object.entries(formData)) {
      const input = page.getByLabel(field);
      await input.fill(value);
    }
  },

  /**
   * Submit form
   */
  async submitForm(page: Page, submitButtonText = 'Submit') {
    await page.getByRole('button', { name: submitButtonText }).click();
  },

  /**
   * Clear form
   */
  async clearForm(page: Page, fields: string[]) {
    for (const field of fields) {
      const input = page.getByLabel(field);
      await input.clear();
    }
  },

  /**
   * Validate form errors
   */
  async expectFormErrors(page: Page, errors: Record<string, string>) {
    for (const [field, errorMessage] of Object.entries(errors)) {
      await expect(page.getByText(errorMessage)).toBeVisible();
    }
  },
};

// Wait helpers
export const waitHelpers = {
  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(page: Page) {
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
  },

  /**
   * Wait for element to be visible
   */
  async waitForElement(page: Page, selector: string, timeout = 10000) {
    await page.waitForSelector(selector, { state: 'visible', timeout });
  },

  /**
   * Wait for element to be hidden
   */
  async waitForElementHidden(page: Page, selector: string, timeout = 10000) {
    await page.waitForSelector(selector, { state: 'hidden', timeout });
  },

  /**
   * Wait for API call to complete
   */
  async waitForApiCall(page: Page, endpoint: string, timeout = 10000) {
    await page.waitForResponse(response => 
      response.url().includes(endpoint) && response.status() < 400,
      { timeout }
    );
  },

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(page: Page, urlPattern: string | RegExp) {
    await page.waitForURL(urlPattern);
  },
};

// Screenshot helpers
export const screenshotHelpers = {
  /**
   * Take screenshot with timestamp
   */
  async takeScreenshot(page: Page, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ 
      path: `e2e/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  },

  /**
   * Take screenshot of element
   */
  async takeElementScreenshot(page: Page, selector: string, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.locator(selector).screenshot({ 
      path: `e2e/screenshots/${name}-${timestamp}.png` 
    });
  },
};

// Accessibility helpers
export const a11yHelpers = {
  /**
   * Check keyboard navigation
   */
  async testKeyboardNavigation(page: Page, selectors: string[]) {
    for (let i = 0; i < selectors.length; i++) {
      const element = page.locator(selectors[i]);
      await element.focus();
      await expect(element).toBeFocused();
      
      if (i < selectors.length - 1) {
        await page.keyboard.press('Tab');
      }
    }
  },

  /**
   * Check ARIA labels
   */
  async checkAriaLabels(page: Page, selectors: string[]) {
    for (const selector of selectors) {
      const element = page.locator(selector);
      await expect(element).toHaveAttribute('aria-label');
    }
  },

  /**
   * Check color contrast (basic check)
   */
  async checkColorContrast(page: Page, selector: string) {
    const element = page.locator(selector);
    const styles = await element.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
      };
    });
    
    // Basic check - in real implementation, you'd use a proper contrast checker
    expect(styles.color).toBeTruthy();
    expect(styles.backgroundColor).toBeTruthy();
  },
};

// Performance helpers
export const performanceHelpers = {
  /**
   * Measure page load time
   */
  async measurePageLoadTime(page: Page, url: string): Promise<number> {
    const startTime = Date.now();
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    return Date.now() - startTime;
  },

  /**
   * Check for performance issues
   */
  async checkPerformanceMetrics(page: Page) {
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      };
    });
    
    return metrics;
  },
};

// Cleanup helpers
export const cleanupHelpers = {
  /**
   * Clean up test data
   */
  async cleanupTestData(page: Page, endpoints: string[]) {
    for (const endpoint of endpoints) {
      try {
        await page.request.delete(`/api${endpoint}`);
      } catch (error) {
        console.warn(`Failed to cleanup ${endpoint}:`, error);
      }
    }
  },

  /**
   * Reset application state
   */
  async resetAppState(page: Page) {
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  },

  /**
   * Close all modals and overlays
   */
  async closeAllModals(page: Page) {
    // Try to close any open modals
    const modals = page.locator('[role="dialog"]');
    const count = await modals.count();
    
    for (let i = 0; i < count; i++) {
      const modal = modals.nth(i);
      const closeButton = modal.getByRole('button', { name: /close|cancel/i });
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }
  },
};

// Export all helpers as a single object
export const e2eUtils = {
  auth: authHelpers,
  data: dataHelpers,
  network: networkHelpers,
  file: fileHelpers,
  form: formHelpers,
  wait: waitHelpers,
  screenshot: screenshotHelpers,
  a11y: a11yHelpers,
  performance: performanceHelpers,
  cleanup: cleanupHelpers,
};

export default e2eUtils;
