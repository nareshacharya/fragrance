import { BaseService } from './base'
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
  IngredientBatchOperation,
  IngredientValidationResult,
  IngredientImportResult,
  IngredientStatistics,
  ingredientSchemas
} from '@/types/ingredient'
import { 
  BaseResponse, 
  PaginatedResponse, 
  SingleResponse, 
  ApiRequestOptions 
} from '../types'
import { API_ENDPOINTS } from '@/config/constants'
import { logger } from '../logger'

/**
 * Ingredient service extending BaseService with specialized methods
 */
export class IngredientService extends BaseService<Ingredient, CreateIngredientRequest, UpdateIngredientRequest> {
  constructor() {
    super(API_ENDPOINTS.INGREDIENTS.LIST)
  }

  /**
   * Search ingredients with advanced filtering
   */
  async searchIngredients(
    params: IngredientSearchParams,
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<Ingredient>> {
    try {
      const url = API_ENDPOINTS.INGREDIENTS.SEARCH
      const response = await this.client.get<PaginatedResponse<Ingredient>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
        params: params,
      })

      logger.debug(`${this.constructor.name}.searchIngredients:`, {
        url,
        params,
        resultCount: Array.isArray(response.data) ? response.data.length : 0,
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.searchIngredients failed:`, error)
      throw error
    }
  }

  /**
   * Search ingredients by type
   */
  async searchByType(
    type: string,
    filters?: Record<string, any>,
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<Ingredient>> {
    try {
      const params: IngredientSearchParams = {
        filters: { type, ...(filters || {}) },
        pagination: {
          page: 1,
          limit: 20,
        },
      }

      return this.searchIngredients(params, options)
    } catch (error) {
      logger.error(`${this.constructor.name}.searchByType failed:`, error)
      throw error
    }
  }

  /**
   * Search ingredients by supplier
   */
  async searchBySupplier(
    supplier: string,
    filters?: Record<string, any>,
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<Ingredient>> {
    try {
      const params: IngredientSearchParams = {
        filters: { supplier, ...(filters || {}) },
        pagination: {
          page: 1,
          limit: 20,
        },
      }

      return this.searchIngredients(params, options)
    } catch (error) {
      logger.error(`${this.constructor.name}.searchBySupplier failed:`, error)
      throw error
    }
  }

  /**
   * Search ingredients by category
   */
  async searchByCategory(
    category: string,
    filters?: Record<string, any>,
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<Ingredient>> {
    try {
      const params: IngredientSearchParams = {
        filters: { category, ...(filters || {}) },
        pagination: {
          page: 1,
          limit: 20,
        },
      }

      return this.searchIngredients(params, options)
    } catch (error) {
      logger.error(`${this.constructor.name}.searchByCategory failed:`, error)
      throw error
    }
  }

  /**
   * Get ingredients with low stock
   */
  async getLowStockIngredients(
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<Ingredient>> {
    try {
      const params: IngredientSearchParams = {
        filters: { stockStatus: 'low_stock' },
        pagination: {
          page: 1,
          limit: 50,
        },
      }

      return this.searchIngredients(params, options)
    } catch (error) {
      logger.error(`${this.constructor.name}.getLowStockIngredients failed:`, error)
      throw error
    }
  }

  /**
   * Get ingredients that are out of stock
   */
  async getOutOfStockIngredients(
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<Ingredient>> {
    try {
      const params: IngredientSearchParams = {
        filters: { stockStatus: 'out_of_stock' },
        pagination: {
          page: 1,
          limit: 50,
        },
      }

      return this.searchIngredients(params, options)
    } catch (error) {
      logger.error(`${this.constructor.name}.getOutOfStockIngredients failed:`, error)
      throw error
    }
  }

  /**
   * Import ingredients from CSV
   */
  async importFromCSV(
    csvData: IngredientImportData[],
    options?: ApiRequestOptions
  ): Promise<IngredientImportResult> {
    try {
      const url = API_ENDPOINTS.INGREDIENTS.IMPORT
      const response = await this.client.post<IngredientImportResult>(url, {
        ingredients: csvData,
        validateOnly: false,
      }, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug(`${this.constructor.name}.importFromCSV:`, {
        url,
        ingredientCount: csvData.length,
        result: response,
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.importFromCSV failed:`, error)
      throw error
    }
  }

  /**
   * Validate CSV data before import
   */
  async validateCSVData(
    csvData: IngredientImportData[],
    options?: ApiRequestOptions
  ): Promise<IngredientValidationResult[]> {
    try {
      const url = API_ENDPOINTS.INGREDIENTS.VALIDATE
      const response = await this.client.post<IngredientValidationResult[]>(url, {
        ingredients: csvData,
        validateOnly: true,
      }, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug(`${this.constructor.name}.validateCSVData:`, {
        url,
        ingredientCount: csvData.length,
        validationResults: response,
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.validateCSVData failed:`, error)
      throw error
    }
  }

  /**
   * Export ingredients to CSV
   */
  async exportToCSV(
    options: IngredientExportOptions,
    requestOptions?: ApiRequestOptions
  ): Promise<Blob> {
    try {
      const url = API_ENDPOINTS.INGREDIENTS.EXPORT
      const response = await this.client.get(url, {
        responseType: 'blob',
        timeout: requestOptions?.timeout,
        headers: requestOptions?.headers,
        params: options,
      })

      logger.debug(`${this.constructor.name}.exportToCSV:`, {
        url,
        options,
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.exportToCSV failed:`, error)
      throw error
    }
  }

  /**
   * Update ingredient stock level
   */
  async updateStock(
    id: string,
    stockUpdate: IngredientStockUpdate,
    options?: ApiRequestOptions
  ): Promise<SingleResponse<Ingredient>> {
    try {
      const url = API_ENDPOINTS.INGREDIENTS.STOCK.replace(':id', id)
      const response = await this.client.put<SingleResponse<Ingredient>>(url, stockUpdate, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug(`${this.constructor.name}.updateStock:`, {
        url,
        id,
        stockUpdate: this.sanitizeData(stockUpdate),
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.updateStock failed:`, error)
      throw error
    }
  }

  /**
   * Get ingredient suppliers
   */
  async getSuppliers(
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<IngredientSupplier>> {
    try {
      const url = API_ENDPOINTS.INGREDIENTS.SUPPLIERS
      const response = await this.client.get<PaginatedResponse<IngredientSupplier>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug(`${this.constructor.name}.getSuppliers:`, {
        url,
        supplierCount: Array.isArray(response.data) ? response.data.length : 0,
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.getSuppliers failed:`, error)
      throw error
    }
  }

  /**
   * Get ingredient usage in formulas
   */
  async getUsage(
    id: string,
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<IngredientUsage>> {
    try {
      const url = API_ENDPOINTS.INGREDIENTS.USAGE.replace(':id', id)
      const response = await this.client.get<PaginatedResponse<IngredientUsage>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug(`${this.constructor.name}.getUsage:`, {
        url,
        id,
        usageCount: Array.isArray(response.data) ? response.data.length : 0,
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.getUsage failed:`, error)
      throw error
    }
  }

  /**
   * Get ingredient statistics
   */
  async getStatistics(
    options?: ApiRequestOptions
  ): Promise<SingleResponse<IngredientStatistics>> {
    try {
      const url = API_ENDPOINTS.INGREDIENTS.STATISTICS
      const response = await this.client.get<SingleResponse<IngredientStatistics>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug(`${this.constructor.name}.getStatistics:`, {
        url,
        statistics: response.data,
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.getStatistics failed:`, error)
      throw error
    }
  }

  /**
   * Perform batch operations on ingredients
   */
  async batchOperation(
    operation: IngredientBatchOperation,
    options?: ApiRequestOptions
  ): Promise<BaseResponse[]> {
    try {
      const url = API_ENDPOINTS.INGREDIENTS.BATCH
      const response = await this.client.post<BaseResponse[]>(url, operation, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug(`${this.constructor.name}.batchOperation:`, {
        url,
        operation: this.sanitizeData(operation),
        resultCount: Array.isArray(response) ? response.length : 0,
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.batchOperation failed:`, error)
      throw error
    }
  }

  /**
   * Bulk update ingredient stock levels
   */
  async bulkUpdateStock(
    updates: Array<{ id: string; stockUpdate: IngredientStockUpdate }>,
    options?: ApiRequestOptions
  ): Promise<BaseResponse[]> {
    try {
      const operation: IngredientBatchOperation = {
        operation: 'updateStock',
        ingredientIds: updates.map(u => u.id),
        data: { updates },
      }

      return this.batchOperation(operation, options)
    } catch (error) {
      logger.error(`${this.constructor.name}.bulkUpdateStock failed:`, error)
      throw error
    }
  }

  /**
   * Bulk activate/deactivate ingredients
   */
  async bulkToggleActive(
    ingredientIds: string[],
    isActive: boolean,
    options?: ApiRequestOptions
  ): Promise<BaseResponse[]> {
    try {
      const operation: IngredientBatchOperation = {
        operation: isActive ? 'activate' : 'deactivate',
        ingredientIds,
      }

      return this.batchOperation(operation, options)
    } catch (error) {
      logger.error(`${this.constructor.name}.bulkToggleActive failed:`, error)
      throw error
    }
  }

  /**
   * Bulk delete ingredients
   */
  async bulkDelete(
    ingredientIds: string[],
    options?: ApiRequestOptions
  ): Promise<BaseResponse[]> {
    try {
      const operation: IngredientBatchOperation = {
        operation: 'delete',
        ingredientIds,
      }

      return this.batchOperation(operation, options)
    } catch (error) {
      logger.error(`${this.constructor.name}.bulkDelete failed:`, error)
      throw error
    }
  }

  /**
   * Get ingredient by supplier code
   */
  async getBySupplierCode(
    supplierCode: string,
    options?: ApiRequestOptions
  ): Promise<SingleResponse<Ingredient>> {
    try {
      const url = API_ENDPOINTS.INGREDIENTS.SUPPLIER_CODE.replace(':code', supplierCode)
      const response = await this.client.get<SingleResponse<Ingredient>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug(`${this.constructor.name}.getBySupplierCode:`, {
        url,
        supplierCode,
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.getBySupplierCode failed:`, error)
      throw error
    }
  }

  /**
   * Get ingredient by CAS number
   */
  async getByCASNumber(
    casNumber: string,
    options?: ApiRequestOptions
  ): Promise<SingleResponse<Ingredient>> {
    try {
      const url = API_ENDPOINTS.INGREDIENTS.CAS_NUMBER.replace(':number', casNumber)
      const response = await this.client.get<SingleResponse<Ingredient>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug(`${this.constructor.name}.getByCASNumber:`, {
        url,
        casNumber,
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.getByCASNumber failed:`, error)
      throw error
    }
  }

  /**
   * Get ingredient by INCI name
   */
  async getByINCIName(
    inciName: string,
    options?: ApiRequestOptions
  ): Promise<SingleResponse<Ingredient>> {
    try {
      const url = API_ENDPOINTS.INGREDIENTS.INCI_NAME.replace(':name', inciName)
      const response = await this.client.get<SingleResponse<Ingredient>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug(`${this.constructor.name}.getByINCIName:`, {
        url,
        inciName,
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.getByINCIName failed:`, error)
      throw error
    }
  }

  /**
   * Search ingredients by multiple criteria
   */
  async advancedSearch(
    criteria: {
      name?: string
      type?: string
      category?: string
      supplier?: string
      casNumber?: string
      inciName?: string
      tags?: string[]
      stockStatus?: string
      costRange?: { min?: number; max?: number }
      isActive?: boolean
    },
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<Ingredient>> {
    try {
      const params: IngredientSearchParams = {
        filters: criteria,
        pagination: {
          page: 1,
          limit: 20,
        },
      }

      return this.searchIngredients(params, options)
    } catch (error) {
      logger.error(`${this.constructor.name}.advancedSearch failed:`, error)
      throw error
    }
  }

  /**
   * Get ingredient recommendations based on usage patterns
   */
  async getRecommendations(
    ingredientId: string,
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<Ingredient>> {
    try {
      const url = API_ENDPOINTS.INGREDIENTS.RECOMMENDATIONS.replace(':id', ingredientId)
      const response = await this.client.get<PaginatedResponse<Ingredient>>(url, {
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug(`${this.constructor.name}.getRecommendations:`, {
        url,
        ingredientId,
        recommendationCount: Array.isArray(response.data) ? response.data.length : 0,
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.getRecommendations failed:`, error)
      throw error
    }
  }

  /**
   * Validate ingredient data
   */
  validateIngredientData(data: CreateIngredientRequest): IngredientValidationResult {
    try {
      const result = ingredientSchemas.createIngredient.safeParse(data)
      
      if (result.success) {
        return {
          isValid: true,
          errors: [],
          warnings: [],
        }
      } else {
        return {
          isValid: false,
          errors: result.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
          warnings: [],
        }
      }
    } catch (error) {
      logger.error(`${this.constructor.name}.validateIngredientData failed:`, error)
      return {
        isValid: false,
        errors: [{
          field: 'unknown',
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
        }],
        warnings: [],
      }
    }
  }

  /**
   * Get ingredient template for CSV import
   */
  async getImportTemplate(
    options?: ApiRequestOptions
  ): Promise<Blob> {
    try {
      const url = API_ENDPOINTS.INGREDIENTS.IMPORT_TEMPLATE
      const response = await this.client.get(url, {
        responseType: 'blob',
        timeout: options?.timeout,
        headers: options?.headers,
      })

      logger.debug(`${this.constructor.name}.getImportTemplate:`, {
        url,
      })

      return response
    } catch (error) {
      logger.error(`${this.constructor.name}.getImportTemplate failed:`, error)
      throw error
    }
  }
}

// Export singleton instance
export const ingredientService = new IngredientService()
