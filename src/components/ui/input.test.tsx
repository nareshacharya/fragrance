import React from 'react';
import { render, screen } from '@/test-utils';
import { Input } from './input';
import { fillInput, pressKey, expectToHaveClass, expectToBeDisabled } from '@/test-utils';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('renders input with default props', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders input with placeholder', () => {
      render(<Input placeholder="Enter your name" />);
      
      const input = screen.getByPlaceholderText('Enter your name');
      expect(input).toBeInTheDocument();
    });

    it('renders input with default value', () => {
      render(<Input defaultValue="Default text" />);
      
      const input = screen.getByDisplayValue('Default text');
      expect(input).toBeInTheDocument();
    });

    it('renders input with controlled value', () => {
      const { rerender } = render(<Input value="Controlled" onChange={() => {}} />);
      
      let input = screen.getByDisplayValue('Controlled');
      expect(input).toBeInTheDocument();

      rerender(<Input value="Updated" onChange={() => {}} />);
      
      input = screen.getByDisplayValue('Updated');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Input Types', () => {
    it('renders text input by default', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders email input', () => {
      render(<Input type="email" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders password input', () => {
      render(<Input type="password" />);
      
      const input = document.querySelector('input[type="password"]') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'password');
    });

    it('renders number input', () => {
      render(<Input type="number" />);
      
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('renders search input', () => {
      render(<Input type="search" />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('type', 'search');
    });

    it('renders tel input', () => {
      render(<Input type="tel" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('renders url input', () => {
      render(<Input type="url" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'url');
    });

    it('renders file input', () => {
      render(<Input type="file" />);
      
      const input = document.querySelector('input[type="file"]');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'file');
    });
  });

  describe('Variants', () => {
    it('renders default variant by default', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      expectToHaveClass(input, 'border-neutral-300');
    });

    it('renders error variant', () => {
      render(<Input variant="error" />);
      
      const input = screen.getByRole('textbox');
      expectToHaveClass(input, 'border-red-500');
    });

    it('renders success variant', () => {
      render(<Input variant="success" />);
      
      const input = screen.getByRole('textbox');
      expectToHaveClass(input, 'border-green-500');
    });
  });

  describe('Sizes', () => {
    it('renders medium size by default', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      expectToHaveClass(input, 'h-10');
      expectToHaveClass(input, 'px-3');
    });

    it('renders small size', () => {
      render(<Input inputSize="sm" />);
      
      const input = screen.getByRole('textbox');
      expectToHaveClass(input, 'h-8');
      expectToHaveClass(input, 'px-3');
      expectToHaveClass(input, 'text-sm');
    });

    it('renders large size', () => {
      render(<Input inputSize="lg" />);
      
      const input = screen.getByRole('textbox');
      expectToHaveClass(input, 'h-12');
      expectToHaveClass(input, 'px-4');
      expectToHaveClass(input, 'text-base');
    });
  });

  describe('States', () => {
    it('handles disabled state', () => {
      render(<Input disabled />);
      
      const input = screen.getByRole('textbox');
      expectToBeDisabled(input);
      expectToHaveClass(input, 'disabled:opacity-50');
    });

    it('handles readonly state', () => {
      render(<Input readOnly value="Read only" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
      expect(input).toHaveValue('Read only');
    });

    it('handles required state', () => {
      render(<Input required />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('auto-sets error variant when error prop is true', () => {
      render(<Input error />);
      
      const input = screen.getByRole('textbox');
      expectToHaveClass(input, 'border-red-500');
    });

    it('auto-sets success variant when success prop is true', () => {
      render(<Input success />);
      
      const input = screen.getByRole('textbox');
      expectToHaveClass(input, 'border-green-500');
    });

    it('error prop takes precedence over success prop', () => {
      render(<Input error success />);
      
      const input = screen.getByRole('textbox');
      expectToHaveClass(input, 'border-red-500');
    });
  });

  describe('Helper Text', () => {
    it('displays helper text', () => {
      render(<Input helperText="This is helper text" />);
      
      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });

    it('displays error text', () => {
      render(<Input errorText="This is an error" />);
      
      const errorText = screen.getByText('This is an error');
      expect(errorText).toBeInTheDocument();
      expectToHaveClass(errorText, 'text-red-600');
    });

    it('displays success text', () => {
      render(<Input successText="This is success" />);
      
      const successText = screen.getByText('This is success');
      expect(successText).toBeInTheDocument();
      expectToHaveClass(successText, 'text-green-600');
    });

    it('error text takes precedence over other text', () => {
      render(
        <Input 
          helperText="Helper" 
          successText="Success" 
          errorText="Error" 
        />
      );
      
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
      expect(screen.queryByText('Success')).not.toBeInTheDocument();
    });

    it('success text takes precedence over helper text', () => {
      render(
        <Input 
          helperText="Helper" 
          successText="Success" 
        />
      );
      
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });

    it('does not render text container when no text is provided', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      const container = input.parentElement;
      expect(container?.querySelector('p')).not.toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(<Input className="custom-class" />);
      
      const input = screen.getByRole('textbox');
      expectToHaveClass(input, 'custom-class');
    });

    it('forwards HTML input attributes', () => {
      render(
        <Input 
          name="test-input"
          id="test-id"
          data-testid="custom-input"
          maxLength={10}
          minLength={2}
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'test-input');
      expect(input).toHaveAttribute('id', 'test-id');
      expect(input).toHaveAttribute('data-testid', 'custom-input');
      expect(input).toHaveAttribute('maxlength', '10');
      expect(input).toHaveAttribute('minlength', '2');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('User Interactions', () => {
    it('handles onChange events', async () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      
      await fillInput('textbox', 'test input');
      
      expect(handleChange).toHaveBeenCalled();
      expect(screen.getByDisplayValue('test input')).toBeInTheDocument();
    });

    it('handles onFocus events', async () => {
      const handleFocus = jest.fn();
      render(<Input onFocus={handleFocus} />);
      
      const input = screen.getByRole('textbox');
      input.focus();
      
      expect(handleFocus).toHaveBeenCalledTimes(1);
      expect(input).toHaveFocus();
    });

    it('handles onBlur events', async () => {
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);
      
      const input = screen.getByRole('textbox');
      input.focus();
      input.blur();
      
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard events', async () => {
      const handleKeyDown = jest.fn();
      render(<Input onKeyDown={handleKeyDown} />);
      
      const input = screen.getByRole('textbox');
      input.focus();
      
      await pressKey('Enter');
      expect(handleKeyDown).toHaveBeenCalled();
    });

    it('does not accept input when disabled', async () => {
      const handleChange = jest.fn();
      render(<Input disabled onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      
      // Try to type in the disabled input
      try {
        await fillInput('textbox', 'should not work');
      } catch (error) {
        // This is expected for disabled inputs
      }
      
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility attributes', () => {
      render(<Input aria-label="Custom input" />);
      
      const input = screen.getByRole('textbox', { name: 'Custom input' });
      expect(input).toBeInTheDocument();
    });

    it('supports aria-describedby with helper text', () => {
      render(
        <div>
          <Input aria-describedby="help-text" />
          <div id="help-text">This is help text</div>
        </div>
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('supports aria-invalid for error state', () => {
      render(<Input error aria-invalid="true" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('maintains focus ring styles', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      expectToHaveClass(input, 'focus-visible:outline-none');
      expectToHaveClass(input, 'focus-visible:ring-2');
    });
  });

  describe('Form Integration', () => {
    it('works with form validation', () => {
      render(
        <form>
          <Input type="email" required name="email" />
        </form>
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('name', 'email');
    });

    it('handles form submission', async () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());
      
      render(
        <form onSubmit={handleSubmit}>
          <Input name="test" />
          <button type="submit">Submit</button>
        </form>
      );
      
      await fillInput('textbox', 'test value');
      
      const button = screen.getByRole('button', { name: 'Submit' });
      button.click();
      
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('File Input Specific', () => {
    it('handles file input attributes', () => {
      render(
        <Input 
          type="file" 
          accept=".jpg,.png" 
          multiple 
        />
      );
      
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(input).toHaveAttribute('accept', '.jpg,.png');
      expect(input).toHaveAttribute('multiple');
    });

    it('applies file input specific styles', () => {
      render(<Input type="file" />);
      
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      expectToHaveClass(input, 'file:border-0');
      expectToHaveClass(input, 'file:bg-transparent');
    });
  });

  describe('Number Input Specific', () => {
    it('handles number input attributes', () => {
      render(
        <Input 
          type="number" 
          min={0} 
          max={100} 
          step={0.1} 
        />
      );
      
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
      expect(input).toHaveAttribute('step', '0.1');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string values', () => {
      render(<Input value="" onChange={() => {}} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });

    it('handles null and undefined values gracefully', () => {
      const { rerender } = render(<Input value={undefined} onChange={() => {}} />);
      
      let input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();

      rerender(<Input value={null as any} onChange={() => {}} />);
      
      input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('combines multiple props correctly', () => {
      render(
        <Input 
          variant="success"
          inputSize="lg"
          error={true}
          successText="Success message"
          errorText="Error message"
          className="custom-class"
        />
      );
      
      const input = screen.getByRole('textbox');
      
      // Error should override success variant
      expectToHaveClass(input, 'border-red-500');
      expectToHaveClass(input, 'h-12'); // Large size
      expectToHaveClass(input, 'custom-class');
      
      // Error text should be displayed
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });
});

describe('Input Variants Class Generation', () => {
  it('generates correct classes for all variant combinations', () => {
    const { inputVariants } = require('./input');
    
    // Test all variants
    expect(inputVariants({ variant: 'default' })).toContain('border-neutral-300');
    expect(inputVariants({ variant: 'error' })).toContain('border-red-500');
    expect(inputVariants({ variant: 'success' })).toContain('border-green-500');
    
    // Test all sizes
    expect(inputVariants({ inputSize: 'sm' })).toContain('h-8');
    expect(inputVariants({ inputSize: 'md' })).toContain('h-10');
    expect(inputVariants({ inputSize: 'lg' })).toContain('h-12');
  });
});
