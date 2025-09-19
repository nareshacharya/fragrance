import type { Meta, StoryObj } from '@storybook/react'
import { IngredientForm } from './ingredient-form'
import { Ingredient, CreateIngredientRequest, UpdateIngredientRequest } from '@/types/ingredient'

const meta: Meta<typeof IngredientForm> = {
  title: 'Components/Ingredients/IngredientForm',
  component: IngredientForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submit' },
    onCancel: { action: 'cancel' },
    onDelete: { action: 'delete' },
    loading: { control: 'boolean' },
    mode: { control: 'select', options: ['create', 'edit'] },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Sample ingredient for edit mode
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

export const CreateMode: Story = {
  args: {
    mode: 'create',
    loading: false,
    error: null,
  },
}

export const EditMode: Story = {
  args: {
    ingredient: sampleIngredient,
    mode: 'edit',
    loading: false,
    error: null,
  },
}

export const Loading: Story = {
  args: {
    mode: 'create',
    loading: true,
    error: null,
  },
}

export const WithError: Story = {
  args: {
    mode: 'create',
    loading: false,
    error: 'Failed to create ingredient. Please check your input and try again.',
  },
}

export const MinimalData: Story = {
  args: {
    ingredient: {
      id: '2',
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
    mode: 'edit',
    loading: false,
    error: null,
  },
}

export const SyntheticIngredient: Story = {
  args: {
    ingredient: {
      ...sampleIngredient,
      id: '3',
      name: 'Methyl Anthranilate',
      type: 'synthetic',
      category: 'middle_notes',
      supplier: 'Chemical Solutions Co.',
      supplierCode: 'CS-MA-003',
      cost: 12.50,
      description: 'Synthetic grape-like fragrance compound',
      notes: 'Stable synthetic compound with consistent quality',
      tags: ['synthetic', 'grape', 'fruity'],
      regulatoryInfo: {
        ifraCategory: '4',
        ifraLimit: 0.2,
        reachCompliant: true,
        fdaApproved: true,
        kosherCertified: false,
        halalCertified: false,
        organicCertified: false,
        certifications: ['GRAS'],
      },
    },
    mode: 'edit',
    loading: false,
    error: null,
  },
}

export const FixativeIngredient: Story = {
  args: {
    ingredient: {
      ...sampleIngredient,
      id: '4',
      name: 'Benzoin Resin',
      type: 'fixative',
      category: 'base_notes',
      supplier: 'Natural Resins Ltd.',
      supplierCode: 'NR-BR-004',
      cost: 45.00,
      description: 'Natural benzoin resin for fixative properties',
      notes: 'Excellent fixative for perfumes, adds warmth and longevity',
      tags: ['fixative', 'resin', 'warm', 'natural'],
      physicalProperties: {
        appearance: 'Brown, viscous resin',
        color: 'Dark brown',
        odor: 'Sweet, balsamic, vanilla-like',
        solubility: 'Soluble in alcohol',
        meltingPoint: 80,
        specificGravity: 1.12,
      },
    },
    mode: 'edit',
    loading: false,
    error: null,
  },
}

export const SolventIngredient: Story = {
  args: {
    ingredient: {
      ...sampleIngredient,
      id: '5',
      name: 'Ethanol 96%',
      type: 'solvent',
      category: 'solvents',
      supplier: 'Solvent Solutions Inc.',
      supplierCode: 'SS-ET-005',
      cost: 8.00,
      description: 'High-purity ethanol for fragrance dilution',
      notes: 'Handle with care - flammable liquid',
      tags: ['solvent', 'alcohol', 'dilution'],
      physicalProperties: {
        appearance: 'Clear, colorless liquid',
        color: 'Colorless',
        odor: 'Characteristic alcohol odor',
        solubility: 'Miscible with water',
        boilingPoint: 78,
        meltingPoint: -114,
        flashPoint: 13,
        refractiveIndex: 1.361,
        specificGravity: 0.789,
      },
      safetyData: {
        hazardClass: 'Flammable Liquid',
        hazardStatements: ['Highly flammable liquid and vapour'],
        precautionaryStatements: ['Keep away from heat, sparks, open flames'],
        restrictions: ['For professional use only'],
      },
    },
    mode: 'edit',
    loading: false,
    error: null,
  },
}

export const WithLongDescription: Story = {
  args: {
    ingredient: {
      ...sampleIngredient,
      description: 'This is a very long description that demonstrates how the form handles longer text content. It includes multiple sentences and provides detailed information about the ingredient, its properties, uses, and any special considerations for handling or storage.',
      notes: 'These are detailed notes that provide additional information about the ingredient. They may include handling instructions, storage requirements, quality specifications, or any other relevant information that users should be aware of when working with this ingredient.',
    },
    mode: 'edit',
    loading: false,
    error: null,
  },
}

export const WithManyTags: Story = {
  args: {
    ingredient: {
      ...sampleIngredient,
      tags: ['floral', 'calming', 'natural', 'organic', 'premium', 'luxury', 'therapeutic', 'aromatherapy', 'relaxing', 'sleep'],
    },
    mode: 'edit',
    loading: false,
    error: null,
  },
}

export const InactiveIngredient: Story = {
  args: {
    ingredient: {
      ...sampleIngredient,
      isActive: false,
      notes: 'This ingredient has been discontinued and is no longer available for new formulations.',
    },
    mode: 'edit',
    loading: false,
    error: null,
  },
}
