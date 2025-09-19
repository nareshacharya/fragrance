import { IngredientService } from './ingredients'
import { apiClient } from '../client'
import { logger } from '../logger'
import { 
  BaseResponse, 
  PaginatedResponse, 
  SingleResponse, 
  ApiRequestOptions 
} from '../types'
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
} from '@/types/ingredient'
import { API_ENDPOINTS } from '@/config/constants'

// Mock the HTTP client
jest.mock('../client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

// Mock the logger
jest.mock('../logger', () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}))

// Mock the ingredient schemas
jest.mock('@/types/ingredient', () => ({
  ...jest.requireActual('@/types/ingredient'),
  ingredientSchemas: {
    createIngredient: {
      safeParse: jest.fn(),
    },
  },
}))

// Mock the API endpoints
jest.mock('@/config/constants', () => ({
  API_ENDPOINTS: {
    INGREDIENTS: {
      LIST: '/api/ingredients',
      SEARCH: '/api/ingredients/search',
      IMPORT: '/api/ingredients/import',
      VALIDATE: '/api/ingredients/validate',
      EXPORT: '/api/ingredients/export',
      STOCK: '/api/ingredients/:id/stock',
      SUPPLIERS: '/api/ingredients/suppliers',
      USAGE: '/api/ingredients/:id/usage',
      STATISTICS: '/api/ingredients/statistics',
      BATCH: '/api/ingredients/batch',
      SUPPLIER_CODE: '/api/ingredients/supplier/:code',
      CAS_NUMBER: '/api/ingredients/cas/:number',
      INCI_NAME: '/api/ingredients/inci/:name',
      RECOMMENDATIONS: '/api/ingredients/:id/recommendations',
      IMPORT_TEMPLATE: '/api/ingredients/import-template',
    },
  },
}))

describe('IngredientService', () => {
  let service: IngredientService
  let mockApiClient: jest.Mocked<typeof apiClient>

  beforeEach(() => {
    service = new IngredientService()
    mockApiClient = apiClient as jest.Mocked<typeof apiClient>
    jest.clearAllMocks()
  })

  describe('Search Operations', () => {
    describe('searchIngredients', () => {
      it('should search ingredients with advanced filtering', async () => {
        const params: IngredientSearchParams = {
          query: 'rose',
          filters: { category: 'essential_oil' },
          pagination: { page: 1, limit: 20 },
        }
        const mockResponse: PaginatedResponse<Ingredient> = {
          data: [
            {
              id: '1',
              name: 'Rose Essential Oil',
              type: 'essential_oil',
              category: 'floral',
              supplier: 'Test Supplier',
              casNumber: '8007-01-0',
              inciName: 'Rosa Damascena Flower Oil',
              cost: 150.00,
              stock: 100,
              unit: 'ml',
              isActive: true,
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z',
            },
          ],
          pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.searchIngredients(params)

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/ingredients/search', {
          timeout: undefined,
          headers: undefined,
          params: params,
        })
        expect(result).toEqual(mockResponse)
        expect(logger.debug).toHaveBeenCalledWith(
          'IngredientService.searchIngredients:',
          expect.objectContaining({
            url: '/api/ingredients/search',
            params,
            resultCount: 1,
          })
        )
      })

      it('should handle search errors', async () => {
        const params: IngredientSearchParams = {
          query: 'rose',
          pagination: { page: 1, limit: 20 },
        }
        const error = new Error('Search failed')

        mockApiClient.get.mockRejectedValue(error)

        await expect(service.searchIngredients(params)).rejects.toThrow('Search failed')
        expect(logger.error).toHaveBeenCalledWith(
          'IngredientService.searchIngredients failed:',
          error
        )
      })
    })

    describe('searchByType', () => {
      it('should search ingredients by type', async () => {
        const mockResponse: PaginatedResponse<Ingredient> = {
          data: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.searchByType('essential_oil', { category: 'floral' })

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/ingredients/search', {
          timeout: undefined,
          headers: undefined,
          params: expect.objectContaining({
            filters: { type: 'essential_oil', category: 'floral' },
            pagination: { page: 1, limit: 20 },
          }),
        })
        expect(result).toEqual(mockResponse)
      })
    })

    describe('searchBySupplier', () => {
      it('should search ingredients by supplier', async () => {
        const mockResponse: PaginatedResponse<Ingredient> = {
          data: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.searchBySupplier('Test Supplier')

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/ingredients/search', {
          timeout: undefined,
          headers: undefined,
          params: expect.objectContaining({
            filters: { supplier: 'Test Supplier' },
            pagination: { page: 1, limit: 20 },
          }),
        })
        expect(result).toEqual(mockResponse)
      })
    })

    describe('searchByCategory', () => {
      it('should search ingredients by category', async () => {
        const mockResponse: PaginatedResponse<Ingredient> = {
          data: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.searchByCategory('floral')

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/ingredients/search', {
          timeout: undefined,
          headers: undefined,
          params: expect.objectContaining({
            filters: { category: 'floral' },
            pagination: { page: 1, limit: 20 },
          }),
        })
        expect(result).toEqual(mockResponse)
      })
    })

    describe('getLowStockIngredients', () => {
      it('should get ingredients with low stock', async () => {
        const mockResponse: PaginatedResponse<Ingredient> = {
          data: [],
          pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.getLowStockIngredients()

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/ingredients/search', {
          timeout: undefined,
          headers: undefined,
          params: expect.objectContaining({
            filters: { stockStatus: 'low_stock' },
            pagination: { page: 1, limit: 50 },
          }),
        })
        expect(result).toEqual(mockResponse)
      })
    })

    describe('getOutOfStockIngredients', () => {
      it('should get ingredients that are out of stock', async () => {
        const mockResponse: PaginatedResponse<Ingredient> = {
          data: [],
          pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.getOutOfStockIngredients()

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/ingredients/search', {
          timeout: undefined,
          headers: undefined,
          params: expect.objectContaining({
            filters: { stockStatus: 'out_of_stock' },
            pagination: { page: 1, limit: 50 },
          }),
        })
        expect(result).toEqual(mockResponse)
      })
    })
  })

  describe('Import/Export Operations', () => {
    describe('importFromCSV', () => {
      it('should import ingredients from CSV data', async () => {
        const csvData: IngredientImportData[] = [
          {
            name: 'Rose Oil',
            type: 'essential_oil',
            category: 'floral',
            supplier: 'Test Supplier',
            casNumber: '8007-01-0',
            inciName: 'Rosa Damascena Flower Oil',
            cost: 150.00,
            stock: 100,
            unit: 'ml',
          },
        ]
        const mockResponse: IngredientImportResult = {
          success: true,
          imported: 1,
          failed: 0,
          errors: [],
          warnings: [],
        }

        mockApiClient.post.mockResolvedValue(mockResponse)

        const result = await service.importFromCSV(csvData)

        expect(mockApiClient.post).toHaveBeenCalledWith('/api/ingredients/import', {
          ingredients: csvData,
          validateOnly: false,
        }, {
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockResponse)
        expect(logger.debug).toHaveBeenCalledWith(
          'IngredientService.importFromCSV:',
          expect.objectContaining({
            url: '/api/ingredients/import',
            ingredientCount: 1,
            result: mockResponse,
          })
        )
      })

      it('should handle import errors', async () => {
        const csvData: IngredientImportData[] = []
        const error = new Error('Import failed')

        mockApiClient.post.mockRejectedValue(error)

        await expect(service.importFromCSV(csvData)).rejects.toThrow('Import failed')
        expect(logger.error).toHaveBeenCalledWith(
          'IngredientService.importFromCSV failed:',
          error
        )
      })
    })

    describe('validateCSVData', () => {
      it('should validate CSV data before import', async () => {
        const csvData: IngredientImportData[] = [
          {
            name: 'Rose Oil',
            type: 'essential_oil',
            category: 'floral',
            supplier: 'Test Supplier',
            casNumber: '8007-01-0',
            inciName: 'Rosa Damascena Flower Oil',
            cost: 150.00,
            stock: 100,
            unit: 'ml',
          },
        ]
        const mockResponse: IngredientValidationResult[] = [
          {
            isValid: true,
            errors: [],
            warnings: [],
          },
        ]

        mockApiClient.post.mockResolvedValue(mockResponse)

        const result = await service.validateCSVData(csvData)

        expect(mockApiClient.post).toHaveBeenCalledWith('/api/ingredients/validate', {
          ingredients: csvData,
          validateOnly: true,
        }, {
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockResponse)
        expect(logger.debug).toHaveBeenCalledWith(
          'IngredientService.validateCSVData:',
          expect.objectContaining({
            url: '/api/ingredients/validate',
            ingredientCount: 1,
            validationResults: mockResponse,
          })
        )
      })
    })

    describe('exportToCSV', () => {
      it('should export ingredients to CSV', async () => {
        const options: IngredientExportOptions = {
          filters: { category: 'floral' },
          fields: ['name', 'type', 'category', 'cost'],
          format: 'csv',
        }
        const mockBlob = new Blob(['csv,data'], { type: 'text/csv' })

        mockApiClient.get.mockResolvedValue(mockBlob)

        const result = await service.exportToCSV(options)

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/ingredients/export', {
          responseType: 'blob',
          timeout: undefined,
          headers: undefined,
          params: options,
        })
        expect(result).toEqual(mockBlob)
        expect(logger.debug).toHaveBeenCalledWith(
          'IngredientService.exportToCSV:',
          expect.objectContaining({
            url: '/api/ingredients/export',
            options,
          })
        )
      })
    })

    describe('getImportTemplate', () => {
      it('should get ingredient import template', async () => {
        const mockBlob = new Blob(['template,data'], { type: 'text/csv' })

        mockApiClient.get.mockResolvedValue(mockBlob)

        const result = await service.getImportTemplate()

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/ingredients/import-template', {
          responseType: 'blob',
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockBlob)
      })
    })
  })

  describe('Stock Management', () => {
    describe('updateStock', () => {
      it('should update ingredient stock level', async () => {
        const stockUpdate: IngredientStockUpdate = {
          stock: 150,
          unit: 'ml',
          notes: 'Stock replenished',
        }
        const mockResponse: SingleResponse<Ingredient> = {
          data: {
            id: '1',
            name: 'Rose Oil',
            type: 'essential_oil',
            category: 'floral',
            supplier: 'Test Supplier',
            casNumber: '8007-01-0',
            inciName: 'Rosa Damascena Flower Oil',
            cost: 150.00,
            stock: 150,
            unit: 'ml',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        }

        mockApiClient.put.mockResolvedValue(mockResponse)

        const result = await service.updateStock('1', stockUpdate)

        expect(mockApiClient.put).toHaveBeenCalledWith('/api/ingredients/1/stock', stockUpdate, {
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockResponse)
        expect(logger.debug).toHaveBeenCalledWith(
          'IngredientService.updateStock:',
          expect.objectContaining({
            url: '/api/ingredients/1/stock',
            id: '1',
            stockUpdate,
          })
        )
      })
    })

    describe('bulkUpdateStock', () => {
      it('should bulk update ingredient stock levels', async () => {
        const updates = [
          { id: '1', stockUpdate: { stock: 150, unit: 'ml' } as IngredientStockUpdate },
          { id: '2', stockUpdate: { stock: 200, unit: 'ml' } as IngredientStockUpdate },
        ]
        const mockResponse: BaseResponse[] = [
          { success: true },
          { success: true },
        ]

        mockApiClient.post.mockResolvedValue(mockResponse)

        const result = await service.bulkUpdateStock(updates)

        expect(mockApiClient.post).toHaveBeenCalledWith('/api/ingredients/batch', {
          operation: 'updateStock',
          ingredientIds: ['1', '2'],
          data: { updates },
        }, {
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockResponse)
      })
    })
  })

  describe('Supplier Management', () => {
    describe('getSuppliers', () => {
      it('should get ingredient suppliers', async () => {
        const mockResponse: PaginatedResponse<IngredientSupplier> = {
          data: [
            {
              id: '1',
              name: 'Test Supplier',
              contactEmail: 'test@supplier.com',
              contactPhone: '+1234567890',
              address: '123 Test St',
              isActive: true,
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z',
            },
          ],
          pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.getSuppliers()

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/ingredients/suppliers', {
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockResponse)
        expect(logger.debug).toHaveBeenCalledWith(
          'IngredientService.getSuppliers:',
          expect.objectContaining({
            url: '/api/ingredients/suppliers',
            supplierCount: 1,
          })
        )
      })
    })
  })

  describe('Usage Tracking', () => {
    describe('getUsage', () => {
      it('should get ingredient usage in formulas', async () => {
        const mockResponse: PaginatedResponse<IngredientUsage> = {
          data: [
            {
              id: '1',
              ingredientId: '1',
              formulaId: 'formula-1',
              formulaName: 'Rose Perfume',
              quantity: 5.0,
              unit: 'ml',
              percentage: 2.5,
              createdAt: '2023-01-01T00:00:00Z',
            },
          ],
          pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.getUsage('1')

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/ingredients/1/usage', {
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockResponse)
        expect(logger.debug).toHaveBeenCalledWith(
          'IngredientService.getUsage:',
          expect.objectContaining({
            url: '/api/ingredients/1/usage',
            id: '1',
            usageCount: 1,
          })
        )
      })
    })
  })

  describe('Statistics', () => {
    describe('getStatistics', () => {
      it('should get ingredient statistics', async () => {
        const mockResponse: SingleResponse<IngredientStatistics> = {
          data: {
            totalIngredients: 150,
            activeIngredients: 140,
            inactiveIngredients: 10,
            lowStockCount: 5,
            outOfStockCount: 2,
            totalValue: 25000.00,
            averageCost: 166.67,
            categoryBreakdown: {
              essential_oil: 50,
              alcohol: 30,
              fixative: 20,
              other: 50,
            },
          },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.getStatistics()

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/ingredients/statistics', {
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockResponse)
        expect(logger.debug).toHaveBeenCalledWith(
          'IngredientService.getStatistics:',
          expect.objectContaining({
            url: '/api/ingredients/statistics',
            statistics: mockResponse.data,
          })
        )
      })
    })
  })

  describe('Batch Operations', () => {
    describe('batchOperation', () => {
      it('should perform batch operations on ingredients', async () => {
        const operation: IngredientBatchOperation = {
          operation: 'activate',
          ingredientIds: ['1', '2', '3'],
        }
        const mockResponse: BaseResponse[] = [
          { success: true },
          { success: true },
          { success: true },
        ]

        mockApiClient.post.mockResolvedValue(mockResponse)

        const result = await service.batchOperation(operation)

        expect(mockApiClient.post).toHaveBeenCalledWith('/api/ingredients/batch', operation, {
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockResponse)
        expect(logger.debug).toHaveBeenCalledWith(
          'IngredientService.batchOperation:',
          expect.objectContaining({
            url: '/api/ingredients/batch',
            operation,
            resultCount: 3,
          })
        )
      })
    })

    describe('bulkToggleActive', () => {
      it('should bulk activate/deactivate ingredients', async () => {
        const ingredientIds = ['1', '2', '3']
        const mockResponse: BaseResponse[] = [
          { success: true },
          { success: true },
          { success: true },
        ]

        mockApiClient.post.mockResolvedValue(mockResponse)

        const result = await service.bulkToggleActive(ingredientIds, true)

        expect(mockApiClient.post).toHaveBeenCalledWith('/api/ingredients/batch', {
          operation: 'activate',
          ingredientIds,
        }, {
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockResponse)
      })
    })

    describe('bulkDelete', () => {
      it('should bulk delete ingredients', async () => {
        const ingredientIds = ['1', '2', '3']
        const mockResponse: BaseResponse[] = [
          { success: true },
          { success: true },
          { success: true },
        ]

        mockApiClient.post.mockResolvedValue(mockResponse)

        const result = await service.bulkDelete(ingredientIds)

        expect(mockApiClient.post).toHaveBeenCalledWith('/api/ingredients/batch', {
          operation: 'delete',
          ingredientIds,
        }, {
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockResponse)
      })
    })
  })

  describe('Lookup Operations', () => {
    describe('getBySupplierCode', () => {
      it('should get ingredient by supplier code', async () => {
        const mockResponse: SingleResponse<Ingredient> = {
          data: {
            id: '1',
            name: 'Rose Oil',
            type: 'essential_oil',
            category: 'floral',
            supplier: 'Test Supplier',
            supplierCode: 'ROSE-001',
            casNumber: '8007-01-0',
            inciName: 'Rosa Damascena Flower Oil',
            cost: 150.00,
            stock: 100,
            unit: 'ml',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.getBySupplierCode('ROSE-001')

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/ingredients/supplier/ROSE-001', {
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockResponse)
        expect(logger.debug).toHaveBeenCalledWith(
          'IngredientService.getBySupplierCode:',
          expect.objectContaining({
            url: '/api/ingredients/supplier/ROSE-001',
            supplierCode: 'ROSE-001',
          })
        )
      })
    })

    describe('getByCASNumber', () => {
      it('should get ingredient by CAS number', async () => {
        const mockResponse: SingleResponse<Ingredient> = {
          data: {
            id: '1',
            name: 'Rose Oil',
            type: 'essential_oil',
            category: 'floral',
            supplier: 'Test Supplier',
            casNumber: '8007-01-0',
            inciName: 'Rosa Damascena Flower Oil',
            cost: 150.00,
            stock: 100,
            unit: 'ml',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.getByCASNumber('8007-01-0')

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/ingredients/cas/8007-01-0', {
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockResponse)
      })
    })

    describe('getByINCIName', () => {
      it('should get ingredient by INCI name', async () => {
        const mockResponse: SingleResponse<Ingredient> = {
          data: {
            id: '1',
            name: 'Rose Oil',
            type: 'essential_oil',
            category: 'floral',
            supplier: 'Test Supplier',
            casNumber: '8007-01-0',
            inciName: 'Rosa Damascena Flower Oil',
            cost: 150.00,
            stock: 100,
            unit: 'ml',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.getByINCIName('Rosa Damascena Flower Oil')

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/ingredients/inci/Rosa Damascena Flower Oil', {
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockResponse)
      })
    })
  })

  describe('Advanced Search', () => {
    describe('advancedSearch', () => {
      it('should search ingredients by multiple criteria', async () => {
        const criteria = {
          name: 'rose',
          type: 'essential_oil',
          category: 'floral',
          supplier: 'Test Supplier',
          casNumber: '8007-01-0',
          inciName: 'Rosa Damascena Flower Oil',
          tags: ['floral', 'natural'],
          stockStatus: 'in_stock',
          costRange: { min: 100, max: 200 },
          isActive: true,
        }
        const mockResponse: PaginatedResponse<Ingredient> = {
          data: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.advancedSearch(criteria)

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/ingredients/search', {
          timeout: undefined,
          headers: undefined,
          params: expect.objectContaining({
            filters: criteria,
            pagination: { page: 1, limit: 20 },
          }),
        })
        expect(result).toEqual(mockResponse)
      })
    })

    describe('getRecommendations', () => {
      it('should get ingredient recommendations based on usage patterns', async () => {
        const mockResponse: PaginatedResponse<Ingredient> = {
          data: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.getRecommendations('1')

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/ingredients/1/recommendations', {
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockResponse)
        expect(logger.debug).toHaveBeenCalledWith(
          'IngredientService.getRecommendations:',
          expect.objectContaining({
            url: '/api/ingredients/1/recommendations',
            ingredientId: '1',
            recommendationCount: 0,
          })
        )
      })
    })
  })

  describe('Validation', () => {
    describe('validateIngredientData', () => {
      it('should validate ingredient data successfully', () => {
        const { ingredientSchemas } = require('@/types/ingredient')
        const mockSafeParse = jest.fn().mockReturnValue({
          success: true,
          data: { name: 'Test Ingredient' },
        })
        ingredientSchemas.createIngredient.safeParse = mockSafeParse

        const data: CreateIngredientRequest = {
          name: 'Test Ingredient',
          type: 'essential_oil',
          category: 'floral',
          supplier: 'Test Supplier',
          cost: 100.00,
          stock: 50,
          unit: 'ml',
        }

        const result = service.validateIngredientData(data)

        expect(mockSafeParse).toHaveBeenCalledWith(data)
        expect(result).toEqual({
          isValid: true,
          errors: [],
          warnings: [],
        })
      })

      it('should return validation errors for invalid data', () => {
        const { ingredientSchemas } = require('@/types/ingredient')
        const mockSafeParse = jest.fn().mockReturnValue({
          success: false,
          error: {
            errors: [
              { path: ['name'], message: 'Name is required', code: 'required' },
              { path: ['cost'], message: 'Cost must be positive', code: 'invalid_type' },
            ],
          },
        })
        ingredientSchemas.createIngredient.safeParse = mockSafeParse

        const data: CreateIngredientRequest = {
          name: '',
          type: 'essential_oil',
          category: 'floral',
          supplier: 'Test Supplier',
          cost: -10,
          stock: 50,
          unit: 'ml',
        }

        const result = service.validateIngredientData(data)

        expect(result).toEqual({
          isValid: false,
          errors: [
            { field: 'name', message: 'Name is required', code: 'required' },
            { field: 'cost', message: 'Cost must be positive', code: 'invalid_type' },
          ],
          warnings: [],
        })
      })

      it('should handle validation errors gracefully', () => {
        const { ingredientSchemas } = require('@/types/ingredient')
        const mockSafeParse = jest.fn().mockImplementation(() => {
          throw new Error('Validation error')
        })
        ingredientSchemas.createIngredient.safeParse = mockSafeParse

        const data: CreateIngredientRequest = {
          name: 'Test Ingredient',
          type: 'essential_oil',
          category: 'floral',
          supplier: 'Test Supplier',
          cost: 100.00,
          stock: 50,
          unit: 'ml',
        }

        const result = service.validateIngredientData(data)

        expect(result).toEqual({
          isValid: false,
          errors: [{
            field: 'unknown',
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
          }],
          warnings: [],
        })
        expect(logger.error).toHaveBeenCalledWith(
          'IngredientService.validateIngredientData failed:',
          expect.any(Error)
        )
      })
    })
  })
})
