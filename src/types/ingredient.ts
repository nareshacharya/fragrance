import { z } from 'zod'
import { 
  INGREDIENT_TYPES, 
  INGREDIENT_TYPE_LABELS, 
  WEIGHT_UNITS, 
  WEIGHT_UNIT_LABELS,
  VALIDATION 
} from '../config/constants'

/**
 * Ingredient schema for comprehensive ingredient management
 */
export const ingredientSchema = z.object({
  id: z.string(),
  name: z.string().min(VALIDATION.NAME_MIN_LENGTH).max(VALIDATION.NAME_MAX_LENGTH),
  type: z.enum([
    INGREDIENT_TYPES.ESSENTIAL_OIL,
    INGREDIENT_TYPES.SYNTHETIC,
    INGREDIENT_TYPES.NATURAL_EXTRACT,
    INGREDIENT_TYPES.FIXATIVE,
    INGREDIENT_TYPES.SOLVENT,
    INGREDIENT_TYPES.ADDITIVE,
  ]),
  category: z.string().optional(),
  supplier: z.string().min(2).max(100),
  supplierCode: z.string().optional(),
  cost: z.number().min(0),
  currency: z.string().default('USD'),
  stockLevel: z.number().min(0),
  minStockLevel: z.number().min(0).default(0),
  maxStockLevel: z.number().min(0).optional(),
  unit: z.enum([
    WEIGHT_UNITS.MG,
    WEIGHT_UNITS.G,
    WEIGHT_UNITS.KG,
    WEIGHT_UNITS.ML,
    WEIGHT_UNITS.L,
  ]),
  density: z.number().min(0).optional(),
  molecularWeight: z.number().min(0).optional(),
  casNumber: z.string().optional(),
  einECSNumber: z.string().optional(),
  inciName: z.string().optional(),
  description: z.string().max(VALIDATION.DESCRIPTION_MAX_LENGTH).optional(),
  notes: z.string().max(VALIDATION.NOTES_MAX_LENGTH).optional(),
  safetyData: z.object({
    hazardClass: z.string().optional(),
    hazardStatements: z.array(z.string()).optional(),
    precautionaryStatements: z.array(z.string()).optional(),
    safetyDataSheet: z.string().url().optional(),
    allergenInfo: z.array(z.string()).optional(),
    restrictions: z.array(z.string()).optional(),
  }).optional(),
  regulatoryInfo: z.object({
    ifraCategory: z.string().optional(),
    ifraLimit: z.number().min(0).optional(),
    reachCompliant: z.boolean().default(false),
    fdaApproved: z.boolean().default(false),
    kosherCertified: z.boolean().default(false),
    halalCertified: z.boolean().default(false),
    organicCertified: z.boolean().default(false),
    certifications: z.array(z.string()).optional(),
  }).optional(),
  physicalProperties: z.object({
    appearance: z.string().optional(),
    color: z.string().optional(),
    odor: z.string().optional(),
    solubility: z.string().optional(),
    boilingPoint: z.number().optional(),
    meltingPoint: z.number().optional(),
    flashPoint: z.number().optional(),
    refractiveIndex: z.number().optional(),
    specificGravity: z.number().optional(),
  }).optional(),
  storageConditions: z.object({
    temperature: z.string().optional(),
    humidity: z.string().optional(),
    lightSensitivity: z.boolean().default(false),
    airSensitivity: z.boolean().default(false),
    shelfLife: z.number().optional(), // in months
    storageNotes: z.string().optional(),
  }).optional(),
  usage: z.object({
    typicalConcentration: z.number().min(0).max(100).optional(), // percentage
    maxConcentration: z.number().min(0).max(100).optional(), // percentage
    applications: z.array(z.string()).optional(),
    compatibility: z.array(z.string()).optional(),
    contraindications: z.array(z.string()).optional(),
  }).optional(),
  images: z.array(z.object({
    id: z.string(),
    url: z.string().url(),
    alt: z.string().optional(),
    isPrimary: z.boolean().default(false),
  })).optional(),
  documents: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    url: z.string().url(),
    uploadedAt: z.string().datetime(),
  })).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  createdBy: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

/**
 * Ingredient interface
 */
export type Ingredient = z.infer<typeof ingredientSchema>

/**
 * Create ingredient request schema
 */
export const createIngredientSchema = ingredientSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

/**
 * Create ingredient request interface
 */
export type CreateIngredientRequest = z.infer<typeof createIngredientSchema>

/**
 * Update ingredient request schema
 */
export const updateIngredientSchema = createIngredientSchema.partial()

/**
 * Update ingredient request interface
 */
export type UpdateIngredientRequest = z.infer<typeof updateIngredientSchema>

/**
 * Ingredient search parameters schema - unified with SearchParams structure
 */
export const ingredientSearchParamsSchema = z.object({
  query: z.string().optional(),
  pagination: z.object({
    page: z.number().min(1).optional(),
    limit: z.number().min(1).max(100).optional(),
  }).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  filters: z.object({
    type: z.enum([
      INGREDIENT_TYPES.ESSENTIAL_OIL,
      INGREDIENT_TYPES.SYNTHETIC,
      INGREDIENT_TYPES.NATURAL_EXTRACT,
      INGREDIENT_TYPES.FIXATIVE,
      INGREDIENT_TYPES.SOLVENT,
      INGREDIENT_TYPES.ADDITIVE,
    ]).optional(),
    category: z.string().optional(),
    supplier: z.string().optional(),
    stockStatus: z.enum(['in_stock', 'low_stock', 'out_of_stock']).optional(),
    costRange: z.object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
    }).optional(),
    isActive: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  }).optional(),
})

/**
 * Ingredient search parameters interface
 */
export type IngredientSearchParams = z.infer<typeof ingredientSearchParamsSchema>

/**
 * Ingredient import data schema
 */
export const ingredientImportDataSchema = z.object({
  name: z.string().min(VALIDATION.NAME_MIN_LENGTH).max(VALIDATION.NAME_MAX_LENGTH),
  type: z.enum([
    INGREDIENT_TYPES.ESSENTIAL_OIL,
    INGREDIENT_TYPES.SYNTHETIC,
    INGREDIENT_TYPES.NATURAL_EXTRACT,
    INGREDIENT_TYPES.FIXATIVE,
    INGREDIENT_TYPES.SOLVENT,
    INGREDIENT_TYPES.ADDITIVE,
  ]),
  category: z.string().optional(),
  supplier: z.string().min(2).max(100),
  supplierCode: z.string().optional(),
  cost: z.number().min(0),
  currency: z.string().default('USD'),
  stockLevel: z.number().min(0),
  minStockLevel: z.number().min(0).default(0),
  unit: z.enum([
    WEIGHT_UNITS.MG,
    WEIGHT_UNITS.G,
    WEIGHT_UNITS.KG,
    WEIGHT_UNITS.ML,
    WEIGHT_UNITS.L,
  ]),
  casNumber: z.string().optional(),
  inciName: z.string().optional(),
  description: z.string().max(VALIDATION.DESCRIPTION_MAX_LENGTH).optional(),
  notes: z.string().max(VALIDATION.NOTES_MAX_LENGTH).optional(),
  tags: z.string().optional(), // comma-separated tags
})

/**
 * Ingredient import data interface
 */
export type IngredientImportData = z.infer<typeof ingredientImportDataSchema>

/**
 * Ingredient export options schema
 */
export const ingredientExportOptionsSchema = z.object({
  fields: z.array(z.enum([
    'name',
    'type',
    'category',
    'supplier',
    'supplierCode',
    'cost',
    'currency',
    'stockLevel',
    'minStockLevel',
    'maxStockLevel',
    'unit',
    'casNumber',
    'inciName',
    'einECSNumber',
    'description',
    'notes',
    'tags',
    'isActive',
    'createdAt',
    'updatedAt',
  ])),
  format: z.enum(['csv', 'excel', 'json']).default('csv'),
  includeHeaders: z.boolean().default(true),
  filters: ingredientSearchParamsSchema.shape.filters.optional(),
})

/**
 * Ingredient export options interface
 */
export type IngredientExportOptions = z.infer<typeof ingredientExportOptionsSchema>

/**
 * Ingredient stock update schema
 */
export const ingredientStockUpdateSchema = z.object({
  stockLevel: z.number().min(0),
  reason: z.string().optional(),
  notes: z.string().optional(),
})

/**
 * Ingredient stock update interface
 */
export type IngredientStockUpdate = z.infer<typeof ingredientStockUpdateSchema>

/**
 * Ingredient supplier schema
 */
export const ingredientSupplierSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string().optional(),
  contactInfo: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    website: z.string().url().optional(),
  }).optional(),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

/**
 * Ingredient supplier interface
 */
export type IngredientSupplier = z.infer<typeof ingredientSupplierSchema>

/**
 * Ingredient usage in formulas schema
 */
export const ingredientUsageSchema = z.object({
  ingredientId: z.string(),
  ingredientName: z.string(),
  formulaId: z.string(),
  formulaName: z.string(),
  concentration: z.number().min(0).max(100),
  weight: z.number().min(0),
  unit: z.string(),
  usageDate: z.string().datetime(),
})

/**
 * Ingredient usage in formulas interface
 */
export type IngredientUsage = z.infer<typeof ingredientUsageSchema>

/**
 * Ingredient batch operation schema
 */
export const ingredientBatchOperationSchema = z.object({
  operation: z.enum(['update', 'delete', 'activate', 'deactivate', 'updateStock']),
  ingredientIds: z.array(z.string()),
  data: z.record(z.any()).optional(),
})

/**
 * Ingredient batch operation interface
 */
export type IngredientBatchOperation = z.infer<typeof ingredientBatchOperationSchema>

/**
 * Ingredient validation result schema
 */
export const ingredientValidationResultSchema = z.object({
  row: z.number().optional(),
  isValid: z.boolean(),
  errors: z.array(z.object({
    field: z.string(),
    message: z.string(),
    code: z.string(),
  })),
  warnings: z.array(z.object({
    field: z.string(),
    message: z.string(),
    code: z.string(),
  })),
})

/**
 * Ingredient validation result interface
 */
export type IngredientValidationResult = z.infer<typeof ingredientValidationResultSchema>

/**
 * Ingredient import result schema
 */
export const ingredientImportResultSchema = z.object({
  totalProcessed: z.number(),
  successful: z.number(),
  failed: z.number(),
  skipped: z.number(),
  errors: z.array(z.object({
    row: z.number(),
    field: z.string().optional(),
    message: z.string(),
    data: z.record(z.any()).optional(),
  })),
  warnings: z.array(z.object({
    row: z.number(),
    field: z.string().optional(),
    message: z.string(),
    data: z.record(z.any()).optional(),
  })),
})

/**
 * Ingredient import result interface
 */
export type IngredientImportResult = z.infer<typeof ingredientImportResultSchema>

/**
 * Ingredient statistics schema
 */
export const ingredientStatisticsSchema = z.object({
  totalIngredients: z.number(),
  activeIngredients: z.number(),
  inactiveIngredients: z.number(),
  lowStockIngredients: z.number(),
  outOfStockIngredients: z.number(),
  totalValue: z.number(),
  averageCost: z.number(),
  typeDistribution: z.record(z.number()),
  supplierDistribution: z.record(z.number()),
  categoryDistribution: z.record(z.number()),
})

/**
 * Ingredient statistics interface
 */
export type IngredientStatistics = z.infer<typeof ingredientStatisticsSchema>

/**
 * Export all ingredient schemas for validation
 */
export const ingredientSchemas = {
  ingredient: ingredientSchema,
  createIngredient: createIngredientSchema,
  updateIngredient: updateIngredientSchema,
  ingredientSearchParams: ingredientSearchParamsSchema,
  ingredientImportData: ingredientImportDataSchema,
  ingredientExportOptions: ingredientExportOptionsSchema,
  ingredientStockUpdate: ingredientStockUpdateSchema,
  ingredientSupplier: ingredientSupplierSchema,
  ingredientUsage: ingredientUsageSchema,
  ingredientBatchOperation: ingredientBatchOperationSchema,
  ingredientValidationResult: ingredientValidationResultSchema,
  ingredientImportResult: ingredientImportResultSchema,
  ingredientStatistics: ingredientStatisticsSchema,
} as const

/**
 * Ingredient type labels mapping
 */
export const INGREDIENT_TYPE_LABELS_MAP = INGREDIENT_TYPE_LABELS

/**
 * Weight unit labels mapping
 */
export const WEIGHT_UNIT_LABELS_MAP = WEIGHT_UNIT_LABELS

/**
 * Stock status enum
 */
export const STOCK_STATUS = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
} as const

/**
 * Stock status labels
 */
export const STOCK_STATUS_LABELS = {
  [STOCK_STATUS.IN_STOCK]: 'In Stock',
  [STOCK_STATUS.LOW_STOCK]: 'Low Stock',
  [STOCK_STATUS.OUT_OF_STOCK]: 'Out of Stock',
} as const

/**
 * Stock status colors
 */
export const STOCK_STATUS_COLORS = {
  [STOCK_STATUS.IN_STOCK]: '#10b981',
  [STOCK_STATUS.LOW_STOCK]: '#f59e0b',
  [STOCK_STATUS.OUT_OF_STOCK]: '#ef4444',
} as const

/**
 * Ingredient categories
 */
export const INGREDIENT_CATEGORIES = {
  TOP_NOTES: 'top_notes',
  MIDDLE_NOTES: 'middle_notes',
  BASE_NOTES: 'base_notes',
  FIXATIVES: 'fixatives',
  SOLVENTS: 'solvents',
  ADDITIVES: 'additives',
} as const

/**
 * Ingredient category labels
 */
export const INGREDIENT_CATEGORY_LABELS = {
  [INGREDIENT_CATEGORIES.TOP_NOTES]: 'Top Notes',
  [INGREDIENT_CATEGORIES.MIDDLE_NOTES]: 'Middle Notes',
  [INGREDIENT_CATEGORIES.BASE_NOTES]: 'Base Notes',
  [INGREDIENT_CATEGORIES.FIXATIVES]: 'Fixatives',
  [INGREDIENT_CATEGORIES.SOLVENTS]: 'Solvents',
  [INGREDIENT_CATEGORIES.ADDITIVES]: 'Additives',
} as const

/**
 * Ingredient category colors
 */
export const INGREDIENT_CATEGORY_COLORS = {
  [INGREDIENT_CATEGORIES.TOP_NOTES]: '#06b6d4',
  [INGREDIENT_CATEGORIES.MIDDLE_NOTES]: '#8b5cf6',
  [INGREDIENT_CATEGORIES.BASE_NOTES]: '#92400e',
  [INGREDIENT_CATEGORIES.FIXATIVES]: '#dc2626',
  [INGREDIENT_CATEGORIES.SOLVENTS]: '#6b7280',
  [INGREDIENT_CATEGORIES.ADDITIVES]: '#f59e0b',
} as const
