/**
 * Input Accessibility Stories
 * Demonstrates accessibility features and usage patterns for the Input component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Label } from './label';
import { ScreenReaderAnnouncement } from './screen-reader-announcement';

const meta: Meta<typeof Input> = {
  title: 'Components/Input/Accessibility',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: 'Accessibility-focused stories demonstrating proper usage of the Input component with screen readers, keyboard navigation, and ARIA attributes.',
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
            id: 'label',
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number'],
    },
    required: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
    helperText: {
      control: 'text',
    },
    successText: {
      control: 'text',
    },
    announceErrors: {
      control: 'boolean',
    },
    announceSuccess: {
      control: 'boolean',
    },
    ariaLabel: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// Basic accessible input
export const Basic: Story = {
  args: {
    label: 'Email',
    type: 'email',
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic accessible input with proper label association and semantic HTML.',
      },
    },
  },
};

// Required input
export const Required: Story = {
  args: {
    label: 'Password',
    type: 'password',
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Required input with proper aria-required attribute and visual indicator.',
      },
    },
  },
};

// Input with helper text
export const WithHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    helperText: 'Must be at least 8 characters long',
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with helper text using aria-describedby. The helper text is associated with the input for screen readers.',
      },
    },
  },
};

// Input with error
export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    error: 'Please enter a valid email address',
    announceErrors: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with validation error. The error is announced to screen readers and the input is marked as invalid.',
      },
    },
  },
};

// Input with success message
export const WithSuccess: Story = {
  args: {
    label: 'Email',
    type: 'email',
    successText: 'Email format is valid',
    announceSuccess: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with success message. The success message is announced to screen readers.',
      },
    },
  },
};

// Search input with autocomplete
export const SearchWithAutocomplete: Story = {
  args: {
    label: 'Search ingredients',
    type: 'search',
    placeholder: 'Type to search...',
  },
  render: (args) => (
    <div>
      <Input {...args} />
      <div className="mt-2 text-sm text-gray-600">
        <p>This input supports autocomplete and search functionality.</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Search input demonstrating proper search input semantics and autocomplete support.',
      },
    },
  },
};

// Input with custom accessible name
export const WithAriaLabel: Story = {
  args: {
    ariaLabel: 'Enter your full name',
    placeholder: 'John Doe',
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with custom accessible name using aria-label. Useful when the visual label is not sufficient.',
      },
    },
  },
};

// Disabled input
export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    value: 'Cannot be edited',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled input with proper aria-disabled attribute and visual styling.',
      },
    },
  },
};

// Form with multiple inputs
export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = React.useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
    const [errors, setErrors] = React.useState({});
    
    const handleSubmit = (e) => {
      e.preventDefault();
      const newErrors = {};
      
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      
      setErrors(newErrors);
    };
    
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            error={errors.firstName}
            required
          />
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            error={errors.lastName}
            required
          />
        </div>
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
        />
        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          helperText="Must be at least 8 characters"
          required
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Submit
        </button>
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete form example demonstrating proper form accessibility with multiple inputs, validation, and error handling.',
      },
    },
  },
};

// Input with live validation
export const LiveValidation: Story = {
  render: () => {
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    
    const validateEmail = (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        setError('');
        setSuccess('');
      } else if (!emailRegex.test(value)) {
        setError('Please enter a valid email address');
        setSuccess('');
      } else {
        setError('');
        setSuccess('Email format is valid');
      }
    };
    
    return (
      <>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          error={error}
          successText={success}
          announceErrors
          announceSuccess
        />
        <ScreenReaderAnnouncement message="" />
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with live validation that provides immediate feedback to users and screen readers.',
      },
    },
  },
};

// Input with complex helper text
export const ComplexHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    helperText: 'Password must contain at least 8 characters, including uppercase, lowercase, and numbers',
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with complex helper text that provides detailed requirements to users.',
      },
    },
  },
};

// Input with error recovery
export const ErrorRecovery: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    const [error, setError] = React.useState('');
    
    const handleChange = (e) => {
      setValue(e.target.value);
      if (error && e.target.value) {
        setError(''); // Clear error when user starts typing
      }
    };
    
    const handleBlur = () => {
      if (!value) {
        setError('This field is required');
      }
    };
    
    return (
      <Input
        label="Required Field"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error}
        required
        announceErrors
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Input demonstrating error recovery - errors are cleared when the user starts typing.',
      },
    },
  },
};

// All input types
export const AllTypes: Story = {
  render: () => (
    <div className="space-y-4">
      <Input label="Text" type="text" placeholder="Enter text" />
      <Input label="Email" type="email" placeholder="Enter email" />
      <Input label="Password" type="password" placeholder="Enter password" />
      <Input label="Search" type="search" placeholder="Search..." />
      <Input label="Phone" type="tel" placeholder="Enter phone number" />
      <Input label="URL" type="url" placeholder="Enter URL" />
      <Input label="Number" type="number" placeholder="Enter number" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All input types demonstrating proper semantic HTML and accessibility for different input types.',
      },
    },
  },
};

// Keyboard navigation demo
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Use Tab to navigate between inputs, Enter to submit forms.
      </p>
      <div className="space-y-2">
        <Input label="First Input" placeholder="Tab to focus" />
        <Input label="Second Input" placeholder="Tab to focus" />
        <Input label="Third Input" placeholder="Tab to focus" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
          story: 'Demonstration of keyboard navigation between inputs. Use Tab to move between inputs and Enter to submit forms.',
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
            These inputs demonstrate screen reader announcements for validation states.
          </p>
          <Input
            label="Test Input"
            onChange={() => setMessage('Input value changed')}
            announceErrors
            announceSuccess
          />
        </div>
        <ScreenReaderAnnouncement message={message} />
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Input demonstrating screen reader announcements for validation states and user interactions.',
      },
    },
  },
};
