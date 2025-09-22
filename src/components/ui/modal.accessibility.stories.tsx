/**
 * Modal Accessibility Stories
 * Demonstrates accessibility features and usage patterns for the Modal component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, ModalTrigger } from './modal';
import { Button } from './button';
import { Input } from './input';
import { ScreenReaderAnnouncement } from './screen-reader-announcement';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal/Accessibility',
  component: Modal,
  parameters: {
    docs: {
      description: {
        component: 'Accessibility-focused stories demonstrating proper usage of the Modal component with focus management, keyboard navigation, and ARIA attributes.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'focus-order-semantics',
            enabled: true,
          },
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// Basic accessible modal
export const Basic: Story = {
  args: {
    open: true,
  },
  render: (args) => (
    <Modal {...args}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Basic Modal</ModalTitle>
          <ModalDescription>
            This is a basic accessible modal with proper focus management and ARIA attributes.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A basic accessible modal with proper focus management, keyboard navigation, and ARIA attributes.',
      },
    },
  },
};

// Modal with trigger
export const WithTrigger: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>Open Modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Modal with Trigger</ModalTitle>
          <ModalDescription>
            This modal is opened by clicking the trigger button and demonstrates proper focus management.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Modal with trigger button demonstrating proper focus management when opening and closing.',
      },
    },
  },
};

// Confirmation modal
export const Confirmation: Story = {
  args: {
    open: true,
  },
  render: (args) => (
    <Modal {...args}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Confirm Action</ModalTitle>
          <ModalDescription>
            Are you sure you want to delete this item? This action cannot be undone.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Confirmation modal demonstrating proper focus management and clear action buttons.',
      },
    },
  },
};

// Form modal
export const Form: Story = {
  args: {
    open: true,
  },
  render: (args) => (
    <Modal {...args}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Create New Item</ModalTitle>
          <ModalDescription>
            Fill out the form below to create a new item.
          </ModalDescription>
        </ModalHeader>
        <form className="space-y-4">
          <Input label="Name" required />
          <Input label="Description" />
          <Input label="Email" type="email" required />
        </form>
        <ModalFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Create</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Form modal demonstrating proper form accessibility within a modal context.',
      },
    },
  },
};

// Modal with complex content
export const ComplexContent: Story = {
  args: {
    open: true,
  },
  render: (args) => (
    <Modal {...args}>
      <ModalContent className="max-w-2xl">
        <ModalHeader>
          <ModalTitle>Complex Modal</ModalTitle>
          <ModalDescription>
            This modal contains complex content with multiple sections and interactive elements.
          </ModalDescription>
        </ModalHeader>
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">Section 1</h3>
            <p className="text-gray-600">
              This is the first section with some content.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-semibold mb-2">Section 2</h3>
            <p className="text-gray-600">
              This is the second section with more content.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-semibold mb-2">Interactive Elements</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm">Action 1</Button>
              <Button variant="outline" size="sm">Action 2</Button>
            </div>
          </section>
        </div>
        <ModalFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Modal with complex content demonstrating proper focus management and navigation within the modal.',
      },
    },
  },
};

// Modal with focus trap demo
export const FocusTrap: Story = {
  args: {
    open: true,
  },
  render: (args) => (
    <Modal {...args}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Focus Trap Demo</ModalTitle>
          <ModalDescription>
            This modal demonstrates focus trapping. Use Tab to navigate between elements.
          </ModalDescription>
        </ModalHeader>
        <div className="space-y-4">
          <Input label="First Input" placeholder="Tab to focus" />
          <Input label="Second Input" placeholder="Tab to focus" />
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Button 1</Button>
            <Button variant="outline" size="sm">Button 2</Button>
            <Button variant="outline" size="sm">Button 3</Button>
          </div>
        </div>
        <ModalFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Modal demonstrating focus trap functionality. Focus is trapped within the modal and cannot escape to the background.',
      },
    },
  },
};

// Modal with keyboard navigation
export const KeyboardNavigation: Story = {
  args: {
    open: true,
  },
  render: (args) => (
    <Modal {...args}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Keyboard Navigation</ModalTitle>
          <ModalDescription>
            This modal demonstrates keyboard navigation. Use Tab, Shift+Tab, and Escape.
          </ModalDescription>
        </ModalHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Use Tab to move forward, Shift+Tab to move backward, and Escape to close.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Input 1" placeholder="Tab to focus" />
            <Input label="Input 2" placeholder="Tab to focus" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Option 1</Button>
            <Button variant="outline">Option 2</Button>
            <Button variant="outline">Option 3</Button>
          </div>
        </div>
        <ModalFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Modal demonstrating keyboard navigation patterns including Tab, Shift+Tab, and Escape key handling.',
      },
    },
  },
};

// Modal with screen reader announcements
export const ScreenReaderAnnouncements: Story = {
  args: {
    open: true,
  },
  render: (args) => (
    <>
      <Modal {...args}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Screen Reader Announcements</ModalTitle>
            <ModalDescription>
              This modal demonstrates screen reader announcements for modal state changes.
            </ModalDescription>
          </ModalHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Screen readers will announce when this modal opens and closes.
            </p>
            <Button onClick={() => setMessage('Modal action performed')}>
              Trigger Announcement
            </Button>
          </div>
          <ModalFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ScreenReaderAnnouncement message="" />
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Modal demonstrating screen reader announcements for modal state changes and user actions.',
      },
    },
  },
};

// Modal with error handling
export const ErrorHandling: Story = {
  args: {
    open: true,
  },
  render: (args) => {
    const [error, setError] = React.useState('');
    
    return (
      <Modal {...args}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Error Handling</ModalTitle>
            <ModalDescription>
              This modal demonstrates proper error handling and accessibility.
            </ModalDescription>
          </ModalHeader>
          <div className="space-y-4">
            {error && (
              <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded text-red-800">
                {error}
              </div>
            )}
            <Input label="Required Field" required />
            <Button 
              onClick={() => setError('This field is required')}
              variant="outline"
            >
              Trigger Error
            </Button>
          </div>
          <ModalFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal demonstrating proper error handling with accessible error messages and recovery actions.',
      },
    },
  },
};

// Modal with multiple steps
export const MultiStep: Story = {
  args: {
    open: true,
  },
  render: (args) => {
    const [step, setStep] = React.useState(1);
    const totalSteps = 3;
    
    return (
      <Modal {...args}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Multi-Step Modal - Step {step} of {totalSteps}</ModalTitle>
            <ModalDescription>
              This modal demonstrates multi-step functionality with proper accessibility.
            </ModalDescription>
          </ModalHeader>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="space-y-4">
              {step === 1 && (
                <div>
                  <h3 className="font-semibold mb-2">Step 1: Basic Information</h3>
                  <Input label="Name" required />
                  <Input label="Email" type="email" required />
                </div>
              )}
              {step === 2 && (
                <div>
                  <h3 className="font-semibold mb-2">Step 2: Additional Details</h3>
                  <Input label="Phone" type="tel" />
                  <Input label="Company" />
                </div>
              )}
              {step === 3 && (
                <div>
                  <h3 className="font-semibold mb-2">Step 3: Confirmation</h3>
                  <p className="text-gray-600">
                    Please review your information before submitting.
                  </p>
                </div>
              )}
            </div>
          </div>
          <ModalFooter>
            <Button variant="outline">
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            <Button onClick={() => setStep(step + 1)}>
              {step === totalSteps ? 'Submit' : 'Next'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal demonstrating multi-step functionality with proper accessibility and progress indication.',
      },
    },
  },
};

// Modal with custom size
export const CustomSize: Story = {
  args: {
    open: true,
  },
  render: (args) => (
    <Modal {...args}>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle>Small Modal</ModalTitle>
          <ModalDescription>
            This modal demonstrates custom sizing while maintaining accessibility.
          </ModalDescription>
        </ModalHeader>
        <div className="space-y-4">
          <Input label="Input" placeholder="Enter text" />
        </div>
        <ModalFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Modal demonstrating custom sizing while maintaining proper accessibility and focus management.',
      },
    },
  },
};

// Modal with backdrop click
export const BackdropClick: Story = {
  args: {
    open: true,
  },
  render: (args) => (
    <Modal {...args}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Backdrop Click</ModalTitle>
          <ModalDescription>
            This modal can be closed by clicking the backdrop or pressing Escape.
          </ModalDescription>
        </ModalHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Click outside the modal or press Escape to close.
          </p>
        </div>
        <ModalFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Modal demonstrating backdrop click functionality while maintaining proper accessibility.',
      },
    },
  },
};

