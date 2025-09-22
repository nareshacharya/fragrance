import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input';
import { renderWithAccessibility } from '../../lib/accessibility/testing';

describe('Input Accessibility', () => {
  it('should be accessible', async () => {
    const { container } = renderWithAccessibility(
      <Input placeholder="Enter text" ariaLabel="Test input" />
    );
    
    await expect(container).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <Input 
        id="test-input"
        ariaLabel="Test input"
        required
        error={true}
        errorText="This field is required"
      />
    );

    const input = screen.getByLabelText('Test input');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('should announce validation errors', async () => {
    const user = userEvent.setup();
    render(
      <Input 
        ariaLabel="Email"
        type="email"
        required
        announceErrors={true}
      />
    );

    const input = screen.getByLabelText('Email');
    
    // Focus and blur without entering value
    await user.click(input);
    await user.tab();

    // Check that error message is announced
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('should announce validation success', async () => {
    const user = userEvent.setup();
    render(
      <Input 
        ariaLabel="Email"
        type="email"
        announceSuccess={true}
      />
    );

    const input = screen.getByLabelText('Email');
    
    // Enter valid email
    await user.type(input, 'test@example.com');
    await user.tab();

    // Check that success message is announced
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  it('should have proper focus management', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Input ariaLabel="First input" />
        <Input ariaLabel="Second input" />
      </div>
    );

    const firstInput = screen.getByLabelText('First input');
    const secondInput = screen.getByLabelText('Second input');

    // Test tab navigation
    await user.tab();
    expect(firstInput).toHaveFocus();

    await user.tab();
    expect(secondInput).toHaveFocus();
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<Input ariaLabel="Test input" />);

    const input = screen.getByLabelText('Test input');
    
    // Test Enter key
    await user.click(input);
    await user.keyboard('{Enter}');
    expect(input).toHaveFocus();

    // Test Escape key
    await user.keyboard('{Escape}');
    expect(input).toHaveFocus();
  });

  it('should have proper color contrast', async () => {
    const { container } = renderWithAccessibility(
      <Input 
        ariaLabel="Test input"
        error={true}
        errorText="Error message"
      />
    );
    
    await expect(container).toHaveNoViolations();
  });

  it('should work with screen readers', async () => {
    const { container } = renderWithAccessibility(
      <Input 
        ariaLabel="Test input"
        helperText="This is helper text"
        required
      />
    );
    
    await expect(container).toHaveNoViolations();
  });

  it('should handle dynamic error states', async () => {
    const { rerender } = render(
      <Input 
        ariaLabel="Test input"
        error={false}
      />
    );

    let input = screen.getByLabelText('Test input');
    expect(input).toHaveAttribute('aria-invalid', 'false');

    // Update to error state
    rerender(
      <Input 
        ariaLabel="Test input"
        error={true}
        errorText="This field has an error"
      />
    );

    input = screen.getByLabelText('Test input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should handle success states', async () => {
    render(
      <Input 
        ariaLabel="Test input"
        success={true}
        successText="This field is valid"
      />
    );

    const input = screen.getByLabelText('Test input');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

