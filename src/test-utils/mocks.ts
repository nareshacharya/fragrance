import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AuthService } from '@/lib/auth/auth-service';
import { ApiClient } from '@/lib/api/client';
import type { User, AuthCredentials, AuthResponse, TokenData } from '@/lib/auth/types';
import type { Ingredient } from '@/types/ingredient';

// Mock axios instance
export const createMockAxiosInstance = (): Partial<AxiosInstance> => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  patch: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} }),
  request: jest.fn().mockResolvedValue({ data: {} }),
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
  defaults: {
    headers: {
      common: {},
    },
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
  },
});

// Mock API client
export const createMockApiClient = (): Partial<ApiClient> => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  patch: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({}),
  request: jest.fn().mockResolvedValue({}),
  setAuthToken: jest.fn(),
  clearAuthToken: jest.fn(),
  setHeaders: jest.fn(),
  clearHeaders: jest.fn(),
  getAxiosInstance: jest.fn().mockReturnValue(createMockAxiosInstance()),
  updateConfig: jest.fn(),
  getConfig: jest.fn().mockReturnValue({
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
    retries: 3,
    retryDelay: 1000,
    enableLogging: false,
    enableRetry: true,
  }),
});

// Mock authentication service
export const createMockAuthService = (
  overrides: Partial<AuthService> = {}
): Partial<AuthService> => ({
  authenticate: jest.fn().mockResolvedValue({
    user: createMockUser(),
    token: createMockTokenData(),
    session: createMockSession(),
    permissions: ['read', 'write'],
  } as AuthResponse),
  logout: jest.fn().mockResolvedValue(undefined),
  refreshToken: jest.fn().mockResolvedValue(createMockTokenData()),
  getAccessToken: jest.fn().mockResolvedValue('mock-access-token'),
  getCurrentUser: jest.fn().mockResolvedValue(createMockUser()),
  getCurrentSession: jest.fn().mockReturnValue(createMockSession()),
  isAuthenticated: jest.fn().mockReturnValue(true),
  updateProfile: jest.fn().mockResolvedValue(createMockUser()),
  changePassword: jest.fn().mockResolvedValue(undefined),
  hasPermission: jest.fn().mockReturnValue(true),
  hasRole: jest.fn().mockReturnValue(true),
  hasAnyRole: jest.fn().mockReturnValue(true),
  hasAllRoles: jest.fn().mockReturnValue(true),
  canAccess: jest.fn().mockReturnValue(true),
  extendSession: jest.fn(),
  isSessionValid: jest.fn().mockReturnValue(true),
  isSessionExpiringSoon: jest.fn().mockReturnValue(false),
  getSessionTimeRemaining: jest.fn().mockReturnValue(30),
  getSessionInfo: jest.fn().mockReturnValue({}),
  getAuthState: jest.fn().mockReturnValue({
    isAuthenticated: true,
    user: createMockUser(),
    session: createMockSession(),
    isLoading: false,
    error: null,
  }),
  needsTokenRefresh: jest.fn().mockReturnValue(false),
  initialize: jest.fn().mockResolvedValue(undefined),
  cleanup: jest.fn(),
  addSessionListener: jest.fn(),
  removeSessionListener: jest.fn(),
  ...overrides,
});

// Create mock user
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'test-user-id',
  sub: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  preferredUsername: 'testuser',
  givenName: 'Test',
  familyName: 'User',
  roles: ['user'],
  groups: ['test-group'],
  displayName: 'Test User',
  avatar: undefined,
  department: 'Testing',
  permissions: ['read', 'write'],
  lastLogin: new Date(),
  isActive: true,
  ...overrides,
});

// Create mock admin user
export const createMockAdminUser = (overrides: Partial<User> = {}): User => 
  createMockUser({
    id: 'admin-user-id',
    name: 'Admin User',
    email: 'admin@example.com',
    preferredUsername: 'admin',
    givenName: 'Admin',
    familyName: 'User',
    roles: ['admin', 'manager', 'user'],
    groups: ['admin-group', 'management-team'],
    displayName: 'Admin User',
    department: 'Administration',
    permissions: ['read', 'write', 'delete', 'admin', 'manage_users', 'manage_cases'],
    ...overrides,
  });

// Create mock manager user
export const createMockManagerUser = (overrides: Partial<User> = {}): User => 
  createMockUser({
    id: 'manager-user-id',
    name: 'Manager User',
    email: 'manager@example.com',
    preferredUsername: 'manager',
    givenName: 'Manager',
    familyName: 'User',
    roles: ['manager', 'user'],
    groups: ['management-team'],
    displayName: 'Manager User',
    department: 'Management',
    permissions: ['read', 'write', 'manage_cases'],
    ...overrides,
  });

// Create mock token data
export const createMockTokenData = (overrides: Partial<TokenData> = {}): TokenData => ({
  accessToken: 'mock-access-token',
  tokenType: 'Bearer',
  expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
  refreshToken: 'mock-refresh-token',
  scope: 'read write',
  ...overrides,
});

// Create mock session
export const createMockSession = (overrides: any = {}) => ({
  id: 'test-session-id',
  userId: 'test-user-id',
  token: createMockTokenData(),
  isActive: true,
  createdAt: new Date(),
  lastActivity: new Date(),
  expiresAt: new Date(Date.now() + 3600000),
  clientIP: '127.0.0.1',
  userAgent: 'Test User Agent',
  ...overrides,
});

// Create mock credentials
export const createMockCredentials = (overrides: Partial<AuthCredentials> = {}): AuthCredentials => ({
  email: 'test@example.com',
  password: 'TestPassword123!',
  ...overrides,
});

// Create mock ingredient
export const createMockIngredient = (overrides: Partial<Ingredient> = {}): Ingredient => ({
  id: 'test-ingredient-id',
  name: 'Test Ingredient',
  type: 'essential_oil',
  category: 'top_notes',
  supplier: 'Test Supplier',
  supplierCode: 'TEST-001',
  cost: 25.50,
  currency: 'USD',
  stockLevel: 100,
  minStockLevel: 10,
  maxStockLevel: 500,
  unit: 'ml',
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
  createdBy: 'test-user-id',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Create mock ingredient list
export const createMockIngredientList = (count: number = 5): Ingredient[] => {
  return Array.from({ length: count }, (_, index) => 
    createMockIngredient({
      id: `test-ingredient-${index + 1}`,
      name: `Test Ingredient ${index + 1}`,
      supplierCode: `TEST-${String(index + 1).padStart(3, '0')}`,
    })
  );
};

// Mock file system operations
export const createMockFileSystem = () => ({
  readFile: jest.fn().mockResolvedValue('mock file content'),
  writeFile: jest.fn().mockResolvedValue(undefined),
  mkdir: jest.fn().mockResolvedValue(undefined),
  rmdir: jest.fn().mockResolvedValue(undefined),
  exists: jest.fn().mockResolvedValue(true),
  stat: jest.fn().mockResolvedValue({
    isFile: () => true,
    isDirectory: () => false,
    size: 1024,
    mtime: new Date(),
  }),
});

// Mock localStorage
export const createMockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    length: Object.keys(store).length,
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };
};

// Mock sessionStorage
export const createMockSessionStorage = () => createMockLocalStorage();

// Mock fetch API
export const createMockFetch = () => {
  return jest.fn().mockImplementation((url: string, options?: RequestInit) => {
    return Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      json: () => Promise.resolve({ success: true, data: {} }),
      text: () => Promise.resolve('mock response'),
      blob: () => Promise.resolve(new Blob()),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      clone: () => createMockFetch(),
      url,
    } as Response);
  });
};

// Mock Date.now for consistent timestamps
export const createMockDateNow = (timestamp?: number) => {
  const mockTimestamp = timestamp || Date.now();
  return jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
};

// Mock console methods for cleaner test output
export const createMockConsole = () => ({
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
});

// Mock window.location
export const createMockLocation = (overrides: Partial<Location> = {}) => ({
  href: 'http://localhost:3000/',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  toString: jest.fn(() => 'http://localhost:3000/'),
  ...overrides,
});

// Mock window object
export const createMockWindow = (overrides: any = {}) => ({
  location: createMockLocation(),
  localStorage: createMockLocalStorage(),
  sessionStorage: createMockSessionStorage(),
  navigator: {
    userAgent: 'Test User Agent',
    language: 'en-US',
    languages: ['en-US'],
    onLine: true,
  },
  document: {
    cookie: '',
    title: 'Test App',
    createElement: jest.fn(),
    getElementById: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  setTimeout: jest.fn((callback, delay) => {
    callback();
    return 1;
  }),
  clearTimeout: jest.fn(),
  setInterval: jest.fn((callback, delay) => {
    callback();
    return 1;
  }),
  clearInterval: jest.fn(),
  fetch: createMockFetch(),
  URL: jest.fn().mockImplementation((url) => ({
    href: url,
    toString: () => url,
  })),
  ...overrides,
});

// Global mock setup function
export const setupGlobalMocks = () => {
  // Mock console
  const mockConsole = createMockConsole();
  Object.assign(console, mockConsole);

  // Mock Date.now
  createMockDateNow();

  // Mock window
  if (typeof window !== 'undefined') {
    Object.assign(window, createMockWindow());
  }

  // Mock global fetch
  if (typeof global !== 'undefined') {
    global.fetch = createMockFetch();
  }

  return {
    mockConsole,
    mockWindow: typeof window !== 'undefined' ? window : createMockWindow(),
  };
};

// Cleanup mocks function
export const cleanupMocks = () => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
};
