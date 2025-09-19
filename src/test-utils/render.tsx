import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthContext } from '@/lib/auth/auth-context';
import { CaseManagementProvider } from '@/components/providers/case-management-provider';
import type { ThemeMode } from '@/types/theme';
import type { User, AuthContextType } from '@/lib/auth/types';

// Create a mock user for testing
const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  displayName: 'Test User',
  roles: ['user'],
  permissions: ['read'],
  isActive: true,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// Render options interface
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Theme options
  theme?: ThemeMode;
  
  // Auth options
  user?: User | null;
  isAuthenticated?: boolean;
  
  // Case management options
  initialRoute?: string;
  
  // Provider options
  skipThemeProvider?: boolean;
  skipAuthProvider?: boolean;
  skipCaseManagementProvider?: boolean;
}

// Create a wrapper component with all providers
function createTestWrapper(options: CustomRenderOptions = {}) {
  const {
    theme = 'light',
    user = createMockUser(),
    isAuthenticated = true,
    initialRoute = '/',
    skipThemeProvider = false,
    skipAuthProvider = false,
    skipCaseManagementProvider = false,
  } = options;

  return function TestWrapper({ children }: { children: React.ReactNode }) {
    let content = <>{children}</>;

    // Wrap with CaseManagementProvider if not skipped
    if (!skipCaseManagementProvider) {
      content = (
        <CaseManagementProvider defaultRoute={initialRoute}>
          {content}
        </CaseManagementProvider>
      );
    }

    // Wrap with AuthProvider if not skipped
    if (!skipAuthProvider) {
      // Mock the auth provider with test state
      const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
        const mockAuthState = {
          isAuthenticated,
          isLoading: false,
          user,
          token: isAuthenticated ? { accessToken: 'mock-token', tokenType: 'Bearer', expiresAt: new Date(Date.now() + 3600000) } : null,
          permissions: user?.permissions || [],
          lastActivity: isAuthenticated ? new Date() : null,
          error: null,
        };

        const mockContextValue: AuthContextType = {
          authState: mockAuthState,
          login: jest.fn(),
          logout: jest.fn(),
          refreshToken: jest.fn(),
          updateProfile: jest.fn(),
          changePassword: jest.fn(),
          hasPermission: jest.fn((permission: string) => user?.permissions?.includes(permission) || false),
          hasRole: jest.fn((role: string) => user?.roles?.includes(role) || false),
          hasAnyRole: jest.fn((roles: string[]) => roles.some(role => user?.roles?.includes(role)) || false),
          hasAllRoles: jest.fn((roles: string[]) => roles.every(role => user?.roles?.includes(role)) || false),
          canAccess: jest.fn(() => true),
          extendSession: jest.fn(),
          getSessionInfo: jest.fn(() => null),
          isSessionValid: jest.fn(() => isAuthenticated),
        };

        // Use the real AuthContext.Provider
        return (
          <AuthContext.Provider value={mockContextValue}>
            {children}
          </AuthContext.Provider>
        );
      };

      content = <MockAuthProvider>{content}</MockAuthProvider>;
    }

    // Wrap with ThemeProvider if not skipped
    if (!skipThemeProvider) {
      content = (
        <ThemeProvider defaultTheme={theme} storageKey="test-theme">
          {content}
        </ThemeProvider>
      );
    }

    return content;
  };
}

// Custom render function
function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { ...renderOptions } = options;
  
  const Wrapper = createTestWrapper(options);
  
  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    // Re-export useful utilities
    user: options.user || createMockUser(),
  };
}

// Render with specific user roles
export function renderWithUser(
  ui: ReactElement,
  user: Partial<User>,
  options: Omit<CustomRenderOptions, 'user'> = {}
) {
  return customRender(ui, {
    ...options,
    user: createMockUser(user),
    isAuthenticated: true,
  });
}

// Render with admin user
export function renderWithAdmin(
  ui: ReactElement,
  options: Omit<CustomRenderOptions, 'user'> = {}
) {
  return renderWithUser(ui, {
    roles: ['admin', 'user'],
    permissions: ['read', 'write', 'delete', 'admin'],
  }, options);
}

// Render with manager user
export function renderWithManager(
  ui: ReactElement,
  options: Omit<CustomRenderOptions, 'user'> = {}
) {
  return renderWithUser(ui, {
    roles: ['manager', 'user'],
    permissions: ['read', 'write', 'manage_cases'],
  }, options);
}

// Render with operator user
export function renderWithOperator(
  ui: ReactElement,
  options: Omit<CustomRenderOptions, 'user'> = {}
) {
  return renderWithUser(ui, {
    roles: ['operator', 'user'],
    permissions: ['read', 'write'],
  }, options);
}

// Render with viewer user
export function renderWithViewer(
  ui: ReactElement,
  options: Omit<CustomRenderOptions, 'user'> = {}
) {
  return renderWithUser(ui, {
    roles: ['viewer'],
    permissions: ['read'],
  }, options);
}

// Render without authentication
export function renderWithoutAuth(
  ui: ReactElement,
  options: Omit<CustomRenderOptions, 'user' | 'isAuthenticated'> = {}
) {
  return customRender(ui, {
    ...options,
    user: null,
    isAuthenticated: false,
  });
}

// Render with dark theme
export function renderWithDarkTheme(
  ui: ReactElement,
  options: Omit<CustomRenderOptions, 'theme'> = {}
) {
  return customRender(ui, {
    ...options,
    theme: 'dark',
  });
}

// Render with loading state
export function renderWithLoading(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  // Mock loading state by creating a loading wrapper
  const LoadingWrapper = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = React.useState(true);
    
    React.useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 100);
      return () => clearTimeout(timer);
    }, []);
    
    if (isLoading) {
      return <div data-testid="loading">Loading...</div>;
    }
    
    return <>{children}</>;
  };
  
  const TestWrapper = createTestWrapper(options);
  
  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper>
        <LoadingWrapper>{children}</LoadingWrapper>
      </TestWrapper>
    ),
  });
}

// Render with error state
export function renderWithError(
  ui: ReactElement,
  error: string,
  options: CustomRenderOptions = {}
) {
  const ErrorWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <div>
        <div data-testid="error" role="alert">
          {error}
        </div>
        {children}
      </div>
    );
  };
  
  const TestWrapper = createTestWrapper(options);
  
  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper>
        <ErrorWrapper>{children}</ErrorWrapper>
      </TestWrapper>
    ),
  });
}

// Export utilities
export * from '@testing-library/react';
export { createMockUser };
export { customRender as render };
