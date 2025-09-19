'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { IngredientList } from '@/components/ingredients'
import { ingredientService } from '@/lib/api/services/ingredients'
import { Ingredient, IngredientSearchParams } from '@/types/ingredient'
import { PaginatedResponse } from '@/lib/api/types'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  AlertCircle, 
  RefreshCw,
  Plus,
  Upload,
  Download
} from 'lucide-react'

export default function IngredientsPage() {
  const router = useRouter()
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [searchParams, setSearchParams] = useState<IngredientSearchParams>({
    pagination: { page: 1, limit: 20 },
    sortBy: 'name',
    sortOrder: 'asc',
  })
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const loadIngredients = useCallback(async (params: IngredientSearchParams = searchParams) => {
    try {
      setLoading(true)
      setError(null)
      
      const response: PaginatedResponse<Ingredient> = await ingredientService.searchIngredients(params)
      
      setIngredients(response.data)
      setTotalCount(response.pagination.total)
      setCurrentPage(response.pagination.page)
    } catch (err: any) {
      setError(err.message || 'Failed to load ingredients')
      console.error('Error loading ingredients:', err)
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  const handleSearch = useCallback((params: IngredientSearchParams) => {
    setSearchParams(params)
    loadIngredients(params)
  }, [loadIngredients])

  const handleFilter = useCallback((filters: Record<string, any>) => {
    const newParams = { ...searchParams, filters, pagination: { page: 1, limit: pageSize } }
    setSearchParams(newParams)
    loadIngredients(newParams)
  }, [searchParams, pageSize, loadIngredients])

  const handlePageChange = useCallback((page: number) => {
    const newParams = { ...searchParams, pagination: { page, limit: pageSize } }
    setSearchParams(newParams)
    loadIngredients(newParams)
  }, [searchParams, pageSize, loadIngredients])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    const newParams = { ...searchParams, pagination: { page: 1, limit: size } }
    setSearchParams(newParams)
    loadIngredients(newParams)
  }, [searchParams, loadIngredients])

  const handleRefresh = useCallback(() => {
    loadIngredients()
  }, [loadIngredients])

  const handleView = useCallback((ingredient: Ingredient) => {
    router.push(`/ingredients/${ingredient.id}`)
  }, [router])

  const handleEdit = useCallback((ingredient: Ingredient) => {
    router.push(`/ingredients/${ingredient.id}/edit`)
  }, [router])

  const handleDelete = useCallback(async (ingredient: Ingredient) => {
    if (!confirm(`Are you sure you want to delete "${ingredient.name}"?`)) {
      return
    }

    try {
      await ingredientService.delete(ingredient.id)
      // Reload the list after deletion
      loadIngredients()
    } catch (err: any) {
      setError(err.message || 'Failed to delete ingredient')
    }
  }, [loadIngredients])

  const handleUpdateStock = useCallback((ingredient: Ingredient) => {
    // This would open a stock update modal or navigate to a stock update page
    console.log('Update stock for:', ingredient.name)
  }, [])

  const handleCreate = useCallback(() => {
    router.push('/ingredients/create')
  }, [router])

  const handleImport = useCallback(() => {
    router.push('/ingredients/import')
  }, [router])

  const handleExport = useCallback(() => {
    router.push('/ingredients/export')
  }, [router])

  const handleBulkAction = useCallback(async (action: string, ingredientIds: string[]) => {
    try {
      switch (action) {
        case 'delete':
          if (!confirm(`Are you sure you want to delete ${ingredientIds.length} ingredients?`)) {
            return
          }
          await ingredientService.bulkDelete(ingredientIds)
          break
        case 'activate':
          await ingredientService.bulkToggleActive(ingredientIds, true)
          break
        case 'deactivate':
          await ingredientService.bulkToggleActive(ingredientIds, false)
          break
        case 'updateStock':
          // This would open a bulk stock update modal
          console.log('Bulk update stock for:', ingredientIds)
          break
        default:
          console.warn('Unknown bulk action:', action)
      }
      
      // Reload the list after bulk action
      loadIngredients()
      setSelectedIngredients([])
    } catch (err: any) {
      setError(err.message || `Failed to ${action} ingredients`)
    }
  }, [loadIngredients])

  const handleSelectionChange = useCallback((ingredientIds: string[]) => {
    setSelectedIngredients(ingredientIds)
  }, [])

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode)
  }, [])

  // Load ingredients on component mount
  useEffect(() => {
    loadIngredients()
  }, [])

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Ingredients List */}
      <IngredientList
        ingredients={ingredients}
        loading={loading}
        error={error}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onRefresh={handleRefresh}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUpdateStock={handleUpdateStock}
        onCreate={handleCreate}
        onImport={handleImport}
        onExport={handleExport}
        onBulkAction={handleBulkAction}
        selectedIngredients={selectedIngredients}
        onSelectionChange={handleSelectionChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        showFilters={true}
        showSearch={true}
        showActions={true}
      />
    </div>
  )
}
