/**
 * Button Component Accessibility Tests
 * Comprehensive accessibility testing for the Button component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';
import { 
  expectAccessible,
  testAccessibility,
  testAriaAccessibility,
  testKeyboardAccessibility,
  testButtonAccessibilityFeatures,
  renderWithA11y
} from '../../test-utils/helpers';

describe('Button Accessibility', () => {
  describe('ARIA Attributes', () => {
    it('should have proper ARIA attributes', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-disabled', 'false');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('should have proper ARIA attributes when disabled', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toBeDisabled();
    });

    it('should have proper ARIA attributes when pressed', () => {
      render(<Button pressed>Pressed Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('should have proper ARIA attributes when expanded', () => {
      render(<Button expanded>Expanded Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have proper ARIA attributes when loading', () => {
      render(<Button loading>Loading Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toBeDisabled();
    });

    it('should have custom ARIA label', () => {
      render(<Button ariaLabel="Custom label">Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-label', 'Custom label');
    });

    it('should have ARIA described by attribute', () => {
      render(
        <>
          <Button describedBy="button-description">Button</Button>
          <div id="button-description">This button does something important</div>
        </>
      );
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-describedby', 'button-description');
    });

    it('should have ARIA controls attribute', () => {
      render(
        <>
          <Button controls="controlled-element">Button</Button>
          <div id="controlled-element">Controlled content</div>
        </>
      );
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-controls', 'controlled-element');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should be focusable via keyboard', async () => {
      const user = userEvent.setup();
      render(<Button>Focusable Button</Button>);
      const button = screen.getByRole('button');
      
      await user.tab();
      expect(button).toHaveFocus();
    });

    it('should be activated with Enter key', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Button</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      await user.keyboard('{Enter}');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be activated with Space key', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Button</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      await user.keyboard(' ');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not be activated with Space key when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Button</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      await user.keyboard(' ');
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not be activated with Enter key when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Button</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      await user.keyboard('{Enter}');
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should have proper tab order', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Button>First Button</Button>
          <Button>Second Button</Button>
          <Button>Third Button</Button>
        </>
      );
      
      const firstButton = screen.getByRole('button', { name: 'First Button' });
      const secondButton = screen.getByRole('button', { name: 'Second Button' });
      const thirdButton = screen.getByRole('button', { name: 'Third Button' });
      
      await user.tab();
      expect(firstButton).toHaveFocus();
      
      await user.tab();
      expect(secondButton).toHaveFocus();
      
      await user.tab();
      expect(thirdButton).toHaveFocus();
    });
  });

  describe('Screen Reader Support', () => {
    it('should announce loading state', () => {
      render(<Button loading>Loading Button</Button>);
      
      const loadingText = screen.getByText('Loading');
      expect(loadingText).toHaveClass('sr-only');
    });

    it('should have accessible name', () => {
      render(<Button>Accessible Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAccessibleName('Accessible Button');
    });

    it('should have accessible name from aria-label', () => {
      render(<Button ariaLabel="Custom accessible name">Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAccessibleName('Custom accessible name');
    });

    it('should announce state changes', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<Button>Button</Button>);
      
      rerender(<Button pressed>Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Focus Management', () => {
    it('should maintain focus when not disabled', async () => {
      const user = userEvent.setup();
      render(<Button>Focusable Button</Button>);
      const button = screen.getByRole('button');
      
      await user.click(button);
      expect(button).toHaveFocus();
    });

    it('should lose focus when disabled', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      
      await user.click(button);
      expect(button).toHaveFocus();
      
      rerender(<Button disabled>Button</Button>);
      expect(button).not.toHaveFocus();
    });

    it('should have visible focus indicator', async () => {
      const { container } = renderWithA11y(<Button>Button</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      await expect(container).toHaveNoViolations();
    });
  });

  describe('Color Contrast', () => {
    it('should have sufficient color contrast', async () => {
      const { container } = renderWithA11y(<Button>Button</Button>);
      await expect(container).toHaveNoViolations();
    });

    it('should have sufficient color contrast in secondary variant', async () => {
      const { container } = renderWithA11y(<Button variant="secondary">Secondary Button</Button>);
      await expect(container).toHaveNoViolations();
    });

    it('should have sufficient color contrast in all variants', async () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost', 'link', 'destructive'];
      
      for (const variant of variants) {
        const { container } = renderWithA11y(<Button variant={variant as any}>Button</Button>);
        await expect(container).toHaveNoViolations();
      }
    });
  });

  describe('Touch Target Size', () => {
    it('should have minimum touch target size', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      
      // Check if button has minimum size classes
      expect(button).toHaveClass('h-10'); // Minimum height
    });

    it('should have larger touch target for icon variant', () => {
      render(<Button size="icon" ariaLabel="Icon button">×</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('h-10', 'w-10'); // Square icon button
    });
  });

  describe('WCAG Compliance', () => {
    it('should pass WCAG 2.1 AA compliance', async () => {
      const { container } = render(<Button>WCAG Compliant Button</Button>);
      await expectAccessible(container);
    });

    it('should pass accessibility tests with custom options', async () => {
      const { container } = render(<Button>Custom Button</Button>);
      await testAccessibility(container, {
        rules: ['color-contrast'],
        tags: ['wcag2aa'],
      });
    });
  });

  describe('Integration Tests', () => {
    it('should work with accessibility testing utilities', async () => {
      const result = renderWithA11y(<Button>Test Button</Button>);
      const button = result.getByRole('button');
      
      // Test ARIA attributes
      testAriaAccessibility(button, {
        'aria-disabled': 'false',
        'aria-pressed': 'false',
      });
      
      // Test button accessibility
      testButtonAccessibilityFeatures(button);
    });

    it('should work with form integration', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      
      render(
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <Button type="submit">Submit</Button>
        </form>
      );
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);
      
      expect(handleSubmit).toHaveBeenCalled();
    });

    it('should work with modal integration', async () => {
      const user = userEvent.setup();
      const handleModalOpen = jest.fn();
      
      render(
        <>
          <Button onClick={handleModalOpen}>Open Modal</Button>
          <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <h2 id="modal-title">Modal Title</h2>
            <Button>Close</Button>
          </div>
        </>
      );
      
      const openButton = screen.getByRole('button', { name: 'Open Modal' });
      await user.click(openButton);
      
      expect(handleModalOpen).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children gracefully', () => {
      render(<Button ariaLabel="Empty button"></Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAccessibleName('Empty button');
    });

    it('should handle complex children', () => {
      render(
        <Button>
          <span>Complex</span>
          <strong>Content</strong>
        </Button>
      );
      const button = screen.getByRole('button');
      
      expect(button).toHaveAccessibleName('Complex Content');
    });

    it('should handle loading state with complex children', () => {
      render(
        <Button loading>
          <span>Complex</span>
          <strong>Content</strong>
        </Button>
      );
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toBeDisabled();
    });

    it('should handle multiple ARIA attributes', () => {
      render(
        <Button
          pressed
          expanded
          controls="content"
          describedBy="description"
          ariaLabel="Complex button"
        >
          Complex Button
        </Button>
      );
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(button).toHaveAttribute('aria-controls', 'content');
      expect(button).toHaveAttribute('aria-describedby', 'description');
      expect(button).toHaveAttribute('aria-label', 'Complex button');
    });
  });
});
