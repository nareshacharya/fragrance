/**
 * Storybook stories for the case status component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { 
  CaseStatus, 
  CaseStatusBadge, 
  CaseStatusIndicator, 
  CaseStatusList, 
  CaseStatusProgress 
} from './case-status'
import { CASE_STATUS } from '@/config/constants'

const meta: Meta<typeof CaseStatus> = {
  title: 'Case Management/CaseStatus',
  component: CaseStatus,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: { type: 'select' },
      options: Object.values(CASE_STATUS),
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['badge', 'pill', 'square', 'outline', 'solid', 'subtle'],
    },
    showIcon: {
      control: { type: 'boolean' },
    },
    showLabel: {
      control: { type: 'boolean' },
    },
    showPulse: {
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Open status
export const Open: Story = {
  args: {
    status: CASE_STATUS.OPEN,
  },
}

// In Progress status
export const InProgress: Story = {
  args: {
    status: CASE_STATUS.IN_PROGRESS,
  },
}

// Pending Review status
export const PendingReview: Story = {
  args: {
    status: CASE_STATUS.PENDING_REVIEW,
  },
}

// Resolved status
export const Resolved: Story = {
  args: {
    status: CASE_STATUS.RESOLVED,
  },
}

// Closed status
export const Closed: Story = {
  args: {
    status: CASE_STATUS.CLOSED,
  },
}

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <CaseStatus status={CASE_STATUS.IN_PROGRESS} size="sm" />
      <CaseStatus status={CASE_STATUS.IN_PROGRESS} size="md" />
      <CaseStatus status={CASE_STATUS.IN_PROGRESS} size="lg" />
    </div>
  ),
}

// Different variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <span className="w-20 text-sm">Badge:</span>
        <CaseStatus status={CASE_STATUS.IN_PROGRESS} variant="badge" />
      </div>
      <div className="flex items-center space-x-4">
        <span className="w-20 text-sm">Pill:</span>
        <CaseStatus status={CASE_STATUS.IN_PROGRESS} variant="pill" />
      </div>
      <div className="flex items-center space-x-4">
        <span className="w-20 text-sm">Square:</span>
        <CaseStatus status={CASE_STATUS.IN_PROGRESS} variant="square" />
      </div>
      <div className="flex items-center space-x-4">
        <span className="w-20 text-sm">Outline:</span>
        <CaseStatus status={CASE_STATUS.IN_PROGRESS} variant="outline" />
      </div>
      <div className="flex items-center space-x-4">
        <span className="w-20 text-sm">Solid:</span>
        <CaseStatus status={CASE_STATUS.IN_PROGRESS} variant="solid" />
      </div>
      <div className="flex items-center space-x-4">
        <span className="w-20 text-sm">Subtle:</span>
        <CaseStatus status={CASE_STATUS.IN_PROGRESS} variant="subtle" />
      </div>
    </div>
  ),
}

// Without icon
export const WithoutIcon: Story = {
  args: {
    status: CASE_STATUS.IN_PROGRESS,
    showIcon: false,
  },
}

// Without label
export const WithoutLabel: Story = {
  args: {
    status: CASE_STATUS.IN_PROGRESS,
    showLabel: false,
  },
}

// With pulse animation
export const WithPulse: Story = {
  args: {
    status: CASE_STATUS.IN_PROGRESS,
    showPulse: true,
  },
}

// Interactive status
export const Interactive: Story = {
  args: {
    status: CASE_STATUS.IN_PROGRESS,
    onClick: () => console.log('Status clicked'),
  },
}

// All statuses
export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <CaseStatus status={CASE_STATUS.OPEN} />
      <CaseStatus status={CASE_STATUS.IN_PROGRESS} />
      <CaseStatus status={CASE_STATUS.PENDING_REVIEW} />
      <CaseStatus status={CASE_STATUS.RESOLVED} />
      <CaseStatus status={CASE_STATUS.CLOSED} />
    </div>
  ),
}

// Status Badge variant
export const BadgeVariant: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <CaseStatusBadge status={CASE_STATUS.OPEN} />
      <CaseStatusBadge status={CASE_STATUS.IN_PROGRESS} />
      <CaseStatusBadge status={CASE_STATUS.PENDING_REVIEW} />
      <CaseStatusBadge status={CASE_STATUS.RESOLVED} />
      <CaseStatusBadge status={CASE_STATUS.CLOSED} />
    </div>
  ),
}

// Status Indicator (icon only)
export const Indicator: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <CaseStatusIndicator status={CASE_STATUS.OPEN} />
      <CaseStatusIndicator status={CASE_STATUS.IN_PROGRESS} />
      <CaseStatusIndicator status={CASE_STATUS.PENDING_REVIEW} />
      <CaseStatusIndicator status={CASE_STATUS.RESOLVED} />
      <CaseStatusIndicator status={CASE_STATUS.CLOSED} />
    </div>
  ),
}

// Status List
export const StatusList: Story = {
  render: () => (
    <CaseStatusList
      statuses={[
        { status: CASE_STATUS.OPEN, count: 5 },
        { status: CASE_STATUS.IN_PROGRESS, count: 12 },
        { status: CASE_STATUS.PENDING_REVIEW, count: 3 },
        { status: CASE_STATUS.RESOLVED, count: 8 },
        { status: CASE_STATUS.CLOSED, count: 2 },
      ]}
    />
  ),
}

// Status Progress
export const Progress: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <CaseStatusProgress currentStatus={CASE_STATUS.OPEN} />
      <CaseStatusProgress currentStatus={CASE_STATUS.IN_PROGRESS} />
      <CaseStatusProgress currentStatus={CASE_STATUS.PENDING_REVIEW} />
      <CaseStatusProgress currentStatus={CASE_STATUS.RESOLVED} />
      <CaseStatusProgress currentStatus={CASE_STATUS.CLOSED} />
    </div>
  ),
}
