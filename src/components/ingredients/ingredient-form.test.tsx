import React from 'react'
import { render, screen, fireEvent, waitFor } from '@/test-utils'
import { IngredientForm } from './ingredient-form'
import { Ingredient, CreateIngredientRequest, UpdateIngredientRequest } from '@/types/ingredient'

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => ({
    register: jest.fn(),
    handleSubmit: jest.fn((fn) => fn),
    formState: { errors: {}, isValid: true },
    watch: jest.fn(() => ({})),
    setValue: jest.fn(),
    reset: jest.fn(),
  })),
}))

// Mock the ingredient schemas
jest.mock('@/types/ingredient', () => ({
  ...jest.requireActual('@/types/ingredient'),
  ingredientSchemas: {
    createIngredient: {
      safeParse: jest.fn(),
    },
    updateIngredient: {
      safeParse: jest.fn(),
    },
  },
  INGREDIENT_TYPE_LABELS_MAP: {
    essential_oil: 'Essential Oil',
    alcohol: 'Alcohol',
    fixative: 'Fixative',
  },
  WEIGHT_UNIT_LABELS_MAP: {
    g: 'Grams',
    ml: 'Milliliters',
    kg: 'Kilograms',
  },
  INGREDIENT_CATEGORY_LABELS: {
    top_notes: 'Top Notes',
    middle_notes: 'Middle Notes',
    base_notes: 'Base Notes',
  },
}))

const mockIngredient: Ingredient = {
  id: '1',
  name: 'Lavender Oil',
  type: 'essential_oil',
  category: 'top_notes',
  supplier: 'Essential Oils Co.',
  supplierCode: 'EO-LAV-001',
  cost: 25.50,
  currency: 'USD',
  stockLevel: 1000,
  minStockLevel: 100,
  maxStockLevel: 5000,
  unit: 'ml',
  density: 0.9,
  molecularWeight: 154.25,
  casNumber: '8000-28-0',
  einECSNumber: '284-545-0',
  inciName: 'Lavandula Angustifolia Oil',
  description: 'High-quality lavender essential oil',
  notes: 'Store in cool, dark place',
  safetyData: {
    flashPoint: 65,
    boilingPoint: 200,
    solubility: 'Insoluble in water',
    stability: 'Stable under normal conditions',
  },
  regulatoryInfo: {
    fdaApproved: true,
    reachCompliant: true,
    ifraRestricted: false,
  },
  physicalProperties: {
    appearance: 'Clear liquid',
    odor: 'Floral, herbaceous',
    color: 'Colorless to pale yellow',
  },
  storageConditions: {
    temperature: '15-25°C',
    humidity: 'Below 60%',
    light: 'Protect from light',
  },
  usage: {
    concentration: '0.5-2%',
    applications: ['Perfumes', 'Cosmetics', 'Aromatherapy'],
    notes: 'Use sparingly in formulations',
  },
  tags: ['floral', 'calming', 'natural'],
  isActive: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
}

describe('IngredientForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders create form by default', () => {
      render(<IngredientForm {...defaultProps} />)
      
      expect(screen.getByText('Add New Ingredient')).toBeInTheDocument()
      expect(screen.getByText('Fill in the details to add a new ingredient to your inventory')).toBeInTheDocument()
      expect(screen.getByText('Create')).toBeInTheDocument()
    })

    it('renders edit form when ingredient is provided', () => {
      render(<IngredientForm {...defaultProps} ingredient={mockIngredient} mode="edit" />)
      
      expect(screen.getByText('Edit Ingredient')).toBeInTheDocument()
      expect(screen.getByText('Update the ingredient information')).toBeInTheDocument()
      expect(screen.getByText('Save Changes')).toBeInTheDocument()
    })

    it('renders delete button in edit mode', () => {
      const onDelete = jest.fn()
      render(
        <IngredientForm 
          {...defaultProps} 
          ingredient={mockIngredient} 
          mode="edit" 
          onDelete={onDelete}
        />
      )
      
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })

    it('does not render delete button in create mode', () => {
      render(<IngredientForm {...defaultProps} mode="create" />)
      
      expect(screen.queryByText('Delete')).not.toBeInTheDocument()
    })

    it('renders with custom className', () => {
      const { container } = render(<IngredientForm {...defaultProps} className="custom-class" />)
      
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('Form Tabs', () => {
    it('renders all form tabs', () => {
      render(<IngredientForm {...defaultProps} />)
      
      expect(screen.getByText('Basic Info')).toBeInTheDocument()
      expect(screen.getByText('Safety Data')).toBeInTheDocument()
      expect(screen.getByText('Regulatory')).toBeInTheDocument()
      expect(screen.getByText('Physical Properties')).toBeInTheDocument()
      expect(screen.getByText('Usage Info')).toBeInTheDocument()
    })

    it('shows basic info tab by default', () => {
      render(<IngredientForm {...defaultProps} />)
      
      expect(screen.getByText('Basic Information')).toBeInTheDocument()
    })

    it('switches tabs when clicked', () => {
      render(<IngredientForm {...defaultProps} />)
      
      const safetyTab = screen.getByText('Safety Data')
      fireEvent.click(safetyTab)
      
      expect(screen.getByText('Safety Information')).toBeInTheDocument()
    })
  })

  describe('Basic Information Tab', () => {
    it('renders basic information fields', () => {
      render(<IngredientForm {...defaultProps} />)
      
      expect(screen.getByLabelText('Name *')).toBeInTheDocument()
      expect(screen.getByLabelText('Type *')).toBeInTheDocument()
      expect(screen.getByLabelText('Category')).toBeInTheDocument()
      expect(screen.getByLabelText('Supplier *')).toBeInTheDocument()
      expect(screen.getByLabelText('Cost *')).toBeInTheDocument()
      expect(screen.getByLabelText('Stock Level *')).toBeInTheDocument()
      expect(screen.getByLabelText('Unit *')).toBeInTheDocument()
    })

    it('renders type options', () => {
      render(<IngredientForm {...defaultProps} />)
      
      const typeSelect = screen.getByLabelText('Type *')
      expect(typeSelect).toBeInTheDocument()
      
      // Check for option values
      expect(screen.getByText('Essential Oil')).toBeInTheDocument()
      expect(screen.getByText('Alcohol')).toBeInTheDocument()
      expect(screen.getByText('Fixative')).toBeInTheDocument()
    })

    it('renders category options', () => {
      render(<IngredientForm {...defaultProps} />)
      
      const categorySelect = screen.getByLabelText('Category')
      expect(categorySelect).toBeInTheDocument()
      
      // Check for option values
      expect(screen.getByText('Top Notes')).toBeInTheDocument()
      expect(screen.getByText('Middle Notes')).toBeInTheDocument()
      expect(screen.getByText('Base Notes')).toBeInTheDocument()
    })

    it('renders unit options', () => {
      render(<IngredientForm {...defaultProps} />)
      
      const unitSelect = screen.getByLabelText('Unit *')
      expect(unitSelect).toBeInTheDocument()
      
      // Check for option values
      expect(screen.getByText('Grams')).toBeInTheDocument()
      expect(screen.getByText('Milliliters')).toBeInTheDocument()
      expect(screen.getByText('Kilograms')).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('calls onSubmit when form is submitted', async () => {
      const onSubmit = jest.fn().mockResolvedValue(undefined)
      render(<IngredientForm {...defaultProps} onSubmit={onSubmit} />)
      
      const submitButton = screen.getByText('Create')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })
    })

    it('calls onSubmit with correct data in create mode', async () => {
      const onSubmit = jest.fn().mockResolvedValue(undefined)
      render(<IngredientForm {...defaultProps} onSubmit={onSubmit} />)
      
      const submitButton = screen.getByText('Create')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            currency: 'USD',
            minStockLevel: 0,
            isActive: true,
          })
        )
      })
    })

    it('calls onSubmit with ingredient data in edit mode', async () => {
      const onSubmit = jest.fn().mockResolvedValue(undefined)
      render(<IngredientForm {...defaultProps} ingredient={mockIngredient} mode="edit" onSubmit={onSubmit} />)
      
      const submitButton = screen.getByText('Save Changes')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Lavender Oil',
            type: 'essential_oil',
            category: 'top_notes',
            supplier: 'Essential Oils Co.',
            cost: 25.50,
            currency: 'USD',
            stockLevel: 1000,
            unit: 'ml',
            tags: ['floral', 'calming', 'natural'],
          })
        )
      })
    })

    it('disables submit button when loading', () => {
      render(<IngredientForm {...defaultProps} loading={true} />)
      
      const submitButton = screen.getByText('Saving...')
      expect(submitButton).toBeDisabled()
    })

    it('disables submit button when form is invalid', () => {
      const mockUseForm = require('react-hook-form').useForm
      mockUseForm.mockReturnValue({
        register: jest.fn(),
        handleSubmit: jest.fn((fn) => fn),
        formState: { errors: {}, isValid: false },
        watch: jest.fn(() => ({})),
        setValue: jest.fn(),
        reset: jest.fn(),
      })

      render(<IngredientForm {...defaultProps} />)
      
      const submitButton = screen.getByText('Create')
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Form Actions', () => {
    it('calls onCancel when cancel button is clicked', () => {
      const onCancel = jest.fn()
      render(<IngredientForm {...defaultProps} onCancel={onCancel} />)
      
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
      
      expect(onCancel).toHaveBeenCalled()
    })

    it('calls onDelete when delete button is clicked', () => {
      const onDelete = jest.fn()
      render(
        <IngredientForm 
          {...defaultProps} 
          ingredient={mockIngredient} 
          mode="edit" 
          onDelete={onDelete}
        />
      )
      
      const deleteButton = screen.getByText('Delete')
      fireEvent.click(deleteButton)
      
      expect(onDelete).toHaveBeenCalledWith(mockIngredient)
    })

    it('disables action buttons when loading', () => {
      render(<IngredientForm {...defaultProps} loading={true} />)
      
      expect(screen.getByText('Cancel')).toBeDisabled()
    })
  })

  describe('Error Handling', () => {
    it('displays error message when error prop is provided', () => {
      const errorMessage = 'Failed to save ingredient'
      render(<IngredientForm {...defaultProps} error={errorMessage} />)
      
      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    it('displays field validation errors', () => {
      const mockUseForm = require('react-hook-form').useForm
      mockUseForm.mockReturnValue({
        register: jest.fn(),
        handleSubmit: jest.fn((fn) => fn),
        formState: { 
          errors: { 
            name: { message: 'Name is required' },
            cost: { message: 'Cost must be positive' }
          }, 
          isValid: false 
        },
        watch: jest.fn(() => ({})),
        setValue: jest.fn(),
        reset: jest.fn(),
      })

      render(<IngredientForm {...defaultProps} />)
      
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Cost must be positive')).toBeInTheDocument()
    })
  })

  describe('File Upload', () => {
    it('renders file upload section', () => {
      render(<IngredientForm {...defaultProps} />)
      
      expect(screen.getByText('Attachments')).toBeInTheDocument()
      expect(screen.getByText('Upload Files')).toBeInTheDocument()
    })

    it('handles file upload', () => {
      render(<IngredientForm {...defaultProps} />)
      
      const fileInput = screen.getByLabelText('Upload Files')
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      
      fireEvent.change(fileInput, { target: { files: [file] } })
      
      expect(screen.getByText('test.pdf')).toBeInTheDocument()
    })

    it('removes uploaded file when remove button is clicked', () => {
      render(<IngredientForm {...defaultProps} />)
      
      const fileInput = screen.getByLabelText('Upload Files')
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      
      fireEvent.change(fileInput, { target: { files: [file] } })
      expect(screen.getByText('test.pdf')).toBeInTheDocument()
      
      const removeButton = screen.getByText('Remove')
      fireEvent.click(removeButton)
      
      expect(screen.queryByText('test.pdf')).not.toBeInTheDocument()
    })
  })

  describe('Tags Management', () => {
    it('renders tags section', () => {
      render(<IngredientForm {...defaultProps} />)
      
      expect(screen.getByText('Tags')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Add tag')).toBeInTheDocument()
    })

    it('adds new tag', () => {
      render(<IngredientForm {...defaultProps} />)
      
      const tagInput = screen.getByPlaceholderText('Add tag')
      const addButton = screen.getByText('Add')
      
      fireEvent.change(tagInput, { target: { value: 'floral' } })
      fireEvent.click(addButton)
      
      expect(screen.getByText('floral')).toBeInTheDocument()
    })

    it('does not add duplicate tags', () => {
      render(<IngredientForm {...defaultProps} ingredient={mockIngredient} />)
      
      const tagInput = screen.getByPlaceholderText('Add tag')
      const addButton = screen.getByText('Add')
      
      // Try to add existing tag
      fireEvent.change(tagInput, { target: { value: 'floral' } })
      fireEvent.click(addButton)
      
      // Should not add duplicate
      const floralTags = screen.getAllByText('floral')
      expect(floralTags).toHaveLength(1) // Only the existing one
    })

    it('removes tag when remove button is clicked', () => {
      render(<IngredientForm {...defaultProps} ingredient={mockIngredient} />)
      
      expect(screen.getByText('floral')).toBeInTheDocument()
      
      const removeButtons = screen.getAllByText('×')
      fireEvent.click(removeButtons[0]) // Remove first tag
      
      expect(screen.queryByText('floral')).not.toBeInTheDocument()
    })

    it('adds tag on Enter key press', () => {
      render(<IngredientForm {...defaultProps} />)
      
      const tagInput = screen.getByPlaceholderText('Add tag')
      
      fireEvent.change(tagInput, { target: { value: 'natural' } })
      fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' })
      
      expect(screen.getByText('natural')).toBeInTheDocument()
    })
  })

  describe('Form Reset', () => {
    it('resets form when ingredient changes', () => {
      const mockReset = jest.fn()
      const mockUseForm = require('react-hook-form').useForm
      mockUseForm.mockReturnValue({
        register: jest.fn(),
        handleSubmit: jest.fn((fn) => fn),
        formState: { errors: {}, isValid: true },
        watch: jest.fn(() => ({})),
        setValue: jest.fn(),
        reset: mockReset,
      })

      const { rerender } = render(<IngredientForm {...defaultProps} />)
      
      rerender(<IngredientForm {...defaultProps} ingredient={mockIngredient} />)
      
      expect(mockReset).toHaveBeenCalledWith({
        name: 'Lavender Oil',
        type: 'essential_oil',
        category: 'top_notes',
        supplier: 'Essential Oils Co.',
        supplierCode: 'EO-LAV-001',
        cost: 25.50,
        currency: 'USD',
        stockLevel: 1000,
        minStockLevel: 100,
        maxStockLevel: 5000,
        unit: 'ml',
        density: 0.9,
        molecularWeight: 154.25,
        casNumber: '8000-28-0',
        einECSNumber: '284-545-0',
        inciName: 'Lavandula Angustifolia Oil',
        description: 'High-quality lavender essential oil',
        notes: 'Store in cool, dark place',
        safetyData: mockIngredient.safetyData,
        regulatoryInfo: mockIngredient.regulatoryInfo,
        physicalProperties: mockIngredient.physicalProperties,
        storageConditions: mockIngredient.storageConditions,
        usage: mockIngredient.usage,
        tags: ['floral', 'calming', 'natural'],
        isActive: true,
      })
    })
  })

  describe('Loading States', () => {
    it('shows loading state on submit button', () => {
      render(<IngredientForm {...defaultProps} loading={true} />)
      
      expect(screen.getByText('Saving...')).toBeInTheDocument()
    })

    it('disables all buttons when loading', () => {
      render(<IngredientForm {...defaultProps} loading={true} />)
      
      expect(screen.getByText('Cancel')).toBeDisabled()
      expect(screen.getByText('Saving...')).toBeDisabled()
    })
  })

  describe('Tab Navigation', () => {
    it('navigates between tabs correctly', () => {
      render(<IngredientForm {...defaultProps} />)
      
      // Start on basic tab
      expect(screen.getByText('Basic Information')).toBeInTheDocument()
      
      // Switch to safety tab
      fireEvent.click(screen.getByText('Safety Data'))
      expect(screen.getByText('Safety Information')).toBeInTheDocument()
      
      // Switch to regulatory tab
      fireEvent.click(screen.getByText('Regulatory'))
      expect(screen.getByText('Regulatory Information')).toBeInTheDocument()
      
      // Switch to physical properties tab
      fireEvent.click(screen.getByText('Physical Properties'))
      expect(screen.getByText('Physical Properties')).toBeInTheDocument()
      
      // Switch to usage tab
      fireEvent.click(screen.getByText('Usage Info'))
      expect(screen.getByText('Usage Information')).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('shows required field indicators', () => {
      render(<IngredientForm {...defaultProps} />)
      
      expect(screen.getByText('Name *')).toBeInTheDocument()
      expect(screen.getByText('Type *')).toBeInTheDocument()
      expect(screen.getByText('Supplier *')).toBeInTheDocument()
      expect(screen.getByText('Cost *')).toBeInTheDocument()
      expect(screen.getByText('Stock Level *')).toBeInTheDocument()
      expect(screen.getByText('Unit *')).toBeInTheDocument()
    })

    it('applies error styling to invalid fields', () => {
      const mockUseForm = require('react-hook-form').useForm
      mockUseForm.mockReturnValue({
        register: jest.fn(),
        handleSubmit: jest.fn((fn) => fn),
        formState: { 
          errors: { 
            name: { message: 'Name is required' }
          }, 
          isValid: false 
        },
        watch: jest.fn(() => ({})),
        setValue: jest.fn(),
        reset: jest.fn(),
      })

      render(<IngredientForm {...defaultProps} />)
      
      const nameInput = screen.getByLabelText('Name *')
      expect(nameInput).toHaveClass('border-destructive')
    })
  })
})
