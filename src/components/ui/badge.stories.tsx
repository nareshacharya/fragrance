import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'info'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Badge',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
}

export const PerfumeStatus: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Status:</span>
        <Badge variant="success">Approved</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Status:</span>
        <Badge variant="warning">In Review</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Status:</span>
        <Badge variant="info">In Production</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Status:</span>
        <Badge variant="destructive">Discontinued</Badge>
      </div>
    </div>
  ),
}

export const ProjectStatus: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Project:</span>
        <Badge variant="info">Active</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Project:</span>
        <Badge variant="warning">On Hold</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Project:</span>
        <Badge variant="success">Completed</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Project:</span>
        <Badge variant="destructive">Cancelled</Badge>
      </div>
    </div>
  ),
}

export const UserRoles: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Role:</span>
        <Badge variant="default">Perfumer</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Role:</span>
        <Badge variant="secondary">Palette Manager</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Role:</span>
        <Badge variant="info">Project Manager</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Role:</span>
        <Badge variant="warning">Lab Manager</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Role:</span>
        <Badge variant="outline">Administrator</Badge>
      </div>
    </div>
  ),
}

export const IngredientTags: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">Essential Oil</Badge>
        <Badge variant="outline">Synthetic</Badge>
        <Badge variant="outline">Natural Extract</Badge>
        <Badge variant="outline">Fixative</Badge>
        <Badge variant="outline">Solvent</Badge>
        <Badge variant="outline">Additive</Badge>
      </div>
    </div>
  ),
}

export const PriorityLevels: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Priority:</span>
        <Badge variant="success">Low</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Priority:</span>
        <Badge variant="warning">Medium</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Priority:</span>
        <Badge variant="destructive">High</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Priority:</span>
        <Badge variant="destructive">Critical</Badge>
      </div>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">
        <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Approved
      </Badge>
      <Badge variant="warning">
        <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Warning
      </Badge>
      <Badge variant="info">
        <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Info
      </Badge>
    </div>
  ),
}
