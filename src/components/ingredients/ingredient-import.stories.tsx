import type { Meta, StoryObj } from '@storybook/react'
import { IngredientImport } from './ingredient-import'
import { IngredientImportData, IngredientImportResult } from '@/types/ingredient'

const meta: Meta<typeof IngredientImport> = {
  title: 'Components/Ingredients/IngredientImport',
  component: IngredientImport,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onImport: { action: 'import' },
    onValidate: { action: 'validate' },
    onDownloadTemplate: { action: 'downloadTemplate' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Sample import data
const sampleImportData: IngredientImportData[] = [
  {
    name: 'Lavender Essential Oil',
    type: 'essential_oil',
    category: 'top_notes',
    supplier: 'Essential Oils Co.',
    supplierCode: 'EO-LAV-001',
    cost: 25.50,
    currency: 'USD',
    stockLevel: 1000,
    minStockLevel: 100,
    unit: 'ml',
    casNumber: '8000-28-0',
    inciName: 'Lavandula Angustifolia Oil',
    description: 'High-quality lavender essential oil',
    notes: 'Store in cool, dark place',
    tags: 'floral, calming, natural',
  },
  {
    name: 'Rose Absolute',
    type: 'natural_extract',
    category: 'middle_notes',
    supplier: 'Premium Extracts Ltd.',
    supplierCode: 'PE-ROS-002',
    cost: 150.00,
    currency: 'USD',
    stockLevel: 50,
    minStockLevel: 100,
    unit: 'g',
    casNumber: '8000-28-0',
    inciName: 'Rosa Damascena Absolute',
    description: 'Premium rose absolute from Bulgaria',
    notes: 'Handle with care, very concentrated',
    tags: 'floral, luxury, rose',
  },
  {
    name: 'Methyl Anthranilate',
    type: 'synthetic',
    category: 'middle_notes',
    supplier: 'Chemical Solutions Co.',
    supplierCode: 'CS-MA-003',
    cost: 12.50,
    currency: 'USD',
    stockLevel: 2000,
    minStockLevel: 500,
    unit: 'g',
    casNumber: '134-20-3',
    inciName: 'Methyl Anthranilate',
    description: 'Synthetic grape-like fragrance compound',
    notes: 'Stable synthetic compound',
    tags: 'synthetic, grape, fruity',
  },
]

// Sample validation results
const sampleValidationResults = [
  {
    row: 2,
    isValid: true,
    errors: [],
    warnings: [
      {
        field: 'stockLevel',
        message: 'Stock level is below minimum recommended level',
        code: 'LOW_STOCK_WARNING',
      },
    ],
  },
  {
    row: 3,
    isValid: true,
    errors: [],
    warnings: [],
  },
  {
    row: 4,
    isValid: false,
    errors: [
      {
        field: 'name',
        message: 'Name is required',
        code: 'REQUIRED_FIELD',
      },
      {
        field: 'supplier',
        message: 'Supplier is required',
        code: 'REQUIRED_FIELD',
      },
    ],
    warnings: [],
  },
]

// Sample import result
const sampleImportResult: IngredientImportResult = {
  totalProcessed: 3,
  successful: 2,
  failed: 1,
  skipped: 0,
  errors: [
    {
      row: 4,
      field: 'name',
      message: 'Name is required',
      data: {
        name: '',
        type: 'essential_oil',
        supplier: '',
        cost: 25.50,
      },
    },
  ],
  warnings: [
    {
      row: 2,
      field: 'stockLevel',
      message: 'Stock level is below minimum recommended level',
      data: {
        name: 'Rose Absolute',
        stockLevel: 50,
        minStockLevel: 100,
      },
    },
  ],
}

export const Default: Story = {
  args: {},
}

export const WithImportData: Story = {
  args: {
    // This would be set by the component internally after file upload
  },
}

export const WithValidationErrors: Story = {
  args: {
    // This would be set by the component internally after validation
  },
}

export const WithImportResult: Story = {
  args: {
    // This would be set by the component internally after import
  },
}

export const Loading: Story = {
  args: {
    // This would be set by the component internally during processing
  },
}

export const WithLargeDataset: Story = {
  args: {
    // This would be set by the component internally with a large dataset
  },
}

export const WithMixedResults: Story = {
  args: {
    // This would be set by the component internally with mixed success/failure
  },
}

export const WithOnlyWarnings: Story = {
  args: {
    // This would be set by the component internally with only warnings
  },
}

export const WithOnlyErrors: Story = {
  args: {
    // This would be set by the component internally with only errors
  },
}

export const SuccessfulImport: Story = {
  args: {
    // This would be set by the component internally after successful import
  },
}

export const FailedImport: Story = {
  args: {
    // This would be set by the component internally after failed import
  },
}
