import React from 'react'
import { render, screen, fireEvent, waitFor } from '@/test-utils'
import { IngredientList } from './ingredient-list'
import { Ingredient, IngredientSearchParams } from '@/types/ingredient'

// Mock the hooks
jest.mock('@/hooks/use-debounce', () => ({
  useDebounce: jest.fn((value) => value),
}))

// Mock the child components
jest.mock('./ingredient-card', () => ({
  IngredientCard: ({ ingredient, onView, onEdit, onDelete, onUpdateStock, selected, onSelect }: any) => (
    <div data-testid={`ingredient-card-${ingredient.id}`}>
      <span>{ingredient.name}</span>
      <button onClick={() => onView?.(ingredient)}>View</button>
      <button onClick={() => onEdit?.(ingredient)}>Edit</button>
      <button onClick={() => onDelete?.(ingredient)}>Delete</button>
      <button onClick={() => onUpdateStock?.(ingredient)}>Update Stock</button>
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onSelect?.(ingredient.id)}
      />
    </div>
  ),
}))

jest.mock('./ingredient-search', () => ({
  IngredientSearch: ({ onSearch, onAdvancedSearch }: any) => (
    <div data-testid="ingredient-search">
      <button onClick={() => onSearch?.({ query: 'test' })}>Search</button>
      <button onClick={() => onAdvancedSearch?.()}>Advanced Search</button>
    </div>
  ),
}))

jest.mock('./ingredient-filters', () => ({
  IngredientFilters: ({ onFilterChange, onClearFilters }: any) => (
    <div data-testid="ingredient-filters">
      <button onClick={() => onFilterChange?.({ type: 'essential_oil' })}>Apply Filter</button>
      <button onClick={() => onClearFilters?.()}>Clear Filters</button>
    </div>
  ),
}))

jest.mock('./ingredient-pagination', () => ({
  IngredientPagination: ({ currentPage, totalPages, onPageChange, onPageSizeChange }: any) => (
    <div data-testid="ingredient-pagination">
      <button onClick={() => onPageChange?.(2)}>Page 2</button>
      <button onClick={() => onPageSizeChange?.(50)}>Page Size 50</button>
      <span>Page {currentPage} of {totalPages}</span>
    </div>
  ),
}))

const mockIngredients: Ingredient[] = [
  {
    id: '1',
    name: 'Lavender Oil',
    type: 'essential_oil',
    category: 'top_notes',
    supplier: 'Essential Oils Co.',
    supplierCode: 'EO-LAV-001',
    cost: 25.50,
    currency: 'USD',
    stockLevel: 1000,
    minStockLevel: 100,
    maxStockLevel: 5000,
    unit: 'ml',
    casNumber: '8000-28-0',
    inciName: 'Lavandula Angustifolia Oil',
    einECSNumber: '284-545-0',
    description: 'High-quality lavender essential oil',
    notes: 'Store in cool, dark place',
    tags: ['floral', 'calming', 'natural'],
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Rose Oil',
    type: 'essential_oil',
    category: 'middle_notes',
    supplier: 'Rose Company',
    supplierCode: 'ROSE-001',
    cost: 45.00,
    currency: 'USD',
    stockLevel: 500,
    minStockLevel: 50,
    maxStockLevel: 2000,
    unit: 'ml',
    casNumber: '8007-01-0',
    inciName: 'Rosa Damascena Flower Oil',
    einECSNumber: '284-545-1',
    description: 'Premium rose essential oil',
    notes: 'Handle with care',
    tags: ['floral', 'romantic', 'luxury'],
    isActive: true,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
]

describe('IngredientList', () => {
  const defaultProps = {
    ingredients: mockIngredients,
    totalCount: 2,
    currentPage: 1,
    pageSize: 20,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders ingredient list with basic props', () => {
      render(<IngredientList {...defaultProps} />)
      
      expect(screen.getByText('Ingredients')).toBeInTheDocument()
      expect(screen.getByText('2 ingredients found')).toBeInTheDocument()
      expect(screen.getByTestId('ingredient-card-1')).toBeInTheDocument()
      expect(screen.getByTestId('ingredient-card-2')).toBeInTheDocument()
    })

    it('renders loading state', () => {
      render(<IngredientList {...defaultProps} loading={true} />)
      
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('renders error state', () => {
      const errorMessage = 'Failed to load ingredients'
      render(<IngredientList {...defaultProps} error={errorMessage} />)
      
      expect(screen.getByText('Error Loading Ingredients')).toBeInTheDocument()
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })

    it('renders empty state when no ingredients', () => {
      render(<IngredientList {...defaultProps} ingredients={[]} totalCount={0} />)
      
      expect(screen.getByText('0 ingredients found')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      const { container } = render(<IngredientList {...defaultProps} className="custom-class" />)
      
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('Search Functionality', () => {
    it('renders search input when showSearch is true', () => {
      render(<IngredientList {...defaultProps} showSearch={true} />)
      
      expect(screen.getByPlaceholderText('Search ingredients...')).toBeInTheDocument()
    })

    it('does not render search input when showSearch is false', () => {
      render(<IngredientList {...defaultProps} showSearch={false} />)
      
      expect(screen.queryByPlaceholderText('Search ingredients...')).not.toBeInTheDocument()
    })

    it('handles search input changes', () => {
      const onSearch = jest.fn()
      render(<IngredientList {...defaultProps} onSearch={onSearch} showSearch={true} />)
      
      const searchInput = screen.getByPlaceholderText('Search ingredients...')
      fireEvent.change(searchInput, { target: { value: 'lavender' } })
      
      expect(searchInput).toHaveValue('lavender')
    })

    it('calls onSearch when search query changes', async () => {
      const onSearch = jest.fn()
      render(<IngredientList {...defaultProps} onSearch={onSearch} showSearch={true} />)
      
      const searchInput = screen.getByPlaceholderText('Search ingredients...')
      fireEvent.change(searchInput, { target: { value: 'lavender' } })
      
      await waitFor(() => {
        expect(onSearch).toHaveBeenCalledWith({
          query: 'lavender',
          filters: {},
          sortBy: 'name',
          sortOrder: 'asc',
          pagination: {
            page: 1,
            limit: 20,
          },
        })
      })
    })

    it('shows advanced search button', () => {
      render(<IngredientList {...defaultProps} showSearch={true} />)
      
      expect(screen.getByText('Advanced')).toBeInTheDocument()
    })

    it('toggles advanced search panel', () => {
      render(<IngredientList {...defaultProps} showSearch={true} />)
      
      const advancedButton = screen.getByText('Advanced')
      fireEvent.click(advancedButton)
      
      // Advanced search panel should be visible
      expect(screen.getByTestId('ingredient-search')).toBeInTheDocument()
    })
  })

  describe('Filter Functionality', () => {
    it('renders filters button when showFilters is true', () => {
      render(<IngredientList {...defaultProps} showFilters={true} showSearch={true} />)
      
      expect(screen.getByText('Filters')).toBeInTheDocument()
    })

    it('does not render filters button when showFilters is false', () => {
      render(<IngredientList {...defaultProps} showFilters={false} showSearch={true} />)
      
      expect(screen.queryByText('Filters')).not.toBeInTheDocument()
    })

    it('shows active filters count', () => {
      const filters = { type: 'essential_oil', category: 'top_notes' }
      render(<IngredientList {...defaultProps} showFilters={true} showSearch={true} />)
      
      // Simulate setting filters
      const filtersButton = screen.getByText('Filters')
      fireEvent.click(filtersButton)
      
      const applyFilterButton = screen.getByText('Apply Filter')
      fireEvent.click(applyFilterButton)
      
      // Should show filter count badge
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('toggles filters panel', () => {
      render(<IngredientList {...defaultProps} showFilters={true} showSearch={true} />)
      
      const filtersButton = screen.getByText('Filters')
      fireEvent.click(filtersButton)
      
      expect(screen.getByTestId('ingredient-filters')).toBeInTheDocument()
    })

    it('calls onFilter when filters change', () => {
      const onFilter = jest.fn()
      render(<IngredientList {...defaultProps} onFilter={onFilter} showFilters={true} showSearch={true} />)
      
      const filtersButton = screen.getByText('Filters')
      fireEvent.click(filtersButton)
      
      const applyFilterButton = screen.getByText('Apply Filter')
      fireEvent.click(applyFilterButton)
      
      expect(onFilter).toHaveBeenCalledWith({ type: 'essential_oil' })
    })

    it('clears filters when clear button is clicked', () => {
      const onSearch = jest.fn()
      render(<IngredientList {...defaultProps} onSearch={onSearch} showFilters={true} showSearch={true} />)
      
      const filtersButton = screen.getByText('Filters')
      fireEvent.click(filtersButton)
      
      const clearFiltersButton = screen.getByText('Clear Filters')
      fireEvent.click(clearFiltersButton)
      
      expect(onSearch).toHaveBeenCalledWith({
        sortBy: 'name',
        sortOrder: 'asc',
        pagination: {
          page: 1,
          limit: 20,
        },
      })
    })
  })

  describe('View Mode', () => {
    it('renders view mode toggle buttons', () => {
      const onViewModeChange = jest.fn()
      render(<IngredientList {...defaultProps} onViewModeChange={onViewModeChange} />)
      
      expect(screen.getByRole('button', { name: /grid/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /list/i })).toBeInTheDocument()
    })

    it('calls onViewModeChange when view mode changes', () => {
      const onViewModeChange = jest.fn()
      render(<IngredientList {...defaultProps} onViewModeChange={onViewModeChange} />)
      
      const listButton = screen.getByRole('button', { name: /list/i })
      fireEvent.click(listButton)
      
      expect(onViewModeChange).toHaveBeenCalledWith('list')
    })

    it('shows correct active view mode', () => {
      render(<IngredientList {...defaultProps} viewMode="list" onViewModeChange={jest.fn()} />)
      
      const listButton = screen.getByRole('button', { name: /list/i })
      expect(listButton).toHaveClass('bg-secondary')
    })
  })

  describe('Actions', () => {
    it('renders action buttons when showActions is true', () => {
      const onCreate = jest.fn()
      const onImport = jest.fn()
      const onExport = jest.fn()
      
      render(
        <IngredientList 
          {...defaultProps} 
          showActions={true}
          onCreate={onCreate}
          onImport={onImport}
          onExport={onExport}
        />
      )
      
      expect(screen.getByText('Add Ingredient')).toBeInTheDocument()
      expect(screen.getByText('Import')).toBeInTheDocument()
      expect(screen.getByText('Export')).toBeInTheDocument()
    })

    it('does not render action buttons when showActions is false', () => {
      render(<IngredientList {...defaultProps} showActions={false} />)
      
      expect(screen.queryByText('Add Ingredient')).not.toBeInTheDocument()
      expect(screen.queryByText('Import')).not.toBeInTheDocument()
      expect(screen.queryByText('Export')).not.toBeInTheDocument()
    })

    it('calls onCreate when create button is clicked', () => {
      const onCreate = jest.fn()
      render(<IngredientList {...defaultProps} showActions={true} onCreate={onCreate} />)
      
      const createButton = screen.getByText('Add Ingredient')
      fireEvent.click(createButton)
      
      expect(onCreate).toHaveBeenCalled()
    })

    it('calls onImport when import button is clicked', () => {
      const onImport = jest.fn()
      render(<IngredientList {...defaultProps} showActions={true} onImport={onImport} />)
      
      const importButton = screen.getByText('Import')
      fireEvent.click(importButton)
      
      expect(onImport).toHaveBeenCalled()
    })

    it('calls onExport when export button is clicked', () => {
      const onExport = jest.fn()
      render(<IngredientList {...defaultProps} showActions={true} onExport={onExport} />)
      
      const exportButton = screen.getByText('Export')
      fireEvent.click(exportButton)
      
      expect(onExport).toHaveBeenCalled()
    })

    it('calls onRefresh when refresh button is clicked', () => {
      const onRefresh = jest.fn()
      render(<IngredientList {...defaultProps} onRefresh={onRefresh} />)
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i })
      fireEvent.click(refreshButton)
      
      expect(onRefresh).toHaveBeenCalled()
    })
  })

  describe('Selection', () => {
    it('renders select all checkbox when onSelectionChange is provided', () => {
      const onSelectionChange = jest.fn()
      render(<IngredientList {...defaultProps} onSelectionChange={onSelectionChange} />)
      
      expect(screen.getByRole('checkbox', { name: /select all/i })).toBeInTheDocument()
    })

    it('selects all ingredients when select all is clicked', () => {
      const onSelectionChange = jest.fn()
      render(<IngredientList {...defaultProps} onSelectionChange={onSelectionChange} />)
      
      const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i })
      fireEvent.click(selectAllCheckbox)
      
      expect(onSelectionChange).toHaveBeenCalledWith(['1', '2'])
    })

    it('deselects all ingredients when select all is clicked again', () => {
      const onSelectionChange = jest.fn()
      render(
        <IngredientList 
          {...defaultProps} 
          onSelectionChange={onSelectionChange}
          selectedIngredients={['1', '2']}
        />
      )
      
      const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i })
      fireEvent.click(selectAllCheckbox)
      
      expect(onSelectionChange).toHaveBeenCalledWith([])
    })

    it('shows bulk actions when ingredients are selected', () => {
      const onBulkAction = jest.fn()
      render(
        <IngredientList 
          {...defaultProps} 
          onBulkAction={onBulkAction}
          selectedIngredients={['1']}
        />
      )
      
      expect(screen.getByText('Bulk Actions')).toBeInTheDocument()
    })

    it('calls onBulkAction when bulk action is performed', () => {
      const onBulkAction = jest.fn()
      render(
        <IngredientList 
          {...defaultProps} 
          onBulkAction={onBulkAction}
          selectedIngredients={['1']}
        />
      )
      
      const bulkActionButton = screen.getByText('Delete Selected')
      fireEvent.click(bulkActionButton)
      
      expect(onBulkAction).toHaveBeenCalledWith('delete', ['1'])
    })
  })

  describe('Pagination', () => {
    it('renders pagination component', () => {
      const onPageChange = jest.fn()
      const onPageSizeChange = jest.fn()
      
      render(
        <IngredientList 
          {...defaultProps} 
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )
      
      expect(screen.getByTestId('ingredient-pagination')).toBeInTheDocument()
    })

    it('calls onPageChange when page changes', () => {
      const onPageChange = jest.fn()
      render(<IngredientList {...defaultProps} onPageChange={onPageChange} />)
      
      const pageButton = screen.getByText('Page 2')
      fireEvent.click(pageButton)
      
      expect(onPageChange).toHaveBeenCalledWith(2)
    })

    it('calls onPageSizeChange when page size changes', () => {
      const onPageSizeChange = jest.fn()
      render(<IngredientList {...defaultProps} onPageSizeChange={onPageSizeChange} />)
      
      const pageSizeButton = screen.getByText('Page Size 50')
      fireEvent.click(pageSizeButton)
      
      expect(onPageSizeChange).toHaveBeenCalledWith(50)
    })
  })

  describe('Ingredient Card Interactions', () => {
    it('calls onView when view button is clicked', () => {
      const onView = jest.fn()
      render(<IngredientList {...defaultProps} onView={onView} />)
      
      const viewButtons = screen.getAllByText('View')
      fireEvent.click(viewButtons[0])
      
      expect(onView).toHaveBeenCalledWith(mockIngredients[0])
    })

    it('calls onEdit when edit button is clicked', () => {
      const onEdit = jest.fn()
      render(<IngredientList {...defaultProps} onEdit={onEdit} />)
      
      const editButtons = screen.getAllByText('Edit')
      fireEvent.click(editButtons[0])
      
      expect(onEdit).toHaveBeenCalledWith(mockIngredients[0])
    })

    it('calls onDelete when delete button is clicked', () => {
      const onDelete = jest.fn()
      render(<IngredientList {...defaultProps} onDelete={onDelete} />)
      
      const deleteButtons = screen.getAllByText('Delete')
      fireEvent.click(deleteButtons[0])
      
      expect(onDelete).toHaveBeenCalledWith(mockIngredients[0])
    })

    it('calls onUpdateStock when update stock button is clicked', () => {
      const onUpdateStock = jest.fn()
      render(<IngredientList {...defaultProps} onUpdateStock={onUpdateStock} />)
      
      const updateStockButtons = screen.getAllByText('Update Stock')
      fireEvent.click(updateStockButtons[0])
      
      expect(onUpdateStock).toHaveBeenCalledWith(mockIngredients[0])
    })

    it('handles individual ingredient selection', () => {
      const onSelectionChange = jest.fn()
      render(<IngredientList {...defaultProps} onSelectionChange={onSelectionChange} />)
      
      const checkboxes = screen.getAllByRole('checkbox')
      // Skip the select all checkbox (first one)
      fireEvent.click(checkboxes[1])
      
      expect(onSelectionChange).toHaveBeenCalledWith(['1'])
    })
  })

  describe('Sorting', () => {
    it('calls onSearch with sort parameters when sorting changes', async () => {
      const onSearch = jest.fn()
      render(<IngredientList {...defaultProps} onSearch={onSearch} />)
      
      // Simulate sort change (this would typically be triggered by a sort control)
      // For now, we'll test the internal sort handling
      const searchInput = screen.getByPlaceholderText('Search ingredients...')
      fireEvent.change(searchInput, { target: { value: 'test' } })
      
      await waitFor(() => {
        expect(onSearch).toHaveBeenCalledWith({
          query: 'test',
          filters: {},
          sortBy: 'name',
          sortOrder: 'asc',
          pagination: {
            page: 1,
            limit: 20,
          },
        })
      })
    })
  })

  describe('Compact Mode', () => {
    it('renders in compact mode when compact prop is true', () => {
      const { container } = render(<IngredientList {...defaultProps} compact={true} />)
      
      expect(container.firstChild).toHaveClass('space-y-4')
    })

    it('renders in normal mode when compact prop is false', () => {
      const { container } = render(<IngredientList {...defaultProps} compact={false} />)
      
      expect(container.firstChild).toHaveClass('space-y-6')
    })
  })

  describe('Error Handling', () => {
    it('shows retry button in error state', () => {
      const onRefresh = jest.fn()
      render(<IngredientList {...defaultProps} error="Test error" onRefresh={onRefresh} />)
      
      const retryButton = screen.getByText('Try Again')
      fireEvent.click(retryButton)
      
      expect(onRefresh).toHaveBeenCalled()
    })

    it('disables retry button when loading', () => {
      render(<IngredientList {...defaultProps} error="Test error" loading={true} />)
      
      const retryButton = screen.getByText('Try Again')
      expect(retryButton).toBeDisabled()
    })
  })

  describe('Loading States', () => {
    it('shows loading spinner on refresh button when loading', () => {
      render(<IngredientList {...defaultProps} loading={true} onRefresh={jest.fn()} />)
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i })
      expect(refreshButton).toBeDisabled()
    })

    it('disables action buttons when loading', () => {
      render(
        <IngredientList 
          {...defaultProps} 
          loading={true}
          showActions={true}
          onCreate={jest.fn()}
          onImport={jest.fn()}
          onExport={jest.fn()}
        />
      )
      
      expect(screen.getByText('Add Ingredient')).toBeDisabled()
      expect(screen.getByText('Import')).toBeDisabled()
      expect(screen.getByText('Export')).toBeDisabled()
    })
  })
})
