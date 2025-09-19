/**
 * Test configuration constants and utilities
 * Centralized configuration for all test environments
 */

// Environment-specific constants
export const TEST_CONFIG = {
  // API Configuration
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    AUTH_ENDPOINT: '/auth',
    INGREDIENTS_ENDPOINT: '/ingredients',
    USERS_ENDPOINT: '/users',
    TIMEOUT: 10000,
  },

  // Test Timeouts
  TIMEOUTS: {
    DEFAULT: 5000,
    LONG: 10000,
    SHORT: 1000,
    ANIMATION: 1000,
    NETWORK: 15000,
  },

  // Feature Flags for Testing
  FEATURES: {
    ENABLE_ANIMATIONS: false,
    ENABLE_REAL_TIME_UPDATES: false,
    ENABLE_MOCK_DATA: true,
    ENABLE_OFFLINE_MODE: false,
    ENABLE_DEBUG_MODE: true,
  },

  // User Roles and Permissions for Testing
  ROLES: {
    ADMIN: 'administrator',
    MANAGER: 'lab_manager',
    PERFUMER: 'perfumer',
    OPERATOR: 'operator',
    VIEWER: 'viewer',
  },

  PERMISSIONS: {
    READ: 'read',
    WRITE: 'write',
    DELETE: 'delete',
    ADMIN: 'admin',
    MANAGE_CASES: 'manage_cases',
    MANAGE_USERS: 'manage_users',
    MANAGE_INGREDIENTS: 'manage_ingredients',
  },

  // Test Data Constants
  TEST_DATA: {
    USERS: {
      ADMIN: {
        id: 'admin-1',
        username: 'admin',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        roles: ['administrator'],
        permissions: ['read', 'write', 'delete', 'admin'],
        isActive: true,
      },
      MANAGER: {
        id: 'manager-1',
        username: 'manager',
        email: 'manager@example.com',
        firstName: 'Manager',
        lastName: 'User',
        roles: ['lab_manager'],
        permissions: ['read', 'write', 'manage_cases'],
        isActive: true,
      },
      PERFUMER: {
        id: 'perfumer-1',
        username: 'perfumer',
        email: 'perfumer@example.com',
        firstName: 'Perfumer',
        lastName: 'User',
        roles: ['perfumer'],
        permissions: ['read', 'write'],
        isActive: true,
      },
    },

    INGREDIENTS: {
      ESSENTIAL_OIL: {
        id: 'ingredient-1',
        name: 'Lavender Essential Oil',
        type: 'essential_oil',
        supplier: 'Natural Oils Inc',
        cost: 25.50,
        stockLevel: 100,
        unit: 'ml',
        description: 'High-quality lavender essential oil',
        notes: 'Use sparingly in formulations',
      },
      SYNTHETIC: {
        id: 'ingredient-2',
        name: 'Synthetic Vanillin',
        type: 'synthetic',
        supplier: 'Chemical Solutions',
        cost: 15.00,
        stockLevel: 500,
        unit: 'g',
        description: 'Pure synthetic vanillin',
        notes: 'Stable and consistent',
      },
      NATURAL: {
        id: 'ingredient-3',
        name: 'Rose Absolute',
        type: 'natural',
        supplier: 'Botanical Extracts',
        cost: 150.00,
        stockLevel: 25,
        unit: 'ml',
        description: 'Premium rose absolute',
        notes: 'Very expensive, use carefully',
      },
    },

    CREDENTIALS: {
      VALID: {
        email: 'test@example.com',
        password: 'TestPassword123!',
      },
      INVALID: {
        email: 'invalid-email',
        password: '123',
      },
      ADMIN: {
        email: 'admin@example.com',
        password: 'AdminPassword123!',
      },
    },

    FORMS: {
      VALID_USER: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        username: 'testuser',
      },
      INVALID_USER: {
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        username: '',
      },
      VALID_INGREDIENT: {
        name: 'Test Ingredient',
        type: 'essential_oil',
        supplier: 'Test Supplier',
        cost: 10.00,
        stockLevel: 50,
        unit: 'ml',
      },
      INVALID_INGREDIENT: {
        name: '',
        type: '',
        supplier: '',
        cost: -1,
        stockLevel: -1,
        unit: '',
      },
    },
  },

  // MSW Configuration
  MSW: {
    ENABLED: true,
    DELAY: 100,
    ERROR_RATE: 0,
  },

  // Playwright Configuration
  PLAYWRIGHT: {
    BASE_URL: 'http://localhost:3000',
    TIMEOUT: 30000,
    RETRIES: 2,
    WORKERS: 1,
  },

  // Jest Configuration
  JEST: {
    TIMEOUT: 10000,
    CLEAR_MOCKS: true,
    RESTORE_MOCKS: true,
    RESET_MODULES: false,
  },

  // Database Configuration (for integration tests)
  DATABASE: {
    HOST: 'localhost',
    PORT: 5432,
    NAME: 'fragrance_test',
    USER: 'test_user',
    PASSWORD: 'test_password',
  },

  // File Upload Configuration
  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
    TEST_FILE_PATH: '/test-utils/test-files/',
  },

  // Email Configuration (for testing email functionality)
  EMAIL: {
    PROVIDER: 'test',
    FROM: 'test@example.com',
    REPLY_TO: 'noreply@example.com',
  },

  // Cache Configuration
  CACHE: {
    TTL: 300, // 5 minutes
    MAX_SIZE: 1000,
    ENABLED: true,
  },

  // Logging Configuration
  LOGGING: {
    LEVEL: 'debug',
    ENABLE_CONSOLE: true,
    ENABLE_FILE: false,
    ENABLE_REMOTE: false,
  },
} as const;

// Type definitions for better TypeScript support
export type TestConfig = typeof TEST_CONFIG;
export type TestUser = typeof TEST_CONFIG.TEST_DATA.USERS.ADMIN;
export type TestIngredient = typeof TEST_CONFIG.TEST_DATA.INGREDIENTS.ESSENTIAL_OIL;
export type TestCredentials = typeof TEST_CONFIG.TEST_DATA.CREDENTIALS.VALID;

// Utility functions for test configuration
export const getTestConfig = () => TEST_CONFIG;

export const getTestUser = (role: keyof typeof TEST_CONFIG.TEST_DATA.USERS) => {
  return TEST_CONFIG.TEST_DATA.USERS[role];
};

export const getTestIngredient = (type: keyof typeof TEST_CONFIG.TEST_DATA.INGREDIENTS) => {
  return TEST_CONFIG.TEST_DATA.INGREDIENTS[type];
};

export const getTestCredentials = (type: keyof typeof TEST_CONFIG.TEST_DATA.CREDENTIALS) => {
  return TEST_CONFIG.TEST_DATA.CREDENTIALS[type];
};

export const isFeatureEnabled = (feature: keyof typeof TEST_CONFIG.FEATURES) => {
  return TEST_CONFIG.FEATURES[feature];
};

export const getTimeout = (type: keyof typeof TEST_CONFIG.TIMEOUTS) => {
  return TEST_CONFIG.TIMEOUTS[type];
};

export const getApiEndpoint = (endpoint: keyof typeof TEST_CONFIG.API) => {
  return TEST_CONFIG.API[endpoint];
};

// Environment-specific overrides
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'test';
  
  switch (env) {
    case 'development':
      return {
        ...TEST_CONFIG,
        API: {
          ...TEST_CONFIG.API,
          BASE_URL: 'http://localhost:3000/api',
        },
        FEATURES: {
          ...TEST_CONFIG.FEATURES,
          ENABLE_DEBUG_MODE: true,
        },
      };
    
    case 'production':
      return {
        ...TEST_CONFIG,
        API: {
          ...TEST_CONFIG.API,
          BASE_URL: 'https://api.fragrance.com',
        },
        FEATURES: {
          ...TEST_CONFIG.FEATURES,
          ENABLE_DEBUG_MODE: false,
        },
      };
    
    case 'test':
    default:
      return TEST_CONFIG;
  }
};

// Validation helpers
export const validateTestConfig = () => {
  const config = getEnvironmentConfig();
  
  // Validate required fields
  if (!config.API.BASE_URL) {
    throw new Error('API base URL is required');
  }
  
  if (!config.TIMEOUTS.DEFAULT) {
    throw new Error('Default timeout is required');
  }
  
  // Validate test data
  Object.values(config.TEST_DATA.USERS).forEach(user => {
    if (!user.id || !user.email || !user.roles.length) {
      throw new Error('Invalid test user configuration');
    }
  });
  
  Object.values(config.TEST_DATA.INGREDIENTS).forEach(ingredient => {
    if (!ingredient.id || !ingredient.name || !ingredient.type) {
      throw new Error('Invalid test ingredient configuration');
    }
  });
  
  return true;
};

// Initialize configuration validation
if (typeof window === 'undefined') {
  validateTestConfig();
}

export default TEST_CONFIG;
