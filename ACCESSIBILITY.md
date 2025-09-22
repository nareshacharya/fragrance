# Accessibility Guide

This document provides comprehensive guidelines for implementing and maintaining accessibility features in the Fragrance Management System, ensuring WCAG 2.1 AA compliance.

## Table of Contents

1. [Overview](#overview)
2. [WCAG 2.1 AA Compliance](#wcag-21-aa-compliance)
3. [Accessibility Infrastructure](#accessibility-infrastructure)
4. [Component Guidelines](#component-guidelines)
5. [Testing Procedures](#testing-procedures)
6. [Development Best Practices](#development-best-practices)
7. [Common Patterns](#common-patterns)
8. [Troubleshooting](#troubleshooting)

## Overview

The Fragrance Management System is designed to be fully accessible to users with disabilities, following Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. This includes support for:

- Screen readers and assistive technologies
- Keyboard navigation
- High contrast and reduced motion preferences
- Focus management
- ARIA attributes and semantic HTML
- Color contrast compliance

## WCAG 2.1 AA Compliance

### Perceivable
- **Text Alternatives**: All images, icons, and visual elements have appropriate alt text
- **Captions**: Video content includes captions
- **Adaptable**: Content can be presented in different ways without losing information
- **Distinguishable**: Users can see and hear content, including proper color contrast

### Operable
- **Keyboard Accessible**: All functionality is available from a keyboard
- **No Seizures**: Content does not cause seizures or physical reactions
- **Navigable**: Users can navigate, find content, and determine where they are
- **Input Modalities**: Users can interact with the interface using various input methods

### Understandable
- **Readable**: Text content is readable and understandable
- **Predictable**: Web pages appear and operate in predictable ways
- **Input Assistance**: Users are helped to avoid and correct mistakes

### Robust
- **Compatible**: Content is compatible with current and future user agents
- **Assistive Technologies**: Works with assistive technologies

## Accessibility Infrastructure

### Core Utilities

The accessibility system is built on several core utilities:

#### 1. Focus Management (`/src/lib/accessibility/focus-management.ts`)
- Focus trapping for modals and dropdowns
- Focus restoration
- Focus cycling and navigation
- Escape key handling

```typescript
import { createFocusTrap } from '@/lib/accessibility/focus-management';

const focusManager = createFocusTrap(element, {
  trapFocus: true,
  restoreFocus: true,
  initialFocus: () => firstButton
});
```

#### 2. Screen Reader Support (`/src/lib/accessibility/screen-reader.ts`)
- Live regions for dynamic content
- Announcement queue management
- Priority-based announcements
- Context-aware messaging

```typescript
import { announce, createLiveRegion } from '@/lib/accessibility/screen-reader';

// Announce a message
announce('Form submitted successfully', { priority: 'polite' });

// Create a live region for dynamic updates
const liveRegion = createLiveRegion({ priority: 'assertive' });
```

#### 3. Keyboard Navigation (`/src/lib/accessibility/keyboard-navigation.ts`)
- Arrow key navigation
- Custom keyboard shortcuts
- Tab order management
- Escape key handling

```typescript
import { createKeyboardNavigation } from '@/lib/accessibility/keyboard-navigation';

const cleanup = createKeyboardNavigation(element, {
  handleArrows: true,
  handleEscape: true,
  customHandlers: [
    { key: 'Enter', handler: handleSubmit }
  ]
});
```

#### 4. Testing Utilities (`/src/lib/accessibility/testing.ts`)
- Automated accessibility testing with axe-core
- Keyboard navigation testing
- Screen reader simulation
- Focus management validation

```typescript
import { renderWithAccessibility, testKeyboardNavigation } from '@/lib/accessibility/testing';

const { container, checkA11y, testKeyboardNavigation } = renderWithAccessibility(<Component />);

// Test accessibility compliance
await checkA11y();

// Test keyboard navigation
await testKeyboardNavigation({ testTab: true, testEnter: true });
```

### React Hooks

#### useAnnouncement
Manages screen reader announcements with priority and queuing.

```typescript
import { useAnnouncement } from '@/lib/accessibility';

function MyComponent() {
  const { announce, announceError, announceSuccess } = useAnnouncement();
  
  const handleSubmit = () => {
    announceSuccess('Form submitted successfully');
  };
  
  const handleError = () => {
    announceError('Please fix the errors and try again');
  };
}
```

#### useFocusTrap
Manages focus trapping for modals and dropdowns.

```typescript
import { useFocusTrap } from '@/lib/accessibility';

function Modal({ isOpen, onClose }) {
  const { containerRef, activate, deactivate } = useFocusTrap({
    restoreFocus: true
  });
  
  useEffect(() => {
    if (isOpen) {
      activate();
    } else {
      deactivate();
    }
  }, [isOpen, activate, deactivate]);
  
  return (
    <div ref={containerRef}>
      {/* Modal content */}
    </div>
  );
}
```

#### useKeyboardNavigation
Handles keyboard navigation for interactive elements.

```typescript
import { useKeyboardNavigation } from '@/lib/accessibility';

function Menu() {
  const { containerRef } = useKeyboardNavigation({
    handleArrows: true,
    handleEscape: true,
    customHandlers: [
      { key: 'Enter', handler: selectItem },
      { key: ' ', handler: selectItem }
    ]
  });
  
  return (
    <ul ref={containerRef}>
      {/* Menu items */}
    </ul>
  );
}
```

## Component Guidelines

### Button Component

The Button component includes comprehensive accessibility features:

```typescript
<Button
  ariaLabel="Submit form"
  pressed={isPressed}
  expanded={isExpanded}
  announceLoading={true}
  announceState={true}
  onActivate={handleSubmit}
>
  Submit
</Button>
```

**Key Features:**
- ARIA attributes for state management
- Loading state announcements
- Keyboard activation (Enter/Space)
- Focus indicators
- Screen reader support

### Input Component

The Input component provides accessible form controls:

```typescript
<Input
  ariaLabel="Email address"
  required={true}
  errorText={error}
  helperText="Enter your email address"
  announceErrors={true}
  announceSuccess={true}
/>
```

**Key Features:**
- Proper labeling and descriptions
- Error announcements
- Required field indicators
- Validation feedback
- ARIA invalid states

### Modal Component

The Modal component includes focus management and screen reader support:

```typescript
<ModalFocusTrap
  open={isOpen}
  title="Confirm Action"
  onClose={handleClose}
>
  <ModalContent>
    {/* Modal content */}
  </ModalContent>
</ModalFocusTrap>
```

**Key Features:**
- Focus trapping
- Escape key handling
- Screen reader announcements
- Focus restoration
- ARIA modal attributes

### Skip Navigation

Skip navigation allows keyboard users to bypass repetitive content:

```typescript
<SkipNav
  links={[
    { id: 'main-content', label: 'Skip to main content' },
    { id: 'navigation', label: 'Skip to navigation' },
    { id: 'search', label: 'Skip to search' }
  ]}
/>
```

## Testing Procedures

### Automated Testing

#### 1. Unit Tests with Accessibility
```typescript
import { renderWithAccessibility } from '@/lib/accessibility/testing';

test('Button is accessible', async () => {
  const { checkA11y } = renderWithAccessibility(<Button>Click me</Button>);
  await checkA11y();
});
```

#### 2. Keyboard Navigation Tests
```typescript
test('Button responds to keyboard', async () => {
  const { testKeyboardNavigation } = renderWithAccessibility(<Button>Click me</Button>);
  await testKeyboardNavigation({ testEnter: true, testSpace: true });
});
```

#### 3. Screen Reader Tests
```typescript
test('Button announces loading state', async () => {
  const { testScreenReader } = renderWithAccessibility(<Button loading>Loading...</Button>);
  await testScreenReader({ testAriaLabels: true });
});
```

### Manual Testing

#### 1. Keyboard Navigation
- Tab through all interactive elements
- Use Enter and Space to activate buttons
- Use Arrow keys for menu navigation
- Use Escape to close modals and dropdowns

#### 2. Screen Reader Testing
- Test with NVDA (Windows)
- Test with JAWS (Windows)
- Test with VoiceOver (macOS)
- Test with Orca (Linux)

#### 3. Visual Testing
- Test with high contrast mode
- Test with reduced motion preferences
- Test with browser zoom up to 200%
- Test with different color schemes

### E2E Testing with Playwright

```typescript
import { test, expect } from '@playwright/test';

test('page is accessible', async ({ page }) => {
  await page.goto('/');
  
  // Run axe-core accessibility tests
  const results = await page.evaluate(() => {
    return new Promise((resolve) => {
      axe.run(document.body, {}, (err, results) => {
        resolve(results);
      });
    });
  });
  
  expect(results.violations).toHaveLength(0);
});
```

## Development Best Practices

### 1. Semantic HTML
Always use semantic HTML elements:

```html
<!-- Good -->
<button>Submit</button>
<nav>Navigation</nav>
<main>Main content</main>

<!-- Avoid -->
<div onclick="submit()">Submit</div>
<div>Navigation</div>
<div>Main content</div>
```

### 2. ARIA Attributes
Use ARIA attributes appropriately:

```html
<!-- Good -->
<button aria-pressed="false" aria-expanded="false">Menu</button>
<input aria-required="true" aria-invalid="false" aria-describedby="help-text" />

<!-- Avoid -->
<button aria-label="Click this button to submit the form">Submit</button>
<!-- Use visible text instead when possible -->
```

### 3. Focus Management
Ensure proper focus management:

```typescript
// Good - Focus management in modals
useEffect(() => {
  if (isOpen) {
    const firstButton = modalRef.current?.querySelector('button');
    firstButton?.focus();
  }
}, [isOpen]);

// Good - Focus restoration
const previousFocus = useRef<HTMLElement>();
useEffect(() => {
  if (isOpen) {
    previousFocus.current = document.activeElement as HTMLElement;
  } else {
    previousFocus.current?.focus();
  }
}, [isOpen]);
```

### 4. Color Contrast
Ensure sufficient color contrast:

```css
/* Good - 4.5:1 contrast ratio */
.button {
  background-color: #2563eb; /* Blue */
  color: #ffffff; /* White */
}

/* Good - High contrast mode support */
@media (prefers-contrast: high) {
  .button {
    background-color: #000000;
    color: #ffffff;
    border: 2px solid #ffffff;
  }
}
```

### 5. Motion Preferences
Respect reduced motion preferences:

```css
/* Good - Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Common Patterns

### 1. Form Validation
```typescript
function FormField({ name, label, required, error, success }) {
  const { announceFieldError, announceFieldSuccess } = useAnnouncement();
  
  useEffect(() => {
    if (error) {
      announceFieldError(name, error);
    } else if (success) {
      announceFieldSuccess(name, success);
    }
  }, [error, success, name, announceFieldError, announceFieldSuccess]);
  
  return (
    <div>
      <label htmlFor={name} className={required ? 'required' : ''}>
        {label}
        {required && <span className="sr-only">Required</span>}
      </label>
      <input
        id={name}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : success ? `${name}-success` : undefined}
      />
      {error && (
        <div id={`${name}-error`} role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      {success && (
        <div id={`${name}-success`} role="status" aria-live="polite">
          {success}
        </div>
      )}
    </div>
  );
}
```

### 2. Modal Dialog
```typescript
function Modal({ isOpen, onClose, title, children }) {
  const { containerRef, activate, deactivate } = useFocusTrap({
    restoreFocus: true
  });
  
  useEffect(() => {
    if (isOpen) {
      activate();
      // Announce modal opening
      announce(`${title} dialog opened`, { priority: 'assertive' });
    } else {
      deactivate();
      // Announce modal closing
      announce(`${title} dialog closed`, { priority: 'assertive' });
    }
  }, [isOpen, title, activate, deactivate]);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={containerRef}
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}
```

### 3. Dropdown Menu
```typescript
function DropdownMenu({ isOpen, onClose, children }) {
  const { containerRef } = useKeyboardNavigation({
    handleArrows: true,
    handleEscape: true,
    customHandlers: [
      { key: 'Escape', handler: onClose }
    ]
  });
  
  return (
    <div
      ref={containerRef}
      role="menu"
      aria-expanded={isOpen}
      className={isOpen ? 'open' : 'closed'}
    >
      {isOpen && children}
    </div>
  );
}
```

## Troubleshooting

### Common Issues

#### 1. Focus Not Visible
**Problem**: Focus indicators are not visible or don't meet contrast requirements.

**Solution**:
```css
/* Ensure focus indicators meet WCAG requirements */
*:focus {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  *:focus {
    outline: 3px solid #ffffff;
    outline-offset: 2px;
  }
}
```

#### 2. Screen Reader Not Announcing Changes
**Problem**: Dynamic content changes are not announced to screen readers.

**Solution**:
```typescript
import { announce } from '@/lib/accessibility/screen-reader';

// Announce important changes
announce('Status updated to completed', { priority: 'assertive' });

// Use live regions for frequent updates
const liveRegion = createLiveRegion({ priority: 'polite' });
updateLiveRegion(liveRegion, 'Processing item 5 of 10');
```

#### 3. Keyboard Navigation Not Working
**Problem**: Interactive elements are not accessible via keyboard.

**Solution**:
```typescript
import { useKeyboardNavigation } from '@/lib/accessibility';

// Ensure keyboard navigation is set up
const { containerRef } = useKeyboardNavigation({
  handleEnter: true,
  handleSpace: true,
  handleArrows: true
});
```

#### 4. ARIA Attributes Missing
**Problem**: Components lack proper ARIA attributes.

**Solution**:
```typescript
// Use accessibility constants
import { ARIA_ATTRIBUTES } from '@/lib/accessibility/constants';

const ariaAttributes = {
  [ARIA_ATTRIBUTES.STATE_EXPANDED]: isExpanded.toString(),
  [ARIA_ATTRIBUTES.STATE_PRESSED]: isPressed.toString(),
  [ARIA_ATTRIBUTES.PROP_LABEL]: accessibleName
};
```

### Testing Tools

#### 1. Browser Extensions
- **axe DevTools**: Chrome/Firefox extension for accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Built-in accessibility auditing

#### 2. Screen Readers
- **NVDA**: Free screen reader for Windows
- **JAWS**: Commercial screen reader for Windows
- **VoiceOver**: Built-in screen reader for macOS/iOS
- **Orca**: Free screen reader for Linux

#### 3. Automated Testing
- **axe-core**: JavaScript accessibility testing library
- **jest-axe**: Jest integration for axe-core
- **@testing-library/jest-axe**: Additional Jest matchers

### Getting Help

For accessibility questions or issues:

1. Check the [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
2. Review the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
3. Test with actual assistive technologies
4. Consult with accessibility experts
5. Use the accessibility testing utilities in the codebase

## Conclusion

Accessibility is not just a compliance requirement—it's a fundamental aspect of creating inclusive software that works for everyone. By following these guidelines and using the provided utilities, you can ensure that the Fragrance Management System is accessible to all users, regardless of their abilities or the tools they use to interact with the system.

Remember to test early and often, involve users with disabilities in your testing process, and continuously improve the accessibility of your components and features.

