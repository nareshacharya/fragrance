import { Page, Locator, expect } from '@playwright/test';

export class IngredientsPage {
  readonly page: Page;
  
  // Header elements
  readonly pageTitle: Locator;
  readonly addIngredientButton: Locator;
  readonly importButton: Locator;
  readonly exportButton: Locator;
  
  // Search and filters
  readonly searchInput: Locator;
  readonly filterDropdown: Locator;
  readonly sortDropdown: Locator;
  readonly clearFiltersButton: Locator;
  
  // Ingredient list
  readonly ingredientCards: Locator;
  readonly emptyState: Locator;
  readonly loadingSpinner: Locator;
  
  // Pagination
  readonly paginationContainer: Locator;
  readonly previousPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly pageNumbers: Locator;
  
  // Ingredient card elements
  readonly ingredientName: Locator;
  readonly ingredientType: Locator;
  readonly ingredientSupplier: Locator;
  readonly ingredientCost: Locator;
  readonly ingredientStock: Locator;
  readonly viewButton: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Header elements
    this.pageTitle = page.getByRole('heading', { name: /ingredients/i });
    this.addIngredientButton = page.getByRole('button', { name: /add ingredient/i });
    this.importButton = page.getByRole('button', { name: /import/i });
    this.exportButton = page.getByRole('button', { name: /export/i });
    
    // Search and filters
    this.searchInput = page.getByPlaceholder(/search ingredients/i);
    this.filterDropdown = page.getByRole('button', { name: /filter/i });
    this.sortDropdown = page.getByRole('button', { name: /sort/i });
    this.clearFiltersButton = page.getByRole('button', { name: /clear filters/i });
    
    // Ingredient list
    this.ingredientCards = page.getByTestId('ingredient-card');
    this.emptyState = page.getByTestId('empty-state');
    this.loadingSpinner = page.getByTestId('loading');
    
    // Pagination
    this.paginationContainer = page.getByTestId('pagination');
    this.previousPageButton = page.getByRole('button', { name: /previous/i });
    this.nextPageButton = page.getByRole('button', { name: /next/i });
    this.pageNumbers = page.getByRole('button', { name: /page \d+/i });
  }

  async goto() {
    await this.page.goto('/ingredients');
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.pageTitle).toBeVisible();
  }

  async waitForIngredientsToLoad() {
    await expect(this.loadingSpinner).not.toBeVisible();
    await expect(this.ingredientCards.first()).toBeVisible({ timeout: 10000 });
  }

  // Search functionality
  async searchIngredients(query: string) {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
    await this.waitForIngredientsToLoad();
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.page.keyboard.press('Enter');
    await this.waitForIngredientsToLoad();
  }

  // Filter functionality
  async openFilters() {
    await this.filterDropdown.click();
  }

  async selectFilter(filterType: string, filterValue: string) {
    await this.openFilters();
    await this.page.getByRole('menuitem', { name: filterType }).click();
    await this.page.getByRole('option', { name: filterValue }).click();
    await this.waitForIngredientsToLoad();
  }

  async clearFilters() {
    await this.clearFiltersButton.click();
    await this.waitForIngredientsToLoad();
  }

  // Sort functionality
  async openSortOptions() {
    await this.sortDropdown.click();
  }

  async sortBy(sortOption: string) {
    await this.openSortOptions();
    await this.page.getByRole('menuitem', { name: sortOption }).click();
    await this.waitForIngredientsToLoad();
  }

  // Ingredient management
  async clickAddIngredient() {
    await this.addIngredientButton.click();
  }

  async clickImportIngredients() {
    await this.importButton.click();
  }

  async clickExportIngredients() {
    await this.exportButton.click();
  }

  // Ingredient card interactions
  async getIngredientCard(ingredientName: string) {
    return this.page.getByTestId('ingredient-card').filter({ hasText: ingredientName });
  }

  async clickViewIngredient(ingredientName: string) {
    const card = await this.getIngredientCard(ingredientName);
    await card.getByRole('button', { name: /view/i }).click();
  }

  async clickEditIngredient(ingredientName: string) {
    const card = await this.getIngredientCard(ingredientName);
    await card.getByRole('button', { name: /edit/i }).click();
  }

  async clickDeleteIngredient(ingredientName: string) {
    const card = await this.getIngredientCard(ingredientName);
    await card.getByRole('button', { name: /delete/i }).click();
  }

  async confirmDeleteIngredient() {
    await this.page.getByRole('button', { name: /confirm/i }).click();
    await this.waitForIngredientsToLoad();
  }

  async cancelDeleteIngredient() {
    await this.page.getByRole('button', { name: /cancel/i }).click();
  }

  // Pagination
  async goToNextPage() {
    await this.nextPageButton.click();
    await this.waitForIngredientsToLoad();
  }

  async goToPreviousPage() {
    await this.previousPageButton.click();
    await this.waitForIngredientsToLoad();
  }

  async goToPage(pageNumber: number) {
    await this.page.getByRole('button', { name: `Page ${pageNumber}` }).click();
    await this.waitForIngredientsToLoad();
  }

  // Data extraction
  async getIngredientCount() {
    return await this.ingredientCards.count();
  }

  async getIngredientNames() {
    const cards = await this.ingredientCards.all();
    const names = [];
    for (const card of cards) {
      const name = await card.getByTestId('ingredient-name').textContent();
      if (name) names.push(name);
    }
    return names;
  }

  async getIngredientDetails(ingredientName: string) {
    const card = await this.getIngredientCard(ingredientName);
    return {
      name: await card.getByTestId('ingredient-name').textContent(),
      type: await card.getByTestId('ingredient-type').textContent(),
      supplier: await card.getByTestId('ingredient-supplier').textContent(),
      cost: await card.getByTestId('ingredient-cost').textContent(),
      stock: await card.getByTestId('ingredient-stock').textContent(),
    };
  }

  // Validation methods
  async expectIngredientVisible(ingredientName: string) {
    await expect(this.getIngredientCard(ingredientName)).toBeVisible();
  }

  async expectIngredientNotVisible(ingredientName: string) {
    await expect(this.getIngredientCard(ingredientName)).not.toBeVisible();
  }

  async expectEmptyState() {
    await expect(this.emptyState).toBeVisible();
    await expect(this.emptyState).toContainText(/no ingredients found/i);
  }

  async expectLoadingState() {
    await expect(this.loadingSpinner).toBeVisible();
  }

  async expectNotLoading() {
    await expect(this.loadingSpinner).not.toBeVisible();
  }

  async expectSearchResults(query: string) {
    const cards = await this.ingredientCards.all();
    for (const card of cards) {
      const name = await card.getByTestId('ingredient-name').textContent();
      expect(name?.toLowerCase()).toContain(query.toLowerCase());
    }
  }

  async expectFilteredResults(filterType: string) {
    const cards = await this.ingredientCards.all();
    for (const card of cards) {
      const type = await card.getByTestId('ingredient-type').textContent();
      expect(type).toContain(filterType);
    }
  }

  async expectSortedResults(sortBy: string) {
    const names = await this.getIngredientNames();
    const sortedNames = [...names].sort();
    
    if (sortBy.includes('desc')) {
      sortedNames.reverse();
    }
    
    expect(names).toEqual(sortedNames);
  }

  // Accessibility
  async expectKeyboardNavigation() {
    await this.searchInput.focus();
    await expect(this.searchInput).toBeFocused();
    
    await this.page.keyboard.press('Tab');
    await expect(this.filterDropdown).toBeFocused();
    
    await this.page.keyboard.press('Tab');
    await expect(this.sortDropdown).toBeFocused();
  }

  async expectProperLabels() {
    await expect(this.searchInput).toHaveAttribute('aria-label');
    await expect(this.filterDropdown).toHaveAttribute('aria-label');
    await expect(this.sortDropdown).toHaveAttribute('aria-label');
  }

  // Error handling
  async handleNetworkError() {
    await this.page.route('**/api/ingredients**', route => {
      route.abort('failed');
    });
  }

  async handleServerError() {
    await this.page.route('**/api/ingredients**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });
  }

  // Mock data
  async mockIngredientsData(ingredients: any[]) {
    await this.page.route('**/api/ingredients**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ingredients,
          total: ingredients.length,
          page: 1,
          limit: 10,
        }),
      });
    });
  }

  async mockEmptyIngredientsData() {
    await this.mockIngredientsData([]);
  }

  async mockSingleIngredient(ingredient: any) {
    await this.mockIngredientsData([ingredient]);
  }

  // Cleanup
  async cleanup() {
    await this.page.unroute('**/api/ingredients**');
  }
}
