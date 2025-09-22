'use client';

import React, { useEffect, useRef, ReactNode } from 'react';
import { useFocusTrap } from '@/lib/accessibility';

export interface FocusTrapProps {
  /** Child components */
  children: ReactNode;
  /** Whether the focus trap is active */
  active?: boolean;
  /** Whether to restore focus when deactivated */
  restoreFocus?: boolean;
  /** Element to focus when the trap is activated */
  initialFocus?: HTMLElement | (() => HTMLElement);
  /** Element to focus when the trap is deactivated */
  finalFocus?: HTMLElement | (() => HTMLElement);
  /** Whether to prevent scrolling when focusing elements */
  preventScroll?: boolean;
  /** Custom CSS class */
  className?: string;
  /** Whether to show focus trap indicator */
  showIndicator?: boolean;
  /** Callback when focus trap is activated */
  onActivate?: () => void;
  /** Callback when focus trap is deactivated */
  onDeactivate?: () => void;
  /** Callback when escape key is pressed */
  onEscape?: () => void;
}

/**
 * Focus trap component for managing focus within modals, dropdowns, and other contained elements
 */
export function FocusTrap({
  children,
  active = false,
  restoreFocus = true,
  initialFocus,
  finalFocus,
  preventScroll = false,
  className = '',
  showIndicator = false,
  onActivate,
  onDeactivate,
  onEscape
}: FocusTrapProps) {
  const {
    containerRef,
    isActive,
    activate,
    deactivate,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious
  } = useFocusTrap({
    trapFocus: true,
    restoreFocus,
    initialFocus,
    finalFocus,
    preventScroll
  });

  // Handle escape key
  useEffect(() => {
    if (!active || !onEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [active, onEscape]);

  // Activate/deactivate focus trap based on active prop
  useEffect(() => {
    if (active && !isActive) {
      activate();
      onActivate?.();
    } else if (!active && isActive) {
      deactivate();
      onDeactivate?.();
    }
  }, [active, isActive, activate, deactivate, onActivate, onDeactivate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isActive) {
        deactivate();
      }
    };
  }, [isActive, deactivate]);

  return (
    <div
      ref={containerRef}
      className={`focus-trap ${showIndicator ? 'show-indicator' : ''} ${className}`}
      data-focus-trap={active}
      role={active ? 'dialog' : undefined}
      aria-modal={active ? 'true' : undefined}
      tabIndex={-1}
    >
      {children}
    </div>
  );
}

export interface ModalFocusTrapProps extends FocusTrapProps {
  /** Modal title for accessibility */
  title?: string;
  /** Whether the modal is open */
  open?: boolean;
  /** Callback when modal should close */
  onClose?: () => void;
}

/**
 * Modal-specific focus trap component
 */
export function ModalFocusTrap({
  children,
  title,
  open = false,
  onClose,
  className = '',
  ...props
}: ModalFocusTrapProps) {
  const handleEscape = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleActivate = () => {
    // Announce modal opening
    if (title) {
      const announcement = new CustomEvent('screen-reader-announcement', {
        detail: {
          message: `${title} dialog opened`,
          priority: 'assertive'
        }
      });
      document.dispatchEvent(announcement);
    }
  };

  const handleDeactivate = () => {
    // Announce modal closing
    if (title) {
      const announcement = new CustomEvent('screen-reader-announcement', {
        detail: {
          message: `${title} dialog closed`,
          priority: 'assertive'
        }
      });
      document.dispatchEvent(announcement);
    }
  };

  return (
    <FocusTrap
      active={open}
      onEscape={handleEscape}
      onActivate={handleActivate}
      onDeactivate={handleDeactivate}
      className={`modal-focus-trap ${className}`}
      showIndicator={true}
      {...props}
    >
      {open && (
        <>
          <h2 id="modal-title" className="sr-only">
            {title}
          </h2>
          {children}
        </>
      )}
    </FocusTrap>
  );
}

export interface DropdownFocusTrapProps extends FocusTrapProps {
  /** Whether the dropdown is open */
  open?: boolean;
  /** Callback when dropdown should close */
  onClose?: () => void;
  /** Role of the dropdown */
  role?: 'menu' | 'listbox' | 'grid' | 'tree';
}

/**
 * Dropdown-specific focus trap component
 */
export function DropdownFocusTrap({
  children,
  open = false,
  onClose,
  role = 'menu',
  className = '',
  ...props
}: DropdownFocusTrapProps) {
  const handleEscape = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleActivate = () => {
    // Focus first menu item when dropdown opens
    setTimeout(() => {
      const firstItem = document.querySelector('[role="menuitem"], [role="option"], [role="gridcell"], [role="treeitem"]');
      if (firstItem instanceof HTMLElement) {
        firstItem.focus();
      }
    }, 0);
  };

  return (
    <FocusTrap
      active={open}
      onEscape={handleEscape}
      onActivate={handleActivate}
      className={`dropdown-focus-trap ${className}`}
      {...props}
    >
      <div role={role} aria-expanded={open}>
        {open && children}
      </div>
    </FocusTrap>
  );
}

export interface PopoverFocusTrapProps extends FocusTrapProps {
  /** Whether the popover is open */
  open?: boolean;
  /** Callback when popover should close */
  onClose?: () => void;
  /** ID of the trigger element */
  triggerId?: string;
}

/**
 * Popover-specific focus trap component
 */
export function PopoverFocusTrap({
  children,
  open = false,
  onClose,
  triggerId,
  className = '',
  ...props
}: PopoverFocusTrapProps) {
  const handleEscape = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleDeactivate = () => {
    // Return focus to trigger element
    if (triggerId) {
      const trigger = document.getElementById(triggerId);
      if (trigger) {
        trigger.focus();
      }
    }
  };

  return (
    <FocusTrap
      active={open}
      onEscape={handleEscape}
      onDeactivate={handleDeactivate}
      className={`popover-focus-trap ${className}`}
      {...props}
    >
      <div role="dialog" aria-expanded={open}>
        {open && children}
      </div>
    </FocusTrap>
  );
}

export default FocusTrap;