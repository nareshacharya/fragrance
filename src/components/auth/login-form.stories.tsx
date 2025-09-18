import type { Meta, StoryObj } from '@storybook/react'
import { LoginForm, CompactLoginForm } from './login-form'

const meta: Meta<typeof LoginForm> = {
  title: 'Components/Auth/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive login form component with validation, error handling, and authentication integration.',
      },
    },
  },
  argTypes: {
    onSuccess: { action: 'login-success' },
    onError: { action: 'login-error' },
    redirectTo: { control: 'text' },
    showRememberMe: { control: 'boolean' },
    className: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof LoginForm>

export const Default: Story = {
  args: {
    redirectTo: '/',
    showRememberMe: true,
  },
}

export const WithoutRememberMe: Story = {
  args: {
    redirectTo: '/',
    showRememberMe: false,
  },
}

export const WithCustomRedirect: Story = {
  args: {
    redirectTo: '/dashboard',
    showRememberMe: true,
  },
}

export const Compact: Story = {
  render: (args) => <CompactLoginForm {...args} />,
  args: {
    redirectTo: '/',
  },
}

export const WithError: Story = {
  args: {
    redirectTo: '/',
    showRememberMe: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates the login form with error handling. In a real scenario, errors would be displayed when authentication fails.',
      },
    },
  },
}

export const Loading: Story = {
  args: {
    redirectTo: '/',
    showRememberMe: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'This story shows the loading state of the login form during authentication.',
      },
    },
  },
}

export const Validation: Story = {
  args: {
    redirectTo: '/',
    showRememberMe: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates form validation with invalid email and password requirements.',
      },
    },
  },
}
