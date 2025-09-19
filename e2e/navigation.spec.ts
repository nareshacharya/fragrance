import { test, expect } from '@playwright/test';
import { NavigationPage } from './pages/navigation.page';
import { LoginPage } from './pages/login.page';
import { e2eUtils } from './utils';

test.describe('Navigation E2E Tests', () => {
  let navigationPage: NavigationPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    navigationPage = new NavigationPage(page);
    loginPage = new LoginPage(page);
  });

  test.afterEach(async ({ page }) => {
    await e2eUtils.cleanup.resetAppState(page);
  });

  test.describe('Authentication Navigation', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
      await navigationPage.goto();
      await expect(page).toHaveURL(/.*login/);
    });

    test('should display user information when authenticated', async ({ page }) => {
      await e2eUtils.auth.loginAs(page, 'user');
      
      await navigationPage.expectUserLoggedIn('Regular User', 'perfumer');
      await expect(navigationPage.userMenu).toBeVisible();
      await expect(navigationPage.userAvatar).toBeVisible();
    });

    test('should logout successfully', async ({ page }) => {
      await e2eUtils.auth.loginAs(page, 'user');
      await navigationPage.logout();
      
      await expect(page).toHaveURL(/.*login/);
      await navigationPage.expectUserNotLoggedIn();
    });
  });

  test.describe('Main Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await e2eUtils.auth.loginAs(page, 'user');
    });

    test('should navigate to dashboard', async ({ page }) => {
      await navigationPage.navigateToDashboard();
      await expect(page).toHaveURL(/.*dashboard/);
      await navigationPage.expectActiveNavigationItem('Dashboard');
    });

    test('should navigate to ingredients', async ({ page }) => {
      await navigationPage.navigateToIngredients();
      await expect(page).toHaveURL(/.*ingredients/);
      await navigationPage.expectActiveNavigationItem('Ingredients');
    });

    test('should navigate to cases', async ({ page }) => {
      await navigationPage.navigateToCases();
      await expect(page).toHaveURL(/.*cases/);
      await navigationPage.expectActiveNavigationItem('Cases');
    });

    test('should navigate to settings', async ({ page }) => {
      await navigationPage.navigateToSettings();
      await expect(page).toHaveURL(/.*settings/);
      await navigationPage.expectActiveNavigationItem('Settings');
    });
  });

  test.describe('Sidebar Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await e2eUtils.auth.loginAs(page, 'user');
    });

    test('should toggle sidebar visibility', async ({ page }) => {
      await navigationPage.toggleSidebar();
      await navigationPage.expectSidebarCollapsed();
      
      await navigationPage.toggleSidebar();
      await navigationPage.expectSidebarExpanded();
    });

    test('should expand sidebar by default on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await navigationPage.expectDesktopLayout();
      await navigationPage.expectSidebarExpanded();
    });

    test('should hide sidebar on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await navigationPage.expectMobileLayout();
      await navigationPage.expectSidebarHidden();
    });
  });

  test.describe('User Menu', () => {
    test.beforeEach(async ({ page }) => {
      await e2eUtils.auth.loginAs(page, 'user');
    });

    test('should open user menu', async ({ page }) => {
      await navigationPage.openUserMenu();
      await expect(navigationPage.page.getByRole('menu')).toBeVisible();
    });

    test('should close user menu on escape', async ({ page }) => {
      await navigationPage.openUserMenu();
      await navigationPage.closeUserMenu();
      await expect(navigationPage.page.getByRole('menu')).not.toBeVisible();
    });

    test('should navigate to user profile', async ({ page }) => {
      await navigationPage.clickUserProfile();
      await expect(page).toHaveURL(/.*profile/);
    });

    test('should navigate to user settings', async ({ page }) => {
      await navigationPage.clickUserSettings();
      await expect(page).toHaveURL(/.*settings/);
    });
  });

  test.describe('Breadcrumb Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await e2eUtils.auth.loginAs(page, 'user');
    });

    test('should display breadcrumb on nested pages', async ({ page }) => {
      await navigationPage.navigateToIngredients();
      await expect(navigationPage.breadcrumb).toBeVisible();
      
      const breadcrumbItems = await navigationPage.getBreadcrumbItems();
      expect(breadcrumbItems).toContain('Dashboard');
      expect(breadcrumbItems).toContain('Ingredients');
    });

    test('should navigate via breadcrumb', async ({ page }) => {
      await navigationPage.navigateToIngredients();
      await navigationPage.clickBreadcrumbItem('Dashboard');
      await expect(page).toHaveURL(/.*dashboard/);
    });

    test('should show correct breadcrumb path', async ({ page }) => {
      await navigationPage.navigateToIngredients();
      await navigationPage.expectBreadcrumbPath(['Dashboard', 'Ingredients']);
    });
  });

  test.describe('Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await e2eUtils.auth.loginAs(page, 'user');
      await page.setViewportSize({ width: 375, height: 667 });
    });

    test('should open mobile menu', async ({ page }) => {
      await navigationPage.openMobileMenu();
      await navigationPage.expectMobileMenuVisible();
    });

    test('should close mobile menu on escape', async ({ page }) => {
      await navigationPage.openMobileMenu();
      await navigationPage.closeMobileMenu();
      await navigationPage.expectMobileMenuHidden();
    });

    test('should navigate via mobile menu', async ({ page }) => {
      await navigationPage.navigateMobileTo('Ingredients');
      await expect(page).toHaveURL(/.*ingredients/);
    });
  });

  test.describe('Role-based Navigation', () => {
    test('should show admin navigation for admin users', async ({ page }) => {
      await e2eUtils.auth.loginAs(page, 'admin');
      await navigationPage.expectAdminNavigation();
    });

    test('should show manager navigation for manager users', async ({ page }) => {
      await e2eUtils.auth.loginAs(page, 'manager');
      await navigationPage.expectManagerNavigation();
    });

    test('should show user navigation for regular users', async ({ page }) => {
      await e2eUtils.auth.loginAs(page, 'user');
      await navigationPage.expectUserNavigation();
    });
  });

  test.describe('Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await e2eUtils.auth.loginAs(page, 'user');
    });

    test('should support keyboard navigation', async ({ page }) => {
      await navigationPage.expectKeyboardNavigation();
    });

    test('should have proper labels', async ({ page }) => {
      await navigationPage.expectProperLabels();
    });

    test('should announce navigation changes', async ({ page }) => {
      await navigationPage.navigateToIngredients();
      await navigationPage.expectNavigationAnnouncements();
    });

    test('should maintain focus management', async ({ page }) => {
      await navigationPage.navigateToIngredients();
      await expect(navigationPage.page.locator('h1')).toBeFocused();
    });
  });

  test.describe('Responsive Design', () => {
    test.beforeEach(async ({ page }) => {
      await e2eUtils.auth.loginAs(page, 'user');
    });

    test('should adapt to mobile viewport', async ({ page }) => {
      await navigationPage.setMobileViewport();
      await navigationPage.expectMobileLayout();
    });

    test('should adapt to tablet viewport', async ({ page }) => {
      await navigationPage.setTabletViewport();
      await navigationPage.expectSidebarVisible();
    });

    test('should adapt to desktop viewport', async ({ page }) => {
      await navigationPage.setDesktopViewport();
      await navigationPage.expectDesktopLayout();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle navigation errors gracefully', async ({ page }) => {
      await e2eUtils.auth.loginAs(page, 'user');
      await e2eUtils.network.mockNetworkFailure(page, '/api/auth/me');
      
      await navigationPage.goto();
      await expect(page.getByText(/error|failed/i)).toBeVisible();
    });

    test('should handle logout errors', async ({ page }) => {
      await e2eUtils.auth.loginAs(page, 'user');
      await e2eUtils.network.mockApiError(page, '/api/auth/logout', 'Logout failed');
      
      await navigationPage.logout();
      await expect(page.getByText(/logout failed/i)).toBeVisible();
    });

    test('should redirect to login on authentication failure', async ({ page }) => {
      await e2eUtils.auth.loginAs(page, 'user');
      await e2eUtils.network.mockApiError(page, '/api/auth/me', 'Unauthorized', 401);
      
      await page.reload();
      await expect(page).toHaveURL(/.*login/);
    });
  });

  test.describe('Performance', () => {
    test('should load navigation quickly', async ({ page }) => {
      const startTime = Date.now();
      await e2eUtils.auth.loginAs(page, 'user');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    });

    test('should handle rapid navigation', async ({ page }) => {
      await e2eUtils.auth.loginAs(page, 'user');
      
      // Rapidly navigate between pages
      await navigationPage.navigateToDashboard();
      await navigationPage.navigateToIngredients();
      await navigationPage.navigateToCases();
      await navigationPage.navigateToDashboard();
      
      await expect(page).toHaveURL(/.*dashboard/);
    });
  });

  test.describe('State Persistence', () => {
    test('should remember sidebar state', async ({ page }) => {
      await e2eUtils.auth.loginAs(page, 'user');
      
      await navigationPage.collapseSidebar();
      await page.reload();
      
      await navigationPage.expectSidebarCollapsed();
    });

    test('should maintain active navigation state', async ({ page }) => {
      await e2eUtils.auth.loginAs(page, 'user');
      
      await navigationPage.navigateToIngredients();
      await page.reload();
      
      await navigationPage.expectActiveNavigationItem('Ingredients');
    });
  });

  test.describe('Cross-browser Compatibility', () => {
    test('should work in different browsers', async ({ page, browserName }) => {
      await e2eUtils.auth.loginAs(page, 'user');
      
      await navigationPage.navigateToIngredients();
      await expect(page).toHaveURL(/.*ingredients/);
      
      // Browser-specific assertions if needed
      if (browserName === 'webkit') {
        // Safari-specific tests
        await expect(navigationPage.sidebar).toBeVisible();
      }
    });
  });
});
