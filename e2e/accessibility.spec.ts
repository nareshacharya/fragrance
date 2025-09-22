import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page
    await page.goto('/');
  });

  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    // Run axe-core accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check that headings follow proper hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    expect(headings.length).toBeGreaterThan(0);
    
    // Check that h1 exists
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
  });

  test('should have proper landmark roles', async ({ page }) => {
    // Check for essential landmark roles
    const banner = page.locator('[role="banner"]');
    const navigation = page.locator('[role="navigation"]');
    const main = page.locator('[role="main"]');
    const contentinfo = page.locator('[role="contentinfo"]');

    await expect(banner).toBeVisible();
    await expect(navigation).toBeVisible();
    await expect(main).toBeVisible();
    await expect(contentinfo).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper form labels', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Check that form inputs have proper labels
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    
    // Check for associated labels
    const emailLabel = page.locator('label[for]');
    await expect(emailLabel).toBeVisible();
  });

  test('should have proper color contrast', async ({ page }) => {
    // Run color contrast tests
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper focus indicators', async ({ page }) => {
    // Test focus indicators on interactive elements
    const buttons = page.locator('button');
    const links = page.locator('a[href]');
    const inputs = page.locator('input, select, textarea');

    // Focus on first button
    await buttons.first().focus();
    await expect(buttons.first()).toBeFocused();

    // Focus on first link
    await links.first().focus();
    await expect(links.first()).toBeFocused();

    // Focus on first input
    await inputs.first().focus();
    await expect(inputs.first()).toBeFocused();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    // Check for proper ARIA attributes on interactive elements
    const buttons = page.locator('button');
    const firstButton = buttons.first();
    
    // Check that buttons have accessible names
    const buttonText = await firstButton.textContent();
    const ariaLabel = await firstButton.getAttribute('aria-label');
    const ariaLabelledBy = await firstButton.getAttribute('aria-labelledby');
    
    expect(buttonText || ariaLabel || ariaLabelledBy).toBeTruthy();
  });

  test('should support screen readers', async ({ page }) => {
    // Check for screen reader only content
    const screenReaderOnly = page.locator('.sr-only');
    await expect(screenReaderOnly).toHaveCount({ min: 1 });
  });

  test('should have proper modal accessibility', async ({ page }) => {
    // Navigate to a page with modals
    await page.goto('/ingredients');
    
    // Look for modal triggers
    const modalTrigger = page.locator('[data-testid="open-modal"]').first();
    
    if (await modalTrigger.isVisible()) {
      await modalTrigger.click();
      
      // Check modal accessibility
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      
      // Check that modal has proper attributes
      await expect(modal).toHaveAttribute('aria-modal', 'true');
      
      // Check for modal title
      const modalTitle = modal.locator('[id*="title"]');
      await expect(modalTitle).toBeVisible();
      
      // Test escape key to close modal
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
    }
  });

  test('should have proper table accessibility', async ({ page }) => {
    // Navigate to a page with tables
    await page.goto('/ingredients');
    
    const table = page.locator('table').first();
    
    if (await table.isVisible()) {
      // Check table structure
      await expect(table).toBeVisible();
      
      // Check for table headers
      const headers = table.locator('th');
      await expect(headers).toHaveCount({ min: 1 });
      
      // Check for proper table roles
      await expect(table).toHaveAttribute('role', 'table');
    }
  });

  test('should have proper error handling', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Submit form without filling fields
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Check for error messages
    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
  });

  test('should have proper loading states', async ({ page }) => {
    // Navigate to a page that might have loading states
    await page.goto('/ingredients');
    
    // Look for loading indicators
    const loadingIndicator = page.locator('[role="progressbar"]');
    
    if (await loadingIndicator.isVisible()) {
      await expect(loadingIndicator).toHaveAttribute('aria-label');
    }
  });

  test('should have proper skip links', async ({ page }) => {
    // Check for skip links
    const skipLink = page.locator('a[href="#main-content"]');
    
    if (await skipLink.isVisible()) {
      await expect(skipLink).toHaveText(/skip to main content/i);
      
      // Test skip link functionality
      await skipLink.click();
      
      // Check that focus moved to main content
      const mainContent = page.locator('#main-content');
      await expect(mainContent).toBeFocused();
    }
  });

  test('should have proper form validation', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    // Test invalid email
    await emailInput.fill('invalid-email');
    await emailInput.blur();
    
    // Check for validation message
    const validationMessage = page.locator('[aria-describedby]');
    await expect(validationMessage).toBeVisible();
  });

  test('should have proper button states', async ({ page }) => {
    // Check button states
    const buttons = page.locator('button');
    
    for (const button of await buttons.all()) {
      const isDisabled = await button.getAttribute('disabled');
      const ariaDisabled = await button.getAttribute('aria-disabled');
      
      if (isDisabled || ariaDisabled === 'true') {
        // Disabled buttons should not be focusable
        await button.focus();
        await expect(button).not.toBeFocused();
      }
    }
  });

  test('should have proper link accessibility', async ({ page }) => {
    // Check that links have proper attributes
    const links = page.locator('a[href]');
    
    for (const link of await links.all()) {
      const href = await link.getAttribute('href');
      const ariaLabel = await link.getAttribute('aria-label');
      const linkText = await link.textContent();
      
      // Links should have either href, aria-label, or text content
      expect(href || ariaLabel || linkText).toBeTruthy();
    }
  });

  test('should have proper image accessibility', async ({ page }) => {
    // Check that images have proper alt attributes
    const images = page.locator('img');
    
    for (const image of await images.all()) {
      const alt = await image.getAttribute('alt');
      const ariaLabel = await image.getAttribute('aria-label');
      const role = await image.getAttribute('role');
      
      // Images should have alt text, aria-label, or be decorative (role="presentation")
      expect(alt || ariaLabel || role === 'presentation').toBeTruthy();
    }
  });

  test('should have proper list accessibility', async ({ page }) => {
    // Check that lists have proper structure
    const lists = page.locator('ul, ol');
    
    for (const list of await lists.all()) {
      const listItems = list.locator('li');
      await expect(listItems).toHaveCount({ min: 1 });
    }
  });

  test('should have proper search functionality', async ({ page }) => {
    // Navigate to ingredients page
    await page.goto('/ingredients');
    
    const searchInput = page.locator('input[type="search"], input[role="searchbox"]');
    
    if (await searchInput.isVisible()) {
      await expect(searchInput).toHaveAttribute('aria-label');
      
      // Test search functionality
      await searchInput.fill('test search');
      await page.keyboard.press('Enter');
      
      // Check for search results
      const results = page.locator('[role="list"]');
      await expect(results).toBeVisible();
    }
  });

  test('should have proper pagination accessibility', async ({ page }) => {
    // Navigate to ingredients page
    await page.goto('/ingredients');
    
    const pagination = page.locator('[role="navigation"]').filter({ hasText: /page/i });
    
    if (await pagination.isVisible()) {
      // Check for proper pagination structure
      const pageButtons = pagination.locator('button');
      await expect(pageButtons).toHaveCount({ min: 1 });
      
      // Check for current page indicator
      const currentPage = pagination.locator('[aria-current="page"]');
      await expect(currentPage).toBeVisible();
    }
  });
});

