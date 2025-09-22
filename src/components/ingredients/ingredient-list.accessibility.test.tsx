import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IngredientList } from './ingredient-list';
import { renderWithAccessibility } from '../../lib/accessibility/testing';

// Mock the ingredient data
const mockIngredients = [
  {
    id: '1',
    name: 'Lavender',
    category: 'Floral',
    description: 'Aromatic flowering plant',
    price: 10.99,
    inStock: true,
    imageUrl: '/images/lavender.jpg'
  },
  {
    id: '2',
    name: 'Vanilla',
    category: 'Sweet',
    description: 'Sweet and warm scent',
    price: 15.99,
    inStock: false,
    imageUrl: '/images/vanilla.jpg'
  },
  {
    id: '3',
    name: 'Sandalwood',
    category: 'Woody',
    description: 'Rich woody fragrance',
    price: 25.99,
    inStock: true,
    imageUrl: '/images/sandalwood.jpg'
  }
];

describe('IngredientList Accessibility', () => {
  it('should be accessible', async () => {
    const { container } = renderWithAccessibility(
      <IngredientList ingredients={mockIngredients} />
    );
    
    await expect(container).toHaveNoViolations();
  });

  it('should have proper list structure', () => {
    render(<IngredientList ingredients={mockIngredients} />);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(mockIngredients.length);
  });

  it('should have proper heading structure', () => {
    render(<IngredientList ingredients={mockIngredients} title="Available Ingredients" />);

    const heading = screen.getByRole('heading', { name: 'Available Ingredients' });
    expect(heading).toBeInTheDocument();
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<IngredientList ingredients={mockIngredients} />);

    const listItems = screen.getAllByRole('listitem');
    
    // Test tab navigation through list items
    for (const item of listItems) {
      await user.tab();
      expect(item).toHaveFocus();
    }
  });

  it('should have proper ARIA labels for interactive elements', () => {
    render(<IngredientList ingredients={mockIngredients} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
    });
  });

  it('should announce loading state', async () => {
    render(<IngredientList ingredients={[]} loading={true} />);

    const loadingIndicator = screen.getByRole('progressbar');
    expect(loadingIndicator).toBeInTheDocument();
    expect(loadingIndicator).toHaveAttribute('aria-label', 'Loading ingredients');
  });

  it('should announce empty state', () => {
    render(<IngredientList ingredients={[]} />);

    const emptyMessage = screen.getByText(/no ingredients found/i);
    expect(emptyMessage).toBeInTheDocument();
  });

  it('should handle ingredient selection', async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    
    render(<IngredientList ingredients={mockIngredients} onSelect={onSelect} />);

    const firstIngredient = screen.getByRole('button', { name: /lavender/i });
    await user.click(firstIngredient);

    expect(onSelect).toHaveBeenCalledWith(mockIngredients[0]);
  });

  it('should support search functionality', async () => {
    const user = userEvent.setup();
    render(<IngredientList ingredients={mockIngredients} searchable={true} />);

    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('aria-label', 'Search ingredients');

    // Test search
    await user.type(searchInput, 'lavender');
    
    await waitFor(() => {
      const filteredItems = screen.getAllByRole('listitem');
      expect(filteredItems).toHaveLength(1);
    });
  });

  it('should support filtering by category', async () => {
    const user = userEvent.setup();
    render(<IngredientList ingredients={mockIngredients} filterable={true} />);

    const filterButton = screen.getByRole('button', { name: /filter/i });
    await user.click(filterButton);

    const floralOption = screen.getByRole('option', { name: 'Floral' });
    await user.click(floralOption);

    await waitFor(() => {
      const filteredItems = screen.getAllByRole('listitem');
      expect(filteredItems).toHaveLength(1);
    });
  });

  it('should support sorting', async () => {
    const user = userEvent.setup();
    render(<IngredientList ingredients={mockIngredients} sortable={true} />);

    const sortButton = screen.getByRole('button', { name: /sort/i });
    await user.click(sortButton);

    const nameOption = screen.getByRole('option', { name: 'Name' });
    await user.click(nameOption);

    // Check that items are sorted
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0]).toHaveTextContent('Lavender');
  });

  it('should support pagination', async () => {
    const user = userEvent.setup();
    const largeIngredientList = Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Ingredient ${i + 1}`,
      category: 'Test',
      description: 'Test ingredient',
      price: 10.99,
      inStock: true,
      imageUrl: '/images/test.jpg'
    }));

    render(<IngredientList ingredients={largeIngredientList} paginated={true} itemsPerPage={5} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeInTheDocument();

    await user.click(nextButton);

    await waitFor(() => {
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(5);
    });
  });

  it('should announce ingredient details', async () => {
    const user = userEvent.setup();
    render(<IngredientList ingredients={mockIngredients} />);

    const firstIngredient = screen.getByRole('button', { name: /lavender/i });
    
    // Hover to show details
    await user.hover(firstIngredient);

    await waitFor(() => {
      const description = screen.getByText('Aromatic flowering plant');
      expect(description).toBeInTheDocument();
    });
  });

  it('should handle ingredient status announcements', () => {
    render(<IngredientList ingredients={mockIngredients} />);

    // Check that out of stock items are properly marked
    const outOfStockItem = screen.getByText(/vanilla/i);
    expect(outOfStockItem).toHaveAttribute('aria-label', /out of stock/i);
  });

  it('should support bulk actions', async () => {
    const user = userEvent.setup();
    const onBulkAction = jest.fn();
    
    render(
      <IngredientList 
        ingredients={mockIngredients} 
        bulkActions={['delete', 'export']}
        onBulkAction={onBulkAction}
      />
    );

    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    await user.click(selectAllCheckbox);

    const deleteButton = screen.getByRole('button', { name: /delete selected/i });
    await user.click(deleteButton);

    expect(onBulkAction).toHaveBeenCalledWith('delete', mockIngredients);
  });

  it('should work with screen readers', async () => {
    const { container } = renderWithAccessibility(
      <IngredientList ingredients={mockIngredients} />
    );
    
    await expect(container).toHaveNoViolations();
  });

  it('should handle dynamic updates', async () => {
    const { rerender } = render(<IngredientList ingredients={[]} />);

    expect(screen.getByText(/no ingredients found/i)).toBeInTheDocument();

    // Add ingredients
    rerender(<IngredientList ingredients={mockIngredients} />);

    await waitFor(() => {
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(mockIngredients.length);
    });
  });

  it('should support custom item rendering', () => {
    const CustomItem = ({ ingredient }: { ingredient: any }) => (
      <div role="listitem" aria-label={`Custom ${ingredient.name}`}>
        {ingredient.name}
      </div>
    );

    render(
      <IngredientList 
        ingredients={mockIngredients} 
        renderItem={CustomItem}
      />
    );

    const customItems = screen.getAllByRole('listitem');
    expect(customItems).toHaveLength(mockIngredients.length);
    expect(customItems[0]).toHaveAttribute('aria-label', 'Custom Lavender');
  });
});

