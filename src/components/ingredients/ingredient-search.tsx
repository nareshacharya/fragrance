'use client'

import React, { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { IngredientSearchParams } from '@/types/ingredient'
import { 
  INGREDIENT_TYPE_LABELS_MAP,
  INGREDIENT_CATEGORY_LABELS,
  STOCK_STATUS_LABELS
} from '@/types/ingredient'
import { Search, X, Filter, Save, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IngredientSearchProps {
  onSearch?: (params: IngredientSearchParams) => void
  onFilterChange?: (filters: Record<string, any>) => void
  filters?: Record<string, any>
  className?: string
}

export function IngredientSearch({
  onSearch,
  onFilterChange,
  filters = {},
  className,
}: IngredientSearchProps) {
  const [searchParams, setSearchParams] = useState<IngredientSearchParams>({
    query: filters.query || '',
    pagination: {
      page: 1,
      limit: 20,
    },
    sortBy: filters.sortBy || 'name',
    sortOrder: filters.sortOrder || 'asc',
    filters: {
      type: filters.type || undefined,
      category: filters.category || undefined,
      supplier: filters.supplier || undefined,
      stockStatus: filters.stockStatus || undefined,
      costRange: filters.costRange || undefined,
      isActive: filters.isActive,
      tags: filters.tags || undefined,
    },
  })

  const [savedSearches, setSavedSearches] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const handleInputChange = useCallback((field: keyof IngredientSearchParams, value: any) => {
    const newParams = { ...searchParams, [field]: value }
    setSearchParams(newParams)
    
    if (onFilterChange) {
      onFilterChange(newParams)
    }
  }, [searchParams, onFilterChange])

  const handleFilterChange = useCallback((filterField: string, value: any) => {
    const newParams = {
      ...searchParams,
      filters: {
        ...searchParams.filters,
        [filterField]: value,
      }
    }
    setSearchParams(newParams)
    
    if (onFilterChange) {
      onFilterChange(newParams)
    }
  }, [searchParams, onFilterChange])

  const handleSearch = useCallback(() => {
    if (onSearch) {
      onSearch(searchParams)
      
      // Add to search history
      if (searchParams.query && !searchHistory.includes(searchParams.query)) {
        setSearchHistory(prev => [searchParams.query!, ...prev.slice(0, 9)])
      }
    }
  }, [onSearch, searchParams, searchHistory])

  const handleSaveSearch = useCallback(() => {
    const searchName = prompt('Enter a name for this search:')
    if (searchName && !savedSearches.includes(searchName)) {
      setSavedSearches(prev => [...prev, searchName])
      // In a real app, you'd save this to localStorage or backend
      localStorage.setItem('savedIngredientSearches', JSON.stringify([...savedSearches, searchName]))
    }
  }, [savedSearches])

  const handleLoadSavedSearch = useCallback((searchName: string) => {
    // In a real app, you'd load the saved search parameters
    console.log('Loading saved search:', searchName)
  }, [])

  const handleClearFilters = useCallback(() => {
    const clearedParams: IngredientSearchParams = {
      query: '',
      pagination: {
        page: 1,
        limit: 20,
      },
      sortBy: 'name',
      sortOrder: 'asc',
      filters: {
        type: undefined,
        category: undefined,
        supplier: undefined,
        stockStatus: undefined,
        costRange: undefined,
        isActive: undefined,
        tags: undefined,
      },
    }
    setSearchParams(clearedParams)
    
    if (onFilterChange) {
      onFilterChange(clearedParams)
    }
  }, [onFilterChange])

  const activeFiltersCount = [
    searchParams.query,
    ...Object.values(searchParams.filters || {}),
    ...Object.values(searchParams.pagination || {})
  ].filter(value => {
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== undefined && v !== null && v !== '')
    }
    return value !== undefined && value !== null && value !== ''
  }).length

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor="search-query">Search Query</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search-query"
            placeholder="Search by name, supplier, CAS number, INCI name..."
            value={searchParams.query || ''}
            onChange={(e) => handleInputChange('query', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="type-filter">Type</Label>
          <select
            id="type-filter"
            value={searchParams.filters?.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">All Types</option>
            {Object.entries(INGREDIENT_TYPE_LABELS_MAP).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="category-filter">Category</Label>
          <select
            id="category-filter"
            value={searchParams.filters?.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">All Categories</option>
            {Object.entries(INGREDIENT_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Supplier Filter */}
        <div className="space-y-2">
          <Label htmlFor="supplier-filter">Supplier</Label>
          <Input
            id="supplier-filter"
            placeholder="Filter by supplier"
            value={searchParams.filters?.supplier || ''}
            onChange={(e) => handleFilterChange('supplier', e.target.value || undefined)}
          />
        </div>

        {/* Stock Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="stock-status-filter">Stock Status</Label>
          <select
            id="stock-status-filter"
            value={searchParams.filters?.stockStatus || ''}
            onChange={(e) => handleFilterChange('stockStatus', e.target.value || undefined)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">All Stock Levels</option>
            {Object.entries(STOCK_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Cost Range */}
        <div className="space-y-2">
          <Label>Cost Range</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Min"
              type="number"
              step="0.01"
              min="0"
              value={searchParams.filters?.costRange?.min || ''}
              onChange={(e) => handleFilterChange('costRange', {
                ...searchParams.filters?.costRange,
                min: e.target.value ? parseFloat(e.target.value) : undefined
              })}
            />
            <Input
              placeholder="Max"
              type="number"
              step="0.01"
              min="0"
              value={searchParams.filters?.costRange?.max || ''}
              onChange={(e) => handleFilterChange('costRange', {
                ...searchParams.filters?.costRange,
                max: e.target.value ? parseFloat(e.target.value) : undefined
              })}
            />
          </div>
        </div>

        {/* Active Status */}
        <div className="space-y-2">
          <Label htmlFor="active-status-filter">Status</Label>
          <select
            id="active-status-filter"
            value={searchParams.filters?.isActive === undefined ? '' : searchParams.filters?.isActive ? 'true' : 'false'}
            onChange={(e) => handleFilterChange('isActive', e.target.value === '' ? undefined : e.target.value === 'true')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">All Status</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Tags Filter */}
      <div className="space-y-2">
        <Label htmlFor="tags-filter">Tags</Label>
        <Input
          id="tags-filter"
          placeholder="Enter tags separated by commas"
          value={searchParams.filters?.tags?.join(', ') || ''}
          onChange={(e) => handleFilterChange('tags', e.target.value ? e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) : undefined)}
        />
      </div>

      {/* Sort Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sort-by">Sort By</Label>
          <select
            id="sort-by"
            value={searchParams.sortBy || 'name'}
            onChange={(e) => handleInputChange('sortBy', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="name">Name</option>
            <option value="type">Type</option>
            <option value="supplier">Supplier</option>
            <option value="cost">Cost</option>
            <option value="stockLevel">Stock Level</option>
            <option value="createdAt">Created Date</option>
            <option value="updatedAt">Updated Date</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort-order">Sort Order</Label>
          <select
            id="sort-order"
            value={searchParams.sortOrder || 'asc'}
            onChange={(e) => handleInputChange('sortOrder', e.target.value as 'asc' | 'desc')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={handleSearch} className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
          <Button variant="outline" onClick={handleClearFilters} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
          <Button variant="outline" onClick={handleSaveSearch} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Search
          </Button>
        </div>

        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Filter className="h-3 w-3" />
            {activeFiltersCount} filters active
          </Badge>
        )}
      </div>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Searches
          </Label>
          <div className="flex flex-wrap gap-2">
            {searchHistory.slice(0, 5).map((query, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleInputChange('query', query)}
              >
                {query}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div className="space-y-2">
          <Label>Saved Searches</Label>
          <div className="flex flex-wrap gap-2">
            {savedSearches.map((searchName, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleLoadSavedSearch(searchName)}
              >
                {searchName}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
