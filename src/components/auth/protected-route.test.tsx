import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import { ProtectedRoute } from './protected-route';
import { renderWithUser, renderWithoutAuth } from '@/test-utils';

describe('ProtectedRoute Component', () => {
  describe('Authentication State', () => {
    it('renders children when user is authenticated', () => {
      renderWithUser(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { roles: ['user'] }
      );
      
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('shows loading state when authentication is loading', () => {
      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { isAuthenticated: false, isLoading: true }
      );
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('redirects to login when user is not authenticated', () => {
      const mockPush = jest.fn();
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({ push: mockPush }),
      }));

      renderWithoutAuth(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );
      
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('shows fallback component when user is not authenticated', () => {
      renderWithoutAuth(
        <ProtectedRoute fallback={<div>Please log in</div>}>
          <div>Protected Content</div>
        </ProtectedRoute>
      );
      
      expect(screen.getByText('Please log in')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Role-based Access', () => {
    it('renders children when user has required role', () => {
      renderWithUser(
        <ProtectedRoute requiredRole="admin">
          <div>Admin Content</div>
        </ProtectedRoute>,
        { roles: ['admin', 'user'] }
      );
      
      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('shows access denied when user lacks required role', () => {
      renderWithUser(
        <ProtectedRoute requiredRole="admin">
          <div>Admin Content</div>
        </ProtectedRoute>,
        { roles: ['user'] }
      );
      
      expect(screen.getByText(/access denied|insufficient permissions/i)).toBeInTheDocument();
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });

    it('renders children when user has any of the required roles', () => {
      renderWithUser(
        <ProtectedRoute requiredRoles={['admin', 'manager']}>
          <div>Manager Content</div>
        </ProtectedRoute>,
        { roles: ['manager'] }
      );
      
      expect(screen.getByText('Manager Content')).toBeInTheDocument();
    });

    it('shows access denied when user has none of the required roles', () => {
      renderWithUser(
        <ProtectedRoute requiredRoles={['admin', 'manager']}>
          <div>Manager Content</div>
        </ProtectedRoute>,
        { roles: ['user'] }
      );
      
      expect(screen.getByText(/access denied|insufficient permissions/i)).toBeInTheDocument();
      expect(screen.queryByText('Manager Content')).not.toBeInTheDocument();
    });

    it('renders children when user has all required roles', () => {
      renderWithUser(
        <ProtectedRoute requiredRoles={['admin', 'user']} requireAll>
          <div>Admin User Content</div>
        </ProtectedRoute>,
        { roles: ['admin', 'user'] }
      );
      
      expect(screen.getByText('Admin User Content')).toBeInTheDocument();
    });

    it('shows access denied when user lacks any required role', () => {
      renderWithUser(
        <ProtectedRoute requiredRoles={['admin', 'user']} requireAll>
          <div>Admin User Content</div>
        </ProtectedRoute>,
        { roles: ['admin'] }
      );
      
      expect(screen.getByText(/access denied|insufficient permissions/i)).toBeInTheDocument();
      expect(screen.queryByText('Admin User Content')).not.toBeInTheDocument();
    });
  });

  describe('Permission-based Access', () => {
    it('renders children when user has required permission', () => {
      renderWithUser(
        <ProtectedRoute requiredPermission="read">
          <div>Readable Content</div>
        </ProtectedRoute>,
        { permissions: ['read', 'write'] }
      );
      
      expect(screen.getByText('Readable Content')).toBeInTheDocument();
    });

    it('shows access denied when user lacks required permission', () => {
      renderWithUser(
        <ProtectedRoute requiredPermission="admin">
          <div>Admin Content</div>
        </ProtectedRoute>,
        { permissions: ['read', 'write'] }
      );
      
      expect(screen.getByText(/access denied|insufficient permissions/i)).toBeInTheDocument();
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });

    it('renders children when user has any of the required permissions', () => {
      renderWithUser(
        <ProtectedRoute requiredPermissions={['read', 'write']}>
          <div>Readable Content</div>
        </ProtectedRoute>,
        { permissions: ['read'] }
      );
      
      expect(screen.getByText('Readable Content')).toBeInTheDocument();
    });

    it('shows access denied when user has none of the required permissions', () => {
      renderWithUser(
        <ProtectedRoute requiredPermissions={['admin', 'delete']}>
          <div>Admin Content</div>
        </ProtectedRoute>,
        { permissions: ['read', 'write'] }
      );
      
      expect(screen.getByText(/access denied|insufficient permissions/i)).toBeInTheDocument();
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });
  });

  describe('Custom Access Control', () => {
    it('renders children when custom access function returns true', () => {
      const customAccess = jest.fn().mockReturnValue(true);
      
      renderWithUser(
        <ProtectedRoute customAccess={customAccess}>
          <div>Custom Content</div>
        </ProtectedRoute>,
        { roles: ['user'] }
      );
      
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
      expect(customAccess).toHaveBeenCalled();
    });

    it('shows access denied when custom access function returns false', () => {
      const customAccess = jest.fn().mockReturnValue(false);
      
      renderWithUser(
        <ProtectedRoute customAccess={customAccess}>
          <div>Custom Content</div>
        </ProtectedRoute>,
        { roles: ['user'] }
      );
      
      expect(screen.getByText(/access denied|insufficient permissions/i)).toBeInTheDocument();
      expect(screen.queryByText('Custom Content')).not.toBeInTheDocument();
      expect(customAccess).toHaveBeenCalled();
    });

    it('passes user and context to custom access function', () => {
      const customAccess = jest.fn().mockReturnValue(true);
      const user = { id: '1', roles: ['user'] };
      
      renderWithUser(
        <ProtectedRoute customAccess={customAccess}>
          <div>Custom Content</div>
        </ProtectedRoute>,
        user
      );
      
      expect(customAccess).toHaveBeenCalledWith(user, expect.any(Object));
    });
  });

  describe('Fallback Components', () => {
    it('shows custom fallback for authentication', () => {
      renderWithoutAuth(
        <ProtectedRoute fallback={<div>Custom Login Required</div>}>
          <div>Protected Content</div>
        </ProtectedRoute>
      );
      
      expect(screen.getByText('Custom Login Required')).toBeInTheDocument();
    });

    it('shows custom fallback for authorization', () => {
      renderWithUser(
        <ProtectedRoute 
          requiredRole="admin" 
          fallback={<div>Admin Access Required</div>}
        >
          <div>Admin Content</div>
        </ProtectedRoute>,
        { roles: ['user'] }
      );
      
      expect(screen.getByText('Admin Access Required')).toBeInTheDocument();
    });

    it('shows different fallbacks for different access failures', () => {
      renderWithUser(
        <ProtectedRoute 
          requiredRole="admin" 
          fallback={<div>Role Access Required</div>}
          permissionFallback={<div>Permission Access Required</div>}
        >
          <div>Admin Content</div>
        </ProtectedRoute>,
        { roles: ['user'] }
      );
      
      expect(screen.getByText('Role Access Required')).toBeInTheDocument();
    });
  });

  describe('Redirect Behavior', () => {
    it('redirects to login page by default', () => {
      const mockPush = jest.fn();
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({ push: mockPush }),
      }));

      renderWithoutAuth(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );
      
      // The redirect should happen automatically
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('redirects to custom login page', () => {
      const mockPush = jest.fn();
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({ push: mockPush }),
      }));

      renderWithoutAuth(
        <ProtectedRoute loginPath="/custom-login">
          <div>Protected Content</div>
        </ProtectedRoute>
      );
      
      expect(mockPush).toHaveBeenCalledWith('/custom-login');
    });

    it('redirects to custom unauthorized page', () => {
      const mockPush = jest.fn();
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({ push: mockPush }),
      }));

      renderWithUser(
        <ProtectedRoute 
          requiredRole="admin" 
          unauthorizedPath="/unauthorized"
        >
          <div>Admin Content</div>
        </ProtectedRoute>,
        { roles: ['user'] }
      );
      
      expect(mockPush).toHaveBeenCalledWith('/unauthorized');
    });
  });

  describe('Nested Protection', () => {
    it('handles nested protected routes', () => {
      renderWithUser(
        <ProtectedRoute requiredRole="user">
          <div>
            <ProtectedRoute requiredRole="admin">
              <div>Nested Admin Content</div>
            </ProtectedRoute>
          </div>
        </ProtectedRoute>,
        { roles: ['user'] }
      );
      
      expect(screen.getByText(/access denied|insufficient permissions/i)).toBeInTheDocument();
      expect(screen.queryByText('Nested Admin Content')).not.toBeInTheDocument();
    });

    it('allows nested routes when user has all required permissions', () => {
      renderWithUser(
        <ProtectedRoute requiredRole="user">
          <div>
            <ProtectedRoute requiredRole="admin">
              <div>Nested Admin Content</div>
            </ProtectedRoute>
          </div>
        </ProtectedRoute>,
        { roles: ['user', 'admin'] }
      );
      
      expect(screen.getByText('Nested Admin Content')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined user gracefully', () => {
      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { user: null, isAuthenticated: false }
      );
      
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('handles empty roles array', () => {
      renderWithUser(
        <ProtectedRoute requiredRoles={[]}>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { roles: [] }
      );
      
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('handles empty permissions array', () => {
      renderWithUser(
        <ProtectedRoute requiredPermissions={[]}>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { permissions: [] }
      );
      
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('handles multiple access requirements', () => {
      renderWithUser(
        <ProtectedRoute 
          requiredRole="user" 
          requiredPermission="read"
        >
          <div>Multi-protected Content</div>
        </ProtectedRoute>,
        { roles: ['user'], permissions: ['read'] }
      );
      
      expect(screen.getByText('Multi-protected Content')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('does not re-render unnecessarily', () => {
      const renderSpy = jest.fn();
      
      const TestComponent = () => {
        renderSpy();
        return <div>Protected Content</div>;
      };
      
      renderWithUser(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>,
        { roles: ['user'] }
      );
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('memoizes access checks', () => {
      const customAccess = jest.fn().mockReturnValue(true);
      
      const { rerender } = renderWithUser(
        <ProtectedRoute customAccess={customAccess}>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { roles: ['user'] }
      );
      
      expect(customAccess).toHaveBeenCalledTimes(1);
      
      rerender(
        <ProtectedRoute customAccess={customAccess}>
          <div>Protected Content</div>
        </ProtectedRoute>
      );
      
      // Should not call again if user hasn't changed
      expect(customAccess).toHaveBeenCalledTimes(1);
    });
  });
});
