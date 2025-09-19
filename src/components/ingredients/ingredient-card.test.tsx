import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import { IngredientCard } from './ingredient-card';
import { clickButton, hoverElement } from '@/test-utils';
import type { Ingredient } from '@/types/ingredient';

const mockIngredient: Ingredient = {
  id: '1',
  name: 'Lavender Essential Oil',
  type: 'essential_oil',
  supplier: 'Natural Oils Inc',
  cost: 25.50,
  stockLevel: 100,
  unit: 'ml',
  description: 'High-quality lavender essential oil',
  notes: 'Use sparingly in formulations',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-15'),
};

describe('IngredientCard Component', () => {
  describe('Rendering', () => {
    it('renders ingredient card with all information', () => {
      render(<IngredientCard ingredient={mockIngredient} />);
      
      expect(screen.getByText('Lavender Essential Oil')).toBeInTheDocument();
      expect(screen.getByText('Natural Oils Inc')).toBeInTheDocument();
      expect(screen.getByText('$25.50')).toBeInTheDocument();
      expect(screen.getByText('100 ml')).toBeInTheDocument();
      expect(screen.getByText('High-quality lavender essential oil')).toBeInTheDocument();
    });

    it('renders ingredient type badge', () => {
      render(<IngredientCard ingredient={mockIngredient} />);
      
      expect(screen.getByText('Essential Oil')).toBeInTheDocument();
    });

    it('renders action buttons', () => {
      render(<IngredientCard ingredient={mockIngredient} />);
      
      expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<IngredientCard ingredient={mockIngredient} className="custom-card" />);
      
      const card = screen.getByText('Lavender Essential Oil').closest('div');
      expect(card).toHaveClass('custom-card');
    });
  });

  describe('Stock Level Display', () => {
    it('shows high stock level in green', () => {
      const highStockIngredient = { ...mockIngredient, stockLevel: 100 };
      render(<IngredientCard ingredient={highStockIngredient} />);
      
      const stockElement = screen.getByText('100 ml');
      expect(stockElement).toHaveClass('text-green-600');
    });

    it('shows medium stock level in yellow', () => {
      const mediumStockIngredient = { ...mockIngredient, stockLevel: 50 };
      render(<IngredientCard ingredient={mediumStockIngredient} />);
      
      const stockElement = screen.getByText('50 ml');
      expect(stockElement).toHaveClass('text-yellow-600');
    });

    it('shows low stock level in red', () => {
      const lowStockIngredient = { ...mockIngredient, stockLevel: 5 };
      render(<IngredientCard ingredient={lowStockIngredient} />);
      
      const stockElement = screen.getByText('5 ml');
      expect(stockElement).toHaveClass('text-red-600');
    });

    it('shows out of stock warning', () => {
      const outOfStockIngredient = { ...mockIngredient, stockLevel: 0 };
      render(<IngredientCard ingredient={outOfStockIngredient} />);
      
      expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    });
  });

  describe('Cost Display', () => {
    it('formats cost correctly', () => {
      render(<IngredientCard ingredient={mockIngredient} />);
      
      expect(screen.getByText('$25.50')).toBeInTheDocument();
    });

    it('handles zero cost', () => {
      const freeIngredient = { ...mockIngredient, cost: 0 };
      render(<IngredientCard ingredient={freeIngredient} />);
      
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('handles high cost values', () => {
      const expensiveIngredient = { ...mockIngredient, cost: 1250.75 };
      render(<IngredientCard ingredient={expensiveIngredient} />);
      
      expect(screen.getByText('$1,250.75')).toBeInTheDocument();
    });
  });

  describe('Interactive Features', () => {
    it('calls onView when view button is clicked', () => {
      const onView = jest.fn();
      render(<IngredientCard ingredient={mockIngredient} onView={onView} />);
      
      const viewButton = screen.getByRole('button', { name: /view/i });
      viewButton.click();
      
      expect(onView).toHaveBeenCalledWith(mockIngredient);
    });

    it('calls onEdit when edit button is clicked', () => {
      const onEdit = jest.fn();
      render(<IngredientCard ingredient={mockIngredient} onEdit={onEdit} />);
      
      const editButton = screen.getByRole('button', { name: /edit/i });
      editButton.click();
      
      expect(onEdit).toHaveBeenCalledWith(mockIngredient);
    });

    it('calls onDelete when delete button is clicked', () => {
      const onDelete = jest.fn();
      render(<IngredientCard ingredient={mockIngredient} onDelete={onDelete} />);
      
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      deleteButton.click();
      
      expect(onDelete).toHaveBeenCalledWith(mockIngredient);
    });

    it('shows confirmation dialog before delete', () => {
      const onDelete = jest.fn();
      render(<IngredientCard ingredient={mockIngredient} onDelete={onDelete} />);
      
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      deleteButton.click();
      
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('cancels delete when cancel button is clicked', () => {
      const onDelete = jest.fn();
      render(<IngredientCard ingredient={mockIngredient} onDelete={onDelete} />);
      
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      deleteButton.click();
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      cancelButton.click();
      
      expect(onDelete).not.toHaveBeenCalled();
      expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();
    });

    it('confirms delete when confirm button is clicked', () => {
      const onDelete = jest.fn();
      render(<IngredientCard ingredient={mockIngredient} onDelete={onDelete} />);
      
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      deleteButton.click();
      
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      confirmButton.click();
      
      expect(onDelete).toHaveBeenCalledWith(mockIngredient);
    });
  });

  describe('Hover Effects', () => {
    it('shows additional information on hover', async () => {
      render(<IngredientCard ingredient={mockIngredient} />);
      
      const card = screen.getByText('Lavender Essential Oil').closest('div');
      await hoverElement(card!);
      
      await waitFor(() => {
        expect(screen.getByText('Use sparingly in formulations')).toBeInTheDocument();
      });
    });

    it('shows action buttons on hover', async () => {
      render(<IngredientCard ingredient={mockIngredient} />);
      
      const card = screen.getByText('Lavender Essential Oil').closest('div');
      await hoverElement(card!);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /view/i })).toBeVisible();
        expect(screen.getByRole('button', { name: /edit/i })).toBeVisible();
      });
    });
  });

  describe('Loading State', () => {
    it('shows loading state when ingredient is loading', () => {
      render(<IngredientCard ingredient={mockIngredient} isLoading />);
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('disables interactions when loading', () => {
      render(<IngredientCard ingredient={mockIngredient} isLoading />);
      
      const viewButton = screen.queryByRole('button', { name: /view/i });
      const editButton = screen.queryByRole('button', { name: /edit/i });
      
      expect(viewButton).toBeDisabled();
      expect(editButton).toBeDisabled();
    });
  });

  describe('Error State', () => {
    it('shows error state when ingredient has error', () => {
      render(<IngredientCard ingredient={mockIngredient} error="Failed to load ingredient" />);
      
      expect(screen.getByText(/failed to load ingredient/i)).toBeInTheDocument();
    });

    it('disables interactions when error', () => {
      render(<IngredientCard ingredient={mockIngredient} error="Error" />);
      
      const viewButton = screen.queryByRole('button', { name: /view/i });
      const editButton = screen.queryByRole('button', { name: /edit/i });
      
      expect(viewButton).toBeDisabled();
      expect(editButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<IngredientCard ingredient={mockIngredient} />);
      
      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('aria-label', 'Lavender Essential Oil ingredient card');
    });

    it('has proper button labels', () => {
      render(<IngredientCard ingredient={mockIngredient} />);
      
      expect(screen.getByRole('button', { name: /view lavender essential oil/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit lavender essential oil/i })).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(<IngredientCard ingredient={mockIngredient} />);
      
      const viewButton = screen.getByRole('button', { name: /view/i });
      const editButton = screen.getByRole('button', { name: /edit/i });
      
      viewButton.focus();
      expect(viewButton).toHaveFocus();
      
      viewButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
      expect(editButton).toHaveFocus();
    });

    it('announces stock level changes', () => {
      const { rerender } = render(<IngredientCard ingredient={mockIngredient} />);
      
      const lowStockIngredient = { ...mockIngredient, stockLevel: 5 };
      rerender(<IngredientCard ingredient={lowStockIngredient} />);
      
      const stockElement = screen.getByText('5 ml');
      expect(stockElement).toHaveAttribute('aria-label', 'Low stock: 5 ml');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing optional fields', () => {
      const minimalIngredient = {
        id: '1',
        name: 'Test Ingredient',
        type: 'synthetic' as const,
        supplier: 'Test Supplier',
        cost: 10,
        stockLevel: 50,
        unit: 'g' as const,
      };
      
      render(<IngredientCard ingredient={minimalIngredient} />);
      
      expect(screen.getByText('Test Ingredient')).toBeInTheDocument();
      expect(screen.queryByText('Description')).not.toBeInTheDocument();
      expect(screen.queryByText('Notes')).not.toBeInTheDocument();
    });

    it('handles very long ingredient names', () => {
      const longNameIngredient = {
        ...mockIngredient,
        name: 'This is a very long ingredient name that might overflow the card layout',
      };
      
      render(<IngredientCard ingredient={longNameIngredient} />);
      
      expect(screen.getByText('This is a very long ingredient name that might overflow the card layout')).toBeInTheDocument();
    });

    it('handles special characters in ingredient name', () => {
      const specialCharIngredient = {
        ...mockIngredient,
        name: 'Ingredient with Special Chars: @#$%^&*()',
      };
      
      render(<IngredientCard ingredient={specialCharIngredient} />);
      
      expect(screen.getByText('Ingredient with Special Chars: @#$%^&*()')).toBeInTheDocument();
    });

    it('handles zero stock with proper formatting', () => {
      const zeroStockIngredient = { ...mockIngredient, stockLevel: 0 };
      render(<IngredientCard ingredient={zeroStockIngredient} />);
      
      expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('does not re-render unnecessarily', () => {
      const renderSpy = jest.fn();
      
      const TestComponent = () => {
        renderSpy();
        return <IngredientCard ingredient={mockIngredient} />;
      };
      
      const { rerender } = render(<TestComponent />);
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      rerender(<TestComponent />);
      
      // Should not re-render if props haven't changed
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('memoizes expensive calculations', () => {
      const expensiveIngredient = {
        ...mockIngredient,
        cost: 1234.56789,
        stockLevel: 999,
      };
      
      const { rerender } = render(<IngredientCard ingredient={expensiveIngredient} />);
      
      expect(screen.getByText('$1,234.57')).toBeInTheDocument();
      
      rerender(<IngredientCard ingredient={expensiveIngredient} />);
      
      // Should not recalculate if ingredient hasn't changed
      expect(screen.getByText('$1,234.57')).toBeInTheDocument();
    });
  });
});
