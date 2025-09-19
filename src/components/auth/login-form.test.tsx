import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import { LoginForm } from './login-form';
import { fillInput, clickButton, expectError } from '@/test-utils';

// Mock the auth service
jest.mock('@/lib/auth/auth-service', () => ({
  authService: {
    authenticate: jest.fn(),
  },
}));

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('LoginForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders login form with all required elements', () => {
      render(<LoginForm />);
      
      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in|login/i })).toBeInTheDocument();
    });

    it('renders with proper form structure', () => {
      render(<LoginForm />);
      
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('renders with default placeholder text', () => {
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      expect(emailInput).toHaveAttribute('placeholder');
      expect(passwordInput).toHaveAttribute('placeholder');
    });
  });

  describe('Form Validation', () => {
    it('shows validation error for empty email', async () => {
      render(<LoginForm />);
      
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      submitButton.click();
      
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('shows validation error for empty password', async () => {
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/email/i);
      emailInput.focus();
      emailInput.blur();
      
      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('shows validation error for invalid email format', async () => {
      render(<LoginForm />);
      
      await fillInput('email', 'invalid-email');
      
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      submitButton.click();
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('shows validation error for short password', async () => {
      render(<LoginForm />);
      
      await fillInput('email', 'test@example.com');
      await fillInput('password', '123');
      
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      submitButton.click();
      
      await waitFor(() => {
        expect(screen.getByText(/password must be at least/i)).toBeInTheDocument();
      });
    });

    it('clears validation errors when user starts typing', async () => {
      render(<LoginForm />);
      
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      submitButton.click();
      
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
      
      await fillInput('email', 'test@example.com');
      
      await waitFor(() => {
        expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('submits form with valid credentials', async () => {
      const mockAuthenticate = require('@/lib/auth/auth-service').authService.authenticate;
      mockAuthenticate.mockResolvedValue({
        user: { id: '1', email: 'test@example.com' },
        token: { accessToken: 'token' },
      });

      render(<LoginForm />);
      
      await fillInput('email', 'test@example.com');
      await fillInput('password', 'password123');
      
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      submitButton.click();
      
      await waitFor(() => {
        expect(mockAuthenticate).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('shows loading state during submission', async () => {
      const mockAuthenticate = require('@/lib/auth/auth-service').authService.authenticate;
      mockAuthenticate.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(<LoginForm />);
      
      await fillInput('email', 'test@example.com');
      await fillInput('password', 'password123');
      
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      submitButton.click();
      
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent(/loading|signing in/i);
      });
    });

    it('handles authentication error', async () => {
      const mockAuthenticate = require('@/lib/auth/auth-service').authService.authenticate;
      mockAuthenticate.mockRejectedValue(new Error('Invalid credentials'));

      render(<LoginForm />);
      
      await fillInput('email', 'test@example.com');
      await fillInput('password', 'wrongpassword');
      
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      submitButton.click();
      
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('redirects to dashboard on successful login', async () => {
      const mockAuthenticate = require('@/lib/auth/auth-service').authService.authenticate;
      mockAuthenticate.mockResolvedValue({
        user: { id: '1', email: 'test@example.com' },
        token: { accessToken: 'token' },
      });

      render(<LoginForm />);
      
      await fillInput('email', 'test@example.com');
      await fillInput('password', 'password123');
      
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      submitButton.click();
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });
  });

  describe('User Interactions', () => {
    it('updates email input value', async () => {
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await fillInput('email', 'new@example.com');
      
      expect(emailInput).toHaveValue('new@example.com');
    });

    it('updates password input value', async () => {
      render(<LoginForm />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      await fillInput('password', 'newpassword');
      
      expect(passwordInput).toHaveValue('newpassword');
    });

    it('toggles password visibility', async () => {
      render(<LoginForm />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      const toggleButton = screen.getByRole('button', { name: /show password|hide password/i });
      
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      toggleButton.click();
      
      await waitFor(() => {
        expect(passwordInput).toHaveAttribute('type', 'text');
      });
      
      toggleButton.click();
      
      await waitFor(() => {
        expect(passwordInput).toHaveAttribute('type', 'password');
      });
    });

    it('submits form on Enter key press', async () => {
      const mockAuthenticate = require('@/lib/auth/auth-service').authService.authenticate;
      mockAuthenticate.mockResolvedValue({
        user: { id: '1', email: 'test@example.com' },
        token: { accessToken: 'token' },
      });

      render(<LoginForm />);
      
      await fillInput('email', 'test@example.com');
      await fillInput('password', 'password123');
      
      const passwordInput = screen.getByLabelText(/password/i);
      passwordInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      
      await waitFor(() => {
        expect(mockAuthenticate).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it('has proper form structure', () => {
      render(<LoginForm />);
      
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
      
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('supports keyboard navigation', () => {
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      
      emailInput.focus();
      expect(emailInput).toHaveFocus();
      
      emailInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
      expect(passwordInput).toHaveFocus();
      
      passwordInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
      expect(submitButton).toHaveFocus();
    });

    it('has proper error announcements', async () => {
      render(<LoginForm />);
      
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      submitButton.click();
      
      await waitFor(() => {
        const errorElement = screen.getByRole('alert');
        expect(errorElement).toBeInTheDocument();
      });
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(<LoginForm className="custom-form" />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveClass('custom-form');
    });

    it('applies custom onSubmit handler', async () => {
      const customOnSubmit = jest.fn();
      render(<LoginForm onSubmit={customOnSubmit} />);
      
      await fillInput('email', 'test@example.com');
      await fillInput('password', 'password123');
      
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      submitButton.click();
      
      await waitFor(() => {
        expect(customOnSubmit).toHaveBeenCalled();
      });
    });

    it('applies custom redirect path', async () => {
      const mockAuthenticate = require('@/lib/auth/auth-service').authService.authenticate;
      mockAuthenticate.mockResolvedValue({
        user: { id: '1', email: 'test@example.com' },
        token: { accessToken: 'token' },
      });

      render(<LoginForm redirectTo="/custom-path" />);
      
      await fillInput('email', 'test@example.com');
      await fillInput('password', 'password123');
      
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      submitButton.click();
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/custom-path');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles network timeout', async () => {
      const mockAuthenticate = require('@/lib/auth/auth-service').authService.authenticate;
      mockAuthenticate.mockRejectedValue(new Error('Network timeout'));

      render(<LoginForm />);
      
      await fillInput('email', 'test@example.com');
      await fillInput('password', 'password123');
      
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      submitButton.click();
      
      await waitFor(() => {
        expect(screen.getByText(/network timeout/i)).toBeInTheDocument();
      });
    });

    it('handles server error', async () => {
      const mockAuthenticate = require('@/lib/auth/auth-service').authService.authenticate;
      mockAuthenticate.mockRejectedValue(new Error('Server error'));

      render(<LoginForm />);
      
      await fillInput('email', 'test@example.com');
      await fillInput('password', 'password123');
      
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      submitButton.click();
      
      await waitFor(() => {
        expect(screen.getByText(/server error/i)).toBeInTheDocument();
      });
    });

    it('prevents multiple submissions', async () => {
      const mockAuthenticate = require('@/lib/auth/auth-service').authService.authenticate;
      mockAuthenticate.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

      render(<LoginForm />);
      
      await fillInput('email', 'test@example.com');
      await fillInput('password', 'password123');
      
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      submitButton.click();
      
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
      
      // Try to click again
      submitButton.click();
      
      await waitFor(() => {
        expect(mockAuthenticate).toHaveBeenCalledTimes(1);
      });
    });
  });
});
