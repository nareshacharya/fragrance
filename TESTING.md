# Testing Documentation

This document outlines the comprehensive testing strategy and infrastructure for the Fragrance Management System.

## Overview

Our testing strategy follows a pyramid approach with:
- **Unit Tests**: Fast, isolated tests for individual components and functions
- **Integration Tests**: Tests for component interactions and API integrations
- **End-to-End Tests**: Full user workflow tests using Playwright

## Testing Stack

- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing framework
- **MSW (Mock Service Worker)**: API mocking for tests
- **@testing-library/jest-dom**: Custom Jest matchers

## Project Structure

```
├── src/
│   ├── test-utils/           # Testing utilities and helpers
│   │   ├── render.tsx        # Custom render functions with providers
│   │   ├── mocks.ts          # Mock implementations
│   │   ├── factories.ts      # Test data factories
│   │   ├── helpers.ts        # Testing helper functions
│   │   ├── msw-handlers.ts   # MSW request handlers
│   │   └── index.ts          # Centralized exports
│   └── components/
│       └── **/*.test.tsx     # Component unit tests
├── e2e/                      # Playwright E2E tests
├── jest.config.js            # Jest configuration
├── jest.setup.js             # Jest setup file
└── playwright.config.ts     # Playwright configuration
```

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

### End-to-End Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed

# Debug E2E tests
npm run test:e2e:debug
```

### All Tests

```bash
# Run all tests (unit + E2E)
npm run test:all
```

## Writing Tests

### Unit Tests

#### Component Testing

```typescript
import { render, screen } from '@/test-utils';
import { Button } from './button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await clickButton('Click me');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Testing with Different User Roles

```typescript
import { renderWithAdmin, renderWithUser } from '@/test-utils';

describe('Admin Features', () => {
  it('shows admin controls for admin users', () => {
    renderWithAdmin(<AdminPanel />);
    expect(screen.getByText('Admin Controls')).toBeInTheDocument();
  });

  it('hides admin controls for regular users', () => {
    renderWithUser(<AdminPanel />);
    expect(screen.queryByText('Admin Controls')).not.toBeInTheDocument();
  });
});
```

#### API Service Testing

```typescript
import { createMockApiClient } from '@/test-utils';
import { IngredientService } from './ingredients';

describe('IngredientService', () => {
  it('fetches ingredients successfully', async () => {
    const mockClient = createMockApiClient();
    mockClient.get.mockResolvedValue({ data: mockIngredients });
    
    const service = new IngredientService(mockClient);
    const result = await service.getAll();
    
    expect(result).toEqual(mockIngredients);
    expect(mockClient.get).toHaveBeenCalledWith('/api/ingredients');
  });
});
```

### Integration Tests

```typescript
import { render, screen, server } from '@/test-utils';
import { http, HttpResponse } from 'msw';

describe('Ingredient List Integration', () => {
  it('loads and displays ingredients from API', async () => {
    server.use(
      http.get('/api/ingredients', () => {
        return HttpResponse.json({
          success: true,
          data: [{ id: '1', name: 'Test Ingredient' }]
        });
      })
    );

    render(<IngredientList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Ingredient')).toBeInTheDocument();
    });
  });
});
```

### End-to-End Tests

```typescript
import { test, expect } from '@playwright/test';

test.describe('Ingredient Management', () => {
  test('creates new ingredient', async ({ page }) => {
    await page.goto('/ingredients');
    await page.click('[data-testid="create-ingredient"]');
    
    await page.fill('[name="name"]', 'New Ingredient');
    await page.selectOption('[name="type"]', 'essential_oil');
    await page.click('button[type="submit"]');
    
    await expect(page.getByText('New Ingredient')).toBeVisible();
  });
});
```

## Test Utilities

### Custom Render Functions

- `render()`: Basic render with all providers
- `renderWithUser()`: Render with specific user role
- `renderWithAdmin()`: Render with admin user
- `renderWithoutAuth()`: Render without authentication
- `renderWithDarkTheme()`: Render with dark theme

### Helper Functions

- `clickButton(name)`: Click button by name
- `fillInput(label, value)`: Fill input field
- `selectOption(label, option)`: Select dropdown option
- `uploadFile(label, file)`: Upload file to input
- `waitForLoadingToFinish()`: Wait for loading states

### Test Data Factories

- `createUser(overrides)`: Create user test data
- `createIngredient(overrides)`: Create ingredient test data
- `createApiResponse(data)`: Create API response format
- `createPaginatedResponse(data)`: Create paginated response

### Mocks

- `createMockApiClient()`: Mock API client
- `createMockAuthService()`: Mock authentication service
- `createMockUser()`: Mock user object
- `setupGlobalMocks()`: Setup global mocks

## Testing Patterns

### Testing User Interactions

```typescript
it('handles form submission', async () => {
  const handleSubmit = jest.fn();
  render(<ContactForm onSubmit={handleSubmit} />);
  
  await fillInput('Name', 'John Doe');
  await fillInput('Email', 'john@example.com');
  await submitForm();
  
  expect(handleSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com'
  });
});
```

### Testing Async Operations

```typescript
it('displays loading state', async () => {
  render(<DataComponent />);
  
  expectLoading();
  
  await waitForLoadingToFinish();
  
  expectNotLoading();
  expect(screen.getByText('Data loaded')).toBeInTheDocument();
});
```

### Testing Error States

```typescript
it('displays error message on failure', async () => {
  server.use(
    http.get('/api/data', () => {
      return HttpResponse.json({ error: 'Server error' }, { status: 500 });
    })
  );

  render(<DataComponent />);
  
  await waitFor(() => {
    expectError('Failed to load data');
  });
});
```

### Testing Accessibility

```typescript
it('is accessible', async () => {
  const { container } = render(<MyComponent />);
  
  await checkAccessibility(container);
  await checkKeyboardNavigation(container.querySelectorAll('button'));
});
```

## Continuous Integration

Tests are automatically run in CI/CD pipeline:

1. **Pre-commit**: Unit tests and linting
2. **Pre-push**: Full test suite
3. **Pull Request**: All tests + coverage reports
4. **Deployment**: E2E tests in staging environment

## Coverage Requirements

- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

## Best Practices

### 1. Test Structure
- Use descriptive test names
- Group related tests with `describe` blocks
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Test Data
- Use factories for consistent test data
- Avoid hard-coded values
- Use meaningful test data

### 3. Mocking
- Mock external dependencies
- Use MSW for API mocking
- Keep mocks simple and focused

### 4. Assertions
- Use semantic queries (`getByRole`, `getByLabelText`)
- Test user behavior, not implementation
- Use accessible selectors

### 5. Async Testing
- Always await async operations
- Use `waitFor` for dynamic content
- Handle loading and error states

### 6. Cleanup
- Use proper cleanup in hooks
- Reset mocks between tests
- Clear side effects

## Debugging Tests

### Jest
```bash
# Debug with Node.js debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Run specific test file
npm test -- ComponentName.test.tsx

# Run with verbose output
npm test -- --verbose
```

### Playwright
```bash
# Run with browser visible
npm run test:e2e:headed

# Debug mode with pause
npm run test:e2e:debug

# View test report
npx playwright show-report
```

### React Testing Library
```typescript
// Debug rendered output
import { screen } from '@testing-library/react';
screen.debug(); // Prints current DOM

// Debug specific element
screen.debug(screen.getByRole('button'));
```

## Common Issues and Solutions

### 1. "act" Warnings
```typescript
// Wrap state updates in act()
import { act } from '@testing-library/react';

await act(async () => {
  await user.click(button);
});
```

### 2. Timing Issues
```typescript
// Use waitFor for dynamic content
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### 3. Mock Issues
```typescript
// Reset mocks between tests
afterEach(() => {
  jest.clearAllMocks();
});
```

### 4. Provider Issues
```typescript
// Use custom render with providers
import { render } from '@/test-utils'; // Not from RTL directly
```

## Resources

- [Jest Documentation](https://jestjs.io/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Playwright Documentation](https://playwright.dev/docs)
- [MSW Documentation](https://mswjs.io/docs)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
