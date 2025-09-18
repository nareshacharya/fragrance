import type { Meta, StoryObj } from '@storybook/react'
import { UserProfile, CompactUserProfile, UserProfileSummary, EditableUserProfile } from './user-profile'

const meta: Meta<typeof UserProfile> = {
  title: 'Components/Auth/UserProfile',
  component: UserProfile,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive user profile component that displays user information, roles, permissions, and session details.',
      },
    },
  },
  argTypes: {
    user: { control: 'object' },
    showEditButton: { control: 'boolean' },
    showPermissions: { control: 'boolean' },
    showSessionInfo: { control: 'boolean' },
    className: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof UserProfile>

// Mock user data for stories
const mockUser = {
  id: '1',
  sub: '1',
  name: 'John Doe',
  email: 'john.doe@fragrance.com',
  preferredUsername: 'johndoe',
  givenName: 'John',
  familyName: 'Doe',
  roles: ['lab_manager'],
  groups: ['research-team'],
  displayName: 'John Doe',
  avatar: undefined,
  department: 'Research',
  permissions: [
    { id: 'perfumes:read', name: 'Read Perfumes', resource: 'perfumes', action: 'read' },
    { id: 'formulas:create', name: 'Create Formulas', resource: 'formulas', action: 'create' },
    { id: 'projects:manage', name: 'Manage Projects', resource: 'projects', action: 'manage' },
  ],
  lastLogin: new Date(),
  isActive: true,
}

const adminUser = {
  ...mockUser,
  name: 'Admin User',
  email: 'admin@fragrance.com',
  roles: ['administrator'],
  displayName: 'Admin User',
  department: 'Management',
  permissions: [
    { id: 'users:manage', name: 'Manage Users', resource: 'users', action: 'manage' },
    { id: 'system:admin', name: 'System Administration', resource: 'system', action: 'admin' },
    { id: 'perfumes:manage', name: 'Manage Perfumes', resource: 'perfumes', action: 'manage' },
  ],
}

export const Default: Story = {
  args: {
    user: mockUser,
    showEditButton: true,
    showPermissions: true,
    showSessionInfo: true,
  },
}

export const WithoutEditButton: Story = {
  args: {
    user: mockUser,
    showEditButton: false,
    showPermissions: true,
    showSessionInfo: true,
  },
}

export const WithoutPermissions: Story = {
  args: {
    user: mockUser,
    showEditButton: true,
    showPermissions: false,
    showSessionInfo: true,
  },
}

export const WithoutSessionInfo: Story = {
  args: {
    user: mockUser,
    showEditButton: true,
    showPermissions: true,
    showSessionInfo: false,
  },
}

export const AdminUser: Story = {
  args: {
    user: adminUser,
    showEditButton: true,
    showPermissions: true,
    showSessionInfo: true,
  },
}

export const Compact: Story = {
  render: (args) => <CompactUserProfile {...args} />,
  args: {
    user: mockUser,
  },
}

export const Summary: Story = {
  render: (args) => <UserProfileSummary {...args} />,
  args: {
    user: mockUser,
  },
}

export const Editable: Story = {
  render: (args) => <EditableUserProfile {...args} />,
  args: {
    user: mockUser,
  },
}

export const NoUser: Story = {
  args: {
    user: null,
    showEditButton: true,
    showPermissions: true,
    showSessionInfo: true,
  },
}
