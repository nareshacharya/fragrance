import { Page, Locator, expect } from '@playwright/test';

export class NavigationPage {
  readonly page: Page;
  
  // Header elements
  readonly header: Locator;
  readonly logo: Locator;
  readonly userMenu: Locator;
  readonly userAvatar: Locator;
  readonly userName: Locator;
  readonly userRole: Locator;
  
  // Sidebar elements
  readonly sidebar: Locator;
  readonly sidebarToggle: Locator;
  readonly dashboardLink: Locator;
  readonly ingredientsLink: Locator;
  readonly casesLink: Locator;
  readonly usersLink: Locator;
  readonly settingsLink: Locator;
  readonly logoutButton: Locator;
  
  // Breadcrumb
  readonly breadcrumb: Locator;
  readonly breadcrumbItems: Locator;
  
  // Mobile navigation
  readonly mobileMenuButton: Locator;
  readonly mobileMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Header elements
    this.header = page.getByTestId('header');
    this.logo = page.getByTestId('logo');
    this.userMenu = page.getByTestId('user-menu');
    this.userAvatar = page.getByTestId('user-avatar');
    this.userName = page.getByTestId('user-name');
    this.userRole = page.getByTestId('user-role');
    
    // Sidebar elements
    this.sidebar = page.getByTestId('sidebar');
    this.sidebarToggle = page.getByTestId('sidebar-toggle');
    this.dashboardLink = page.getByRole('link', { name: /dashboard/i });
    this.ingredientsLink = page.getByRole('link', { name: /ingredients/i });
    this.casesLink = page.getByRole('link', { name: /cases/i });
    this.usersLink = page.getByRole('link', { name: /users/i });
    this.settingsLink = page.getByRole('link', { name: /settings/i });
    this.logoutButton = page.getByRole('button', { name: /logout/i });
    
    // Breadcrumb
    this.breadcrumb = page.getByTestId('breadcrumb');
    this.breadcrumbItems = page.getByTestId('breadcrumb-item');
    
    // Mobile navigation
    this.mobileMenuButton = page.getByTestId('mobile-menu-button');
    this.mobileMenu = page.getByTestId('mobile-menu');
  }

  async goto() {
    await this.page.goto('/dashboard');
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.header).toBeVisible();
  }

  // Navigation methods
  async navigateToDashboard() {
    await this.dashboardLink.click();
    await this.page.waitForURL('**/dashboard**');
  }

  async navigateToIngredients() {
    await this.ingredientsLink.click();
    await this.page.waitForURL('**/ingredients**');
  }

  async navigateToCases() {
    await this.casesLink.click();
    await this.page.waitForURL('**/cases**');
  }

  async navigateToUsers() {
    await this.usersLink.click();
    await this.page.waitForURL('**/users**');
  }

  async navigateToSettings() {
    await this.settingsLink.click();
    await this.page.waitForURL('**/settings**');
  }

  // Sidebar interactions
  async toggleSidebar() {
    await this.sidebarToggle.click();
  }

  async expandSidebar() {
    if (await this.sidebar.getAttribute('data-collapsed') === 'true') {
      await this.toggleSidebar();
    }
  }

  async collapseSidebar() {
    if (await this.sidebar.getAttribute('data-collapsed') === 'false') {
      await this.toggleSidebar();
    }
  }

  async isSidebarExpanded() {
    return await this.sidebar.getAttribute('data-collapsed') === 'false';
  }

  async isSidebarCollapsed() {
    return await this.sidebar.getAttribute('data-collapsed') === 'true';
  }

  // User menu interactions
  async openUserMenu() {
    await this.userMenu.click();
  }

  async closeUserMenu() {
    await this.page.keyboard.press('Escape');
  }

  async clickUserProfile() {
    await this.openUserMenu();
    await this.page.getByRole('menuitem', { name: /profile/i }).click();
  }

  async clickUserSettings() {
    await this.openUserMenu();
    await this.page.getByRole('menuitem', { name: /settings/i }).click();
  }

  async logout() {
    await this.openUserMenu();
    await this.logoutButton.click();
    await this.page.waitForURL('**/login**');
  }

  // Breadcrumb interactions
  async getBreadcrumbItems() {
    const items = await this.breadcrumbItems.all();
    return await Promise.all(items.map(item => item.textContent()));
  }

  async clickBreadcrumbItem(itemText: string) {
    await this.breadcrumb.getByRole('link', { name: itemText }).click();
  }

  async expectBreadcrumbPath(expectedPath: string[]) {
    const actualPath = await this.getBreadcrumbItems();
    expect(actualPath).toEqual(expectedPath);
  }

  // Mobile navigation
  async openMobileMenu() {
    await this.mobileMenuButton.click();
    await expect(this.mobileMenu).toBeVisible();
  }

  async closeMobileMenu() {
    await this.page.keyboard.press('Escape');
    await expect(this.mobileMenu).not.toBeVisible();
  }

  async navigateMobileTo(page: string) {
    await this.openMobileMenu();
    await this.page.getByRole('link', { name: page }).click();
  }

  // User information
  async getUserName() {
    return await this.userName.textContent();
  }

  async getUserRole() {
    return await this.userRole.textContent();
  }

  async getUserAvatar() {
    return await this.userAvatar.getAttribute('src');
  }

  // Validation methods
  async expectUserLoggedIn(userName: string, userRole: string) {
    await expect(this.userName).toContainText(userName);
    await expect(this.userRole).toContainText(userRole);
  }

  async expectUserNotLoggedIn() {
    await expect(this.userMenu).not.toBeVisible();
  }

  async expectActiveNavigationItem(itemName: string) {
    const link = this.page.getByRole('link', { name: itemName });
    await expect(link).toHaveClass(/active/);
  }

  async expectInactiveNavigationItem(itemName: string) {
    const link = this.page.getByRole('link', { name: itemName });
    await expect(link).not.toHaveClass(/active/);
  }

  async expectSidebarVisible() {
    await expect(this.sidebar).toBeVisible();
  }

  async expectSidebarHidden() {
    await expect(this.sidebar).not.toBeVisible();
  }

  async expectMobileMenuVisible() {
    await expect(this.mobileMenu).toBeVisible();
  }

  async expectMobileMenuHidden() {
    await expect(this.mobileMenu).not.toBeVisible();
  }

  // Accessibility
  async expectKeyboardNavigation() {
    await this.sidebarToggle.focus();
    await expect(this.sidebarToggle).toBeFocused();
    
    await this.page.keyboard.press('Tab');
    await expect(this.dashboardLink).toBeFocused();
    
    await this.page.keyboard.press('Tab');
    await expect(this.ingredientsLink).toBeFocused();
  }

  async expectProperLabels() {
    await expect(this.sidebarToggle).toHaveAttribute('aria-label');
    await expect(this.userMenu).toHaveAttribute('aria-label');
    await expect(this.dashboardLink).toHaveAttribute('aria-label');
    await expect(this.ingredientsLink).toHaveAttribute('aria-label');
  }

  async expectNavigationAnnouncements() {
    // Check if navigation changes are announced to screen readers
    const announcements = await this.page.getByRole('status').all();
    expect(announcements.length).toBeGreaterThan(0);
  }

  // Responsive behavior
  async setMobileViewport() {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }

  async setTabletViewport() {
    await this.page.setViewportSize({ width: 768, height: 1024 });
  }

  async setDesktopViewport() {
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }

  async expectMobileLayout() {
    await this.setMobileViewport();
    await expect(this.mobileMenuButton).toBeVisible();
    await expect(this.sidebar).not.toBeVisible();
  }

  async expectDesktopLayout() {
    await this.setDesktopViewport();
    await expect(this.sidebar).toBeVisible();
    await expect(this.mobileMenuButton).not.toBeVisible();
  }

  // Role-based navigation
  async expectAdminNavigation() {
    await expect(this.usersLink).toBeVisible();
    await expect(this.settingsLink).toBeVisible();
  }

  async expectManagerNavigation() {
    await expect(this.casesLink).toBeVisible();
    await expect(this.usersLink).not.toBeVisible();
  }

  async expectUserNavigation() {
    await expect(this.dashboardLink).toBeVisible();
    await expect(this.ingredientsLink).toBeVisible();
    await expect(this.usersLink).not.toBeVisible();
    await expect(this.settingsLink).not.toBeVisible();
  }

  // Error handling
  async handleNavigationError() {
    await this.page.route('**/api/auth/me', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Unauthorized' }),
      });
    });
  }

  async handleLogoutError() {
    await this.page.route('**/api/auth/logout', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Logout failed' }),
      });
    });
  }

  // Mock user data
  async mockUserData(user: any) {
    await this.page.route('**/api/auth/me', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(user),
      });
    });
  }

  async mockAdminUser() {
    await this.mockUserData({
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      roles: ['administrator'],
      permissions: ['read', 'write', 'delete', 'admin'],
    });
  }

  async mockManagerUser() {
    await this.mockUserData({
      id: '2',
      username: 'manager',
      email: 'manager@example.com',
      firstName: 'Manager',
      lastName: 'User',
      roles: ['lab_manager'],
      permissions: ['read', 'write', 'manage_cases'],
    });
  }

  async mockRegularUser() {
    await this.mockUserData({
      id: '3',
      username: 'user',
      email: 'user@example.com',
      firstName: 'Regular',
      lastName: 'User',
      roles: ['perfumer'],
      permissions: ['read', 'write'],
    });
  }

  // Cleanup
  async cleanup() {
    await this.page.unroute('**/api/auth/me');
    await this.page.unroute('**/api/auth/logout');
  }
}
