import { test, expect } from '@playwright/test';
import { IngredientsPage } from './pages/ingredients.page';
import { LoginPage } from './pages/login.page';
import { NavigationPage } from './pages/navigation.page';
import { e2eUtils } from './utils';

test.describe('Ingredients E2E Tests', () => {
  let ingredientsPage: IngredientsPage;
  let loginPage: LoginPage;
  let navigationPage: NavigationPage;

  test.beforeEach(async ({ page }) => {
    ingredientsPage = new IngredientsPage(page);
    loginPage = new LoginPage(page);
    navigationPage = new NavigationPage(page);

    // Login before each test
    await e2eUtils.auth.loginAs(page, 'user');
  });

  test.afterEach(async ({ page }) => {
    await e2eUtils.cleanup.resetAppState(page);
  });

  test.describe('Ingredients List', () => {
    test('should display ingredients page', async ({ page }) => {
      await ingredientsPage.goto();
      await ingredientsPage.waitForPageLoad();

      await expect(ingredientsPage.pageTitle).toBeVisible();
      await expect(ingredientsPage.addIngredientButton).toBeVisible();
      await expect(ingredientsPage.searchInput).toBeVisible();
    });

    test('should display ingredients list', async ({ page }) => {
      // Mock ingredients data
      const mockIngredients = [
        e2eUtils.data.generateTestIngredient({ name: 'Lavender Oil' }),
        e2eUtils.data.generateTestIngredient({ name: 'Rose Absolute' }),
        e2eUtils.data.generateTestIngredient({ name: 'Vanilla Extract' }),
      ];

      await e2eUtils.network.mockApiResponse(page, '/ingredients', {
        ingredients: mockIngredients,
        total: mockIngredients.length,
        page: 1,
        limit: 10,
      });

      await ingredientsPage.goto();
      await ingredientsPage.waitForIngredientsToLoad();

      await expect(ingredientsPage.ingredientCards).toHaveCount(3);
      await ingredientsPage.expectIngredientVisible('Lavender Oil');
      await ingredientsPage.expectIngredientVisible('Rose Absolute');
      await ingredientsPage.expectIngredientVisible('Vanilla Extract');
    });

    test('should display empty state when no ingredients', async ({ page }) => {
      await e2eUtils.network.mockApiResponse(page, '/ingredients', {
        ingredients: [],
        total: 0,
        page: 1,
        limit: 10,
      });

      await ingredientsPage.goto();
      await ingredientsPage.waitForIngredientsToLoad();

      await ingredientsPage.expectEmptyState();
    });

    test('should handle loading state', async ({ page }) => {
      await e2eUtils.network.mockSlowResponse(page, '/ingredients', 2000);

      await ingredientsPage.goto();
      await ingredientsPage.expectLoadingState();
      await ingredientsPage.expectNotLoading();
    });
  });

  test.describe('Search and Filter', () => {
    test.beforeEach(async ({ page }) => {
      const mockIngredients = [
        e2eUtils.data.generateTestIngredient({ name: 'Lavender Oil', type: 'essential_oil' }),
        e2eUtils.data.generateTestIngredient({ name: 'Rose Absolute', type: 'natural' }),
        e2eUtils.data.generateTestIngredient({ name: 'Vanilla Extract', type: 'synthetic' }),
      ];

      await e2eUtils.network.mockApiResponse(page, '/ingredients', {
        ingredients: mockIngredients,
        total: mockIngredients.length,
        page: 1,
        limit: 10,
      });

      await ingredientsPage.goto();
      await ingredientsPage.waitForIngredientsToLoad();
    });

    test('should search ingredients by name', async ({ page }) => {
      await ingredientsPage.searchIngredients('Lavender');
      await ingredientsPage.expectIngredientVisible('Lavender Oil');
      await ingredientsPage.expectIngredientNotVisible('Rose Absolute');
      await ingredientsPage.expectIngredientNotVisible('Vanilla Extract');
    });

    test('should clear search', async ({ page }) => {
      await ingredientsPage.searchIngredients('Lavender');
      await ingredientsPage.clearSearch();
      
      await ingredientsPage.expectIngredientVisible('Lavender Oil');
      await ingredientsPage.expectIngredientVisible('Rose Absolute');
      await ingredientsPage.expectIngredientVisible('Vanilla Extract');
    });

    test('should filter by ingredient type', async ({ page }) => {
      await ingredientsPage.selectFilter('Type', 'Essential Oil');
      await ingredientsPage.expectIngredientVisible('Lavender Oil');
      await ingredientsPage.expectIngredientNotVisible('Rose Absolute');
      await ingredientsPage.expectIngredientNotVisible('Vanilla Extract');
    });

    test('should clear filters', async ({ page }) => {
      await ingredientsPage.selectFilter('Type', 'Essential Oil');
      await ingredientsPage.clearFilters();
      
      await ingredientsPage.expectIngredientVisible('Lavender Oil');
      await ingredientsPage.expectIngredientVisible('Rose Absolute');
      await ingredientsPage.expectIngredientVisible('Vanilla Extract');
    });

    test('should sort ingredients', async ({ page }) => {
      await ingredientsPage.sortBy('Name A-Z');
      const names = await ingredientsPage.getIngredientNames();
      expect(names).toEqual(['Lavender Oil', 'Rose Absolute', 'Vanilla Extract']);
    });
  });

  test.describe('Ingredient Management', () => {
    test('should navigate to add ingredient page', async ({ page }) => {
      await ingredientsPage.goto();
      await ingredientsPage.clickAddIngredient();
      await expect(page).toHaveURL(/.*ingredients\/create/);
    });

    test('should view ingredient details', async ({ page }) => {
      const mockIngredient = e2eUtils.data.generateTestIngredient({ name: 'Test Ingredient' });
      
      await e2eUtils.network.mockApiResponse(page, '/ingredients', {
        ingredients: [mockIngredient],
        total: 1,
        page: 1,
        limit: 10,
      });

      await e2eUtils.network.mockApiResponse(page, `/ingredients/${mockIngredient.id}`, mockIngredient);

      await ingredientsPage.goto();
      await ingredientsPage.waitForIngredientsToLoad();
      await ingredientsPage.clickViewIngredient('Test Ingredient');
      
      await expect(page).toHaveURL(`/ingredients/${mockIngredient.id}`);
    });

    test('should navigate to edit ingredient page', async ({ page }) => {
      const mockIngredient = e2eUtils.data.generateTestIngredient({ name: 'Test Ingredient' });
      
      await e2eUtils.network.mockApiResponse(page, '/ingredients', {
        ingredients: [mockIngredient],
        total: 1,
        page: 1,
        limit: 10,
      });

      await ingredientsPage.goto();
      await ingredientsPage.waitForIngredientsToLoad();
      await ingredientsPage.clickEditIngredient('Test Ingredient');
      
      await expect(page).toHaveURL(`/ingredients/${mockIngredient.id}/edit`);
    });

    test('should delete ingredient with confirmation', async ({ page }) => {
      const mockIngredient = e2eUtils.data.generateTestIngredient({ name: 'Test Ingredient' });
      
      await e2eUtils.network.mockApiResponse(page, '/ingredients', {
        ingredients: [mockIngredient],
        total: 1,
        page: 1,
        limit: 10,
      });

      await e2eUtils.network.mockApiResponse(page, `/ingredients/${mockIngredient.id}`, {}, 204);

      await ingredientsPage.goto();
      await ingredientsPage.waitForIngredientsToLoad();
      
      await ingredientsPage.clickDeleteIngredient('Test Ingredient');
      await expect(page.getByText(/are you sure/i)).toBeVisible();
      
      await ingredientsPage.confirmDeleteIngredient();
      await ingredientsPage.expectIngredientNotVisible('Test Ingredient');
    });

    test('should cancel ingredient deletion', async ({ page }) => {
      const mockIngredient = e2eUtils.data.generateTestIngredient({ name: 'Test Ingredient' });
      
      await e2eUtils.network.mockApiResponse(page, '/ingredients', {
        ingredients: [mockIngredient],
        total: 1,
        page: 1,
        limit: 10,
      });

      await ingredientsPage.goto();
      await ingredientsPage.waitForIngredientsToLoad();
      
      await ingredientsPage.clickDeleteIngredient('Test Ingredient');
      await ingredientsPage.cancelDeleteIngredient();
      
      await ingredientsPage.expectIngredientVisible('Test Ingredient');
    });
  });

  test.describe('Import/Export', () => {
    test('should navigate to import page', async ({ page }) => {
      await ingredientsPage.goto();
      await ingredientsPage.clickImportIngredients();
      await expect(page).toHaveURL(/.*ingredients\/import/);
    });

    test('should navigate to export page', async ({ page }) => {
      await ingredientsPage.goto();
      await ingredientsPage.clickExportIngredients();
      await expect(page).toHaveURL(/.*ingredients\/export/);
    });
  });

  test.describe('Pagination', () => {
    test('should navigate through pages', async ({ page }) => {
      const mockIngredients = Array.from({ length: 25 }, (_, i) => 
        e2eUtils.data.generateTestIngredient({ name: `Ingredient ${i + 1}` })
      );

      await e2eUtils.network.mockApiResponse(page, '/ingredients', {
        ingredients: mockIngredients.slice(0, 10),
        total: 25,
        page: 1,
        limit: 10,
      });

      await ingredientsPage.goto();
      await ingredientsPage.waitForIngredientsToLoad();

      await ingredientsPage.goToNextPage();
      await expect(page).toHaveURL(/.*page=2/);
    });

    test('should handle previous page navigation', async ({ page }) => {
      const mockIngredients = Array.from({ length: 25 }, (_, i) => 
        e2eUtils.data.generateTestIngredient({ name: `Ingredient ${i + 1}` })
      );

      await e2eUtils.network.mockApiResponse(page, '/ingredients', {
        ingredients: mockIngredients.slice(10, 20),
        total: 25,
        page: 2,
        limit: 10,
      });

      await page.goto('/ingredients?page=2');
      await ingredientsPage.waitForIngredientsToLoad();

      await ingredientsPage.goToPreviousPage();
      await expect(page).toHaveURL(/.*page=1/);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors', async ({ page }) => {
      await e2eUtils.network.mockNetworkFailure(page, '/ingredients');
      
      await ingredientsPage.goto();
      await expect(page.getByText(/network error|failed to load/i)).toBeVisible();
    });

    test('should handle server errors', async ({ page }) => {
      await e2eUtils.network.mockApiError(page, '/ingredients', 'Internal server error');
      
      await ingredientsPage.goto();
      await expect(page.getByText(/internal server error/i)).toBeVisible();
    });

    test('should handle unauthorized access', async ({ page }) => {
      await e2eUtils.auth.logout(page);
      
      await ingredientsPage.goto();
      await expect(page).toHaveURL(/.*login/);
    });
  });

  test.describe('Accessibility', () => {
    test('should support keyboard navigation', async ({ page }) => {
      await ingredientsPage.goto();
      await ingredientsPage.expectKeyboardNavigation();
    });

    test('should have proper labels', async ({ page }) => {
      await ingredientsPage.goto();
      await ingredientsPage.expectProperLabels();
    });

    test('should announce loading states', async ({ page }) => {
      await e2eUtils.network.mockSlowResponse(page, '/ingredients', 2000);
      
      await ingredientsPage.goto();
      await expect(page.getByRole('status')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await ingredientsPage.goto();
      
      await expect(ingredientsPage.pageTitle).toBeVisible();
      await expect(ingredientsPage.addIngredientButton).toBeVisible();
    });

    test('should work on tablet devices', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await ingredientsPage.goto();
      
      await expect(ingredientsPage.pageTitle).toBeVisible();
      await expect(ingredientsPage.addIngredientButton).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await ingredientsPage.goto();
      await ingredientsPage.waitForIngredientsToLoad();
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });

    test('should handle large datasets', async ({ page }) => {
      const mockIngredients = Array.from({ length: 1000 }, (_, i) => 
        e2eUtils.data.generateTestIngredient({ name: `Ingredient ${i + 1}` })
      );

      await e2eUtils.network.mockApiResponse(page, '/ingredients', {
        ingredients: mockIngredients.slice(0, 10),
        total: 1000,
        page: 1,
        limit: 10,
      });

      await ingredientsPage.goto();
      await ingredientsPage.waitForIngredientsToLoad();
      
      await expect(ingredientsPage.ingredientCards).toHaveCount(10);
    });
  });
});
