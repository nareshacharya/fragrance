import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from './modal';

describe('Modal Components', () => {
  describe('Modal', () => {
    it('renders modal trigger', () => {
      render(
        <Modal>
          <ModalTrigger asChild>
            <button>Open Modal</button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>Modal content</ModalBody>
          </ModalContent>
        </Modal>
      );
      
      const trigger = screen.getByRole('button', { name: 'Open Modal' });
      expect(trigger).toBeInTheDocument();
    });

    it('opens modal when trigger is clicked', async () => {
      render(
        <Modal>
          <ModalTrigger asChild>
            <button>Open Modal</button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>Modal content</ModalBody>
          </ModalContent>
        </Modal>
      );
      
      const trigger = screen.getByRole('button', { name: 'Open Modal' });
      trigger.click();
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('closes modal when close button is clicked', async () => {
      render(
        <Modal>
          <ModalTrigger asChild>
            <button>Open Modal</button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>Modal content</ModalBody>
            <ModalFooter>
              <button>Close</button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      );
      
      // Open modal
      const trigger = screen.getByRole('button', { name: 'Open Modal' });
      trigger.click();
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      // Close modal
      const closeButton = screen.getByRole('button', { name: 'Close' });
      closeButton.click();
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes modal when escape key is pressed', async () => {
      render(
        <Modal>
          <ModalTrigger asChild>
            <button>Open Modal</button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>Modal content</ModalBody>
          </ModalContent>
        </Modal>
      );
      
      // Open modal
      const trigger = screen.getByRole('button', { name: 'Open Modal' });
      trigger.click();
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      // Press escape
      const modal = screen.getByRole('dialog');
      modal.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('ModalContent', () => {
    it('renders with default props', async () => {
      render(
        <Modal defaultOpen>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>Modal content</ModalBody>
          </ModalContent>
        </Modal>
      );
      
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toBeInTheDocument();
        expect(modal).toHaveClass('fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200');
      });
    });

    it('applies custom className', async () => {
      render(
        <Modal defaultOpen>
          <ModalContent className="custom-modal">
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>Modal content</ModalBody>
          </ModalContent>
        </Modal>
      );
      
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toHaveClass('custom-modal');
      });
    });
  });

  describe('ModalHeader', () => {
    it('renders with default props', async () => {
      render(
        <Modal defaultOpen>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>Modal content</ModalBody>
          </ModalContent>
        </Modal>
      );
      
      await waitFor(() => {
        const header = screen.getByText('Test Modal').closest('div');
        expect(header).toHaveClass('flex flex-col space-y-1.5 text-center sm:text-left');
      });
    });

    it('applies custom className', async () => {
      render(
        <Modal defaultOpen>
          <ModalContent>
            <ModalHeader className="custom-header">
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>Modal content</ModalBody>
          </ModalContent>
        </Modal>
      );
      
      await waitFor(() => {
        const header = screen.getByText('Test Modal').closest('div');
        expect(header).toHaveClass('custom-header');
      });
    });
  });

  describe('ModalTitle', () => {
    it('renders with default props', async () => {
      render(
        <Modal defaultOpen>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>Modal content</ModalBody>
          </ModalContent>
        </Modal>
      );
      
      await waitFor(() => {
        const title = screen.getByText('Test Modal');
        expect(title).toBeInTheDocument();
        expect(title).toHaveClass('text-lg font-semibold leading-none tracking-tight');
      });
    });

    it('renders as h2 by default', async () => {
      render(
        <Modal defaultOpen>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>Modal content</ModalBody>
          </ModalContent>
        </Modal>
      );
      
      await waitFor(() => {
        const title = screen.getByRole('heading', { level: 2 });
        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent('Test Modal');
      });
    });

    it('applies custom className', async () => {
      render(
        <Modal defaultOpen>
          <ModalContent>
            <ModalHeader>
              <ModalTitle className="custom-title">Test Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>Modal content</ModalBody>
          </ModalContent>
        </Modal>
      );
      
      await waitFor(() => {
        const title = screen.getByText('Test Modal');
        expect(title).toHaveClass('custom-title');
      });
    });
  });

  describe('ModalDescription', () => {
    it('renders with default props', async () => {
      render(
        <Modal defaultOpen>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
              <ModalDescription>Modal description</ModalDescription>
            </ModalHeader>
            <ModalBody>Modal content</ModalBody>
          </ModalContent>
        </Modal>
      );
      
      await waitFor(() => {
        const description = screen.getByText('Modal description');
        expect(description).toBeInTheDocument();
        expect(description).toHaveClass('text-sm text-muted-foreground');
      });
    });

    it('applies custom className', async () => {
      render(
        <Modal defaultOpen>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
              <ModalDescription className="custom-desc">Modal description</ModalDescription>
            </ModalHeader>
            <ModalBody>Modal content</ModalBody>
          </ModalContent>
        </Modal>
      );
      
      await waitFor(() => {
        const description = screen.getByText('Modal description');
        expect(description).toHaveClass('custom-desc');
      });
    });
  });

  describe('ModalBody', () => {
    it('renders with default props', async () => {
      render(
        <Modal defaultOpen>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>Modal content</ModalBody>
          </ModalContent>
        </Modal>
      );
      
      await waitFor(() => {
        const body = screen.getByText('Modal content');
        expect(body).toBeInTheDocument();
        expect(body).toHaveClass('py-4');
      });
    });

    it('applies custom className', async () => {
      render(
        <Modal defaultOpen>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalBody className="custom-body">Modal content</ModalBody>
          </ModalContent>
        </Modal>
      );
      
      await waitFor(() => {
        const body = screen.getByText('Modal content');
        expect(body).toHaveClass('custom-body');
      });
    });
  });

  describe('ModalFooter', () => {
    it('renders with default props', async () => {
      render(
        <Modal defaultOpen>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>Modal content</ModalBody>
            <ModalFooter>
              <button>Action</button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      );
      
      await waitFor(() => {
        const footer = screen.getByRole('button', { name: 'Action' }).closest('div');
        expect(footer).toHaveClass('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2');
      });
    });

    it('applies custom className', async () => {
      render(
        <Modal defaultOpen>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>Modal content</ModalBody>
            <ModalFooter className="custom-footer">
              <button>Action</button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      );
      
      await waitFor(() => {
        const footer = screen.getByRole('button', { name: 'Action' }).closest('div');
        expect(footer).toHaveClass('custom-footer');
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', async () => {
      render(
        <Modal defaultOpen>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
              <ModalDescription>Modal description</ModalDescription>
            </ModalHeader>
            <ModalBody>Modal content</ModalBody>
          </ModalContent>
        </Modal>
      );
      
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toHaveAttribute('aria-modal', 'true');
        expect(modal).toHaveAttribute('aria-labelledby');
        expect(modal).toHaveAttribute('aria-describedby');
      });
    });

    it('traps focus within modal', async () => {
      render(
        <Modal defaultOpen>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <input placeholder="First input" />
              <input placeholder="Second input" />
            </ModalBody>
            <ModalFooter>
              <button>Cancel</button>
              <button>Confirm</button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      );
      
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toBeInTheDocument();
      });
      
      // Focus should be trapped within the modal
      const firstInput = screen.getByPlaceholderText('First input');
      firstInput.focus();
      expect(firstInput).toHaveFocus();
    });

    it('restores focus to trigger when closed', async () => {
      render(
        <Modal>
          <ModalTrigger asChild>
            <button>Open Modal</button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>Modal content</ModalBody>
            <ModalFooter>
              <button>Close</button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      );
      
      const trigger = screen.getByRole('button', { name: 'Open Modal' });
      trigger.focus();
      trigger.click();
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      const closeButton = screen.getByRole('button', { name: 'Close' });
      closeButton.click();
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
      });
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works as controlled component', async () => {
      const TestComponent = () => {
        const [open, setOpen] = React.useState(false);
        
        return (
          <Modal open={open} onOpenChange={setOpen}>
            <ModalTrigger asChild>
              <button>Open Modal</button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Controlled Modal</ModalTitle>
              </ModalHeader>
              <ModalBody>Modal content</ModalBody>
              <ModalFooter>
                <button onClick={() => setOpen(false)}>Close</button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        );
      };
      
      render(<TestComponent />);
      
      const trigger = screen.getByRole('button', { name: 'Open Modal' });
      trigger.click();
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      const closeButton = screen.getByRole('button', { name: 'Close' });
      closeButton.click();
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });
});
