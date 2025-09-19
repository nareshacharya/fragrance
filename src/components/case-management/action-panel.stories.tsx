/**
 * Storybook stories for the action panel component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { 
  ActionPanel, 
  CompactActionPanel, 
  FloatingActionPanel, 
  SearchableActionPanel 
} from './action-panel'
import { CASE_MANAGEMENT_CONFIG } from '@/config/case-management'
import { CASE_STATUS } from '@/config/constants'

const meta: Meta<typeof ActionPanel> = {
  title: 'Case Management/Action Panel',
  component: ActionPanel,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'floating'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'transparent'],
    },
    showBulkActions: {
      control: { type: 'boolean' },
    },
    showPrimaryActions: {
      control: { type: 'boolean' },
    },
    showSecondaryActions: {
      control: { type: 'boolean' },
    },
    maxPrimaryActions: {
      control: { type: 'number', min: 1, max: 10 },
    },
    loading: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Sample actions
const sampleActions = Object.values(CASE_MANAGEMENT_CONFIG.actions)

// Default action panel
export const Default: Story = {
  args: {
    actions: sampleActions.slice(0, 5),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'top',
    size: 'md',
    variant: 'default',
    showBulkActions: true,
    showPrimaryActions: true,
    showSecondaryActions: true,
    maxPrimaryActions: 3,
    loading: false,
    disabled: false,
    title: 'Case Actions',
    description: 'Perform actions on selected cases',
  },
}

// Action panel with no selected cases
export const NoSelectedCases: Story = {
  args: {
    actions: sampleActions.slice(0, 5),
    selectedCases: [],
    caseStatus: CASE_STATUS.OPEN,
    position: 'top',
    size: 'md',
    variant: 'default',
    showBulkActions: true,
    showPrimaryActions: true,
    showSecondaryActions: true,
    maxPrimaryActions: 3,
    title: 'Case Actions',
    description: 'Select cases to perform actions',
  },
}

// Action panel with many selected cases
export const ManySelectedCases: Story = {
  args: {
    actions: sampleActions.slice(0, 5),
    selectedCases: ['1', '2', '3', '4', '5', '6', '7', '8'],
    caseStatus: CASE_STATUS.PENDING_REVIEW,
    position: 'top',
    size: 'md',
    variant: 'default',
    showBulkActions: true,
    showPrimaryActions: true,
    showSecondaryActions: true,
    maxPrimaryActions: 3,
    title: 'Bulk Actions',
    description: 'Perform actions on 8 selected cases',
  },
}

// Action panel with different case status
export const DifferentCaseStatus: Story = {
  args: {
    actions: sampleActions.slice(0, 5),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.RESOLVED,
    position: 'top',
    size: 'md',
    variant: 'default',
    showBulkActions: true,
    showPrimaryActions: true,
    showSecondaryActions: true,
    maxPrimaryActions: 3,
    title: 'Resolved Case Actions',
    description: 'Actions available for resolved cases',
  },
}

// Action panel with loading state
export const Loading: Story = {
  args: {
    actions: sampleActions.slice(0, 5),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'top',
    size: 'md',
    variant: 'default',
    showBulkActions: true,
    showPrimaryActions: true,
    showSecondaryActions: true,
    maxPrimaryActions: 3,
    loading: true,
    title: 'Processing Actions',
    description: 'Actions are being processed...',
  },
}

// Action panel with disabled state
export const Disabled: Story = {
  args: {
    actions: sampleActions.slice(0, 5),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.CLOSED,
    position: 'top',
    size: 'md',
    variant: 'default',
    showBulkActions: true,
    showPrimaryActions: true,
    showSecondaryActions: true,
    maxPrimaryActions: 3,
    disabled: true,
    title: 'Disabled Actions',
    description: 'Actions are currently disabled',
  },
}

// Action panel with different positions
export const PositionTop: Story = {
  args: {
    actions: sampleActions.slice(0, 5),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'top',
    size: 'md',
    variant: 'default',
    title: 'Top Position',
    description: 'Action panel at the top',
  },
}

export const PositionBottom: Story = {
  args: {
    actions: sampleActions.slice(0, 5),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'bottom',
    size: 'md',
    variant: 'default',
    title: 'Bottom Position',
    description: 'Action panel at the bottom',
  },
}

export const PositionFloating: Story = {
  args: {
    actions: sampleActions.slice(0, 5),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'floating',
    size: 'md',
    variant: 'default',
    title: 'Floating Position',
    description: 'Floating action panel',
  },
}

// Action panel with different sizes
export const SizeSmall: Story = {
  args: {
    actions: sampleActions.slice(0, 3),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'top',
    size: 'sm',
    variant: 'default',
    title: 'Small Size',
    description: 'Compact action panel',
  },
}

export const SizeLarge: Story = {
  args: {
    actions: sampleActions.slice(0, 5),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'top',
    size: 'lg',
    variant: 'default',
    title: 'Large Size',
    description: 'Large action panel',
  },
}

// Action panel with different variants
export const VariantElevated: Story = {
  args: {
    actions: sampleActions.slice(0, 5),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'top',
    size: 'md',
    variant: 'elevated',
    title: 'Elevated Variant',
    description: 'Action panel with elevation',
  },
}

export const VariantTransparent: Story = {
  args: {
    actions: sampleActions.slice(0, 5),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'top',
    size: 'md',
    variant: 'transparent',
    title: 'Transparent Variant',
    description: 'Transparent action panel',
  },
}

// Action panel with limited primary actions
export const LimitedPrimaryActions: Story = {
  args: {
    actions: sampleActions.slice(0, 8),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'top',
    size: 'md',
    variant: 'default',
    showBulkActions: true,
    showPrimaryActions: true,
    showSecondaryActions: true,
    maxPrimaryActions: 2,
    title: 'Limited Primary Actions',
    description: 'Only 2 primary actions shown',
  },
}

// Action panel without bulk actions
export const WithoutBulkActions: Story = {
  args: {
    actions: sampleActions.slice(0, 5),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'top',
    size: 'md',
    variant: 'default',
    showBulkActions: false,
    showPrimaryActions: true,
    showSecondaryActions: true,
    title: 'No Bulk Actions',
    description: 'Bulk actions are hidden',
  },
}

// Action panel without secondary actions
export const WithoutSecondaryActions: Story = {
  args: {
    actions: sampleActions.slice(0, 5),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'top',
    size: 'md',
    variant: 'default',
    showBulkActions: true,
    showPrimaryActions: true,
    showSecondaryActions: false,
    title: 'No Secondary Actions',
    description: 'Secondary actions are hidden',
  },
}

// Action panel without primary actions
export const WithoutPrimaryActions: Story = {
  args: {
    actions: sampleActions.slice(0, 5),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'top',
    size: 'md',
    variant: 'default',
    showBulkActions: true,
    showPrimaryActions: false,
    showSecondaryActions: true,
    title: 'No Primary Actions',
    description: 'Primary actions are hidden',
  },
}

// Interactive action panel
export const Interactive: Story = {
  args: {
    actions: sampleActions.slice(0, 5),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'top',
    size: 'md',
    variant: 'default',
    title: 'Interactive Actions',
    description: 'Click actions to see console output',
    onActionClick: (action, caseIds) => {
      console.log('Action clicked:', action.label, 'on cases:', caseIds)
    },
  },
}

// Compact action panel
export const Compact: Story = {
  render: () => (
    <CompactActionPanel
      actions={sampleActions.slice(0, 3)}
      selectedCases={['1', '2']}
      caseStatus={CASE_STATUS.IN_PROGRESS}
      title="Compact Actions"
      description="Compact action panel for tight spaces"
    />
  ),
}

// Floating action panel
export const Floating: Story = {
  render: () => (
    <div className="relative w-full h-96 border">
      <FloatingActionPanel
        actions={sampleActions.slice(0, 4)}
        selectedCases={['1', '2']}
        caseStatus={CASE_STATUS.IN_PROGRESS}
        position="bottom-right"
        title="Floating Actions"
        description="Floating action panel"
      />
    </div>
  ),
}

// Searchable action panel
export const Searchable: Story = {
  render: () => (
    <SearchableActionPanel
      actions={sampleActions}
      selectedCases={['1', '2']}
      caseStatus={CASE_STATUS.IN_PROGRESS}
      showSearch={true}
      searchPlaceholder="Search actions..."
      title="Searchable Actions"
      description="Search through available actions"
    />
  ),
}

// Action panel with destructive actions
export const WithDestructiveActions: Story = {
  args: {
    actions: [
      ...sampleActions.slice(0, 3),
      {
        id: 'delete',
        label: 'Delete Cases',
        description: 'Permanently delete selected cases',
        icon: '🗑️',
        variant: 'destructive' as const,
        requiresConfirmation: true,
        confirmationMessage: 'Are you sure you want to delete these cases? This action cannot be undone.',
        bulkAction: true,
      },
    ],
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'top',
    size: 'md',
    variant: 'default',
    title: 'Actions with Destructive',
    description: 'Includes destructive actions',
  },
}

// Action panel with confirmation required actions
export const WithConfirmationActions: Story = {
  args: {
    actions: sampleActions.slice(0, 3).map(action => ({
      ...action,
      requiresConfirmation: true,
      confirmationMessage: `Are you sure you want to ${action.label.toLowerCase()}?`,
    })),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'top',
    size: 'md',
    variant: 'default',
    title: 'Confirmation Required',
    description: 'All actions require confirmation',
  },
}

// Action panel with badges
export const WithBadges: Story = {
  args: {
    actions: sampleActions.slice(0, 5).map((action, index) => ({
      ...action,
      badge: index === 0 ? 'New' : index === 1 ? 'Hot' : undefined,
    })),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'top',
    size: 'md',
    variant: 'default',
    title: 'Actions with Badges',
    description: 'Some actions have badges',
  },
}

// Action panel with loading actions
export const WithLoadingActions: Story = {
  args: {
    actions: sampleActions.slice(0, 5).map((action, index) => ({
      ...action,
      loading: index === 0,
    })),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'top',
    size: 'md',
    variant: 'default',
    title: 'Actions with Loading',
    description: 'Some actions are loading',
  },
}

// Action panel with disabled actions
export const WithDisabledActions: Story = {
  args: {
    actions: sampleActions.slice(0, 5).map((action, index) => ({
      ...action,
      disabled: index === 1 || index === 3,
    })),
    selectedCases: ['1', '2'],
    caseStatus: CASE_STATUS.IN_PROGRESS,
    position: 'top',
    size: 'md',
    variant: 'default',
    title: 'Actions with Disabled',
    description: 'Some actions are disabled',
  },
}
