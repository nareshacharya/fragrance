import React from 'react';
import { render, screen } from '@/test-utils';
import { Button } from './button';
import { clickButton, pressKey, expectToBeDisabled, expectToHaveClass } from '@/test-utils';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders button with default props', () => {
      render(<Button>Click me</Button>);
      
      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });

    it('renders button with custom text', () => {
      render(<Button>Custom Button Text</Button>);
      
      expect(screen.getByRole('button', { name: 'Custom Button Text' })).toBeInTheDocument();
    });

    it('renders button with children components', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('IconText');
    });
  });

  describe('Variants', () => {
    it('renders primary variant by default', () => {
      render(<Button>Primary</Button>);
      
      const button = screen.getByRole('button');
      expectToHaveClass(button, 'bg-primary');
    });

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      
      const button = screen.getByRole('button');
      expectToHaveClass(button, 'bg-secondary');
    });

    it('renders outline variant', () => {
      render(<Button variant="outline">Outline</Button>);
      
      const button = screen.getByRole('button');
      expectToHaveClass(button, 'border');
      expectToHaveClass(button, 'bg-transparent');
    });

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      
      const button = screen.getByRole('button');
      expectToHaveClass(button, 'hover:bg-accent');
    });

    it('renders link variant', () => {
      render(<Button variant="link">Link</Button>);
      
      const button = screen.getByRole('button');
      expectToHaveClass(button, 'text-primary');
      expectToHaveClass(button, 'underline-offset-4');
    });

    it('renders destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>);
      
      const button = screen.getByRole('button');
      expectToHaveClass(button, 'bg-destructive');
    });
  });

  describe('Sizes', () => {
    it('renders medium size by default', () => {
      render(<Button>Medium</Button>);
      
      const button = screen.getByRole('button');
      expectToHaveClass(button, 'h-10');
      expectToHaveClass(button, 'px-4');
    });

    it('renders small size', () => {
      render(<Button size="sm">Small</Button>);
      
      const button = screen.getByRole('button');
      expectToHaveClass(button, 'h-8');
      expectToHaveClass(button, 'px-3');
    });

    it('renders large size', () => {
      render(<Button size="lg">Large</Button>);
      
      const button = screen.getByRole('button');
      expectToHaveClass(button, 'h-12');
      expectToHaveClass(button, 'px-6');
    });

    it('renders icon size', () => {
      render(<Button size="icon">👍</Button>);
      
      const button = screen.getByRole('button');
      expectToHaveClass(button, 'h-10');
      expectToHaveClass(button, 'w-10');
    });
  });

  describe('States', () => {
    it('handles disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      
      const button = screen.getByRole('button');
      expectToBeDisabled(button);
      expectToHaveClass(button, 'disabled:opacity-50');
    });

    it('handles loading state', () => {
      render(<Button loading>Loading</Button>);
      
      const button = screen.getByRole('button');
      expectToBeDisabled(button);
      
      // Check for loading spinner
      const spinner = button.querySelector('svg');
      expect(spinner).toBeInTheDocument();
      expectToHaveClass(spinner!, 'animate-spin');
      
      // Button should still show text
      expect(button).toHaveTextContent('Loading');
    });

    it('loading state takes precedence over disabled', () => {
      render(
        <Button loading disabled={false}>
          Loading
        </Button>
      );
      
      const button = screen.getByRole('button');
      expectToBeDisabled(button);
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      
      const button = screen.getByRole('button');
      expectToHaveClass(button, 'custom-class');
    });

    it('forwards HTML button attributes', () => {
      render(
        <Button type="submit" name="submit-btn" data-testid="submit">
          Submit
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('name', 'submit-btn');
      expect(button).toHaveAttribute('data-testid', 'submit');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Ref Button</Button>);
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveTextContent('Ref Button');
    });
  });

  describe('AsChild Prop', () => {
    it('renders as child component when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      
      const link = screen.getByRole('link', { name: 'Link Button' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      
      // Should have button classes but be a link element
      expectToHaveClass(link, 'bg-primary');
    });

    it('maintains button styling when asChild is true', () => {
      render(
        <Button asChild variant="outline" size="lg">
          <div>Custom Element</div>
        </Button>
      );
      
      const element = screen.getByText('Custom Element');
      expectToHaveClass(element, 'border');
      expectToHaveClass(element, 'h-12');
    });
  });

  describe('User Interactions', () => {
    it('calls onClick when clicked', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      await clickButton('Click me');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );
      
      const button = screen.getByRole('button');
      await clickButton('Disabled');
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', async () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} loading>
          Loading
        </Button>
      );
      
      await clickButton('Loading');
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles keyboard navigation', async () => {
      render(<Button>Keyboard</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      expect(button).toHaveFocus();
    });

    it('triggers click on Enter key press', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Enter Click</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      await pressKey('Enter');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('triggers click on Space key press', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Space Click</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      await pressKey('Space');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility attributes', () => {
      render(<Button>Accessible Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Accessible Button' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });

    it('maintains focus ring styles', () => {
      render(<Button>Focus Ring</Button>);
      
      const button = screen.getByRole('button');
      expectToHaveClass(button, 'focus-visible:outline-none');
      expectToHaveClass(button, 'focus-visible:ring-2');
    });

    it('supports aria-label', () => {
      render(<Button aria-label="Custom aria label">Icon</Button>);
      
      const button = screen.getByRole('button', { name: 'Custom aria label' });
      expect(button).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <div>
          <Button aria-describedby="help-text">Help Button</Button>
          <div id="help-text">This button provides help</div>
        </div>
      );
      
      const button = screen.getByRole('button', { name: 'Help Button' });
      expect(button).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('announces loading state to screen readers', () => {
      render(<Button loading aria-label="Loading button">Loading</Button>);
      
      const button = screen.getByRole('button', { name: 'Loading button' });
      expect(button).toBeInTheDocument();
      expectToBeDisabled(button);
    });
  });

  describe('Form Integration', () => {
    it('works as submit button in forms', async () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());
      
      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Submit Form</Button>
        </form>
      );
      
      await clickButton('Submit Form');
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('works as reset button in forms', () => {
      render(
        <form>
          <input defaultValue="test" />
          <Button type="reset">Reset Form</Button>
        </form>
      );
      
      const button = screen.getByRole('button', { name: 'Reset Form' });
      expect(button).toHaveAttribute('type', 'reset');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      render(<Button></Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    it('handles null children', () => {
      render(<Button>{null}</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('handles undefined children', () => {
      render(<Button>{undefined}</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('handles complex nested children', () => {
      render(
        <Button>
          <span>
            <strong>Bold</strong> and <em>italic</em>
          </span>
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Bold and italic');
      expect(button.querySelector('strong')).toBeInTheDocument();
      expect(button.querySelector('em')).toBeInTheDocument();
    });
  });

  describe('Multiple Variants and Sizes', () => {
    it('combines different variants and sizes correctly', () => {
      const { rerender } = render(
        <Button variant="outline" size="sm">
          Small Outline
        </Button>
      );
      
      let button = screen.getByRole('button');
      expectToHaveClass(button, 'border');
      expectToHaveClass(button, 'h-8');
      
      rerender(
        <Button variant="destructive" size="lg">
          Large Destructive
        </Button>
      );
      
      button = screen.getByRole('button');
      expectToHaveClass(button, 'bg-destructive');
      expectToHaveClass(button, 'h-12');
    });
  });
});

describe('Button Variants Class Generation', () => {
  it('generates correct classes for all variant combinations', () => {
    const { buttonVariants } = require('./button');
    
    // Test all variants
    expect(buttonVariants({ variant: 'primary' })).toContain('bg-primary');
    expect(buttonVariants({ variant: 'secondary' })).toContain('bg-secondary');
    expect(buttonVariants({ variant: 'outline' })).toContain('border');
    expect(buttonVariants({ variant: 'ghost' })).toContain('hover:bg-accent');
    expect(buttonVariants({ variant: 'link' })).toContain('text-primary');
    expect(buttonVariants({ variant: 'destructive' })).toContain('bg-destructive');
    
    // Test all sizes
    expect(buttonVariants({ size: 'sm' })).toContain('h-8');
    expect(buttonVariants({ size: 'md' })).toContain('h-10');
    expect(buttonVariants({ size: 'lg' })).toContain('h-12');
    expect(buttonVariants({ size: 'icon' })).toContain('w-10');
  });
});
