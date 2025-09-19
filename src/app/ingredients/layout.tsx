import React from 'react'
import { CaseManagementLayout } from '@/components/layouts/CaseManagementLayout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { 
  Beaker, 
  Package, 
  Upload, 
  Download, 
  Plus,
  Search,
  Filter
} from 'lucide-react'

const ingredientNavigationItems = [
  {
    id: 'ingredients-list',
    label: 'All Ingredients',
    href: '/ingredients',
    icon: Beaker,
    description: 'View and manage all ingredients',
  },
  {
    id: 'ingredients-create',
    label: 'Add Ingredient',
    href: '/ingredients/create',
    icon: Plus,
    description: 'Add a new ingredient to inventory',
  },
  {
    id: 'ingredients-import',
    label: 'Import',
    href: '/ingredients/import',
    icon: Upload,
    description: 'Import ingredients from CSV',
  },
  {
    id: 'ingredients-export',
    label: 'Export',
    href: '/ingredients/export',
    icon: Download,
    description: 'Export ingredients to CSV',
  },
]

const ingredientActionPanels = [
  {
    id: 'quick-actions',
    title: 'Quick Actions',
    actions: [
      {
        id: 'add-ingredient',
        label: 'Add Ingredient',
        href: '/ingredients/create',
        icon: Plus,
        variant: 'primary' as const,
      },
      {
        id: 'import-ingredients',
        label: 'Import CSV',
        href: '/ingredients/import',
        icon: Upload,
        variant: 'outline' as const,
      },
      {
        id: 'export-ingredients',
        label: 'Export CSV',
        href: '/ingredients/export',
        icon: Download,
        variant: 'outline' as const,
      },
    ],
  },
  {
    id: 'search-filters',
    title: 'Search & Filters',
    actions: [
      {
        id: 'advanced-search',
        label: 'Advanced Search',
        icon: Search,
        variant: 'outline' as const,
        onClick: () => {
          // This would trigger advanced search modal
          console.log('Advanced search clicked')
        },
      },
      {
        id: 'filter-ingredients',
        label: 'Filter Options',
        icon: Filter,
        variant: 'outline' as const,
        onClick: () => {
          // This would trigger filter panel
          console.log('Filter options clicked')
        },
      },
    ],
  },
]

const ingredientBreadcrumbConfig = {
  basePath: '/ingredients',
  baseLabel: 'Ingredients',
  items: [
    {
      path: '/ingredients',
      label: 'All Ingredients',
    },
    {
      path: '/ingredients/create',
      label: 'Add Ingredient',
    },
    {
      path: '/ingredients/import',
      label: 'Import Ingredients',
    },
    {
      path: '/ingredients/export',
      label: 'Export Ingredients',
    },
  ],
}

interface IngredientsLayoutProps {
  children: React.ReactNode
}

export default function IngredientsLayout({ children }: IngredientsLayoutProps) {
  return (
    <ProtectedRoute
      requiredRoles={['administrator', 'lab_manager', 'project_manager', 'palette_manager', 'perfumer']}
      fallbackPath="/unauthorized"
    >
      <CaseManagementLayout
        title="Ingredient Management"
        description="Manage your ingredient inventory, suppliers, and formulations"
        navigationItems={ingredientNavigationItems}
        actionPanels={ingredientActionPanels}
        breadcrumbConfig={ingredientBreadcrumbConfig}
        module="ingredients"
        className="ingredients-layout"
      >
        {children}
      </CaseManagementLayout>
    </ProtectedRoute>
  )
}
