import type { Meta, StoryObj } from '@storybook/react'
import {
  Layout,
  Header,
  Sidebar,
  Main,
  Footer,
  LayoutWithSidebar,
  ContentArea,
} from './layout'

const meta: Meta<typeof Layout> = {
  title: 'Components/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'Layout content',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const BasicLayout: Story = {
  render: () => (
    <Layout>
      <Header>
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">Application Header</h1>
        </div>
      </Header>
      <Main>
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Main Content</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            This is the main content area of the application. It contains the primary content
            that users interact with.
          </p>
        </div>
      </Main>
      <Footer>
        <div className="container mx-auto px-4 py-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            © 2024 Fragrance Management System. All rights reserved.
          </p>
        </div>
      </Footer>
    </Layout>
  ),
}

export const LayoutWithSidebarExpanded: Story = {
  render: () => (
    <LayoutWithSidebar>
      <Sidebar>
        <div className="p-4">
          <h3 className="font-semibold mb-4">Navigation</h3>
          <nav className="space-y-2">
            <a href="#" className="block py-2 px-3 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Dashboard
            </a>
            <a href="#" className="block py-2 px-3 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Formulas
            </a>
            <a href="#" className="block py-2 px-3 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Projects
            </a>
            <a href="#" className="block py-2 px-3 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Reports
            </a>
          </nav>
        </div>
      </Sidebar>
      <ContentArea>
        <Header>
          <div className="px-4 py-4">
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
        </Header>
        <Main>
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Welcome to Dashboard</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              This is a layout with an expanded sidebar. The sidebar contains navigation
              elements and the main content area is flexible.
            </p>
          </div>
        </Main>
        <Footer>
          <div className="px-4 py-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Footer content
            </p>
          </div>
        </Footer>
      </ContentArea>
    </LayoutWithSidebar>
  ),
}

export const LayoutWithSidebarCollapsed: Story = {
  render: () => (
    <LayoutWithSidebar>
      <Sidebar collapsed>
        <div className="p-2">
          <div className="space-y-2">
            <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
            <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
            <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
            <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          </div>
        </div>
      </Sidebar>
      <ContentArea>
        <Header>
          <div className="px-4 py-4">
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
        </Header>
        <Main>
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Collapsed Sidebar</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              This layout shows a collapsed sidebar with icon-only navigation. The main content
              area has more space available.
            </p>
          </div>
        </Main>
        <Footer>
          <div className="px-4 py-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Footer content
            </p>
          </div>
        </Footer>
      </ContentArea>
    </LayoutWithSidebar>
  ),
}

export const ResponsiveLayout: Story = {
  render: () => (
    <LayoutWithSidebar>
      <Sidebar className="hidden md:block">
        <div className="p-4">
          <h3 className="font-semibold mb-4">Navigation</h3>
          <nav className="space-y-2">
            <a href="#" className="block py-2 px-3 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Dashboard
            </a>
            <a href="#" className="block py-2 px-3 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Formulas
            </a>
            <a href="#" className="block py-2 px-3 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Projects
            </a>
            <a href="#" className="block py-2 px-3 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Reports
            </a>
          </nav>
        </div>
      </Sidebar>
      <ContentArea>
        <Header>
          <div className="px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Responsive Layout</h1>
            <button className="md:hidden p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </Header>
        <Main>
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Responsive Design</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              This layout demonstrates responsive behavior. The sidebar is hidden on mobile
              devices and shown on medium screens and larger.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg border">
                <h3 className="font-semibold mb-2">Card 1</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  This card adapts to different screen sizes.
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg border">
                <h3 className="font-semibold mb-2">Card 2</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Responsive grid layout example.
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg border">
                <h3 className="font-semibold mb-2">Card 3</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Mobile-first design approach.
                </p>
              </div>
            </div>
          </div>
        </Main>
        <Footer>
          <div className="px-4 py-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Responsive footer content
            </p>
          </div>
        </Footer>
      </ContentArea>
    </LayoutWithSidebar>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
