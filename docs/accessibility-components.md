# Accessibility Components Guide

This guide documents the accessibility features and usage of components in the Fragrance Management System.

## Table of Contents

- [Overview](#overview)
- [Core Components](#core-components)
- [Form Components](#form-components)
- [Navigation Components](#navigation-components)
- [Layout Components](#layout-components)
- [Utility Components](#utility-components)
- [Accessibility Hooks](#accessibility-hooks)
- [Best Practices](#best-practices)

## Overview

All components in our system are built with accessibility in mind, following WCAG 2.1 AA standards. This guide covers the accessibility features of each component and how to use them properly.

## Core Components

### Button

The Button component provides comprehensive accessibility support for various interaction patterns.

#### Accessibility Features

- **Keyboard Navigation**: Supports Enter and Space key activation
- **Focus Management**: Visible focus indicators and proper focus order
- **ARIA Attributes**: Supports `aria-label`, `aria-describedby`, `aria-pressed`, `aria-expanded`, `aria-controls`
- **Loading States**: Announces loading state changes to screen readers
- **Disabled States**: Properly handles disabled state with `aria-disabled`

#### Usage Examples

```tsx
// Basic accessible button
<Button>Click me</Button>

// Button with custom label
<Button ariaLabel="Close dialog">×</Button>

// Button with description
<Button describedBy="button-help">Save</Button>
<div id="button-help">Saves your changes</div>

// Toggle button
<Button pressed={isExpanded} aria-expanded={isExpanded}>
  {isExpanded ? 'Collapse' : 'Expand'}
</Button>

// Loading button with announcement
<Button loading announceLoading>
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

#### ARIA Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `aria-label` | string | Custom accessible name |
| `aria-describedby` | string | ID of element describing the button |
| `aria-pressed` | boolean | For toggle buttons |
| `aria-expanded` | boolean | For expandable buttons |
| `aria-controls` | string | ID of controlled element |
| `aria-busy` | boolean | Set automatically when loading |

### Input

The Input component provides comprehensive form accessibility support.

#### Accessibility Features

- **Label Association**: Automatic association with labels
- **Error Announcements**: Announces validation errors to screen readers
- **Helper Text**: Supports helper text with `aria-describedby`
- **Required Fields**: Indicates required fields with `aria-required`
- **Invalid States**: Uses `aria-invalid` for validation errors
- **Auto-complete**: Supports `aria-autocomplete` for search inputs

#### Usage Examples

```tsx
// Basic accessible input
<Input label="Email" type="email" required />

// Input with helper text
<Input 
  label="Password" 
  type="password"
  helperText="Must be at least 8 characters"
/>

// Input with error
<Input 
  label="Email" 
  type="email"
  error="Please enter a valid email address"
  announceErrors
/>

// Search input with autocomplete
<Input 
  label="Search ingredients"
  type="search"
  aria-autocomplete="list"
  aria-activedescendant="search-result-1"
/>
```

#### ARIA Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `aria-label` | string | Custom accessible name |
| `aria-describedby` | string | ID of helper text or error message |
| `aria-required` | boolean | Set automatically when required |
| `aria-invalid` | boolean | Set automatically when error present |
| `aria-autocomplete` | string | For search inputs |

### Modal

The Modal component provides accessible dialog functionality with proper focus management.

#### Accessibility Features

- **Focus Trap**: Traps focus within the modal
- **Escape Key**: Closes modal with Escape key
- **Focus Restoration**: Restores focus to trigger element
- **ARIA Attributes**: Uses `role="dialog"`, `aria-modal="true"`
- **Backdrop Click**: Closes modal when clicking backdrop
- **Screen Reader**: Announces modal open/close

#### Usage Examples

```tsx
// Basic accessible modal
<Modal open={isOpen} onOpenChange={setIsOpen}>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Confirm Action</ModalTitle>
      <ModalDescription>
        Are you sure you want to delete this item?
      </ModalDescription>
    </ModalHeader>
    <ModalFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

// Modal with custom trigger
<Modal>
  <ModalTrigger asChild>
    <Button>Open Modal</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalTitle>Settings</ModalTitle>
    {/* Modal content */}
  </ModalContent>
</Modal>
```

#### ARIA Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `role` | string | Set to "dialog" |
| `aria-modal` | boolean | Set to true |
| `aria-labelledby` | string | ID of modal title |
| `aria-describedby` | string | ID of modal description |

## Form Components

### LoginForm

The LoginForm component demonstrates comprehensive form accessibility patterns.

#### Accessibility Features

- **Form Validation**: Announces validation errors and successes
- **Required Fields**: Indicates required fields clearly
- **Error Recovery**: Provides clear error messages and recovery actions
- **Keyboard Navigation**: Full keyboard support for form interaction
- **Screen Reader**: Announces form status changes

#### Usage Examples

```tsx
// Basic accessible login form
<LoginForm onSubmit={handleLogin} />

// Login form with custom options
<LoginForm 
  onSubmit={handleLogin}
  announceErrors={true}
  announceSuccess={true}
  announceRequired={true}
/>
```

#### Accessibility Features

- **Form Labels**: All inputs have associated labels
- **Error Announcements**: Validation errors are announced to screen readers
- **Success Feedback**: Success messages are announced
- **Required Indicators**: Required fields are clearly marked
- **Keyboard Navigation**: Full keyboard support

### Label

The Label component provides accessible form labels with proper associations.

#### Accessibility Features

- **Input Association**: Automatically associates with form inputs
- **Required Indicators**: Shows required field indicators
- **Error States**: Supports error styling and announcements

#### Usage Examples

```tsx
// Basic accessible label
<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" />

// Required field label
<Label htmlFor="password" required>Password</Label>
<Input id="password" type="password" required />

// Label with error
<Label htmlFor="username" error>Username</Label>
<Input id="username" error="Username is required" />
```

## Navigation Components

### Breadcrumb

The Breadcrumb component provides accessible navigation breadcrumbs.

#### Accessibility Features

- **Navigation Role**: Uses `role="navigation"`
- **ARIA Label**: Provides descriptive label for screen readers
- **Keyboard Navigation**: Supports keyboard navigation
- **Current Page**: Indicates current page with `aria-current="page"`

#### Usage Examples

```tsx
// Basic accessible breadcrumb
<Breadcrumb>
  <BreadcrumbItem>
    <BreadcrumbLink href="/">Home</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink href="/ingredients">Ingredients</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbPage>Vanilla</BreadcrumbPage>
  </BreadcrumbItem>
</Breadcrumb>
```

### SkipNav

The SkipNav component provides skip navigation links for keyboard users.

#### Accessibility Features

- **Skip Links**: Provides links to skip to main content
- **Keyboard Only**: Visible only when focused with keyboard
- **Screen Reader**: Announced to screen readers

#### Usage Examples

```tsx
// Basic skip navigation
<SkipNav />

// Skip navigation with custom links
<SkipNav>
  <SkipLink href="#main-content">Skip to main content</SkipLink>
  <SkipLink href="#navigation">Skip to navigation</SkipLink>
</SkipNav>
```

## Layout Components

### Card

The Card component provides accessible content containers.

#### Accessibility Features

- **Semantic Structure**: Uses proper semantic HTML
- **Focus Management**: Supports focus management when interactive
- **ARIA Attributes**: Supports various ARIA attributes

#### Usage Examples

```tsx
// Basic accessible card
<Card>
  <CardHeader>
    <CardTitle>Ingredient Details</CardTitle>
    <CardDescription>View and edit ingredient information</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
  <CardFooter>
    <Button>Edit</Button>
  </CardFooter>
</Card>

// Interactive card
<Card 
  role="button" 
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={handleKeyDown}
>
  <CardContent>
    <h3>Clickable Card</h3>
    <p>This card is interactive</p>
  </CardContent>
</Card>
```

## Utility Components

### ScreenReaderAnnouncement

The ScreenReaderAnnouncement component provides live region announcements.

#### Accessibility Features

- **Live Region**: Uses `aria-live` for announcements
- **Priority Levels**: Supports different priority levels
- **Screen Reader**: Announces messages to screen readers

#### Usage Examples

```tsx
// Basic announcement
<ScreenReaderAnnouncement message="Form submitted successfully" />

// Announcement with priority
<ScreenReaderAnnouncement 
  message="Error: Please check your input" 
  priority="assertive" 
/>

// Global announcement component
<ScreenReaderAnnouncement message="" />
```

## Accessibility Hooks

### useAnnouncement

Provides screen reader announcement functionality.

```tsx
const { announce, announceError, announceSuccess } = useAnnouncement();

// Announce custom message
announce('Operation completed successfully');

// Announce error
announceError('Please check your input');

// Announce success
announceSuccess('Form submitted successfully');
```

### useAccessibleForm

Provides accessible form management with validation and announcements.

```tsx
const {
  errors,
  successes,
  setFieldError,
  clearFieldError,
  announceFormStatus
} = useAccessibleForm({
  announceErrors: true,
  announceSuccess: true,
  announceRequired: true
});
```

### useModalKeyboardNavigation

Provides keyboard navigation for modal components.

```tsx
const { modalRef } = useModalKeyboardNavigation(() => {
  // Handle modal close
  setIsOpen(false);
});
```

### useFocusTrap

Provides focus trap functionality for modals and dropdowns.

```tsx
const { trapRef } = useFocusTrap({
  active: isOpen,
  returnFocus: true
});
```

## Best Practices

### 1. Semantic HTML

Always use semantic HTML elements:

```tsx
// Good: Use semantic elements
<button>Click me</button>
<input type="email" />
<label htmlFor="email">Email</label>

// Avoid: Non-semantic elements
<div onClick={handleClick}>Click me</div>
<div contentEditable />
```

### 2. ARIA Attributes

Use ARIA attributes to enhance accessibility:

```tsx
// Good: Use ARIA attributes appropriately
<button aria-label="Close dialog">×</button>
<input aria-describedby="email-help" />
<div id="email-help">Enter your email address</div>

// Avoid: Redundant ARIA attributes
<button role="button">Click me</button> // role is redundant
```

### 3. Focus Management

Ensure proper focus management:

```tsx
// Good: Manage focus properly
const handleModalClose = () => {
  setIsOpen(false);
  triggerRef.current?.focus(); // Restore focus
};

// Good: Use focus trap for modals
<Modal>
  <ModalContent ref={trapRef}>
    {/* Modal content */}
  </ModalContent>
</Modal>
```

### 4. Keyboard Navigation

Support keyboard navigation:

```tsx
// Good: Handle keyboard events
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
};

// Good: Use proper tab order
<Button tabIndex={0}>First</Button>
<Button tabIndex={0}>Second</Button>
```

### 5. Screen Reader Support

Provide screen reader support:

```tsx
// Good: Announce state changes
const { announce } = useAnnouncement();

const handleSubmit = async () => {
  try {
    await submitForm();
    announce('Form submitted successfully');
  } catch (error) {
    announce('Error: Please check your input');
  }
};

// Good: Use live regions for dynamic content
<ScreenReaderAnnouncement message={statusMessage} />
```

### 6. Color and Contrast

Ensure sufficient color contrast:

```tsx
// Good: Use high contrast colors
<Button className="bg-blue-600 text-white">Click me</Button>

// Good: Provide alternative indicators
<Button className="bg-blue-600 text-white border-2 border-blue-800">
  Click me
</Button>
```

### 7. Testing

Test accessibility thoroughly:

```tsx
// Good: Test accessibility
it('should be accessible', async () => {
  const { container } = renderWithAccessibility(<MyComponent />);
  await expect(container).toHaveNoViolations();
});

// Good: Test keyboard navigation
it('should support keyboard navigation', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);
  
  await user.tab();
  expect(document.activeElement).toHaveFocus();
});
```

## Common Patterns

### Form Validation

```tsx
const MyForm = () => {
  const { setFieldError, announceFormStatus } = useAccessibleForm();
  
  const handleSubmit = async (data) => {
    try {
      await submitForm(data);
      announceFormStatus('success', 'Form submitted successfully');
    } catch (error) {
      setFieldError('email', error.message);
      announceFormStatus('error', 'Please check your input');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input 
        label="Email"
        error={errors.email}
        announceErrors
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

### Modal with Focus Management

```tsx
const MyModal = ({ open, onClose }) => {
  const { modalRef } = useModalKeyboardNavigation(onClose);
  
  return (
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent ref={modalRef}>
        <ModalTitle>Confirm Action</ModalTitle>
        <ModalDescription>
          Are you sure you want to proceed?
        </ModalDescription>
        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
```

### Dynamic Content Announcements

```tsx
const MyComponent = () => {
  const { announce } = useAnnouncement();
  const [items, setItems] = useState([]);
  
  const addItem = (item) => {
    setItems(prev => [...prev, item]);
    announce(`Added ${item.name} to the list`);
  };
  
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      <Button onClick={() => addItem(newItem)}>
        Add Item
      </Button>
    </div>
  );
};
```

Remember: Accessibility is not optional - it's a fundamental requirement for inclusive design. Always test your components with real users and assistive technologies to ensure they work for everyone.

