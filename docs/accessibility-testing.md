# Accessibility Testing Guide

This guide provides comprehensive information about accessibility testing in the Fragrance Management System, including testing strategies, tools, and best practices.

## Table of Contents

- [Overview](#overview)
- [Testing Strategy](#testing-strategy)
- [Testing Tools](#testing-tools)
- [Testing Levels](#testing-levels)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

Our accessibility testing approach follows WCAG 2.1 AA standards and includes multiple layers of testing:

1. **Unit Tests** - Component-level accessibility testing
2. **Integration Tests** - Feature-level accessibility testing
3. **E2E Tests** - Full application accessibility testing
4. **Manual Testing** - Human verification and user testing

## Testing Strategy

### Automated Testing

We use a combination of tools to ensure comprehensive accessibility coverage:

- **axe-core** - Automated accessibility testing engine
- **@testing-library/jest-dom** - Custom accessibility matchers
- **@axe-core/playwright** - E2E accessibility testing
- **@axe-core/react** - React component testing

### Manual Testing

Manual testing is essential for catching issues that automated tools might miss:

- **Keyboard Navigation** - Test all functionality with keyboard only
- **Screen Reader Testing** - Verify with NVDA, JAWS, or VoiceOver
- **Color Contrast** - Verify contrast ratios meet WCAG standards
- **Focus Management** - Ensure logical focus order and visible indicators

## Testing Tools

### axe-core

The primary tool for automated accessibility testing:

```bash
# Install axe-core
npm install --save-dev axe-core @axe-core/react @axe-core/playwright

# Run accessibility tests
npm run test:a11y
```

### Custom Testing Utilities

Our custom testing utilities provide additional accessibility testing capabilities:

```typescript
import { renderWithAccessibility, expectAccessible } from '@/test-utils/helpers';

// Render component with accessibility context
const { container } = renderWithAccessibility(<MyComponent />);

// Check for accessibility violations
await expect(container).toHaveNoViolations();
```

### Playwright E2E Testing

End-to-end accessibility testing with Playwright:

```bash
# Run E2E accessibility tests
npm run test:e2e -- --grep "accessibility"
```

## Testing Levels

### 1. Component Level Testing

Test individual components for accessibility compliance:

```typescript
describe('Button Accessibility', () => {
  it('should be accessible', async () => {
    const { container } = renderWithAccessibility(<Button>Click me</Button>);
    await expect(container).toHaveNoViolations();
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button');
    await user.tab();
    expect(button).toHaveFocus();
  });
});
```

### 2. Feature Level Testing

Test complete features for accessibility:

```typescript
describe('Login Form Accessibility', () => {
  it('should be accessible', async () => {
    const { container } = renderWithAccessibility(<LoginForm />);
    await expect(container).toHaveNoViolations();
  });

  it('should announce validation errors', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
```

### 3. Page Level Testing

Test entire pages for accessibility:

```typescript
describe('Dashboard Page Accessibility', () => {
  it('should be accessible', async () => {
    const { container } = renderWithAccessibility(<DashboardPage />);
    await expect(container).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', () => {
    render(<DashboardPage />);
    
    const h1 = screen.getByRole('heading', { level: 1 });
    const h2s = screen.getAllByRole('heading', { level: 2 });
    
    expect(h1).toBeInTheDocument();
    expect(h2s.length).toBeGreaterThan(0);
  });
});
```

## Running Tests

### Unit Tests

```bash
# Run all accessibility unit tests
npm run test:a11y

# Run accessibility tests in watch mode
npm run test:a11y:watch

# Run specific accessibility test file
npm run test:a11y -- button.accessibility.test.tsx
```

### E2E Tests

```bash
# Run E2E accessibility tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed
```

### Accessibility Audit

```bash
# Run comprehensive accessibility audit
npm run audit:a11y
```

## Writing Tests

### Basic Accessibility Test

```typescript
import { renderWithAccessibility } from '@/test-utils/helpers';

describe('Component Accessibility', () => {
  it('should be accessible', async () => {
    const { container } = renderWithAccessibility(<MyComponent />);
    await expect(container).toHaveNoViolations();
  });
});
```

### Keyboard Navigation Test

```typescript
import userEvent from '@testing-library/user-event';

describe('Keyboard Navigation', () => {
  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    // Test tab navigation
    await user.tab();
    expect(document.activeElement).toHaveFocus();
    
    // Test enter key activation
    await user.keyboard('{Enter}');
    // Assert expected behavior
  });
});
```

### Screen Reader Test

```typescript
describe('Screen Reader Support', () => {
  it('should have proper ARIA attributes', () => {
    render(<MyComponent />);
    
    const element = screen.getByRole('button');
    expect(element).toHaveAttribute('aria-label');
    expect(element).toHaveAttribute('aria-describedby');
  });

  it('should announce state changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<MyComponent />);
    
    // Change state
    rerender(<MyComponent loading />);
    
    // Check for announcement
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});
```

### Focus Management Test

```typescript
describe('Focus Management', () => {
  it('should manage focus properly', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    const firstElement = screen.getByRole('button', { name: 'First' });
    const secondElement = screen.getByRole('button', { name: 'Second' });
    
    // Test focus order
    await user.tab();
    expect(firstElement).toHaveFocus();
    
    await user.tab();
    expect(secondElement).toHaveFocus();
  });
});
```

## Best Practices

### 1. Test Early and Often

- Write accessibility tests alongside feature tests
- Include accessibility tests in CI/CD pipeline
- Test components in isolation and in context

### 2. Use Semantic HTML

- Prefer semantic HTML elements over custom components
- Use proper heading hierarchy (h1, h2, h3, etc.)
- Use appropriate ARIA roles and attributes

### 3. Test with Real Users

- Include users with disabilities in testing
- Test with actual assistive technologies
- Gather feedback and iterate

### 4. Comprehensive Coverage

- Test all interactive elements
- Test all form inputs and validation
- Test all navigation and links
- Test all dynamic content updates

### 5. Performance Considerations

- Keep accessibility tests fast
- Use mocking for external dependencies
- Test in realistic scenarios

## Troubleshooting

### Common Issues

#### 1. Color Contrast Violations

```typescript
// Test color contrast
it('should have sufficient color contrast', async () => {
  const { container } = renderWithAccessibility(<MyComponent />);
  await expect(container).toHaveNoViolations();
});
```

#### 2. Missing ARIA Labels

```typescript
// Test for proper labeling
it('should have accessible name', () => {
  render(<MyComponent />);
  
  const element = screen.getByRole('button');
  expect(element).toHaveAccessibleName();
});
```

#### 3. Keyboard Navigation Issues

```typescript
// Test keyboard navigation
it('should be keyboard accessible', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);
  
  const element = screen.getByRole('button');
  await user.tab();
  expect(element).toHaveFocus();
});
```

#### 4. Focus Management Problems

```typescript
// Test focus management
it('should manage focus properly', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);
  
  // Test focus order
  const elements = screen.getAllByRole('button');
  for (const element of elements) {
    await user.tab();
    expect(element).toHaveFocus();
  }
});
```

### Debugging Tips

1. **Use Browser DevTools** - Check accessibility tree and ARIA attributes
2. **Test with Screen Readers** - Verify announcements and navigation
3. **Check Focus Indicators** - Ensure focus is visible and logical
4. **Validate HTML** - Use W3C validator to check markup
5. **Test Color Contrast** - Use tools like WebAIM contrast checker

### Getting Help

- Check the [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- Use [WebAIM Resources](https://webaim.org/)
- Consult [MDN Accessibility Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- Review [axe-core Documentation](https://github.com/dequelabs/axe-core)

## Continuous Improvement

Accessibility testing is an ongoing process. Regularly:

1. **Update Testing Tools** - Keep axe-core and other tools current
2. **Review Test Coverage** - Ensure all components are tested
3. **Gather User Feedback** - Listen to users with disabilities
4. **Monitor Metrics** - Track accessibility violations over time
5. **Train Team Members** - Keep everyone informed about accessibility best practices

Remember: Accessibility is not a one-time task but an ongoing commitment to inclusive design.

