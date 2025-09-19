/**
 * Storybook stories for the navigation sidebar component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { NavigationSidebar, MobileSidebarTrigger, ResponsiveSidebar } from './sidebar'
import { CASE_MANAGEMENT_CONFIG } from '@/config/case-management'

const meta: Meta<typeof NavigationSidebar> = {
  title: 'Navigation/Sidebar',
  component: NavigationSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    collapsed: {
      control: { type: 'boolean' },
    },
    mobileOpen: {
      control: { type: 'boolean' },
    },
    showToggle: {
      control: { type: 'boolean' },
    },
    showLogo: {
      control: { type: 'boolean' },
    },
    logoText: {
      control: { type: 'text' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Sample modules data
const sampleModules = Object.values(CASE_MANAGEMENT_CONFIG.modules)

// Sample user info
const sampleUserInfo = {
  name: 'John Doe',
  role: 'Lab Manager',
  avatar: undefined,
}

// Default sidebar
export const Default: Story = {
  args: {
    modules: sampleModules,
    currentRoute: '/case-management/cases',
    collapsed: false,
    showToggle: true,
    showLogo: true,
    logoText: 'Case Management',
    userInfo: sampleUserInfo,
  },
}

// Collapsed sidebar
export const Collapsed: Story = {
  args: {
    modules: sampleModules,
    currentRoute: '/case-management/cases',
    collapsed: true,
    showToggle: true,
    showLogo: true,
    logoText: 'Case Management',
    userInfo: sampleUserInfo,
  },
}

// Sidebar without toggle
export const WithoutToggle: Story = {
  args: {
    modules: sampleModules,
    currentRoute: '/case-management/cases',
    collapsed: false,
    showToggle: false,
    showLogo: true,
    logoText: 'Case Management',
    userInfo: sampleUserInfo,
  },
}

// Sidebar without logo
export const WithoutLogo: Story = {
  args: {
    modules: sampleModules,
    currentRoute: '/case-management/cases',
    collapsed: false,
    showToggle: true,
    showLogo: false,
    userInfo: sampleUserInfo,
  },
}

// Sidebar with custom logo text
export const CustomLogo: Story = {
  args: {
    modules: sampleModules,
    currentRoute: '/case-management/cases',
    collapsed: false,
    showToggle: true,
    showLogo: true,
    logoText: 'Fragrance Management',
    userInfo: sampleUserInfo,
  },
}

// Sidebar without user info
export const WithoutUserInfo: Story = {
  args: {
    modules: sampleModules,
    currentRoute: '/case-management/cases',
    collapsed: false,
    showToggle: true,
    showLogo: true,
    logoText: 'Case Management',
  },
}

// Sidebar with user avatar
export const WithUserAvatar: Story = {
  args: {
    modules: sampleModules,
    currentRoute: '/case-management/cases',
    collapsed: false,
    showToggle: true,
    showLogo: true,
    logoText: 'Case Management',
    userInfo: {
      name: 'Jane Smith',
      role: 'Administrator',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    },
  },
}

// Mobile sidebar (open)
export const MobileOpen: Story = {
  args: {
    modules: sampleModules,
    currentRoute: '/case-management/cases',
    collapsed: false,
    mobileOpen: true,
    showToggle: true,
    showLogo: true,
    logoText: 'Case Management',
    userInfo: sampleUserInfo,
  },
  render: (args) => (
    <div className="relative w-96 h-screen border">
      <NavigationSidebar {...args} />
    </div>
  ),
}

// Mobile sidebar (closed)
export const MobileClosed: Story = {
  args: {
    modules: sampleModules,
    currentRoute: '/case-management/cases',
    collapsed: false,
    mobileOpen: false,
    showToggle: true,
    showLogo: true,
    logoText: 'Case Management',
    userInfo: sampleUserInfo,
  },
  render: (args) => (
    <div className="relative w-96 h-screen border">
      <NavigationSidebar {...args} />
    </div>
  ),
}

// Interactive sidebar
export const Interactive: Story = {
  args: {
    modules: sampleModules,
    currentRoute: '/case-management/cases',
    collapsed: false,
    showToggle: true,
    showLogo: true,
    logoText: 'Case Management',
    userInfo: sampleUserInfo,
    onToggle: () => {
      console.log('Sidebar toggled')
    },
    onNavigate: (href: string) => {
      console.log('Navigate to:', href)
    },
  },
}

// Sidebar with different current route
export const DifferentRoute: Story = {
  args: {
    modules: sampleModules,
    currentRoute: '/case-management/reports',
    collapsed: false,
    showToggle: true,
    showLogo: true,
    logoText: 'Case Management',
    userInfo: sampleUserInfo,
  },
}

// Sidebar with minimal modules
export const MinimalModules: Story = {
  args: {
    modules: sampleModules.slice(0, 2),
    currentRoute: '/case-management/cases',
    collapsed: false,
    showToggle: true,
    showLogo: true,
    logoText: 'Case Management',
    userInfo: sampleUserInfo,
  },
}

// Mobile sidebar trigger
export const MobileTrigger: Story = {
  render: () => (
    <div className="p-4">
      <MobileSidebarTrigger onToggle={() => console.log('Mobile sidebar toggled')} />
    </div>
  ),
}

// Responsive sidebar
export const Responsive: Story = {
  render: () => (
    <div className="w-full h-screen border">
      <ResponsiveSidebar
        modules={sampleModules}
        currentRoute="/case-management/cases"
        breakpoint="lg"
        userInfo={sampleUserInfo}
      />
    </div>
  ),
}

// Sidebar with role-based modules (perfumer)
export const PerfumerRole: Story = {
  args: {
    modules: sampleModules.filter(module => 
      !module.roles || module.roles.includes('perfumer')
    ),
    currentRoute: '/case-management/cases',
    collapsed: false,
    showToggle: true,
    showLogo: true,
    logoText: 'Case Management',
    userInfo: {
      name: 'Alex Perfumer',
      role: 'Perfumer',
    },
  },
}

// Sidebar with role-based modules (administrator)
export const AdministratorRole: Story = {
  args: {
    modules: sampleModules,
    currentRoute: '/case-management/cases',
    collapsed: false,
    showToggle: true,
    showLogo: true,
    logoText: 'Case Management',
    userInfo: {
      name: 'Admin User',
      role: 'Administrator',
    },
  },
}

// Sidebar with long user name
export const LongUserName: Story = {
  args: {
    modules: sampleModules,
    currentRoute: '/case-management/cases',
    collapsed: false,
    showToggle: true,
    showLogo: true,
    logoText: 'Case Management',
    userInfo: {
      name: 'Dr. Christopher Alexander Johnson-Smith',
      role: 'Senior Laboratory Manager',
    },
  },
}

// Sidebar with many modules
export const ManyModules: Story = {
  args: {
    modules: [
      ...sampleModules,
      {
        id: 'extra-1',
        name: 'Extra Module 1',
        label: 'Extra Module 1',
        icon: '📊',
        description: 'Additional module for testing',
        order: 10,
        items: [
          { id: 'extra-item-1', label: 'Extra Item 1', href: '/extra/item-1' },
          { id: 'extra-item-2', label: 'Extra Item 2', href: '/extra/item-2' },
        ],
      },
      {
        id: 'extra-2',
        name: 'Extra Module 2',
        label: 'Extra Module 2',
        icon: '🔧',
        description: 'Another additional module',
        order: 11,
        items: [
          { id: 'extra-item-3', label: 'Extra Item 3', href: '/extra/item-3' },
        ],
      },
    ],
    currentRoute: '/case-management/cases',
    collapsed: false,
    showToggle: true,
    showLogo: true,
    logoText: 'Case Management',
    userInfo: sampleUserInfo,
  },
}
