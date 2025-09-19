import type { Meta, StoryObj } from '@storybook/react'
import { IngredientCard } from './ingredient-card'
import { Ingredient } from '@/types/ingredient'

const meta: Meta<typeof IngredientCard> = {
  title: 'Components/Ingredients/IngredientCard',
  component: IngredientCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onView: { action: 'view' },
    onEdit: { action: 'edit' },
    onDelete: { action: 'delete' },
    onUpdateStock: { action: 'updateStock' },
    showActions: { control: 'boolean' },
    compact: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Sample ingredient data
const sampleIngredient: Ingredient = {
  id: '1',
  name: 'Lavender Essential Oil',
  type: 'essential_oil',
  category: 'top_notes',
  supplier: 'Essential Oils Co.',
  supplierCode: 'EO-LAV-001',
  cost: 25.50,
  currency: 'USD',
  stockLevel: 1000,
  minStockLevel: 100,
  maxStockLevel: 2000,
  unit: 'ml',
  density: 0.88,
  molecularWeight: 154.25,
  casNumber: '8000-28-0',
  einECSNumber: '289-995-2',
  inciName: 'Lavandula Angustifolia Oil',
  description: 'High-quality lavender essential oil with calming properties',
  notes: 'Store in cool, dark place. Use within 2 years of opening.',
  safetyData: {
    hazardClass: 'None',
    hazardStatements: [],
    precautionaryStatements: ['Keep out of reach of children'],
    safetyDataSheet: 'https://example.com/sds/lavender.pdf',
    allergenInfo: ['May cause skin irritation in sensitive individuals'],
    restrictions: ['Not for internal use'],
  },
  regulatoryInfo: {
    ifraCategory: '4',
    ifraLimit: 0.8,
    reachCompliant: true,
    fdaApproved: true,
    kosherCertified: false,
    halalCertified: false,
    organicCertified: true,
    certifications: ['USDA Organic', 'ISO 9001'],
  },
  physicalProperties: {
    appearance: 'Clear, colorless to pale yellow liquid',
    color: 'Pale yellow',
    odor: 'Fresh, floral, herbaceous',
    solubility: 'Soluble in alcohol, oils',
    boilingPoint: 204,
    meltingPoint: -15,
    flashPoint: 65,
    refractiveIndex: 1.460,
    specificGravity: 0.88,
  },
  storageConditions: {
    temperature: '15-25°C',
    humidity: 'Below 60% RH',
    lightSensitivity: true,
    airSensitivity: true,
    shelfLife: 24,
    storageNotes: 'Store in amber glass bottles',
  },
  usage: {
    typicalConcentration: 0.5,
    maxConcentration: 2.0,
    applications: ['Perfumes', 'Aromatherapy', 'Cosmetics'],
    compatibility: ['Rose', 'Bergamot', 'Cedarwood'],
    contraindications: ['Pregnancy', 'Epilepsy'],
  },
  images: [
    {
      id: '1',
      url: 'https://example.com/images/lavender.jpg',
      alt: 'Lavender Essential Oil',
      isPrimary: true,
    },
  ],
  documents: [
    {
      id: '1',
      name: 'Certificate of Analysis',
      type: 'pdf',
      url: 'https://example.com/docs/lavender-coa.pdf',
      uploadedAt: '2024-01-15T10:00:00Z',
    },
  ],
  tags: ['floral', 'calming', 'natural', 'organic'],
  isActive: true,
  createdBy: 'user123',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z',
}

const lowStockIngredient: Ingredient = {
  ...sampleIngredient,
  id: '2',
  name: 'Rose Absolute',
  type: 'natural_extract',
  stockLevel: 50,
  minStockLevel: 100,
  cost: 150.00,
  description: 'Premium rose absolute from Bulgaria',
  tags: ['floral', 'luxury', 'rose'],
}

const outOfStockIngredient: Ingredient = {
  ...sampleIngredient,
  id: '3',
  name: 'Sandalwood Essential Oil',
  type: 'essential_oil',
  stockLevel: 0,
  minStockLevel: 50,
  cost: 200.00,
  description: 'Rare sandalwood essential oil from India',
  tags: ['woody', 'luxury', 'rare'],
}

const inactiveIngredient: Ingredient = {
  ...sampleIngredient,
  id: '4',
  name: 'Discontinued Ingredient',
  type: 'synthetic',
  isActive: false,
  description: 'This ingredient has been discontinued',
  tags: ['discontinued'],
}

export const Default: Story = {
  args: {
    ingredient: sampleIngredient,
    showActions: true,
    compact: false,
  },
}

export const Compact: Story = {
  args: {
    ingredient: sampleIngredient,
    showActions: true,
    compact: true,
  },
}

export const LowStock: Story = {
  args: {
    ingredient: lowStockIngredient,
    showActions: true,
    compact: false,
  },
}

export const OutOfStock: Story = {
  args: {
    ingredient: outOfStockIngredient,
    showActions: true,
    compact: false,
  },
}

export const Inactive: Story = {
  args: {
    ingredient: inactiveIngredient,
    showActions: true,
    compact: false,
  },
}

export const NoActions: Story = {
  args: {
    ingredient: sampleIngredient,
    showActions: false,
    compact: false,
  },
}

export const EssentialOil: Story = {
  args: {
    ingredient: {
      ...sampleIngredient,
      name: 'Bergamot Essential Oil',
      type: 'essential_oil',
      category: 'top_notes',
      cost: 35.00,
      description: 'Fresh, citrusy bergamot essential oil from Italy',
      tags: ['citrus', 'fresh', 'uplifting'],
    },
    showActions: true,
    compact: false,
  },
}

export const Synthetic: Story = {
  args: {
    ingredient: {
      ...sampleIngredient,
      name: 'Methyl Anthranilate',
      type: 'synthetic',
      category: 'middle_notes',
      cost: 12.50,
      description: 'Synthetic grape-like fragrance compound',
      tags: ['synthetic', 'grape', 'fruity'],
    },
    showActions: true,
    compact: false,
  },
}

export const Fixative: Story = {
  args: {
    ingredient: {
      ...sampleIngredient,
      name: 'Benzoin Resin',
      type: 'fixative',
      category: 'base_notes',
      cost: 45.00,
      description: 'Natural benzoin resin for fixative properties',
      tags: ['fixative', 'resin', 'warm'],
    },
    showActions: true,
    compact: false,
  },
}

export const Solvent: Story = {
  args: {
    ingredient: {
      ...sampleIngredient,
      name: 'Ethanol 96%',
      type: 'solvent',
      category: 'solvents',
      cost: 8.00,
      description: 'High-purity ethanol for fragrance dilution',
      tags: ['solvent', 'alcohol', 'dilution'],
    },
    showActions: true,
    compact: false,
  },
}

export const WithLongDescription: Story = {
  args: {
    ingredient: {
      ...sampleIngredient,
      description: 'This is a very long description that should wrap properly in the card layout and demonstrate how the component handles longer text content without breaking the design.',
    },
    showActions: true,
    compact: false,
  },
}

export const WithManyTags: Story = {
  args: {
    ingredient: {
      ...sampleIngredient,
      tags: ['floral', 'calming', 'natural', 'organic', 'premium', 'luxury', 'therapeutic', 'aromatherapy'],
    },
    showActions: true,
    compact: false,
  },
}

export const MinimalData: Story = {
  args: {
    ingredient: {
      id: '5',
      name: 'Simple Ingredient',
      type: 'essential_oil',
      supplier: 'Basic Supplier',
      cost: 10.00,
      currency: 'USD',
      stockLevel: 500,
      minStockLevel: 50,
      unit: 'g',
      isActive: true,
      createdBy: 'user123',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    showActions: true,
    compact: false,
  },
}
