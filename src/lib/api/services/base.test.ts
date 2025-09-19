import { BaseService } from './base'
import { apiClient } from '../client'
import { logger } from '../logger'
import { 
  BaseResponse, 
  PaginatedResponse, 
  SingleResponse, 
  SearchParams, 
  ApiRequestOptions 
} from '../types'

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

// Mock URL builder and utils
jest.mock('../utils', () => ({
  createUrlBuilder: jest.fn(() => ({
    reset: jest.fn().mockReturnThis(),
    addPath: jest.fn().mockReturnThis(),
    addPaths: jest.fn().mockReturnThis(),
    addQueries: jest.fn().mockReturnThis(),
    build: jest.fn(() => '/test-endpoint'),
  })),
  serializeSearchParams: jest.fn(() => ({})),
}))

// Test implementation of BaseService
class TestService extends BaseService<TestItem, CreateTestItem, UpdateTestItem> {
  constructor() {
    super('/test-endpoint')
  }
}

interface TestItem {
  id: string
  name: string
  value: number
}

interface CreateTestItem {
  name: string
  value: number
}

interface UpdateTestItem {
  name?: string
  value?: number
}

describe('BaseService', () => {
  let service: TestService
  let mockApiClient: jest.Mocked<typeof apiClient>

  beforeEach(() => {
    service = new TestService()
    mockApiClient = apiClient as jest.Mocked<typeof apiClient>
    jest.clearAllMocks()
  })

  describe('CRUD Operations', () => {
    describe('list', () => {
      it('should fetch list of items without parameters', async () => {
        const mockResponse: PaginatedResponse<TestItem> = {
          data: [
            { id: '1', name: 'Item 1', value: 10 },
            { id: '2', name: 'Item 2', value: 20 },
          ],
          pagination: {
            page: 1,
            limit: 20,
            total: 2,
            totalPages: 1,
          },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.list()

        expect(mockApiClient.get).toHaveBeenCalledWith('/test-endpoint', {})
        expect(result).toEqual(mockResponse)
        expect(logger.debug).toHaveBeenCalledWith(
          'TestService.list:',
          expect.objectContaining({
            url: '/test-endpoint',
            params: undefined,
            resultCount: 2,
          })
        )
      })

      it('should fetch list with search parameters', async () => {
        const params: SearchParams = {
          query: 'test',
          filters: { category: 'test' },
          pagination: { page: 1, limit: 10 },
        }
        const mockResponse: PaginatedResponse<TestItem> = {
          data: [{ id: '1', name: 'Test Item', value: 15 }],
          pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.list(params)

        expect(mockApiClient.get).toHaveBeenCalledWith('/test-endpoint', {
          timeout: undefined,
          headers: undefined,
          params: undefined,
        })
        expect(result).toEqual(mockResponse)
      })

      it('should handle list request with options', async () => {
        const options: ApiRequestOptions = {
          timeout: 5000,
          headers: { 'Custom-Header': 'value' },
          params: { custom: 'param' },
        }
        const mockResponse: PaginatedResponse<TestItem> = {
          data: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        await service.list(undefined, options)

        expect(mockApiClient.get).toHaveBeenCalledWith('/test-endpoint', {
          timeout: 5000,
          headers: { 'Custom-Header': 'value' },
          params: { custom: 'param' },
        })
      })

      it('should handle list request errors', async () => {
        const error = new Error('Network error')
        mockApiClient.get.mockRejectedValue(error)

        await expect(service.list()).rejects.toThrow('Network error')
        expect(logger.error).toHaveBeenCalledWith(
          'TestService.list failed:',
          error
        )
      })
    })

    describe('get', () => {
      it('should fetch single item by ID', async () => {
        const mockResponse: SingleResponse<TestItem> = {
          data: { id: '1', name: 'Test Item', value: 15 },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.get('1')

        expect(mockApiClient.get).toHaveBeenCalledWith('/test-endpoint/1', {
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockResponse)
        expect(logger.debug).toHaveBeenCalledWith(
          'TestService.get:',
          expect.objectContaining({
            url: '/test-endpoint/1',
            id: '1',
          })
        )
      })

      it('should handle get request with options', async () => {
        const options: ApiRequestOptions = {
          timeout: 3000,
          headers: { 'Authorization': 'Bearer token' },
        }
        const mockResponse: SingleResponse<TestItem> = {
          data: { id: '1', name: 'Test Item', value: 15 },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        await service.get('1', options)

        expect(mockApiClient.get).toHaveBeenCalledWith('/test-endpoint/1', {
          timeout: 3000,
          headers: { 'Authorization': 'Bearer token' },
        })
      })

      it('should handle get request errors', async () => {
        const error = new Error('Item not found')
        mockApiClient.get.mockRejectedValue(error)

        await expect(service.get('1')).rejects.toThrow('Item not found')
        expect(logger.error).toHaveBeenCalledWith(
          'TestService.get failed:',
          error
        )
      })
    })

    describe('create', () => {
      it('should create new item', async () => {
        const createData: CreateTestItem = { name: 'New Item', value: 25 }
        const mockResponse: SingleResponse<TestItem> = {
          data: { id: '3', name: 'New Item', value: 25 },
        }

        mockApiClient.post.mockResolvedValue(mockResponse)

        const result = await service.create(createData)

        expect(mockApiClient.post).toHaveBeenCalledWith('/test-endpoint', createData, {
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockResponse)
        expect(logger.debug).toHaveBeenCalledWith(
          'TestService.create:',
          expect.objectContaining({
            url: '/test-endpoint',
            data: createData,
          })
        )
      })

      it('should sanitize sensitive data in create logs', async () => {
        const createData = { name: 'New Item', password: 'secret123' }
        const mockResponse: SingleResponse<TestItem> = {
          data: { id: '3', name: 'New Item', value: 0 },
        }

        mockApiClient.post.mockResolvedValue(mockResponse)

        await service.create(createData as any)

        expect(logger.debug).toHaveBeenCalledWith(
          'TestService.create:',
          expect.objectContaining({
            data: { name: 'New Item', password: '[REDACTED]' },
          })
        )
      })

      it('should handle create request errors', async () => {
        const createData: CreateTestItem = { name: 'New Item', value: 25 }
        const error = new Error('Validation failed')
        mockApiClient.post.mockRejectedValue(error)

        await expect(service.create(createData)).rejects.toThrow('Validation failed')
        expect(logger.error).toHaveBeenCalledWith(
          'TestService.create failed:',
          error
        )
      })
    })

    describe('update', () => {
      it('should update existing item', async () => {
        const updateData: UpdateTestItem = { name: 'Updated Item' }
        const mockResponse: SingleResponse<TestItem> = {
          data: { id: '1', name: 'Updated Item', value: 10 },
        }

        mockApiClient.put.mockResolvedValue(mockResponse)

        const result = await service.update('1', updateData)

        expect(mockApiClient.put).toHaveBeenCalledWith('/test-endpoint/1', updateData, {
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockResponse)
        expect(logger.debug).toHaveBeenCalledWith(
          'TestService.update:',
          expect.objectContaining({
            url: '/test-endpoint/1',
            id: '1',
            data: updateData,
          })
        )
      })

      it('should handle update request errors', async () => {
        const updateData: UpdateTestItem = { name: 'Updated Item' }
        const error = new Error('Update failed')
        mockApiClient.put.mockRejectedValue(error)

        await expect(service.update('1', updateData)).rejects.toThrow('Update failed')
        expect(logger.error).toHaveBeenCalledWith(
          'TestService.update failed:',
          error
        )
      })
    })

    describe('delete', () => {
      it('should delete item by ID', async () => {
        const mockResponse: BaseResponse = { success: true }

        mockApiClient.delete.mockResolvedValue(mockResponse)

        const result = await service.delete('1')

        expect(mockApiClient.delete).toHaveBeenCalledWith('/test-endpoint/1', {
          timeout: undefined,
          headers: undefined,
        })
        expect(result).toEqual(mockResponse)
        expect(logger.debug).toHaveBeenCalledWith(
          'TestService.delete:',
          expect.objectContaining({
            url: '/test-endpoint/1',
            id: '1',
          })
        )
      })

      it('should handle delete request errors', async () => {
        const error = new Error('Delete failed')
        mockApiClient.delete.mockRejectedValue(error)

        await expect(service.delete('1')).rejects.toThrow('Delete failed')
        expect(logger.error).toHaveBeenCalledWith(
          'TestService.delete failed:',
          error
        )
      })
    })
  })

  describe('Search Operations', () => {
    describe('search', () => {
      it('should search items with query and filters', async () => {
        const mockResponse: PaginatedResponse<TestItem> = {
          data: [{ id: '1', name: 'Test Item', value: 15 }],
          pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.search('test query', { category: 'test' })

        expect(mockApiClient.get).toHaveBeenCalledWith('/test-endpoint', {
          timeout: undefined,
          headers: undefined,
          params: undefined,
        })
        expect(result).toEqual(mockResponse)
        expect(logger.debug).toHaveBeenCalledWith(
          'TestService.search:',
          expect.objectContaining({
            url: '/test-endpoint',
            params: expect.objectContaining({
              query: 'test query',
              filters: { category: 'test' },
            }),
            resultCount: 1,
          })
        )
      })

      it('should handle search request errors', async () => {
        const error = new Error('Search failed')
        mockApiClient.get.mockRejectedValue(error)

        await expect(service.search('test')).rejects.toThrow('Search failed')
        expect(logger.error).toHaveBeenCalledWith(
          'TestService.search failed:',
          error
        )
      })
    })
  })

  describe('Batch Operations', () => {
    describe('getByIds', () => {
      it('should fetch multiple items by IDs', async () => {
        const mockResponse1: SingleResponse<TestItem> = {
          data: { id: '1', name: 'Item 1', value: 10 },
        }
        const mockResponse2: SingleResponse<TestItem> = {
          data: { id: '2', name: 'Item 2', value: 20 },
        }

        mockApiClient.get
          .mockResolvedValueOnce(mockResponse1)
          .mockResolvedValueOnce(mockResponse2)

        const result = await service.getByIds(['1', '2'])

        expect(mockApiClient.get).toHaveBeenCalledTimes(2)
        expect(result).toEqual([
          { id: '1', name: 'Item 1', value: 10 },
          { id: '2', name: 'Item 2', value: 20 },
        ])
      })

      it('should handle partial failures in getByIds', async () => {
        const mockResponse: SingleResponse<TestItem> = {
          data: { id: '1', name: 'Item 1', value: 10 },
        }
        const error = new Error('Item 2 not found')

        mockApiClient.get
          .mockResolvedValueOnce(mockResponse)
          .mockRejectedValueOnce(error)

        const result = await service.getByIds(['1', '2'])

        expect(result).toEqual([{ id: '1', name: 'Item 1', value: 10 }])
      })
    })

    describe('exists', () => {
      it('should return true if item exists', async () => {
        const mockResponse: SingleResponse<TestItem> = {
          data: { id: '1', name: 'Item 1', value: 10 },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.exists('1')

        expect(result).toBe(true)
      })

      it('should return false if item does not exist (404)', async () => {
        const error = { status: 404, message: 'Not found' }
        mockApiClient.get.mockRejectedValue(error)

        const result = await service.exists('1')

        expect(result).toBe(false)
      })

      it('should throw error for non-404 errors', async () => {
        const error = { status: 500, message: 'Server error' }
        mockApiClient.get.mockRejectedValue(error)

        await expect(service.exists('1')).rejects.toEqual(error)
      })
    })

    describe('count', () => {
      it('should return count of items', async () => {
        const mockResponse: PaginatedResponse<TestItem> = {
          data: [],
          pagination: { page: 1, limit: 1, total: 42, totalPages: 42 },
        }

        mockApiClient.get.mockResolvedValue(mockResponse)

        const result = await service.count()

        expect(result).toBe(42)
        expect(mockApiClient.get).toHaveBeenCalledWith('/test-endpoint', {
          timeout: undefined,
          headers: undefined,
          params: undefined,
        })
      })

      it('should handle count request errors', async () => {
        const error = new Error('Count failed')
        mockApiClient.get.mockRejectedValue(error)

        await expect(service.count()).rejects.toThrow('Count failed')
        expect(logger.error).toHaveBeenCalledWith(
          'TestService.count failed:',
          error
        )
      })
    })

    describe('batchCreate', () => {
      it('should create multiple items', async () => {
        const items: CreateTestItem[] = [
          { name: 'Item 1', value: 10 },
          { name: 'Item 2', value: 20 },
        ]
        const mockResponse1: SingleResponse<TestItem> = {
          data: { id: '1', name: 'Item 1', value: 10 },
        }
        const mockResponse2: SingleResponse<TestItem> = {
          data: { id: '2', name: 'Item 2', value: 20 },
        }

        mockApiClient.post
          .mockResolvedValueOnce(mockResponse1)
          .mockResolvedValueOnce(mockResponse2)

        const result = await service.batchCreate(items)

        expect(mockApiClient.post).toHaveBeenCalledTimes(2)
        expect(result).toEqual([mockResponse1, mockResponse2])
      })

      it('should handle partial failures in batchCreate', async () => {
        const items: CreateTestItem[] = [
          { name: 'Item 1', value: 10 },
          { name: 'Item 2', value: 20 },
        ]
        const mockResponse: SingleResponse<TestItem> = {
          data: { id: '1', name: 'Item 1', value: 10 },
        }
        const error = new Error('Item 2 creation failed')

        mockApiClient.post
          .mockResolvedValueOnce(mockResponse)
          .mockRejectedValueOnce(error)

        const result = await service.batchCreate(items)

        expect(result).toEqual([mockResponse])
      })
    })

    describe('batchUpdate', () => {
      it('should update multiple items', async () => {
        const updates = [
          { id: '1', data: { name: 'Updated Item 1' } as UpdateTestItem },
          { id: '2', data: { name: 'Updated Item 2' } as UpdateTestItem },
        ]
        const mockResponse1: SingleResponse<TestItem> = {
          data: { id: '1', name: 'Updated Item 1', value: 10 },
        }
        const mockResponse2: SingleResponse<TestItem> = {
          data: { id: '2', name: 'Updated Item 2', value: 20 },
        }

        mockApiClient.put
          .mockResolvedValueOnce(mockResponse1)
          .mockResolvedValueOnce(mockResponse2)

        const result = await service.batchUpdate(updates)

        expect(mockApiClient.put).toHaveBeenCalledTimes(2)
        expect(result).toEqual([mockResponse1, mockResponse2])
      })
    })

    describe('batchDelete', () => {
      it('should delete multiple items', async () => {
        const ids = ['1', '2']
        const mockResponse1: BaseResponse = { success: true }
        const mockResponse2: BaseResponse = { success: true }

        mockApiClient.delete
          .mockResolvedValueOnce(mockResponse1)
          .mockResolvedValueOnce(mockResponse2)

        const result = await service.batchDelete(ids)

        expect(mockApiClient.delete).toHaveBeenCalledTimes(2)
        expect(result).toEqual([mockResponse1, mockResponse2])
      })
    })
  })

  describe('Utility Methods', () => {
    describe('sanitizeData', () => {
      it('should redact sensitive fields', () => {
        const data = {
          name: 'Test',
          password: 'secret123',
          token: 'abc123',
          normalField: 'value',
        }

        const sanitized = (service as any).sanitizeData(data)

        expect(sanitized).toEqual({
          name: 'Test',
          password: '[REDACTED]',
          token: '[REDACTED]',
          normalField: 'value',
        })
      })

      it('should handle non-object data', () => {
        expect((service as any).sanitizeData('string')).toBe('string')
        expect((service as any).sanitizeData(null)).toBe(null)
        expect((service as any).sanitizeData(undefined)).toBe(undefined)
      })
    })

    describe('validateResponse', () => {
      it('should return valid response', () => {
        const response = { data: 'test' }
        const result = (service as any).validateResponse(response)
        expect(result).toBe(response)
      })

      it('should throw error for empty response', () => {
        expect(() => (service as any).validateResponse(null)).toThrow('Empty response received')
        expect(() => (service as any).validateResponse(undefined)).toThrow('Empty response received')
      })
    })

    describe('handlePagination', () => {
      it('should handle valid pagination parameters', () => {
        const result = (service as any).handlePagination(2, 10)
        expect(result).toEqual({ page: 2, limit: 10 })
      })

      it('should handle invalid pagination parameters', () => {
        const result = (service as any).handlePagination(-1, 0)
        expect(result).toEqual({ page: 1, limit: 1 })
      })

      it('should respect max limit', () => {
        const result = (service as any).handlePagination(1, 200, 100)
        expect(result).toEqual({ page: 1, limit: 100 })
      })
    })

    describe('handleSorting', () => {
      it('should handle valid sorting parameters', () => {
        const result = (service as any).handleSorting('name', 'desc')
        expect(result).toEqual({ sortBy: 'name', sortOrder: 'desc' })
      })

      it('should default to asc order', () => {
        const result = (service as any).handleSorting('name')
        expect(result).toEqual({ sortBy: 'name', sortOrder: 'asc' })
      })

      it('should return undefined for no sortBy', () => {
        const result = (service as any).handleSorting()
        expect(result).toBeUndefined()
      })
    })

    describe('handleFiltering', () => {
      it('should clean empty filter values', () => {
        const filters = {
          name: 'test',
          category: '',
          status: null,
          active: undefined,
        }

        const result = (service as any).handleFiltering(filters)
        expect(result).toEqual({ name: 'test' })
      })

      it('should return empty object for no filters', () => {
        const result = (service as any).handleFiltering()
        expect(result).toEqual({})
      })
    })
  })
})
