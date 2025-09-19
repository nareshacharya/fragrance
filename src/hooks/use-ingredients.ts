'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { ingredientService } from '@/lib/api/services/ingredients'
import { 
  Ingredient,
  CreateIngredientRequest,
  UpdateIngredientRequest,
  IngredientSearchParams,
  IngredientImportData,
  IngredientExportOptions,
  IngredientStockUpdate,
  IngredientSupplier,
  IngredientUsage,
  IngredientStatistics,
  IngredientValidationResult,
  IngredientImportResult
} from '@/types/ingredient'
import { PaginatedResponse, SingleResponse } from '@/lib/api/types'

// Hook for managing ingredient list with search and filtering
export function useIngredients(initialParams?: IngredientSearchParams) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [searchParams, setSearchParams] = useState<IngredientSearchParams>(
    initialParams || {
      pagination: { page: 1, limit: 20 },
      sortBy: 'name',
      sortOrder: 'asc',
    }
  )

  const loadIngredients = useCallback(async (params?: IngredientSearchParams) => {
    try {
      setLoading(true)
      setError(null)
      
      const paramsToUse = params || searchParams
      const response: PaginatedResponse<Ingredient> = await ingredientService.searchIngredients(paramsToUse)
      
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

  const search = useCallback((params: IngredientSearchParams) => {
    setSearchParams(params)
    loadIngredients(params)
  }, [loadIngredients])

  const refresh = useCallback(() => {
    loadIngredients()
  }, [loadIngredients])

  const updatePage = useCallback((page: number) => {
    const newParams = { ...searchParams, pagination: { page, limit: pageSize } }
    setSearchParams(newParams)
    loadIngredients(newParams)
  }, [searchParams, pageSize, loadIngredients])

  const updatePageSize = useCallback((size: number) => {
    setPageSize(size)
    const newParams = { ...searchParams, pagination: { page: 1, limit: size } }
    setSearchParams(newParams)
    loadIngredients(newParams)
  }, [searchParams, loadIngredients])

  // Load ingredients on mount
  useEffect(() => {
    loadIngredients()
  }, [])

  return {
    ingredients,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
    searchParams,
    search,
    refresh,
    updatePage,
    updatePageSize,
    setError,
  }
}

// Hook for managing a single ingredient
export function useIngredient(id: string) {
  const [ingredient, setIngredient] = useState<Ingredient | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadIngredient = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      
      const response: SingleResponse<Ingredient> = await ingredientService.get(id)
      setIngredient(response.data)
    } catch (err: any) {
      setError(err.message || 'Failed to load ingredient')
      console.error('Error loading ingredient:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  const updateIngredient = useCallback(async (data: UpdateIngredientRequest) => {
    try {
      setLoading(true)
      setError(null)
      
      const response: SingleResponse<Ingredient> = await ingredientService.update(id, data)
      setIngredient(response.data)
      return response.data
    } catch (err: any) {
      setError(err.message || 'Failed to update ingredient')
      throw err
    } finally {
      setLoading(false)
    }
  }, [id])

  const deleteIngredient = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      await ingredientService.delete(id)
      setIngredient(null)
    } catch (err: any) {
      setError(err.message || 'Failed to delete ingredient')
      throw err
    } finally {
      setLoading(false)
    }
  }, [id])

  const updateStock = useCallback(async (stockUpdate: IngredientStockUpdate) => {
    try {
      setLoading(true)
      setError(null)
      
      const response: SingleResponse<Ingredient> = await ingredientService.updateStock(id, stockUpdate)
      setIngredient(response.data)
      return response.data
    } catch (err: any) {
      setError(err.message || 'Failed to update stock')
      throw err
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadIngredient()
  }, [loadIngredient])

  return {
    ingredient,
    loading,
    error,
    loadIngredient,
    updateIngredient,
    deleteIngredient,
    updateStock,
    setError,
  }
}

// Hook for ingredient search functionality
export function useIngredientSearch() {
  const [searchResults, setSearchResults] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const search = useCallback(async (query: string, filters?: Record<string, any>) => {
    try {
      setLoading(true)
      setError(null)
      
      const params: IngredientSearchParams = {
        query,
        filters,
        pagination: { page: 1, limit: 20 },
        sortBy: 'name',
        sortOrder: 'asc',
      }
      
      const response: PaginatedResponse<Ingredient> = await ingredientService.searchIngredients(params)
      setSearchResults(response.data)
      
      // Add to search history
      if (query && !searchHistory.includes(query)) {
        setSearchHistory(prev => [query, ...prev.slice(0, 9)])
      }
    } catch (err: any) {
      setError(err.message || 'Search failed')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }, [searchHistory])

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([])
  }, [])

  const searchByType = useCallback(async (type: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response: PaginatedResponse<Ingredient> = await ingredientService.searchByType(type)
      setSearchResults(response.data)
    } catch (err: any) {
      setError(err.message || 'Search by type failed')
    } finally {
      setLoading(false)
    }
  }, [])

  const searchBySupplier = useCallback(async (supplier: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response: PaginatedResponse<Ingredient> = await ingredientService.searchBySupplier(supplier)
      setSearchResults(response.data)
    } catch (err: any) {
      setError(err.message || 'Search by supplier failed')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    searchResults,
    loading,
    error,
    searchHistory,
    search,
    searchByType,
    searchBySupplier,
    clearSearchHistory,
    setError,
  }
}

// Hook for ingredient import functionality
export function useIngredientImport() {
  const [importResult, setImportResult] = useState<IngredientImportResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const importData = useCallback(async (data: IngredientImportData[]) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await ingredientService.importFromCSV(data)
      setImportResult(result)
      return result
    } catch (err: any) {
      setError(err.message || 'Import failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const validateData = useCallback(async (data: IngredientImportData[]) => {
    try {
      setLoading(true)
      setError(null)
      
      const results = await ingredientService.validateCSVData(data)
      return results
    } catch (err: any) {
      setError(err.message || 'Validation failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const downloadTemplate = useCallback(async () => {
    try {
      setError(null)
      
      const templateBlob = await ingredientService.getImportTemplate()
      
      // Create download link
      const url = window.URL.createObjectURL(templateBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'ingredient-import-template.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message || 'Failed to download template')
      throw err
    }
  }, [])

  const reset = useCallback(() => {
    setImportResult(null)
    setError(null)
  }, [])

  return {
    importResult,
    loading,
    error,
    importData,
    validateData,
    downloadTemplate,
    reset,
    setError,
  }
}

// Hook for ingredient export functionality
export function useIngredientExport() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const exportData = useCallback(async (options: IngredientExportOptions) => {
    try {
      setLoading(true)
      setError(null)
      
      const blob = await ingredientService.exportToCSV(options)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Set filename based on format and timestamp
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `ingredients-export-${timestamp}.${options.format}`
      link.download = filename
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message || 'Export failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const previewExport = useCallback(async (options: IngredientExportOptions) => {
    try {
      setLoading(true)
      setError(null)
      
      const searchParams: IngredientSearchParams = {
        filters: options.filters,
        pagination: { page: 1, limit: 10 },
        sortBy: 'name',
        sortOrder: 'asc',
      }
      
      const response = await ingredientService.searchIngredients(searchParams)
      return response.data
    } catch (err: any) {
      setError(err.message || 'Preview failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    exportData,
    previewExport,
    setError,
  }
}

// Hook for ingredient suppliers
export function useIngredientSuppliers() {
  const [suppliers, setSuppliers] = useState<IngredientSupplier[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSuppliers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response: PaginatedResponse<IngredientSupplier> = await ingredientService.getSuppliers()
      setSuppliers(response.data)
    } catch (err: any) {
      setError(err.message || 'Failed to load suppliers')
      console.error('Error loading suppliers:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSuppliers()
  }, [loadSuppliers])

  return {
    suppliers,
    loading,
    error,
    loadSuppliers,
    setError,
  }
}

// Hook for ingredient usage tracking
export function useIngredientUsage(ingredientId: string) {
  const [usage, setUsage] = useState<IngredientUsage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUsage = useCallback(async () => {
    if (!ingredientId) return

    try {
      setLoading(true)
      setError(null)
      
      const response: PaginatedResponse<IngredientUsage> = await ingredientService.getUsage(ingredientId)
      setUsage(response.data)
    } catch (err: any) {
      setError(err.message || 'Failed to load usage data')
      console.error('Error loading usage:', err)
    } finally {
      setLoading(false)
    }
  }, [ingredientId])

  useEffect(() => {
    loadUsage()
  }, [loadUsage])

  return {
    usage,
    loading,
    error,
    loadUsage,
    setError,
  }
}

// Hook for ingredient statistics
export function useIngredientStatistics() {
  const [statistics, setStatistics] = useState<IngredientStatistics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response: SingleResponse<IngredientStatistics> = await ingredientService.getStatistics()
      setStatistics(response.data)
    } catch (err: any) {
      setError(err.message || 'Failed to load statistics')
      console.error('Error loading statistics:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStatistics()
  }, [loadStatistics])

  return {
    statistics,
    loading,
    error,
    loadStatistics,
    setError,
  }
}

// Hook for bulk operations
export function useIngredientBulkOperations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const bulkDelete = useCallback(async (ingredientIds: string[]) => {
    try {
      setLoading(true)
      setError(null)
      
      await ingredientService.bulkDelete(ingredientIds)
    } catch (err: any) {
      setError(err.message || 'Bulk delete failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const bulkToggleActive = useCallback(async (ingredientIds: string[], isActive: boolean) => {
    try {
      setLoading(true)
      setError(null)
      
      await ingredientService.bulkToggleActive(ingredientIds, isActive)
    } catch (err: any) {
      setError(err.message || 'Bulk toggle active failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const bulkUpdateStock = useCallback(async (updates: Array<{ id: string; stockUpdate: IngredientStockUpdate }>) => {
    try {
      setLoading(true)
      setError(null)
      
      await ingredientService.bulkUpdateStock(updates)
    } catch (err: any) {
      setError(err.message || 'Bulk update stock failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    bulkDelete,
    bulkToggleActive,
    bulkUpdateStock,
    setError,
  }
}

// Hook for ingredient validation
export function useIngredientValidation() {
  const validateIngredient = useCallback((data: CreateIngredientRequest): IngredientValidationResult => {
    return ingredientService.validateIngredientData(data)
  }, [])

  const validateImportData = useCallback(async (data: IngredientImportData[]): Promise<IngredientValidationResult[]> => {
    try {
      return await ingredientService.validateCSVData(data)
    } catch (err: any) {
      console.error('Validation error:', err)
      return data.map((_, index) => ({
        isValid: false,
        errors: [{ field: 'unknown', message: 'Validation failed', code: 'VALIDATION_ERROR' }],
        warnings: [],
      }))
    }
  }, [])

  return {
    validateIngredient,
    validateImportData,
  }
}
