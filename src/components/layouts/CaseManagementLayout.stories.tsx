/**
 * Storybook stories for the case management layout component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { 
  CaseManagementLayout,
  CompactCaseManagementLayout,
  FullCaseManagementLayout 
} from './CaseManagementLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CASE_MANAGEMENT_CONFIG } from '@/config/case-management'
import { CASE_STATUS } from '@/config/constants'

const meta: Meta<typeof CaseManagementLayout> = {
  title: 'Layouts/CaseManagementLayout',
  component: CaseManagementLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    showSidebar: {
      control: { type: 'boolean' },
    },
    showHeader: {
      control: { type: 'boolean' },
    },
    showActionPanel: {
      control: { type: 'boolean' },
    },
    variant: {
      control: { type: 'select' },
      options: ['mobile', 'tablet', 'desktop'],
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Sample content component
const SampleContent = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
          <Badge variant="outline">24</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground">+2 from last week</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Badge variant="secondary">8</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">Active cases</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          <Badge variant="outline">3</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">Awaiting approval</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          <Badge variant="default">13</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">13</div>
          <p className="text-xs text-muted-foreground">Completed this month</p>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Recent Cases</CardTitle>
        <CardDescription>Latest case management activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { id: '1', title: 'Formula Review - Spring Collection 2024', status: CASE_STATUS.IN_PROGRESS },
            { id: '2', title: 'Ingredient Approval - Rose Absolute', status: CASE_STATUS.PENDING_REVIEW },
            { id: '3', title: 'Quality Control - Batch #QC-2024-001', status: CASE_STATUS.OPEN },
          ].map((caseItem) => (
            <div key={caseItem.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="text-sm font-medium">{caseItem.title}</h3>
                <p className="text-xs text-muted-foreground">Case ID: {caseItem.id}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{caseItem.status}</Badge>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
)

// Default layout
export const Default: Story = {
  args: {
    showSidebar: true,
    showHeader: true,
    showActionPanel: true,
    variant: 'desktop',
    padding: 'md',
    sidebarConfig: {
      modules: Object.values(CASE_MANAGEMENT_CONFIG.modules),
      userInfo: {
        name: 'John Doe',
        role: 'Lab Manager',
        avatar: undefined,
      },
    },
    headerConfig: {
      title: 'Case Management Dashboard',
      subtitle: 'Manage and track all case-related activities',
      breadcrumbs: [
        { label: 'Case Management', href: '/case-management' },
        { label: 'Dashboard', current: true },
      ],
      userInfo: {
        name: 'John Doe',
        role: 'Lab Manager',
        avatar: undefined,
      },
      actions: (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">Export</Button>
          <Button size="sm">New Case</Button>
        </div>
      ),
    },
    actionPanelConfig: {
      actions: Object.values(CASE_MANAGEMENT_CONFIG.actions).slice(0, 4),
      selectedCases: ['1', '2'],
      caseStatus: CASE_STATUS.IN_PROGRESS,
      title: 'Case Actions',
      description: 'Perform actions on selected cases',
    },
  },
  render: (args) => (
    <CaseManagementLayout {...args}>
      <SampleContent />
    </CaseManagementLayout>
  ),
}

// Compact layout
export const Compact: Story = {
  render: () => (
    <CompactCaseManagementLayout
      showSidebar={true}
      showHeader={true}
      showActionPanel={false}
      headerConfig={{
        title: 'Compact Layout',
        breadcrumbs: [
          { label: 'Cases', current: true },
        ],
      }}
    >
      <SampleContent />
    </CompactCaseManagementLayout>
  ),
}

// Full layout
export const Full: Story = {
  render: () => (
    <FullCaseManagementLayout
      showAllFeatures={true}
      sidebarConfig={{
        modules: Object.values(CASE_MANAGEMENT_CONFIG.modules),
        userInfo: {
          name: 'Jane Smith',
          role: 'Administrator',
        },
      }}
      headerConfig={{
        title: 'Full Featured Layout',
        subtitle: 'Complete case management interface',
        breadcrumbs: [
          { label: 'Case Management', href: '/case-management' },
          { label: 'All Features', current: true },
        ],
        userInfo: {
          name: 'Jane Smith',
          role: 'Administrator',
        },
        actions: (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">Settings</Button>
            <Button variant="outline" size="sm">Export</Button>
            <Button size="sm">New Case</Button>
          </div>
        ),
      }}
      actionPanelConfig={{
        actions: Object.values(CASE_MANAGEMENT_CONFIG.actions),
        selectedCases: ['1', '2', '3'],
        title: 'All Actions',
        description: 'Complete action panel with all available actions',
      }}
    >
      <SampleContent />
    </FullCaseManagementLayout>
  ),
}

// Without sidebar
export const WithoutSidebar: Story = {
  args: {
    showSidebar: false,
    showHeader: true,
    showActionPanel: true,
  },
  render: (args) => (
    <CaseManagementLayout {...args}>
      <SampleContent />
    </CaseManagementLayout>
  ),
}

// Without header
export const WithoutHeader: Story = {
  args: {
    showSidebar: true,
    showHeader: false,
    showActionPanel: true,
  },
  render: (args) => (
    <CaseManagementLayout {...args}>
      <SampleContent />
    </CaseManagementLayout>
  ),
}

// Without action panel
export const WithoutActionPanel: Story = {
  args: {
    showSidebar: true,
    showHeader: true,
    showActionPanel: false,
  },
  render: (args) => (
    <CaseManagementLayout {...args}>
      <SampleContent />
    </CaseManagementLayout>
  ),
}

// Mobile variant
export const Mobile: Story = {
  args: {
    variant: 'mobile',
    padding: 'sm',
  },
  render: (args) => (
    <div className="w-96 h-screen border">
      <CaseManagementLayout {...args}>
        <SampleContent />
      </CaseManagementLayout>
    </div>
  ),
}

// Tablet variant
export const Tablet: Story = {
  args: {
    variant: 'tablet',
    padding: 'md',
  },
  render: (args) => (
    <div className="w-[768px] h-screen border">
      <CaseManagementLayout {...args}>
        <SampleContent />
      </CaseManagementLayout>
    </div>
  ),
}
