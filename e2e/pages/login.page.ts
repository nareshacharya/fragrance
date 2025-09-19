import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loadingSpinner: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly showPasswordButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Form elements
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.loginButton = page.getByRole('button', { name: /sign in|login/i });
    this.rememberMeCheckbox = page.getByLabel(/remember me/i);
    this.showPasswordButton = page.getByRole('button', { name: /show password|hide password/i });
    
    // Links
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
    this.registerLink = page.getByRole('link', { name: /register|sign up/i });
    
    // Status elements
    this.errorMessage = page.getByRole('alert');
    this.loadingSpinner = page.getByTestId('loading');
  }

  async goto() {
    await this.page.goto('/login');
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async login(email: string, password: string, options: {
    rememberMe?: boolean;
    waitForRedirect?: boolean;
  } = {}) {
    const { rememberMe = false, waitForRedirect = true } = options;

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    }

    await this.loginButton.click();

    if (waitForRedirect) {
      await this.page.waitForURL('**/dashboard**', { timeout: 10000 });
    }
  }

  async loginWithInvalidCredentials(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    
    await expect(this.errorMessage).toBeVisible();
  }

  async togglePasswordVisibility() {
    await this.showPasswordButton.click();
  }

  async clearForm() {
    await this.emailInput.clear();
    await this.passwordInput.clear();
    await this.rememberMeCheckbox.uncheck();
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async clickRegister() {
    await this.registerLink.click();
  }

  async checkRememberMe() {
    await this.rememberMeCheckbox.check();
  }

  async uncheckRememberMe() {
    await this.rememberMeCheckbox.uncheck();
  }

  // Validation methods
  async expectEmailError(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectPasswordError(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectGeneralError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }

  async expectNoErrors() {
    await expect(this.errorMessage).not.toBeVisible();
  }

  async expectLoadingState() {
    await expect(this.loadingSpinner).toBeVisible();
    await expect(this.loginButton).toBeDisabled();
  }

  async expectNotLoading() {
    await expect(this.loadingSpinner).not.toBeVisible();
    await expect(this.loginButton).toBeEnabled();
  }

  // Accessibility methods
  async expectKeyboardNavigation() {
    await this.emailInput.focus();
    await expect(this.emailInput).toBeFocused();
    
    await this.page.keyboard.press('Tab');
    await expect(this.passwordInput).toBeFocused();
    
    await this.page.keyboard.press('Tab');
    await expect(this.loginButton).toBeFocused();
  }

  async expectFormLabels() {
    await expect(this.emailInput).toHaveAttribute('aria-label');
    await expect(this.passwordInput).toHaveAttribute('aria-label');
  }

  // Utility methods
  async getEmailValue() {
    return await this.emailInput.inputValue();
  }

  async getPasswordValue() {
    return await this.passwordInput.inputValue();
  }

  async isRememberMeChecked() {
    return await this.rememberMeCheckbox.isChecked();
  }

  async isPasswordVisible() {
    return await this.passwordInput.getAttribute('type') === 'text';
  }

  async isLoginButtonEnabled() {
    return await this.loginButton.isEnabled();
  }

  async isLoginButtonLoading() {
    return await this.loadingSpinner.isVisible();
  }

  // Error handling
  async handleNetworkError() {
    await this.page.route('**/api/auth/login', route => {
      route.abort('failed');
    });
  }

  async handleServerError() {
    await this.page.route('**/api/auth/login', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });
  }

  async handleSlowResponse() {
    await this.page.route('**/api/auth/login', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      }, 5000);
    });
  }

  // Mock methods for testing
  async mockSuccessfulLogin() {
    await this.page.route('**/api/auth/login', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
          },
          token: {
            accessToken: 'mock-token',
            tokenType: 'Bearer',
            expiresAt: new Date(Date.now() + 3600000).toISOString(),
          },
        }),
      });
    });
  }

  async mockFailedLogin() {
    await this.page.route('**/api/auth/login', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Invalid credentials',
        }),
      });
    });
  }

  // Cleanup
  async cleanup() {
    await this.page.unroute('**/api/auth/login');
  }
}
