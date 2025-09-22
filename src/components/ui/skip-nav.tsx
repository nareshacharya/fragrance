'use client';

import React from 'react';
import { useSkipLinks } from '@/lib/accessibility';

export interface SkipNavProps {
  /** Custom skip links */
  links?: Array<{
    id: string;
    label: string;
    href?: string;
  }>;
  /** Whether to show the skip navigation */
  show?: boolean;
  /** Custom CSS class */
  className?: string;
}

/**
 * Skip navigation component for keyboard users to bypass repetitive navigation elements
 */
export function SkipNav({ 
  links = [
    { id: 'main-content', label: 'Skip to main content' },
    { id: 'main-navigation', label: 'Skip to navigation' },
    { id: 'search-input', label: 'Skip to search' }
  ],
  show = true,
  className = ''
}: SkipNavProps) {
  const { skipTo, activeSkipLink } = useSkipLinks();

  if (!show) return null;

  const handleSkipClick = (event: React.MouseEvent<HTMLAnchorElement>, linkId: string) => {
    event.preventDefault();
    skipTo(linkId);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>, linkId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      skipTo(linkId);
    }
  };

  return (
    <nav 
      className={`skip-nav-container ${className}`}
      role="navigation"
      aria-label="Skip navigation"
    >
      {links.map((link) => (
        <a
          key={link.id}
          href={link.href || `#${link.id}`}
          className={`skip-nav ${activeSkipLink === link.id ? 'active' : ''}`}
          onClick={(e) => handleSkipClick(e, link.id)}
          onKeyDown={(e) => handleKeyDown(e, link.id)}
          aria-label={link.label}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

export default SkipNav;