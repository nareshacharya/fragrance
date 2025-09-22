/**
 * Button Accessibility Stories
 * Demonstrates accessibility features and usage patterns for the Button component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { ScreenReaderAnnouncement } from './screen-reader-announcement';

const meta: Meta<typeof Button> = {
  title: 'Components/Button/Accessibility',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Accessibility-focused stories demonstrating proper usage of the Button component with screen readers, keyboard navigation, and ARIA attributes.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'focus-order-semantics',
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'link', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    pressed: {
      control: 'boolean',
    },
    expanded: {
      control: 'boolean',
    },
    announceLoading: {
      control: 'boolean',
    },
    ariaLabel: {
      control: 'text',
    },
    describedBy: {
      control: 'text',
    },
    controls: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Basic accessible button
export const Basic: Story = {
  args: {
    children: 'Click me',
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic accessible button with proper semantic HTML and keyboard support.',
      },
    },
  },
};

// Button with custom accessible name
export const WithAriaLabel: Story = {
  args: {
    children: '×',
    ariaLabel: 'Close dialog',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with custom accessible name using aria-label. Useful for icon buttons or when the visible text is not descriptive enough.',
      },
    },
  },
};

// Button with description
export const WithDescription: Story = {
  args: {
    children: 'Save',
    describedBy: 'save-description',
  },
  render: (args) => (
    <>
      <Button {...args} />
      <div id="save-description" className="sr-only">
        Saves your changes to the database
      </div>
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button with additional description using aria-describedby. The description is hidden visually but available to screen readers.',
      },
    },
  },
};

// Toggle button
export const ToggleButton: Story = {
  args: {
    children: 'Toggle',
    pressed: false,
    'aria-expanded': false,
  },
  render: (args) => {
    const [pressed, setPressed] = React.useState(args.pressed);
    const [expanded, setExpanded] = React.useState(args['aria-expanded']);
    
    return (
      <Button
        {...args}
        pressed={pressed}
        aria-expanded={expanded}
        onClick={() => {
          setPressed(!pressed);
          setExpanded(!expanded);
        }}
      >
        {pressed ? 'Collapse' : 'Expand'}
      </Button>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle button demonstrating aria-pressed and aria-expanded attributes. Use for buttons that toggle a state or expand/collapse content.',
      },
    },
  },
};

// Loading button with announcement
export const LoadingWithAnnouncement: Story = {
  args: {
    children: 'Save',
    loading: false,
    announceLoading: true,
  },
  render: (args) => {
    const [loading, setLoading] = React.useState(args.loading);
    
    return (
      <>
        <Button
          {...args}
          loading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 2000);
          }}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
        <ScreenReaderAnnouncement message="" />
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading button that announces state changes to screen readers. The loading state is announced when it changes.',
      },
    },
  },
};

// Disabled button
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled button with proper aria-disabled attribute and visual styling. Cannot be activated by mouse or keyboard.',
      },
    },
  },
};

// Button controlling content
export const ControllingContent: Story = {
  args: {
    children: 'Show Details',
    controls: 'details-content',
    'aria-expanded': false,
  },
  render: (args) => {
    const [expanded, setExpanded] = React.useState(false);
    
    return (
      <>
        <Button
          {...args}
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide Details' : 'Show Details'}
        </Button>
        {expanded && (
          <div id="details-content" className="mt-4 p-4 border rounded">
            <h3>Additional Details</h3>
            <p>This content is controlled by the button above.</p>
          </div>
        )}
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Button that controls the visibility of content using aria-controls and aria-expanded. The controlled content is referenced by ID.',
      },
    },
  },
};

// Icon button
export const IconButton: Story = {
  args: {
    children: '×',
    size: 'icon',
    ariaLabel: 'Close',
  },
  parameters: {
    docs: {
      description: {
        story: 'Icon button with proper accessible name. Always provide an aria-label for icon buttons as the icon itself may not be descriptive.',
      },
    },
  },
};

// Button group with proper focus order
export const ButtonGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="outline">Previous</Button>
      <Button>Next</Button>
      <Button variant="outline">Cancel</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Group of buttons with proper focus order. The tab order follows the visual order from left to right.',
      },
    },
  },
};

// Form submission button
export const FormSubmission: Story = {
  render: () => (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit">Submit</Button>
          <Button type="button" variant="outline">Cancel</Button>
        </div>
      </div>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Form submission button demonstrating proper form integration. The button type is set to "submit" for form submission.',
      },
    },
  },
};

// Button with complex content
export const ComplexContent: Story = {
  args: {
    children: (
      <>
        <span>Complex</span>
        <strong> Content</strong>
        <span className="ml-1">→</span>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with complex content including multiple elements. The accessible name is derived from all text content.',
      },
    },
  },
};

// All variants for color contrast testing
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants for testing color contrast and visual accessibility. Each variant should meet WCAG AA contrast requirements.',
      },
    },
  },
};

// Keyboard navigation demo
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Use Tab to navigate between buttons, Enter or Space to activate.
      </p>
      <div className="flex gap-2">
        <Button>First Button</Button>
        <Button>Second Button</Button>
        <Button>Third Button</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of keyboard navigation. Use Tab to move between buttons and Enter or Space to activate them.',
      },
    },
  },
};

// Screen reader announcements
export const ScreenReaderAnnouncements: Story = {
  render: () => {
    const [message, setMessage] = React.useState('');
    
    return (
      <>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            These buttons demonstrate screen reader announcements.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setMessage('Success: Operation completed')}>
              Success
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setMessage('Error: Something went wrong')}
            >
              Error
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setMessage('Info: Check the details')}
            >
              Info
            </Button>
          </div>
        </div>
        <ScreenReaderAnnouncement message={message} />
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Buttons that trigger screen reader announcements. The announcements are made through the ScreenReaderAnnouncement component.',
      },
    },
  },
};
