import type { Meta, StoryObj } from '@storybook/react'
import { IngredientSearch } from './ingredient-search'
import { IngredientSearchParams } from '@/types/ingredient'

const meta: Meta<typeof IngredientSearch> = {
  title: 'Components/Ingredients/IngredientSearch',
  component: IngredientSearch,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onSearch: { action: 'search' },
    onFilterChange: { action: 'filterChange' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const defaultFilters: Record<string, any> = {}

export const Default: Story = {
  args: {
    filters: defaultFilters,
  },
}

export const WithActiveFilters: Story = {
  args: {
    filters: {
      type: 'essential_oil',
      category: 'top_notes',
      supplier: 'Essential Oils Co.',
      stockStatus: 'in_stock',
      costRange: { min: 10, max: 100 },
      isActive: true,
      tags: ['floral', 'natural'],
    },
  },
}

export const WithSearchQuery: Story = {
  args: {
    filters: {
      query: 'lavender',
      type: 'essential_oil',
    },
  },
}

export const WithCostRange: Story = {
  args: {
    filters: {
      costRange: { min: 50, max: 200 },
      stockStatus: 'low_stock',
    },
  },
}

export const WithDateFilters: Story = {
  args: {
    filters: {
      createdAfter: '2024-01-01',
      createdBefore: '2024-12-31',
      isActive: true,
    },
  },
}

export const WithTags: Story = {
  args: {
    filters: {
      tags: ['floral', 'calming', 'natural'],
      type: 'essential_oil',
    },
  },
}

export const EmptyFilters: Story = {
  args: {
    filters: {},
  },
}

export const ComplexFilters: Story = {
  args: {
    filters: {
      query: 'rose',
      type: 'natural_extract',
      category: 'middle_notes',
      supplier: 'Premium Extracts',
      stockStatus: 'in_stock',
      costRange: { min: 100, max: 500 },
      isActive: true,
      tags: ['floral', 'luxury'],
      createdAfter: '2024-01-01',
    },
  },
}
