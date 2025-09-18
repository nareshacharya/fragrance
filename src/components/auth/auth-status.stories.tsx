import type { Meta, StoryObj } from '@storybook/react'
import { AuthStatus, CompactAuthStatus, DetailedAuthStatus, AuthStatusBadge, SessionTimer, UserRoleIndicator } from './auth-status'

const meta: Meta<typeof AuthStatus> = {
  title: 'Components/Auth/AuthStatus',
  component: AuthStatus,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Authentication status component that shows login/logout status, user information, and session details.',
      },
    },
  },
  argTypes: {
    showUserInfo: { control: 'boolean' },
    showRole: { control: 'boolean' },
    showPermissions: { control: 'boolean' },
    showSessionInfo: { control: 'boolean' },
    className: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof AuthStatus>

export const Default: Story = {
  args: {
    showUserInfo: true,
    showRole: true,
    showPermissions: false,
    showSessionInfo: true,
  },
}

export const WithoutUserInfo: Story = {
  args: {
    showUserInfo: false,
    showRole: true,
    showPermissions: false,
    showSessionInfo: true,
  },
}

export const WithoutRole: Story = {
  args: {
    showUserInfo: true,
    showRole: false,
    showPermissions: false,
    showSessionInfo: true,
  },
}

export const WithPermissions: Story = {
  args: {
    showUserInfo: true,
    showRole: true,
    showPermissions: true,
    showSessionInfo: true,
  },
}

export const WithoutSessionInfo: Story = {
  args: {
    showUserInfo: true,
    showRole: true,
    showPermissions: false,
    showSessionInfo: false,
  },
}

export const Compact: Story = {
  render: (args) => <CompactAuthStatus {...args} />,
  args: {},
}

export const Detailed: Story = {
  render: (args) => <DetailedAuthStatus {...args} />,
  args: {},
}

export const Badge: Story = {
  render: () => <AuthStatusBadge />,
  parameters: {
    docs: {
      description: {
        story: 'A simple badge component that shows authentication status.',
      },
    },
  },
}

export const SessionTimer: Story = {
  render: () => <SessionTimer />,
  parameters: {
    docs: {
      description: {
        story: 'A component that displays session time remaining with expiry warnings.',
      },
    },
  },
}

export const RoleIndicator: Story = {
  render: () => <UserRoleIndicator />,
  parameters: {
    docs: {
      description: {
        story: 'A component that displays the current user role with color coding.',
      },
    },
  },
}
