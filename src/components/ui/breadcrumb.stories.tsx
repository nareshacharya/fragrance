/**
 * Storybook stories for the breadcrumb component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumb, CompactBreadcrumb, LargeBreadcrumb } from './breadcrumb'
import { ChevronRight } from 'lucide-react'

const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'large'],
    },
    separator: {
      control: { type: 'select' },
      options: ['chevron', 'slash', 'arrow', 'dot'],
    },
    maxItems: {
      control: { type: 'number', min: 1, max: 10 },
    },
    showHome: {
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic breadcrumb
export const Default: Story = {
  args: {
    items: [
      { label: 'Case Management', href: '/case-management' },
      { label: 'Cases', href: '/case-management/cases' },
      { label: 'Formula Review', href: '/case-management/cases/formula-review' },
      { label: 'Case Details', current: true },
    ],
  },
}

// Breadcrumb with home
export const WithHome: Story = {
  args: {
    items: [
      { label: 'Case Management', href: '/case-management' },
      { label: 'Cases', href: '/case-management/cases' },
      { label: 'Case Details', current: true },
    ],
    showHome: true,
    homeHref: '/',
    homeLabel: 'Home',
  },
}

// Compact breadcrumb
export const Compact: Story = {
  render: (args) => (
    <CompactBreadcrumb
      {...args}
      items={[
        { label: 'Cases', href: '/cases' },
        { label: 'Formula Review', href: '/cases/formula-review' },
        { label: 'Details', current: true },
      ]}
    />
  ),
}

// Large breadcrumb
export const Large: Story = {
  render: (args) => (
    <LargeBreadcrumb
      {...args}
      items={[
        { label: 'Case Management', href: '/case-management' },
        { label: 'Cases', href: '/case-management/cases' },
        { label: 'Formula Review', href: '/case-management/cases/formula-review' },
        { label: 'Case Details', current: true },
      ]}
    />
  ),
}

// Breadcrumb with custom separator
export const CustomSeparator: Story = {
  args: {
    items: [
      { label: 'Case Management', href: '/case-management' },
      { label: 'Cases', href: '/case-management/cases' },
      { label: 'Case Details', current: true },
    ],
    separator: 'slash',
  },
}

// Breadcrumb with many items (truncated)
export const ManyItems: Story = {
  args: {
    items: [
      { label: 'Case Management', href: '/case-management' },
      { label: 'Cases', href: '/case-management/cases' },
      { label: 'Formula Review', href: '/case-management/cases/formula-review' },
      { label: 'Spring Collection', href: '/case-management/cases/formula-review/spring-collection' },
      { label: 'Batch 001', href: '/case-management/cases/formula-review/spring-collection/batch-001' },
      { label: 'Quality Control', href: '/case-management/cases/formula-review/spring-collection/batch-001/quality-control' },
      { label: 'Final Review', current: true },
    ],
    maxItems: 4,
  },
}

// Breadcrumb with icons
export const WithIcons: Story = {
  args: {
    items: [
      { label: 'Case Management', href: '/case-management', icon: '📋' },
      { label: 'Cases', href: '/case-management/cases', icon: '📁' },
      { label: 'Formula Review', href: '/case-management/cases/formula-review', icon: '🔬' },
      { label: 'Case Details', current: true, icon: '📄' },
    ],
  },
}

// Interactive breadcrumb
export const Interactive: Story = {
  args: {
    items: [
      { label: 'Case Management', href: '/case-management' },
      { label: 'Cases', href: '/case-management/cases' },
      { label: 'Formula Review', href: '/case-management/cases/formula-review' },
      { label: 'Case Details', current: true },
    ],
    onNavigate: (href: string) => {
      console.log('Navigate to:', href)
    },
  },
}

// Case management specific breadcrumb
export const CaseManagementFlow: Story = {
  args: {
    items: [
      { label: 'Case Management', href: '/case-management' },
      { label: 'Cases', href: '/case-management/cases' },
      { label: 'Formula Review', href: '/case-management/cases/formula-review' },
      { label: 'Spring Collection 2024', href: '/case-management/cases/formula-review/spring-collection' },
      { label: 'Comments', current: true },
    ],
    showHome: true,
    separator: 'chevron',
  },
}
