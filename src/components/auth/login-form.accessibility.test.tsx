import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './login-form';
import { renderWithAccessibility } from '../../lib/accessibility/testing';

// Mock the auth hook
jest.mock('../../lib/auth', () => ({
  useAuth: () => ({
    login: jest.fn(),
    authState: { isLoading: false, error: null }
  }),
  validateCredentials: (data: any) => ({
    isValid: data.email && data.password,
    errors: data.email && data.password ? {} : { email: 'Email is required', password: 'Password is required' }
  }),
  createCommonAuthErrors: jest.fn()
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

describe('LoginForm Accessibility', () => {
  it('should be accessible', async () => {
    const { container } = renderWithAccessibility(<LoginForm />);
    
    await expect(container).toHaveNoViolations();
  });

  it('should have proper form structure', () => {
    render(<LoginForm />);

    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('aria-labelledby', 'login-form-title');
    expect(form).toHaveAttribute('noValidate');
  });

  it('should have proper heading structure', () => {
    render(<LoginForm />);

    const heading = screen.getByRole('heading', { name: 'Sign In' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute('id', 'login-form-title');
  });

  it('should have properly labeled form fields', () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should announce validation errors', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Submit form without filling fields
    await user.click(submitButton);

    // Check that error messages are announced
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('should announce form submission status', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Fill form with valid data
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    // Submit form
    await user.click(submitButton);

    // Check that loading state is announced
    await waitFor(() => {
      expect(screen.getByText('Signing In...')).toBeInTheDocument();
    });
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Test tab navigation
    await user.tab();
    expect(emailInput).toHaveFocus();

    await user.tab();
    expect(passwordInput).toHaveFocus();

    await user.tab();
    expect(submitButton).toHaveFocus();
  });

  it('should handle password visibility toggle', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    expect(passwordInput).toHaveAttribute('type', 'password');

    // Toggle password visibility
    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');
    expect(toggleButton).toHaveAttribute('aria-label', 'Hide password');
  });

  it('should have proper error handling', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Fill form with invalid data
    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'short');
    
    // Submit form
    await user.click(submitButton);

    // Check that error messages are displayed
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('should work with screen readers', async () => {
    const { container } = renderWithAccessibility(<LoginForm />);
    
    await expect(container).toHaveNoViolations();
  });

  it('should handle required field indicators', () => {
    render(<LoginForm />);

    const emailLabel = screen.getByText('Email Address');
    const passwordLabel = screen.getByText('Password');

    // Check for required indicators
    expect(emailLabel).toHaveTextContent('*');
    expect(passwordLabel).toHaveTextContent('*');
  });

  it('should support auto-complete attributes', () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');

    expect(emailInput).toHaveAttribute('autoComplete', 'email');
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
  });

  it('should handle remember me checkbox', () => {
    render(<LoginForm showRememberMe={true} />);

    const checkbox = screen.getByRole('checkbox', { name: /remember me/i });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });

  it('should handle account lockout', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Simulate multiple failed attempts
    for (let i = 0; i < 3; i++) {
      await user.type(emailInput, 'wrong@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);
      
      // Clear inputs for next attempt
      await user.clear(emailInput);
      await user.clear(passwordInput);
    }

    // Check that account is locked
    await waitFor(() => {
      expect(screen.getByText('Account Locked')).toBeInTheDocument();
    });
  });

  it('should have proper focus management', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email Address');
    
    // Check that email input has autoFocus
    expect(emailInput).toHaveFocus();
  });
});
