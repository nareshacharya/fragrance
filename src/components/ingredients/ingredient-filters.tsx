'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  INGREDIENT_TYPE_LABELS_MAP,
  INGREDIENT_CATEGORY_LABELS,
  STOCK_STATUS_LABELS
} from '@/types/ingredient'
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  DollarSign,
  Package,
  Tag
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface IngredientFiltersProps {
  filters: Record<string, any>
  onFilterChange: (filters: Record<string, any>) => void
  onClearFilters: () => void
  onSortChange: (field: string, order: 'asc' | 'desc') => void
  sortBy: string
  sortOrder: 'asc' | 'desc'
  className?: string
}

export function IngredientFilters({
  filters,
  onFilterChange,
  onClearFilters,
  onSortChange,
  sortBy,
  sortOrder,
  className,
}: IngredientFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic', 'stock']))

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }, [])

  const handleFilterChange = useCallback((key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value })
  }, [filters, onFilterChange])

  const handleRangeFilterChange = useCallback((key: string, field: 'min' | 'max', value: number | undefined) => {
    const currentRange = filters[key] || {}
    onFilterChange({
      ...filters,
      [key]: {
        ...currentRange,
        [field]: value,
      }
    })
  }, [filters, onFilterChange])

  const handleMultiSelectChange = useCallback((key: string, value: string, checked: boolean) => {
    const currentValues = filters[key] || []
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v: string) => v !== value)
    
    onFilterChange({
      ...filters,
      [key]: newValues.length > 0 ? newValues : undefined
    })
  }, [filters, onFilterChange])

  const activeFiltersCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== undefined && v !== null && v !== '')
    }
    return value !== undefined && value !== null && value !== ''
  }).length

  const FilterSection = ({ 
    id, 
    title, 
    icon: Icon, 
    children 
  }: { 
    id: string
    title: string
    icon: React.ComponentType<{ className?: string }>
    children: React.ReactNode
  }) => {
    const isExpanded = expandedSections.has(id)
    
    return (
      <div className="border rounded-lg">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {isExpanded && (
          <div className="p-4 pt-0 space-y-4">
            {children}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount} active</Badge>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      </div>

      {/* Filter Sections */}
      <div className="space-y-3">
        {/* Basic Filters */}
        <FilterSection id="basic" title="Basic Information" icon={Package}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type-filter">Type</Label>
              <select
                id="type-filter"
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">All Types</option>
                {Object.entries(INGREDIENT_TYPE_LABELS_MAP).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-filter">Category</Label>
              <select
                id="category-filter"
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">All Categories</option>
                {Object.entries(INGREDIENT_CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier-filter">Supplier</Label>
              <Input
                id="supplier-filter"
                placeholder="Filter by supplier"
                value={filters.supplier || ''}
                onChange={(e) => handleFilterChange('supplier', e.target.value || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="active-status-filter">Status</Label>
              <select
                id="active-status-filter"
                value={filters.isActive === undefined ? '' : filters.isActive ? 'true' : 'false'}
                onChange={(e) => handleFilterChange('isActive', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">All Status</option>
                <option value="true">Active Only</option>
                <option value="false">Inactive Only</option>
              </select>
            </div>
          </div>
        </FilterSection>

        {/* Stock Filters */}
        <FilterSection id="stock" title="Stock & Inventory" icon={Package}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock-status-filter">Stock Status</Label>
              <select
                id="stock-status-filter"
                value={filters.stockStatus || ''}
                onChange={(e) => handleFilterChange('stockStatus', e.target.value || undefined)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">All Stock Levels</option>
                {Object.entries(STOCK_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Stock Level Range</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  min="0"
                  value={filters.stockLevelRange?.min || ''}
                  onChange={(e) => handleRangeFilterChange('stockLevelRange', 'min', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
                <Input
                  placeholder="Max"
                  type="number"
                  min="0"
                  value={filters.stockLevelRange?.max || ''}
                  onChange={(e) => handleRangeFilterChange('stockLevelRange', 'max', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Cost Filters */}
        <FilterSection id="cost" title="Cost & Pricing" icon={DollarSign}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cost Range</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min Cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={filters.costRange?.min || ''}
                  onChange={(e) => handleRangeFilterChange('costRange', 'min', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
                <Input
                  placeholder="Max Cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={filters.costRange?.max || ''}
                  onChange={(e) => handleRangeFilterChange('costRange', 'max', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency-filter">Currency</Label>
              <select
                id="currency-filter"
                value={filters.currency || ''}
                onChange={(e) => handleFilterChange('currency', e.target.value || undefined)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">All Currencies</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </FilterSection>

        {/* Date Filters */}
        <FilterSection id="dates" title="Dates" icon={Calendar}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="created-after">Created After</Label>
              <Input
                id="created-after"
                type="date"
                value={filters.createdAfter || ''}
                onChange={(e) => handleFilterChange('createdAfter', e.target.value || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="created-before">Created Before</Label>
              <Input
                id="created-before"
                type="date"
                value={filters.createdBefore || ''}
                onChange={(e) => handleFilterChange('createdBefore', e.target.value || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="updated-after">Updated After</Label>
              <Input
                id="updated-after"
                type="date"
                value={filters.updatedAfter || ''}
                onChange={(e) => handleFilterChange('updatedAfter', e.target.value || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="updated-before">Updated Before</Label>
              <Input
                id="updated-before"
                type="date"
                value={filters.updatedBefore || ''}
                onChange={(e) => handleFilterChange('updatedBefore', e.target.value || undefined)}
              />
            </div>
          </div>
        </FilterSection>

        {/* Tags Filters */}
        <FilterSection id="tags" title="Tags & Labels" icon={Tag}>
          <div className="space-y-2">
            <Label htmlFor="tags-filter">Tags</Label>
            <Input
              id="tags-filter"
              placeholder="Enter tags separated by commas"
              value={Array.isArray(filters.tags) ? filters.tags.join(', ') : ''}
              onChange={(e) => handleFilterChange('tags', e.target.value ? e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) : undefined)}
            />
          </div>
        </FilterSection>

        {/* Sort Options */}
        <FilterSection id="sort" title="Sorting" icon={Filter}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sort-by">Sort By</Label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value, sortOrder)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="category">Category</option>
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
                value={sortOrder}
                onChange={(e) => onSortChange(sortBy, e.target.value as 'asc' | 'desc')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </FilterSection>
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="space-y-2">
          <Label>Active Filters</Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (Array.isArray(value) && value.length > 0) {
                return (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    {key}: {value.join(', ')}
                    <button
                      onClick={() => handleFilterChange(key, undefined)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )
              }
              if (typeof value === 'object' && value !== null) {
                const rangeValues = Object.values(value).filter(v => v !== undefined && v !== null && v !== '')
                if (rangeValues.length > 0) {
                  return (
                    <Badge key={key} variant="secondary" className="flex items-center gap-1">
                      {key}: {rangeValues.join(' - ')}
                      <button
                        onClick={() => handleFilterChange(key, undefined)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  )
                }
              }
              if (value !== undefined && value !== null && value !== '') {
                return (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    {key}: {String(value)}
                    <button
                      onClick={() => handleFilterChange(key, undefined)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )
              }
              return null
            })}
          </div>
        </div>
      )}
    </div>
  )
}
