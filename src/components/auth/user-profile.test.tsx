import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import { UserProfile } from './user-profile';
import { renderWithUser, renderWithoutAuth } from '@/test-utils';
import { fillInput, clickButton } from '@/test-utils';

// Mock the auth service
jest.mock('@/lib/auth/auth-service', () => ({
  authService: {
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
  },
}));

describe('UserProfile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders user profile with user information', () => {
      renderWithUser(
        <UserProfile />,
        {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          displayName: 'Test User',
        }
      );
      
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    it('renders profile form when edit mode is enabled', () => {
      renderWithUser(
        <UserProfile />,
        {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        }
      );
      
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      editButton.click();
      
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('shows loading state when user data is loading', () => {
      render(<UserProfile />, { isLoading: true });
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('shows error state when user is not authenticated', () => {
      renderWithoutAuth(<UserProfile />);
      
      expect(screen.getByText(/please log in/i)).toBeInTheDocument();
    });
  });

  describe('Profile Information Display', () => {
    it('displays user avatar or initials', () => {
      renderWithUser(
        <UserProfile />,
        {
          firstName: 'John',
          lastName: 'Doe',
        }
      );
      
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('displays user roles', () => {
      renderWithUser(
        <UserProfile />,
        {
          roles: ['admin', 'user'],
        }
      );
      
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('user')).toBeInTheDocument();
    });

    it('displays user permissions', () => {
      renderWithUser(
        <UserProfile />,
        {
          permissions: ['read', 'write', 'admin'],
        }
      );
      
      expect(screen.getByText('read')).toBeInTheDocument();
      expect(screen.getByText('write')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
    });

    it('displays last login information', () => {
      const lastLogin = new Date('2023-01-01T10:00:00Z');
      renderWithUser(
        <UserProfile />,
        {
          lastLogin,
        }
      );
      
      expect(screen.getByText(/last login/i)).toBeInTheDocument();
    });

    it('displays account creation date', () => {
      const createdAt = new Date('2022-01-01T10:00:00Z');
      renderWithUser(
        <UserProfile />,
        {
          createdAt,
        }
      );
      
      expect(screen.getByText(/member since/i)).toBeInTheDocument();
    });
  });

  describe('Profile Editing', () => {
    it('switches to edit mode when edit button is clicked', () => {
      renderWithUser(
        <UserProfile />,
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
        }
      );
      
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      editButton.click();
      
      expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
      expect(screen.getByDisplayValue('User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });

    it('updates profile information', async () => {
      const mockUpdateProfile = require('@/lib/auth/auth-service').authService.updateProfile;
      mockUpdateProfile.mockResolvedValue({
        id: '1',
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@example.com',
      });

      renderWithUser(
        <UserProfile />,
        {
          id: '1',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
        }
      );
      
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      editButton.click();
      
      await fillInput('first name', 'Updated');
      await fillInput('last name', 'Name');
      await fillInput('email', 'updated@example.com');
      
      const saveButton = screen.getByRole('button', { name: /save/i });
      saveButton.click();
      
      await waitFor(() => {
        expect(mockUpdateProfile).toHaveBeenCalledWith({
          firstName: 'Updated',
          lastName: 'Name',
          email: 'updated@example.com',
        });
      });
    });

    it('validates required fields', async () => {
      renderWithUser(
        <UserProfile />,
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
        }
      );
      
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      editButton.click();
      
      await fillInput('first name', '');
      await fillInput('last name', '');
      
      const saveButton = screen.getByRole('button', { name: /save/i });
      saveButton.click();
      
      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      });
    });

    it('validates email format', async () => {
      renderWithUser(
        <UserProfile />,
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
        }
      );
      
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      editButton.click();
      
      await fillInput('email', 'invalid-email');
      
      const saveButton = screen.getByRole('button', { name: /save/i });
      saveButton.click();
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('cancels editing and reverts changes', async () => {
      renderWithUser(
        <UserProfile />,
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
        }
      );
      
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      editButton.click();
      
      await fillInput('first name', 'Changed');
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      cancelButton.click();
      
      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.queryByDisplayValue('Changed')).not.toBeInTheDocument();
      });
    });

    it('shows loading state during profile update', async () => {
      const mockUpdateProfile = require('@/lib/auth/auth-service').authService.updateProfile;
      mockUpdateProfile.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      renderWithUser(
        <UserProfile />,
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
        }
      );
      
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      editButton.click();
      
      const saveButton = screen.getByRole('button', { name: /save/i });
      saveButton.click();
      
      await waitFor(() => {
        expect(saveButton).toBeDisabled();
        expect(saveButton).toHaveTextContent(/saving/i);
      });
    });
  });

  describe('Password Change', () => {
    it('opens password change form', () => {
      renderWithUser(<UserProfile />);
      
      const changePasswordButton = screen.getByRole('button', { name: /change password/i });
      changePasswordButton.click();
      
      expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });

    it('changes password successfully', async () => {
      const mockChangePassword = require('@/lib/auth/auth-service').authService.changePassword;
      mockChangePassword.mockResolvedValue({});

      renderWithUser(<UserProfile />);
      
      const changePasswordButton = screen.getByRole('button', { name: /change password/i });
      changePasswordButton.click();
      
      await fillInput('current password', 'oldpassword');
      await fillInput('new password', 'newpassword');
      await fillInput('confirm password', 'newpassword');
      
      const saveButton = screen.getByRole('button', { name: /change password/i });
      saveButton.click();
      
      await waitFor(() => {
        expect(mockChangePassword).toHaveBeenCalledWith({
          currentPassword: 'oldpassword',
          newPassword: 'newpassword',
          confirmPassword: 'newpassword',
        });
      });
    });

    it('validates password confirmation', async () => {
      renderWithUser(<UserProfile />);
      
      const changePasswordButton = screen.getByRole('button', { name: /change password/i });
      changePasswordButton.click();
      
      await fillInput('new password', 'newpassword');
      await fillInput('confirm password', 'differentpassword');
      
      const saveButton = screen.getByRole('button', { name: /change password/i });
      saveButton.click();
      
      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('validates password strength', async () => {
      renderWithUser(<UserProfile />);
      
      const changePasswordButton = screen.getByRole('button', { name: /change password/i });
      changePasswordButton.click();
      
      await fillInput('new password', '123');
      
      const saveButton = screen.getByRole('button', { name: /change password/i });
      saveButton.click();
      
      await waitFor(() => {
        expect(screen.getByText(/password must be at least/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles profile update error', async () => {
      const mockUpdateProfile = require('@/lib/auth/auth-service').authService.updateProfile;
      mockUpdateProfile.mockRejectedValue(new Error('Update failed'));

      renderWithUser(
        <UserProfile />,
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
        }
      );
      
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      editButton.click();
      
      const saveButton = screen.getByRole('button', { name: /save/i });
      saveButton.click();
      
      await waitFor(() => {
        expect(screen.getByText(/update failed/i)).toBeInTheDocument();
      });
    });

    it('handles password change error', async () => {
      const mockChangePassword = require('@/lib/auth/auth-service').authService.changePassword;
      mockChangePassword.mockRejectedValue(new Error('Password change failed'));

      renderWithUser(<UserProfile />);
      
      const changePasswordButton = screen.getByRole('button', { name: /change password/i });
      changePasswordButton.click();
      
      await fillInput('current password', 'oldpassword');
      await fillInput('new password', 'newpassword');
      await fillInput('confirm password', 'newpassword');
      
      const saveButton = screen.getByRole('button', { name: /change password/i });
      saveButton.click();
      
      await waitFor(() => {
        expect(screen.getByText(/password change failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      renderWithUser(
        <UserProfile />,
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
        }
      );
      
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      editButton.click();
      
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('has proper button labels', () => {
      renderWithUser(<UserProfile />);
      
      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      renderWithUser(<UserProfile />);
      
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      editButton.focus();
      expect(editButton).toHaveFocus();
      
      editButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
      const changePasswordButton = screen.getByRole('button', { name: /change password/i });
      expect(changePasswordButton).toHaveFocus();
    });

    it('announces form state changes', async () => {
      renderWithUser(<UserProfile />);
      
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      editButton.click();
      
      await waitFor(() => {
        const form = screen.getByRole('form');
        expect(form).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      renderWithUser(
        <UserProfile className="custom-profile" />,
        { firstName: 'Test', lastName: 'User' }
      );
      
      const profile = screen.getByText('Test User').closest('div');
      expect(profile).toHaveClass('custom-profile');
    });

    it('applies custom onProfileUpdate handler', async () => {
      const customOnUpdate = jest.fn();
      const mockUpdateProfile = require('@/lib/auth/auth-service').authService.updateProfile;
      mockUpdateProfile.mockResolvedValue({});

      renderWithUser(
        <UserProfile onProfileUpdate={customOnUpdate} />,
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
        }
      );
      
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      editButton.click();
      
      const saveButton = screen.getByRole('button', { name: /save/i });
      saveButton.click();
      
      await waitFor(() => {
        expect(customOnUpdate).toHaveBeenCalled();
      });
    });

    it('applies custom onPasswordChange handler', async () => {
      const customOnPasswordChange = jest.fn();
      const mockChangePassword = require('@/lib/auth/auth-service').authService.changePassword;
      mockChangePassword.mockResolvedValue({});

      renderWithUser(
        <UserProfile onPasswordChange={customOnPasswordChange} />
      );
      
      const changePasswordButton = screen.getByRole('button', { name: /change password/i });
      changePasswordButton.click();
      
      await fillInput('current password', 'oldpassword');
      await fillInput('new password', 'newpassword');
      await fillInput('confirm password', 'newpassword');
      
      const saveButton = screen.getByRole('button', { name: /change password/i });
      saveButton.click();
      
      await waitFor(() => {
        expect(customOnPasswordChange).toHaveBeenCalled();
      });
    });
  });
});
