import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { NavigationPage } from './pages/navigation.page';
import { e2eUtils } from './utils';

test.describe('Authentication Flow', () => {
  let loginPage: LoginPage;
  let navigationPage: NavigationPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    navigationPage = new NavigationPage(page);
    
    // Ensure deterministic starting state
    await e2eUtils.cleanup.resetAppState(page);
    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    await e2eUtils.cleanup.resetAppState(page);
  });

  test('should redirect to login page when not authenticated', async ({ page }) => {
    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    // Mock successful login
    await loginPage.mockSuccessfulLogin();
    
    await loginPage.goto();
    await loginPage.login('test@example.com', 'TestPassword123!');
    
    await expect(page).toHaveURL(/.*dashboard/);
    await navigationPage.expectUserLoggedIn('Test User', 'perfumer');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Mock failed login
    await loginPage.mockFailedLogin();
    
    await loginPage.goto();
    await loginPage.loginWithInvalidCredentials('invalid@example.com', 'wrongpassword');
    
    await loginPage.expectGeneralError('Invalid credentials');
  });

  test('should validate email format', async ({ page }) => {
    await loginPage.goto();
    await loginPage.fillEmail('invalid-email');
    await loginPage.fillPassword('password123');
    await loginPage.clickLoginButton();
    
    await loginPage.expectEmailError(/invalid email format/i);
  });

  test('should validate required fields', async ({ page }) => {
    await loginPage.goto();
    await loginPage.clickLoginButton();
    
    await loginPage.expectEmailError(/email is required/i);
    await loginPage.expectPasswordError(/password is required/i);
  });

  test('should show loading state during login', async ({ page }) => {
    await loginPage.handleSlowResponse();
    
    await loginPage.goto();
    await loginPage.fillEmail('test@example.com');
    await loginPage.fillPassword('TestPassword123!');
    await loginPage.clickLoginButton();
    
    await loginPage.expectLoadingState();
  });

  test('should toggle password visibility', async ({ page }) => {
    await loginPage.goto();
    await loginPage.fillPassword('password123');
    
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
    
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('should remember me functionality', async ({ page }) => {
    await loginPage.mockSuccessfulLogin();
    
    await loginPage.goto();
    await loginPage.fillEmail('test@example.com');
    await loginPage.fillPassword('TestPassword123!');
    await loginPage.checkRememberMe();
    await loginPage.login('test@example.com', 'TestPassword123!');
    
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Check if remember me was checked
    await page.goto('/login');
    await expect(loginPage.emailInput).toHaveValue('test@example.com');
  });

  test('should logout successfully', async ({ page }) => {
    await e2eUtils.auth.loginAs(page, 'user');
    
    await navigationPage.logout();
    await expect(page).toHaveURL(/.*login/);
    await navigationPage.expectUserNotLoggedIn();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    await loginPage.handleNetworkError();
    
    await loginPage.goto();
    await loginPage.login('test@example.com', 'TestPassword123!');
    
    await expect(page.getByText(/network error|connection failed/i)).toBeVisible();
  });

  test('should handle server errors gracefully', async ({ page }) => {
    await loginPage.handleServerError();
    
    await loginPage.goto();
    await loginPage.login('test@example.com', 'TestPassword123!');
    
    await expect(page.getByText(/internal server error/i)).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await loginPage.goto();
    await loginPage.expectKeyboardNavigation();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await loginPage.goto();
    await loginPage.expectFormLabels();
  });

  test('should redirect to intended page after login', async ({ page }) => {
    await loginPage.mockSuccessfulLogin();
    
    // Try to access protected page
    await page.goto('/ingredients');
    await expect(page).toHaveURL(/.*login/);
    
    // Login
    await loginPage.login('test@example.com', 'TestPassword123!');
    
    // Should redirect to originally requested page
    await expect(page).toHaveURL(/.*ingredients/);
  });

  test('should clear form on page reload', async ({ page }) => {
    await loginPage.goto();
    await loginPage.fillEmail('test@example.com');
    await loginPage.fillPassword('password123');
    
    await page.reload();
    
    await expect(loginPage.emailInput).toHaveValue('');
    await expect(loginPage.passwordInput).toHaveValue('');
  });

  test('should handle session expiry', async ({ page }) => {
    await e2eUtils.auth.loginAs(page, 'user');
    
    // Mock session expiry
    await e2eUtils.network.mockApiError(page, '/api/auth/me', 'Session expired', 401);
    
    await page.reload();
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByText(/session expired/i)).toBeVisible();
  });

  test('should prevent multiple login attempts', async ({ page }) => {
    await loginPage.handleSlowResponse();
    
    await loginPage.goto();
    await loginPage.fillEmail('test@example.com');
    await loginPage.fillPassword('TestPassword123!');
    
    // Click login button multiple times
    await loginPage.clickLoginButton();
    await loginPage.clickLoginButton();
    await loginPage.clickLoginButton();
    
    // Should only show one loading state
    await loginPage.expectLoadingState();
  });

  test('should work on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginPage.goto();
    
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should work on tablet devices', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await loginPage.goto();
    
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should handle different user roles', async ({ page }) => {
    // Test admin login
    await e2eUtils.auth.loginAs(page, 'admin');
    await navigationPage.expectUserLoggedIn('Admin User', 'administrator');
    
    await navigationPage.logout();
    
    // Test manager login
    await e2eUtils.auth.loginAs(page, 'manager');
    await navigationPage.expectUserLoggedIn('Manager User', 'lab_manager');
    
    await navigationPage.logout();
    
    // Test regular user login
    await e2eUtils.auth.loginAs(page, 'user');
    await navigationPage.expectUserLoggedIn('Regular User', 'perfumer');
  });

  test('should maintain login state across page refreshes', async ({ page }) => {
    await e2eUtils.auth.loginAs(page, 'user');
    
    await page.reload();
    await expect(page).toHaveURL(/.*dashboard/);
    await navigationPage.expectUserLoggedIn('Regular User', 'perfumer');
  });

  test('should handle concurrent login attempts', async ({ page, context }) => {
    const page2 = await context.newPage();
    const loginPage2 = new LoginPage(page2);
    
    await loginPage.mockSuccessfulLogin();
    await loginPage2.mockSuccessfulLogin();
    
    await loginPage.goto();
    await loginPage2.goto();
    
    await Promise.all([
      loginPage.login('test@example.com', 'TestPassword123!'),
      loginPage2.login('test@example.com', 'TestPassword123!'),
    ]);
    
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page2).toHaveURL(/.*dashboard/);
    
    await page2.close();
  });
});
