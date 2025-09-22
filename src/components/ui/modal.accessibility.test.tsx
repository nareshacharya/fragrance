import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, ModalTrigger } from './modal';
import { Button } from './button';
import { renderWithAccessibility } from '../../lib/accessibility/testing';

describe('Modal Accessibility', () => {
  it('should be accessible when open', async () => {
    const { container } = renderWithAccessibility(
      <Modal open={true}>
        <ModalContent title="Test Modal" description="This is a test modal">
          <ModalHeader>
            <ModalTitle>Test Modal</ModalTitle>
            <ModalDescription>This is a test modal</ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
    
    await expect(container).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <Modal open={true}>
        <ModalContent title="Test Modal" description="This is a test modal">
          <ModalHeader>
            <ModalTitle>Test Modal</ModalTitle>
            <ModalDescription>This is a test modal</ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(modal).toHaveAttribute('aria-describedby', 'modal-description');
  });

  it('should trap focus within modal', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button>Outside button</button>
        <Modal open={true}>
          <ModalContent title="Test Modal">
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalFooter>
              <Button>First button</Button>
              <Button>Second button</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );

    const firstButton = screen.getByRole('button', { name: 'First button' });
    const secondButton = screen.getByRole('button', { name: 'Second button' });

    // Focus should start on first button
    expect(firstButton).toHaveFocus();

    // Tab should move to second button
    await user.tab();
    expect(secondButton).toHaveFocus();

    // Tab should wrap back to first button
    await user.tab();
    expect(firstButton).toHaveFocus();
  });

  it('should close on Escape key', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    
    render(
      <Modal open={true} onOpenChange={onOpenChange}>
        <ModalContent title="Test Modal">
          <ModalHeader>
            <ModalTitle>Test Modal</ModalTitle>
          </ModalHeader>
        </ModalContent>
      </Modal>
    );

    const modal = screen.getByRole('dialog');
    
    // Press Escape key
    await user.keyboard('{Escape}');
    
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should announce modal opening', async () => {
    render(
      <Modal open={true}>
        <ModalContent title="Test Modal" description="This is a test modal">
          <ModalHeader>
            <ModalTitle>Test Modal</ModalTitle>
            <ModalDescription>This is a test modal</ModalDescription>
          </ModalHeader>
        </ModalContent>
      </Modal>
    );

    // Check that announcement is present
    const announcement = screen.getByText('Test Modal opened');
    expect(announcement).toBeInTheDocument();
  });

  it('should have proper heading structure', () => {
    render(
      <Modal open={true}>
        <ModalContent title="Test Modal">
          <ModalHeader>
            <ModalTitle>Test Modal</ModalTitle>
            <ModalDescription>This is a test modal</ModalDescription>
          </ModalHeader>
        </ModalContent>
      </Modal>
    );

    const title = screen.getByRole('heading', { name: 'Test Modal' });
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H2'); // ModalTitle should render as h2
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(
      <Modal open={true}>
        <ModalContent title="Test Modal">
          <ModalHeader>
            <ModalTitle>Test Modal</ModalTitle>
          </ModalHeader>
          <ModalFooter>
            <Button>Cancel</Button>
            <Button>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    const confirmButton = screen.getByRole('button', { name: 'Confirm' });

    // Test arrow key navigation
    await user.click(cancelButton);
    await user.keyboard('{ArrowRight}');
    expect(confirmButton).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(cancelButton).toHaveFocus();
  });

  it('should work with screen readers', async () => {
    const { container } = renderWithAccessibility(
      <Modal open={true}>
        <ModalContent title="Test Modal" description="This is a test modal">
          <ModalHeader>
            <ModalTitle>Test Modal</ModalTitle>
            <ModalDescription>This is a test modal</ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
    
    await expect(container).toHaveNoViolations();
  });

  it('should handle modal trigger accessibility', async () => {
    const user = userEvent.setup();
    render(
      <Modal>
        <ModalTrigger asChild>
          <Button>Open Modal</Button>
        </ModalTrigger>
        <ModalContent title="Test Modal">
          <ModalHeader>
            <ModalTitle>Test Modal</ModalTitle>
          </ModalHeader>
        </ModalContent>
      </Modal>
    );

    const trigger = screen.getByRole('button', { name: 'Open Modal' });
    expect(trigger).toBeInTheDocument();
    
    // Click trigger to open modal
    await user.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('should restore focus after closing', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    
    render(
      <div>
        <Modal onOpenChange={onOpenChange}>
          <ModalTrigger asChild>
            <Button>Open Modal</Button>
          </ModalTrigger>
          <ModalContent title="Test Modal">
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalFooter>
              <Button>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );

    const trigger = screen.getByRole('button', { name: 'Open Modal' });
    
    // Open modal
    await user.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close modal
    const closeButton = screen.getByRole('button', { name: 'Close' });
    await user.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Focus should be restored to trigger
    expect(trigger).toHaveFocus();
  });
});

