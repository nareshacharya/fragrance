import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Input } from './input'
import { Label } from './label'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'error', 'success'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    error: {
      control: { type: 'boolean' },
    },
    success: {
      control: { type: 'boolean' },
    },
  },
  args: {
    onChange: fn(),
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="input-story-email">Email</Label>
      <Input id="input-story-email" type="email" placeholder="Enter your email" />
    </div>
  ),
}

export const WithHelperText: Story = {
  args: {
    placeholder: 'Enter your email',
    helperText: 'We will never share your email with anyone else.',
  },
}

export const WithError: Story = {
  args: {
    placeholder: 'Enter your email',
    error: true,
    errorText: 'Please enter a valid email address.',
  },
}

export const WithSuccess: Story = {
  args: {
    placeholder: 'Enter your email',
    success: true,
    successText: 'Email address is valid.',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
}

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter number',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input',
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div>
        <Label htmlFor="default">Default</Label>
        <Input id="default" placeholder="Default input" />
      </div>
      <div>
        <Label htmlFor="error">Error</Label>
        <Input id="error" placeholder="Error input" error errorText="This field is required." />
      </div>
      <div>
        <Label htmlFor="success">Success</Label>
        <Input id="success" placeholder="Success input" success successText="Looks good!" />
      </div>
      <div>
        <Label htmlFor="disabled">Disabled</Label>
        <Input id="disabled" placeholder="Disabled input" disabled />
      </div>
    </div>
  ),
}

export const FormExample: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="Enter your full name" />
      </div>
      <div>
        <Label htmlFor="form-story-email">Email Address</Label>
        <Input id="form-story-email" type="email" placeholder="Enter your email" />
      </div>
      <div>
        <Label htmlFor="form-story-password">Password</Label>
        <Input id="form-story-password" type="password" placeholder="Enter your password" />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" type="tel" placeholder="Enter your phone number" />
      </div>
    </div>
  ),
}
