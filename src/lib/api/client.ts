import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { logger } from './logger'
import { setupInterceptors } from './interceptors'
import { pegaConfig, defaultApiConfig } from './config'

/**
 * HTTP client configuration for Pega DX integration
 */
export interface HttpClientConfig {
  baseURL: string
  timeout: number
  retries: number
  retryDelay: number
  enableLogging: boolean
  enableRetry: boolean
}


/**
 * API Client class for Pega DX integration
 * Provides enterprise-grade HTTP client with authentication, error handling, and retry logic
 */
export class ApiClient {
  private client: AxiosInstance
  private config: HttpClientConfig

  constructor(config: Partial<HttpClientConfig> = {}) {
    this.config = { ...defaultApiConfig, ...config }
    this.client = this.createClient()
    this.setupClient()
  }

  /**
   * Create axios instance with base configuration
   */
  private createClient(): AxiosInstance {
    const client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Fragrance-Management-System/1.0.0',
      },
    })

    return client
  }

  /**
   * Setup client with interceptors and middleware
   */
  private setupClient(): void {
    // Setup request/response interceptors
    setupInterceptors(this.client, {
      enableLogging: this.config.enableLogging,
      enableRetry: this.config.enableRetry,
      retries: this.config.retries,
      retryDelay: this.config.retryDelay,
    }, pegaConfig.enableIntegration)

    // Add request interceptor for authentication
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add authentication headers
        if (pegaConfig.apiKey) {
          config.headers['X-API-Key'] = pegaConfig.apiKey
        }
        if (pegaConfig.clientId) {
          config.headers['X-Client-ID'] = pegaConfig.clientId
        }

        // Add request ID for tracing
        config.headers['X-Request-ID'] = this.generateRequestId()

        return config
      },
      (error) => {
        logger.error('Request interceptor error:', error)
        return Promise.reject(error)
      }
    )

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      async (error) => {
        // Log error and reject - retry logic is handled by interceptors
        logger.error('API Error:', {
          status: error.response?.status,
          url: error.config?.url,
          method: error.config?.method,
          message: error.message,
          data: error.response?.data,
        })

        return Promise.reject(error)
      }
    )
  }

  /**
   * Generate unique request ID for tracing
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }


  /**
   * Make GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  /**
   * Make POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  /**
   * Make PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  /**
   * Make PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  /**
   * Make DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }

  /**
   * Make HEAD request
   */
  async head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.head<T>(url, config)
    return response.data
  }

  /**
   * Make OPTIONS request
   */
  async options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.options<T>(url, config)
    return response.data
  }

  /**
   * Make request with custom configuration
   */
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<T>(config)
    return response.data
  }

  /**
   * Get the underlying axios instance for advanced usage
   */
  getAxiosInstance(): AxiosInstance {
    return this.client
  }

  /**
   * Update client configuration
   */
  updateConfig(config: Partial<HttpClientConfig>): void {
    this.config = { ...this.config, ...config }
    
    // Update axios instance configuration
    this.client.defaults.baseURL = this.config.baseURL
    this.client.defaults.timeout = this.config.timeout
  }

  /**
   * Get current configuration
   */
  getConfig(): HttpClientConfig {
    return { ...this.config }
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization']
  }

  /**
   * Set custom headers
   */
  setHeaders(headers: Record<string, string>): void {
    Object.assign(this.client.defaults.headers.common, headers)
  }

  /**
   * Clear custom headers
   */
  clearHeaders(headers?: string[]): void {
    if (headers) {
      headers.forEach(header => {
        delete this.client.defaults.headers.common[header]
      })
    } else {
      // Clear all custom headers except standard ones
      const standardHeaders = ['Content-Type', 'Accept', 'User-Agent', 'Authorization']
      Object.keys(this.client.defaults.headers.common).forEach(header => {
        if (!standardHeaders.includes(header)) {
          delete this.client.defaults.headers.common[header]
        }
      })
    }
  }
}

/**
 * Default API client instance
 */
export const apiClient = new ApiClient()

/**
 * Create a new API client with custom configuration
 */
export function createApiClient(config: Partial<HttpClientConfig>): ApiClient {
  return new ApiClient(config)
}

