'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { IngredientCard } from './ingredient-card'
import { IngredientSearch } from './ingredient-search'
import { IngredientFilters } from './ingredient-filters'
import { IngredientPagination } from './ingredient-pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Ingredient, IngredientSearchParams } from '@/types/ingredient'
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  RefreshCw,
  Grid3X3,
  List,
  MoreHorizontal,
  Trash2,
  Edit,
  Package
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/use-debounce'

interface IngredientListProps {
  ingredients: Ingredient[]
  loading?: boolean
  error?: string
  totalCount?: number
  currentPage?: number
  pageSize?: number
  onSearch?: (params: IngredientSearchParams) => void
  onFilter?: (filters: Record<string, any>) => void
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  onRefresh?: () => void
  onView?: (ingredient: Ingredient) => void
  onEdit?: (ingredient: Ingredient) => void
  onDelete?: (ingredient: Ingredient) => void
  onUpdateStock?: (ingredient: Ingredient) => void
  onCreate?: () => void
  onImport?: () => void
  onExport?: () => void
  onBulkAction?: (action: string, ingredientIds: string[]) => void
  selectedIngredients?: string[]
  onSelectionChange?: (ingredientIds: string[]) => void
  className?: string
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (mode: 'grid' | 'list') => void
  showFilters?: boolean
  showSearch?: boolean
  showActions?: boolean
  compact?: boolean
}

export function IngredientList({
  ingredients = [],
  loading = false,
  error,
  totalCount = 0,
  currentPage = 1,
  pageSize = 20,
  onSearch,
  onFilter,
  onPageChange,
  onPageSizeChange,
  onRefresh,
  onView,
  onEdit,
  onDelete,
  onUpdateStock,
  onCreate,
  onImport,
  onExport,
  onBulkAction,
  selectedIngredients = [],
  onSelectionChange,
  className,
  viewMode = 'grid',
  onViewModeChange,
  showFilters = true,
  showSearch = true,
  showActions = true,
  compact = false,
}: IngredientListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [sortBy, setSortBy] = useState<string>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (onSearch) {
      onSearch({
        query: query || undefined,
        filters,
        sortBy,
        sortOrder,
        pagination: {
          page: 1,
          limit: pageSize,
        },
      })
    }
  }, [onSearch, filters, sortBy, sortOrder, pageSize])

  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters)
    if (onFilter) {
      onFilter(newFilters)
    }
    if (onSearch) {
      onSearch({
        query: debouncedSearchQuery || undefined,
        filters: newFilters,
        sortBy,
        sortOrder,
        pagination: {
          page: 1,
          limit: pageSize,
        },
      })
    }
  }, [onFilter, onSearch, debouncedSearchQuery, sortBy, sortOrder, pageSize])

  const handleSortChange = useCallback((field: string, order: 'asc' | 'desc') => {
    setSortBy(field)
    setSortOrder(order)
    if (onSearch) {
      onSearch({
        query: debouncedSearchQuery || undefined,
        filters,
        sortBy: field,
        sortOrder: order,
        pagination: {
          page: 1,
          limit: pageSize,
        },
      })
    }
  }, [onSearch, debouncedSearchQuery, filters, pageSize])

  const handleBulkAction = useCallback((action: string) => {
    if (onBulkAction && selectedIngredients.length > 0) {
      onBulkAction(action, selectedIngredients)
    }
  }, [onBulkAction, selectedIngredients])

  const handleSelectAll = useCallback(() => {
    if (onSelectionChange) {
      if (selectedIngredients.length === ingredients.length) {
        onSelectionChange([])
      } else {
        onSelectionChange(ingredients.map(ingredient => ingredient.id))
      }
    }
  }, [onSelectionChange, selectedIngredients.length, ingredients])

  const handleSelectIngredient = useCallback((ingredientId: string) => {
    if (onSelectionChange) {
      const newSelection = selectedIngredients.includes(ingredientId)
        ? selectedIngredients.filter(id => id !== ingredientId)
        : [...selectedIngredients, ingredientId]
      onSelectionChange(newSelection)
    }
  }, [onSelectionChange, selectedIngredients])

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== null && value !== ''
    ).length
  }, [filters])

  const clearFilters = useCallback(() => {
    setFilters({})
    setSearchQuery('')
    if (onSearch) {
      onSearch({
        sortBy,
        sortOrder,
        pagination: {
          page: 1,
          limit: pageSize,
        },
      })
    }
  }, [onSearch, sortBy, sortOrder, pageSize])

  React.useEffect(() => {
    handleSearch(debouncedSearchQuery)
  }, [debouncedSearchQuery, handleSearch])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Ingredients</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ingredients</h2>
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `${totalCount} ingredients found`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </Button>
          )}
          {onViewModeChange && (
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {showSearch && (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {showFilters && (
              <Button
                variant="outline"
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className="relative"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            >
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Advanced
            </Button>
          </div>
        )}

        {/* Advanced Search */}
        {showAdvancedSearch && (
          <IngredientSearch
            onSearch={onSearch}
            onFilterChange={handleFilterChange}
            filters={filters}
            className="border rounded-lg p-4"
          />
        )}

        {/* Filters Panel */}
        {showFiltersPanel && (
          <IngredientFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            onSortChange={handleSortChange}
            sortBy={sortBy}
            sortOrder={sortOrder}
            className="border rounded-lg p-4"
          />
        )}

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (value === undefined || value === null || value === '') return null
              return (
                <Badge key={key} variant="secondary" className="text-xs">
                  {key}: {Array.isArray(value) ? value.join(', ') : String(value)}
                  <button
                    onClick={() => handleFilterChange({ ...filters, [key]: undefined })}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )
            })}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedIngredients.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedIngredients.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('activate')}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('updateStock')}
                >
                  <Package className="h-4 w-4 mr-1" />
                  Update Stock
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onImport && (
              <Button variant="outline" onClick={onImport}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            )}
            {onExport && (
              <Button variant="outline" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
            {onCreate && (
              <Button onClick={onCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Ingredient
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48"></div>
            </div>
          ))}
        </div>
      ) : ingredients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No ingredients found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || activeFiltersCount > 0
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first ingredient'
              }
            </p>
            {onCreate && (
              <Button onClick={onCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Ingredient
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Ingredients Grid/List */}
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-2'
          }>
            {ingredients.map((ingredient) => (
              <div key={ingredient.id} className="relative">
                {onSelectionChange && (
                  <input
                    type="checkbox"
                    checked={selectedIngredients.includes(ingredient.id)}
                    onChange={() => handleSelectIngredient(ingredient.id)}
                    className="absolute top-2 left-2 z-10"
                  />
                )}
                <IngredientCard
                  ingredient={ingredient}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onUpdateStock={onUpdateStock}
                  compact={compact || viewMode === 'list'}
                  showActions={showActions}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalCount > pageSize && (
            <IngredientPagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          )}
        </>
      )}
    </div>
  )
}
