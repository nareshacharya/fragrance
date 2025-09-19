import type { 
  User, 
  AuthCredentials, 
  AuthResponse, 
  TokenData, 
  Session,
  Project,
  Case,
  Perfume,
  Formula,
  FormulaIngredient,
  Notification,
  ApiResponse,
  PaginatedResponse,
  Report,
  FileUpload,
} from '@/types';
import type { Ingredient } from '@/types/ingredient';
import {
  USER_ROLES,
  DEPARTMENTS,
  PERFUME_CATEGORIES,
  PERFUME_STATUS,
  PROJECT_STATUS,
  CASE_STATUS,
  PRIORITY,
  INGREDIENT_TYPES,
  WEIGHT_UNITS,
  NOTIFICATION_TYPES,
  REPORT_TYPES,
} from '@/config/constants';

// User factories
export const createUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-' + Math.random().toString(36).substr(2, 9),
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  avatar: undefined,
  role: USER_ROLES.PERFUMER,
  department: DEPARTMENTS.RESEARCH,
  isActive: true,
  lastLoginAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createAdminUser = (overrides: Partial<User> = {}): User => 
  createUser({
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: USER_ROLES.ADMINISTRATOR,
    department: DEPARTMENTS.MANAGEMENT,
    ...overrides,
  });

export const createManagerUser = (overrides: Partial<User> = {}): User => 
  createUser({
    email: 'manager@example.com',
    firstName: 'Manager',
    lastName: 'User',
    role: USER_ROLES.LAB_MANAGER,
    department: DEPARTMENTS.MANAGEMENT,
    ...overrides,
  });

// Auth factories
export const createAuthCredentials = (overrides: Partial<AuthCredentials> = {}): AuthCredentials => ({
  email: 'test@example.com',
  password: 'TestPassword123!',
  ...overrides,
});

export const createTokenData = (overrides: Partial<TokenData> = {}): TokenData => ({
  accessToken: 'access-token-' + Math.random().toString(36).substr(2, 16),
  tokenType: 'Bearer',
  expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
  refreshToken: 'refresh-token-' + Math.random().toString(36).substr(2, 16),
  scope: 'read write',
  ...overrides,
});

export const createSession = (overrides: Partial<Session> = {}): Session => ({
  id: 'session-' + Math.random().toString(36).substr(2, 9),
  userId: 'user-' + Math.random().toString(36).substr(2, 9),
  token: createTokenData(),
  isActive: true,
  createdAt: new Date(),
  lastActivity: new Date(),
  expiresAt: new Date(Date.now() + 3600000),
  clientIP: '127.0.0.1',
  userAgent: 'Test User Agent',
  ...overrides,
});

export const createAuthResponse = (overrides: Partial<AuthResponse> = {}): AuthResponse => ({
  user: createUser(),
  token: createTokenData(),
  session: createSession(),
  permissions: ['read', 'write'],
  ...overrides,
});

// Ingredient factories
export const createIngredient = (overrides: Partial<Ingredient> = {}): Ingredient => ({
  id: 'ingredient-' + Math.random().toString(36).substr(2, 9),
  name: 'Test Ingredient',
  type: INGREDIENT_TYPES.ESSENTIAL_OIL,
  category: 'top_notes',
  supplier: 'Test Supplier',
  supplierCode: 'TEST-' + Math.random().toString(36).substr(2, 3).toUpperCase(),
  cost: parseFloat((Math.random() * 100).toFixed(2)),
  currency: 'USD',
  stockLevel: Math.floor(Math.random() * 1000),
  minStockLevel: 10,
  maxStockLevel: 1000,
  unit: WEIGHT_UNITS.ML,
  density: 0.85,
  molecularWeight: 154.25,
  casNumber: '123-45-6',
  einECSNumber: '234-567-8',
  inciName: 'Test Ingredient INCI',
  description: 'This is a test ingredient for testing purposes',
  notes: 'Test notes for the ingredient',
  safetyData: {
    hazardClass: 'Non-hazardous',
    hazardStatements: [],
    precautionaryStatements: [],
    allergenInfo: [],
    restrictions: [],
  },
  regulatoryInfo: {
    ifraCategory: 'Category 4',
    ifraLimit: 0.5,
    reachCompliant: true,
    fdaApproved: false,
    kosherCertified: false,
    halalCertified: false,
    organicCertified: true,
    certifications: ['Organic'],
  },
  physicalProperties: {
    appearance: 'Clear liquid',
    color: 'Colorless',
    odor: 'Fresh, citrusy',
    solubility: 'Ethanol soluble',
    boilingPoint: 176,
    meltingPoint: -95,
    flashPoint: 48,
    refractiveIndex: 1.4742,
    specificGravity: 0.8500,
  },
  storageConditions: {
    temperature: '15-25°C',
    humidity: 'Below 60% RH',
    lightSensitivity: true,
    airSensitivity: false,
    shelfLife: 24,
    storageNotes: 'Store in dark, cool place',
  },
  usage: {
    typicalConcentration: 0.5,
    maxConcentration: 2.0,
    applications: ['Perfume', 'Cologne', 'Cosmetics'],
    compatibility: ['Ethanol', 'Other citrus oils'],
    contraindications: ['Sensitive skin'],
  },
  images: [
    {
      id: 'img-1',
      url: 'https://example.com/ingredient-image.jpg',
      alt: 'Test Ingredient Image',
      isPrimary: true,
    },
  ],
  documents: [
    {
      id: 'doc-1',
      name: 'Safety Data Sheet',
      type: 'PDF',
      url: 'https://example.com/sds.pdf',
      uploadedAt: new Date().toISOString(),
    },
  ],
  tags: ['citrus', 'fresh', 'natural'],
  isActive: true,
  createdBy: 'user-' + Math.random().toString(36).substr(2, 9),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createIngredientList = (count: number = 5): Ingredient[] => {
  return Array.from({ length: count }, (_, index) => 
    createIngredient({
      name: `Test Ingredient ${index + 1}`,
      type: Object.values(INGREDIENT_TYPES)[index % Object.values(INGREDIENT_TYPES).length],
      cost: parseFloat(((index + 1) * 10.5).toFixed(2)),
    })
  );
};

// Formula factories
export const createFormulaIngredient = (overrides: Partial<FormulaIngredient> = {}): FormulaIngredient => ({
  id: 'ingredient-' + Math.random().toString(36).substr(2, 9),
  name: 'Test Ingredient',
  type: INGREDIENT_TYPES.ESSENTIAL_OIL,
  concentration: parseFloat((Math.random() * 10).toFixed(2)),
  weight: parseFloat((Math.random() * 100).toFixed(2)),
  unit: WEIGHT_UNITS.ML,
  supplier: 'Test Supplier',
  cost: parseFloat((Math.random() * 50).toFixed(2)),
  notes: 'Test notes',
  ...overrides,
});

export const createFormula = (overrides: Partial<Formula> = {}): Formula => ({
  id: 'formula-' + Math.random().toString(36).substr(2, 9),
  name: 'Test Formula',
  ingredients: [createFormulaIngredient(), createFormulaIngredient()],
  totalWeight: 100,
  concentration: 15,
  ph: 7.0,
  alcoholContent: 85,
  notes: 'Test formula notes',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Perfume factories
export const createPerfume = (overrides: Partial<Perfume> = {}): Perfume => ({
  id: 'perfume-' + Math.random().toString(36).substr(2, 9),
  name: 'Test Perfume',
  description: 'A test perfume for testing purposes',
  category: PERFUME_CATEGORIES.FRESH,
  status: PERFUME_STATUS.DRAFT,
  formula: createFormula(),
  notes: ['bergamot', 'lavender', 'sandalwood'],
  tags: ['fresh', 'citrus', 'unisex'],
  createdBy: 'user-' + Math.random().toString(36).substr(2, 9),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: 1,
  ...overrides,
});

// Project factories
export const createProject = (overrides: Partial<Project> = {}): Project => ({
  id: 'project-' + Math.random().toString(36).substr(2, 9),
  name: 'Test Project',
  description: 'A test project for testing purposes',
  status: PROJECT_STATUS.ACTIVE,
  priority: PRIORITY.MEDIUM,
  assignedTo: ['user-1', 'user-2'],
  perfumes: ['perfume-1', 'perfume-2'],
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  budget: 10000,
  progress: 25,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Case factories
export const createCase = (overrides: Partial<Case> = {}): Case => ({
  id: 'case-' + Math.random().toString(36).substr(2, 9),
  title: 'Test Case',
  description: 'A test case for testing purposes',
  status: CASE_STATUS.OPEN,
  priority: PRIORITY.MEDIUM,
  assignedTo: 'user-' + Math.random().toString(36).substr(2, 9),
  projectId: 'project-' + Math.random().toString(36).substr(2, 9),
  perfumeId: 'perfume-' + Math.random().toString(36).substr(2, 9),
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Notification factories
export const createNotification = (overrides: Partial<Notification> = {}): Notification => ({
  id: 'notification-' + Math.random().toString(36).substr(2, 9),
  title: 'Test Notification',
  message: 'This is a test notification',
  type: NOTIFICATION_TYPES.INFO,
  read: false,
  userId: 'user-' + Math.random().toString(36).substr(2, 9),
  createdAt: new Date().toISOString(),
  actionUrl: '/test-action',
  ...overrides,
});

// File upload factories
export const createFileUpload = (overrides: Partial<FileUpload> = {}): FileUpload => ({
  id: 'file-' + Math.random().toString(36).substr(2, 9),
  name: 'test-file.pdf',
  size: 1024 * 1024, // 1MB
  type: 'application/pdf',
  url: 'https://example.com/files/test-file.pdf',
  uploadedAt: new Date().toISOString(),
  uploadedBy: 'user-' + Math.random().toString(36).substr(2, 9),
  ...overrides,
});

// Report factories
export const createReport = (overrides: Partial<Report> = {}): Report => ({
  id: 'report-' + Math.random().toString(36).substr(2, 9),
  name: 'Test Report',
  type: REPORT_TYPES.FORMULA_SUMMARY,
  parameters: { startDate: new Date().toISOString(), endDate: new Date().toISOString() },
  generatedAt: new Date().toISOString(),
  generatedBy: 'user-' + Math.random().toString(36).substr(2, 9),
  fileUrl: 'https://example.com/reports/test-report.pdf',
  ...overrides,
});

// API response factories
export const createApiResponse = <T>(data: T, overrides: Partial<ApiResponse<T>> = {}): ApiResponse<T> => ({
  success: true,
  data,
  message: 'Operation successful',
  timestamp: new Date().toISOString(),
  ...overrides,
});

export const createApiError = (overrides: Partial<ApiResponse> = {}): ApiResponse => ({
  success: false,
  error: 'Test error',
  message: 'An error occurred',
  timestamp: new Date().toISOString(),
  ...overrides,
});

export const createPaginatedResponse = <T>(
  data: T[], 
  overrides: Partial<PaginatedResponse<T>> = {}
): PaginatedResponse<T> => ({
  success: true,
  data,
  message: 'Data retrieved successfully',
  timestamp: new Date().toISOString(),
  pagination: {
    page: 1,
    limit: 20,
    total: data.length,
    totalPages: Math.ceil(data.length / 20),
    hasNext: false,
    hasPrev: false,
  },
  ...overrides,
});

// Batch creation utilities
export const createUserList = (count: number = 5): User[] => {
  return Array.from({ length: count }, (_, index) => 
    createUser({
      email: `user${index + 1}@example.com`,
      firstName: `User${index + 1}`,
      lastName: 'Test',
    })
  );
};

export const createPerfumeList = (count: number = 5): Perfume[] => {
  return Array.from({ length: count }, (_, index) => 
    createPerfume({
      name: `Test Perfume ${index + 1}`,
      category: Object.values(PERFUME_CATEGORIES)[index % Object.values(PERFUME_CATEGORIES).length],
      status: Object.values(PERFUME_STATUS)[index % Object.values(PERFUME_STATUS).length],
    })
  );
};

export const createProjectList = (count: number = 5): Project[] => {
  return Array.from({ length: count }, (_, index) => 
    createProject({
      name: `Test Project ${index + 1}`,
      status: Object.values(PROJECT_STATUS)[index % Object.values(PROJECT_STATUS).length],
      priority: Object.values(PRIORITY)[index % Object.values(PRIORITY).length],
    })
  );
};

export const createCaseList = (count: number = 5): Case[] => {
  return Array.from({ length: count }, (_, index) => 
    createCase({
      title: `Test Case ${index + 1}`,
      status: Object.values(CASE_STATUS)[index % Object.values(CASE_STATUS).length],
      priority: Object.values(PRIORITY)[index % Object.values(PRIORITY).length],
    })
  );
};

export const createNotificationList = (count: number = 5): Notification[] => {
  return Array.from({ length: count }, (_, index) => 
    createNotification({
      title: `Test Notification ${index + 1}`,
      type: Object.values(NOTIFICATION_TYPES)[index % Object.values(NOTIFICATION_TYPES).length],
      read: index % 2 === 0,
    })
  );
};

// Factory configuration
export interface FactoryConfig {
  seed?: number;
  locale?: string;
  timezone?: string;
}

// Seeded random number generator for consistent test data
class SeededRandom {
  private seed: number;

  constructor(seed: number = 1) {
    this.seed = seed;
  }

  random(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  integer(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  choice<T>(array: T[]): T {
    return array[this.integer(0, array.length - 1)];
  }
}

let seededRandom = new SeededRandom();

export const setFactorySeed = (seed: number): void => {
  seededRandom = new SeededRandom(seed);
};

export const resetFactorySeed = (): void => {
  seededRandom = new SeededRandom(1);
};

// Seeded factory functions for deterministic tests
export const createSeededUser = (overrides: Partial<User> = {}): User => {
  const id = seededRandom.integer(1000, 9999);
  return createUser({
    id: `user-${id}`,
    email: `user${id}@example.com`,
    firstName: `User${id}`,
    lastName: 'Test',
    role: seededRandom.choice(Object.values(USER_ROLES)),
    department: seededRandom.choice(Object.values(DEPARTMENTS)),
    ...overrides,
  });
};

export const createSeededIngredient = (overrides: Partial<Ingredient> = {}): Ingredient => {
  const id = seededRandom.integer(1000, 9999);
  return createIngredient({
    id: `ingredient-${id}`,
    name: `Test Ingredient ${id}`,
    type: seededRandom.choice(Object.values(INGREDIENT_TYPES)),
    unit: seededRandom.choice(Object.values(WEIGHT_UNITS)),
    cost: seededRandom.integer(10, 100),
    stockLevel: seededRandom.integer(0, 1000),
    ...overrides,
  });
};

// Test data collections
export const testData = {
  users: {
    admin: createUser({ role: USER_ROLES.ADMINISTRATOR, department: DEPARTMENTS.MANAGEMENT }),
    manager: createUser({ role: USER_ROLES.LAB_MANAGER, department: DEPARTMENTS.RESEARCH }),
    perfumer: createUser({ role: USER_ROLES.PERFUMER, department: DEPARTMENTS.RESEARCH }),
    projectManager: createUser({ role: USER_ROLES.PROJECT_MANAGER, department: DEPARTMENTS.DEVELOPMENT }),
  },
  ingredients: {
    essentialOil: createIngredient({ type: INGREDIENT_TYPES.ESSENTIAL_OIL, name: 'Lavender Essential Oil' }),
    synthetic: createIngredient({ type: INGREDIENT_TYPES.SYNTHETIC, name: 'Synthetic Vanillin' }),
    naturalExtract: createIngredient({ type: INGREDIENT_TYPES.NATURAL_EXTRACT, name: 'Rose Extract' }),
    fixative: createIngredient({ type: INGREDIENT_TYPES.FIXATIVE, name: 'Ambergris' }),
    solvent: createIngredient({ type: INGREDIENT_TYPES.SOLVENT, name: 'Ethanol' }),
    additive: createIngredient({ type: INGREDIENT_TYPES.ADDITIVE, name: 'Antioxidant' }),
  },
  perfumes: {
    fresh: createPerfume({ category: PERFUME_CATEGORIES.FRESH, name: 'Fresh Breeze' }),
    floral: createPerfume({ category: PERFUME_CATEGORIES.FLORAL, name: 'Rose Garden' }),
    woody: createPerfume({ category: PERFUME_CATEGORIES.WOODY, name: 'Sandalwood Dreams' }),
    oriental: createPerfume({ category: PERFUME_CATEGORIES.ORIENTAL, name: 'Mystic Orient' }),
  },
  projects: {
    active: createProject({ status: PROJECT_STATUS.ACTIVE, name: 'Summer Collection' }),
    planning: createProject({ status: PROJECT_STATUS.PLANNING, name: 'Winter Collection' }),
    completed: createProject({ status: PROJECT_STATUS.COMPLETED, name: 'Spring Collection' }),
  },
  cases: {
    open: createCase({ status: CASE_STATUS.OPEN, title: 'New Formula Development' }),
    inProgress: createCase({ status: CASE_STATUS.IN_PROGRESS, title: 'Quality Testing' }),
    resolved: createCase({ status: CASE_STATUS.RESOLVED, title: 'Packaging Design' }),
  },
};

export default {
  // User factories
  createUser,
  createAdminUser,
  createManagerUser,
  createUserList,
  
  // Auth factories
  createAuthCredentials,
  createTokenData,
  createSession,
  createAuthResponse,
  
  // Ingredient factories
  createIngredient,
  createIngredientList,
  
  // Formula factories
  createFormulaIngredient,
  createFormula,
  
  // Perfume factories
  createPerfume,
  createPerfumeList,
  
  // Project factories
  createProject,
  createProjectList,
  
  // Case factories
  createCase,
  createCaseList,
  
  // Notification factories
  createNotification,
  createNotificationList,
  
  // File upload factories
  createFileUpload,
  
  // Report factories
  createReport,
  
  // API response factories
  createApiResponse,
  createApiError,
  createPaginatedResponse,
  
  // Seeded factories
  createSeededUser,
  createSeededIngredient,
  setFactorySeed,
  resetFactorySeed,
  
  // Test data collections
  testData,
};
