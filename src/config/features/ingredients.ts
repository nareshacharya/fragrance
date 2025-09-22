import { z } from 'zod';

/**
 * Ingredients feature configuration schema
 */
export const ingredientsConfigSchema = z.object({
  // Ingredient Management
  management: z.object({
    enableCRUD: z.boolean().default(true),
    enableBulkOperations: z.boolean().default(true),
    enableSoftDelete: z.boolean().default(true),
    enableVersioning: z.boolean().default(false),
    maxIngredientsPerUser: z.number().default(1000),
    enableIngredientCategories: z.boolean().default(true),
    enableIngredientTags: z.boolean().default(true),
  }),

  // Import/Export Configuration
  importExport: z.object({
    enableCSVImport: z.boolean().default(true),
    enableCSVExport: z.boolean().default(true),
    enableJSONImport: z.boolean().default(true),
    enableJSONExport: z.boolean().default(true),
    maxFileSize: z.number().default(10 * 1024 * 1024), // 10MB
    allowedFileTypes: z.array(z.string()).default(['.csv', '.json', '.xlsx']),
    csvDelimiter: z.string().default(','),
    csvEncoding: z.string().default('utf-8'),
    batchSize: z.number().default(100),
    enableValidation: z.boolean().default(true),
    enableProgressTracking: z.boolean().default(true),
  }),

  // Validation Rules
  validation: z.object({
    requiredFields: z.array(z.string()).default(['name', 'category']),
    optionalFields: z.array(z.string()).default(['description', 'notes', 'tags']),
    fieldLengths: z.record(z.object({
      min: z.number().default(1),
      max: z.number().default(255),
    })).default({
      name: { min: 1, max: 100 },
      description: { min: 0, max: 1000 },
      notes: { min: 0, max: 2000 },
      category: { min: 1, max: 50 },
    }),
    enableDuplicateDetection: z.boolean().default(true),
    duplicateThreshold: z.number().default(0.8),
    enableDataCleaning: z.boolean().default(true),
  }),

  // Search and Filtering
  search: z.object({
    enableFullTextSearch: z.boolean().default(true),
    enableFuzzySearch: z.boolean().default(true),
    enableAutoComplete: z.boolean().default(true),
    searchFields: z.array(z.string()).default(['name', 'description', 'category', 'tags']),
    maxSearchResults: z.number().default(100),
    enableSearchHistory: z.boolean().default(true),
    searchHistoryLimit: z.number().default(20),
    enableSearchSuggestions: z.boolean().default(true),
  }),

  // Pagination and Sorting
  pagination: z.object({
    defaultPageSize: z.number().default(20),
    pageSizeOptions: z.array(z.number()).default([10, 20, 50, 100]),
    enableInfiniteScroll: z.boolean().default(false),
    enableVirtualScrolling: z.boolean().default(false),
    maxPageSize: z.number().default(1000),
  }),

  sorting: z.object({
    defaultSortField: z.string().default('name'),
    defaultSortOrder: z.enum(['asc', 'desc']).default('asc'),
    sortableFields: z.array(z.string()).default(['name', 'category', 'createdAt', 'updatedAt']),
    enableMultiColumnSorting: z.boolean().default(false),
  }),

  // Categories and Tags
  categories: z.object({
    enablePredefinedCategories: z.boolean().default(true),
    predefinedCategories: z.array(z.string()).default([
      'Essential Oils',
      'Base Notes',
      'Middle Notes',
      'Top Notes',
      'Accords',
      'Synthetics',
      'Natural Extracts',
      'Fixatives',
    ]),
    enableCustomCategories: z.boolean().default(true),
    maxCustomCategories: z.number().default(50),
    enableCategoryHierarchy: z.boolean().default(false),
  }),

  tags: z.object({
    enableTags: z.boolean().default(true),
    maxTagsPerIngredient: z.number().default(10),
    maxTagLength: z.number().default(30),
    enableTagSuggestions: z.boolean().default(true),
    popularTagsLimit: z.number().default(20),
  }),

  // Stock Management
  stockManagement: z.object({
    enableStockTracking: z.boolean().default(false),
    enableLowStockAlerts: z.boolean().default(false),
    lowStockThreshold: z.number().default(10),
    enableStockHistory: z.boolean().default(false),
    enableSupplierTracking: z.boolean().default(false),
    enableCostTracking: z.boolean().default(false),
  }),

  // Supplier Integration
  suppliers: z.object({
    enableSupplierManagement: z.boolean().default(false),
    enableSupplierAPI: z.boolean().default(false),
    supplierAPITimeout: z.number().default(30000),
    enableSupplierSync: z.boolean().default(false),
    syncInterval: z.number().default(24 * 60 * 60 * 1000), // 24 hours
  }),

  // Analytics and Reporting
  analytics: z.object({
    enableUsageAnalytics: z.boolean().default(true),
    enablePopularIngredients: z.boolean().default(true),
    enableCategoryAnalytics: z.boolean().default(true),
    enableSearchAnalytics: z.boolean().default(true),
    analyticsRetentionDays: z.number().default(365),
  }),

  // Performance Configuration
  performance: z.object({
    enableCaching: z.boolean().default(true),
    cacheTTL: z.number().default(300), // 5 minutes
    enableLazyLoading: z.boolean().default(true),
    enableImageOptimization: z.boolean().default(true),
    enableDataCompression: z.boolean().default(true),
  }),

  // Security and Permissions
  security: z.object({
    enableIngredientPrivacy: z.boolean().default(false),
    enableIngredientSharing: z.boolean().default(false),
    enableIngredientPermissions: z.boolean().default(false),
    enableAuditLogging: z.boolean().default(false),
  }),
});

export type IngredientsConfig = z.infer<typeof ingredientsConfigSchema>;

/**
 * Default ingredients configuration
 */
export const defaultIngredientsConfig: IngredientsConfig = {
  management: {
    enableCRUD: true,
    enableBulkOperations: true,
    enableSoftDelete: true,
    enableVersioning: false,
    maxIngredientsPerUser: 1000,
    enableIngredientCategories: true,
    enableIngredientTags: true,
  },
  importExport: {
    enableCSVImport: true,
    enableCSVExport: true,
    enableJSONImport: true,
    enableJSONExport: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFileTypes: ['.csv', '.json', '.xlsx'],
    csvDelimiter: ',',
    csvEncoding: 'utf-8',
    batchSize: 100,
    enableValidation: true,
    enableProgressTracking: true,
  },
  validation: {
    requiredFields: ['name', 'category'],
    optionalFields: ['description', 'notes', 'tags'],
    fieldLengths: {
      name: { min: 1, max: 100 },
      description: { min: 0, max: 1000 },
      notes: { min: 0, max: 2000 },
      category: { min: 1, max: 50 },
    },
    enableDuplicateDetection: true,
    duplicateThreshold: 0.8,
    enableDataCleaning: true,
  },
  search: {
    enableFullTextSearch: true,
    enableFuzzySearch: true,
    enableAutoComplete: true,
    searchFields: ['name', 'description', 'category', 'tags'],
    maxSearchResults: 100,
    enableSearchHistory: true,
    searchHistoryLimit: 20,
    enableSearchSuggestions: true,
  },
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    enableInfiniteScroll: false,
    enableVirtualScrolling: false,
    maxPageSize: 1000,
  },
  sorting: {
    defaultSortField: 'name',
    defaultSortOrder: 'asc',
    sortableFields: ['name', 'category', 'createdAt', 'updatedAt'],
    enableMultiColumnSorting: false,
  },
  categories: {
    enablePredefinedCategories: true,
    predefinedCategories: [
      'Essential Oils',
      'Base Notes',
      'Middle Notes',
      'Top Notes',
      'Accords',
      'Synthetics',
      'Natural Extracts',
      'Fixatives',
    ],
    enableCustomCategories: true,
    maxCustomCategories: 50,
    enableCategoryHierarchy: false,
  },
  tags: {
    enableTags: true,
    maxTagsPerIngredient: 10,
    maxTagLength: 30,
    enableTagSuggestions: true,
    popularTagsLimit: 20,
  },
  stockManagement: {
    enableStockTracking: false,
    enableLowStockAlerts: false,
    lowStockThreshold: 10,
    enableStockHistory: false,
    enableSupplierTracking: false,
    enableCostTracking: false,
  },
  suppliers: {
    enableSupplierManagement: false,
    enableSupplierAPI: false,
    supplierAPITimeout: 30000,
    enableSupplierSync: false,
    syncInterval: 24 * 60 * 60 * 1000,
  },
  analytics: {
    enableUsageAnalytics: true,
    enablePopularIngredients: true,
    enableCategoryAnalytics: true,
    enableSearchAnalytics: true,
    analyticsRetentionDays: 365,
  },
  performance: {
    enableCaching: true,
    cacheTTL: 300,
    enableLazyLoading: true,
    enableImageOptimization: true,
    enableDataCompression: true,
  },
  security: {
    enableIngredientPrivacy: false,
    enableIngredientSharing: false,
    enableIngredientPermissions: false,
    enableAuditLogging: false,
  },
};

