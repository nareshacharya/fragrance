import React from 'react';
import { render, screen } from '@/test-utils';
import { Badge } from './badge';

describe('Badge Component', () => {
  describe('Rendering', () => {
    it('renders badge with default props', () => {
      render(<Badge>Default Badge</Badge>);
      
      const badge = screen.getByText('Default Badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2');
    });

    it('renders badge with custom text', () => {
      render(<Badge>Custom Text</Badge>);
      
      const badge = screen.getByText('Custom Text');
      expect(badge).toBeInTheDocument();
    });

    it('renders as span by default', () => {
      render(<Badge>Badge Text</Badge>);
      
      const badge = screen.getByText('Badge Text');
      expect(badge.tagName).toBe('SPAN');
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Badge variant="default">Default Badge</Badge>);
      
      const badge = screen.getByText('Default Badge');
      expect(badge).toHaveClass('border-transparent bg-primary text-primary-foreground hover:bg-primary/80');
    });

    it('renders secondary variant', () => {
      render(<Badge variant="secondary">Secondary Badge</Badge>);
      
      const badge = screen.getByText('Secondary Badge');
      expect(badge).toHaveClass('border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80');
    });

    it('renders destructive variant', () => {
      render(<Badge variant="destructive">Destructive Badge</Badge>);
      
      const badge = screen.getByText('Destructive Badge');
      expect(badge).toHaveClass('border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80');
    });

    it('renders outline variant', () => {
      render(<Badge variant="outline">Outline Badge</Badge>);
      
      const badge = screen.getByText('Outline Badge');
      expect(badge).toHaveClass('text-foreground');
    });

    it('defaults to default variant when no variant specified', () => {
      render(<Badge>Badge Text</Badge>);
      
      const badge = screen.getByText('Badge Text');
      expect(badge).toHaveClass('border-transparent bg-primary text-primary-foreground hover:bg-primary/80');
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(<Badge className="custom-badge">Custom Badge</Badge>);
      
      const badge = screen.getByText('Custom Badge');
      expect(badge).toHaveClass('custom-badge');
    });

    it('forwards HTML attributes', () => {
      render(
        <Badge 
          id="test-badge"
          data-testid="badge"
          title="Badge tooltip"
        >
          Test Badge
        </Badge>
      );
      
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveAttribute('id', 'test-badge');
      expect(badge).toHaveAttribute('data-testid', 'badge');
      expect(badge).toHaveAttribute('title', 'Badge tooltip');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Badge ref={ref}>Ref Badge</Badge>);
      
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current).toHaveTextContent('Ref Badge');
    });
  });

  describe('Accessibility', () => {
    it('has proper focus styles', () => {
      render(<Badge tabIndex={0}>Focusable Badge</Badge>);
      
      const badge = screen.getByText('Focusable Badge');
      expect(badge).toHaveClass('focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2');
    });

    it('supports aria-label', () => {
      render(<Badge aria-label="Status badge">Active</Badge>);
      
      const badge = screen.getByLabelText('Status badge');
      expect(badge).toBeInTheDocument();
    });

    it('supports role attribute', () => {
      render(<Badge role="status">Status</Badge>);
      
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <div>
          <Badge aria-describedby="badge-description">Badge</Badge>
          <div id="badge-description">This badge indicates status</div>
        </div>
      );
      
      const badge = screen.getByText('Badge');
      expect(badge).toHaveAttribute('aria-describedby', 'badge-description');
    });
  });

  describe('Content Types', () => {
    it('renders with text content', () => {
      render(<Badge>Text Content</Badge>);
      
      const badge = screen.getByText('Text Content');
      expect(badge).toBeInTheDocument();
    });

    it('renders with number content', () => {
      render(<Badge>42</Badge>);
      
      const badge = screen.getByText('42');
      expect(badge).toBeInTheDocument();
    });

    it('renders with React element content', () => {
      render(
        <Badge>
          <span>Element Content</span>
        </Badge>
      );
      
      const badge = screen.getByText('Element Content');
      expect(badge).toBeInTheDocument();
    });

    it('renders with mixed content', () => {
      render(
        <Badge>
          <span>Count:</span> 5
        </Badge>
      );
      
      const badge = screen.getByText('Count:');
      expect(badge).toBeInTheDocument();
      expect(badge.parentElement).toHaveTextContent('Count: 5');
    });
  });

  describe('Size and Spacing', () => {
    it('has correct padding and sizing', () => {
      render(<Badge>Badge</Badge>);
      
      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('px-2.5 py-0.5');
    });

    it('has correct font size', () => {
      render(<Badge>Badge</Badge>);
      
      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('text-xs');
    });

    it('has correct font weight', () => {
      render(<Badge>Badge</Badge>);
      
      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('font-semibold');
    });
  });

  describe('Interactive States', () => {
    it('handles hover state', () => {
      render(<Badge variant="default">Hover Badge</Badge>);
      
      const badge = screen.getByText('Hover Badge');
      expect(badge).toHaveClass('hover:bg-primary/80');
    });

    it('handles focus state', () => {
      render(<Badge tabIndex={0}>Focus Badge</Badge>);
      
      const badge = screen.getByText('Focus Badge');
      badge.focus();
      expect(badge).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty content', () => {
      render(<Badge></Badge>);
      
      const badge = screen.getByRole('generic');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('');
    });

    it('handles very long content', () => {
      const longText = 'This is a very long badge text that might overflow';
      render(<Badge>{longText}</Badge>);
      
      const badge = screen.getByText(longText);
      expect(badge).toBeInTheDocument();
    });

    it('handles special characters', () => {
      render(<Badge>Badge with special chars: @#$%</Badge>);
      
      const badge = screen.getByText('Badge with special chars: @#$%');
      expect(badge).toBeInTheDocument();
    });

    it('handles multiple badges', () => {
      render(
        <div>
          <Badge>First Badge</Badge>
          <Badge variant="secondary">Second Badge</Badge>
          <Badge variant="destructive">Third Badge</Badge>
        </div>
      );
      
      expect(screen.getByText('First Badge')).toBeInTheDocument();
      expect(screen.getByText('Second Badge')).toBeInTheDocument();
      expect(screen.getByText('Third Badge')).toBeInTheDocument();
    });
  });

  describe('Combined Props', () => {
    it('combines variant with custom className', () => {
      render(
        <Badge variant="destructive" className="custom-class">
          Combined Badge
        </Badge>
      );
      
      const badge = screen.getByText('Combined Badge');
      expect(badge).toHaveClass('border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80');
      expect(badge).toHaveClass('custom-class');
    });

    it('combines accessibility props with variant', () => {
      render(
        <Badge 
          variant="outline" 
          aria-label="Custom label"
          role="status"
        >
          Accessible Badge
        </Badge>
      );
      
      const badge = screen.getByLabelText('Custom label');
      expect(badge).toHaveClass('text-foreground');
      expect(badge).toHaveAttribute('role', 'status');
    });
  });
});
