import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './label'
import { Input } from './input'

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'The label text content',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Email Address',
  },
}

export const WithInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="label-story-email">Email Address</Label>
      <Input id="label-story-email" type="email" placeholder="Enter your email" />
    </div>
  ),
}

export const WithPasswordInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="label-story-password">Password</Label>
      <Input id="label-story-password" type="password" placeholder="Enter your password" />
    </div>
  ),
}

export const WithDisabledInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="disabled-input">Disabled Field</Label>
      <Input id="disabled-input" disabled placeholder="This field is disabled" />
    </div>
  ),
}

export const RequiredField: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="required-field">
        Required Field <span className="text-red-500">*</span>
      </Label>
      <Input id="required-field" placeholder="This field is required" />
    </div>
  ),
}

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="space-y-2">
        <Label htmlFor="first-name">First Name</Label>
        <Input id="first-name" placeholder="Enter your first name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="last-name">Last Name</Label>
        <Input id="last-name" placeholder="Enter your last name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-form">Email</Label>
        <Input id="email-form" type="email" placeholder="Enter your email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" type="tel" placeholder="Enter your phone number" />
      </div>
    </div>
  ),
}
