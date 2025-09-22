'use client';

import React, { useEffect, useRef } from 'react';
import { useLiveRegion, useAnnouncement } from '@/lib/accessibility';

export interface ScreenReaderAnnouncementProps {
  /** Message to announce */
  message: string;
  /** Priority of the announcement */
  priority?: 'polite' | 'assertive' | 'off';
  /** Whether to clear previous announcements */
  clearPrevious?: boolean;
  /** Whether to persist the announcement */
  persistent?: boolean;
  /** Whether to automatically announce when message changes */
  autoAnnounce?: boolean;
  /** Custom CSS class */
  className?: string;
  /** Whether the component is visible */
  visible?: boolean;
}

/**
 * Screen reader announcement component for dynamic content updates and user feedback
 */
export function ScreenReaderAnnouncement({
  message,
  priority = 'polite',
  clearPrevious = false,
  persistent = false,
  autoAnnounce = true,
  className = '',
  visible = true
}: ScreenReaderAnnouncementProps) {
  const { announce, announceError, announceSuccess, announceInfo } = useAnnouncement({
    priority,
    clearPrevious,
    persistent
  });
  
  const { updateRegion } = useLiveRegion(priority);
  const previousMessageRef = useRef<string>('');
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !message) return;

    // Only announce if message has changed and autoAnnounce is enabled
    if (autoAnnounce && message !== previousMessageRef.current) {
      announce(message);
      previousMessageRef.current = message;
    }

    // Update live region
    if (regionRef.current) {
      updateRegion(message);
    }
  }, [message, visible, autoAnnounce, announce, updateRegion]);

  if (!visible) return null;

  return (
    <div
      ref={regionRef}
      className={`sr-only ${className}`}
      aria-live={priority}
      aria-atomic="true"
      role="status"
      aria-label="Screen reader announcement"
    >
      {message}
    </div>
  );
}

export interface FormAnnouncementProps {
  /** Field name */
  fieldName: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Info message */
  info?: string;
  /** Warning message */
  warning?: string;
  /** Whether to announce */
  announce?: boolean;
  /** Custom CSS class */
  className?: string;
}

/**
 * Form-specific announcement component for validation feedback
 */
export function FormAnnouncement({
  fieldName,
  error,
  success,
  info,
  warning,
  announce = true,
  className = ''
}: FormAnnouncementProps) {
  const { announceError, announceSuccess, announceInfo } = useAnnouncement();
  const message = error || success || info || warning;

  useEffect(() => {
    if (!announce || !message) return;

    if (error) {
      announceError(`${fieldName}: ${error}`);
    } else if (success) {
      announceSuccess(`${fieldName}: ${success}`);
    } else if (info) {
      announceInfo(`${fieldName}: ${info}`);
    } else if (warning) {
      announceError(`${fieldName}: ${warning}`);
    }
  }, [fieldName, error, success, info, warning, announce, announceError, announceSuccess, announceInfo]);

  if (!message) return null;

  return (
    <div
      className={`sr-only ${className}`}
      aria-live={error || warning ? 'assertive' : 'polite'}
      aria-atomic="true"
      role="status"
      aria-label={`${fieldName} validation message`}
    >
      {message}
    </div>
  );
}

export interface LoadingAnnouncementProps {
  /** Loading message */
  message?: string;
  /** Whether currently loading */
  isLoading?: boolean;
  /** Completion message */
  completionMessage?: string;
  /** Custom CSS class */
  className?: string;
}

/**
 * Loading announcement component for loading states
 */
export function LoadingAnnouncement({
  message = 'Loading...',
  isLoading = false,
  completionMessage = 'Loading complete',
  className = ''
}: LoadingAnnouncementProps) {
  const { announceLoading, announceLoadingComplete } = useAnnouncement();
  const [announcedMessage, setAnnouncedMessage] = React.useState<string>('');

  useEffect(() => {
    if (isLoading && announcedMessage !== message) {
      announceLoading(message);
      setAnnouncedMessage(message);
    } else if (!isLoading && announcedMessage) {
      announceLoadingComplete(completionMessage);
      setAnnouncedMessage('');
    }
  }, [isLoading, message, completionMessage, announcedMessage, announceLoading, announceLoadingComplete]);

  if (!isLoading && !announcedMessage) return null;

  return (
    <div
      className={`sr-only ${className}`}
      aria-live="polite"
      aria-atomic="true"
      role="status"
      aria-label="Loading status"
    >
      {isLoading ? message : completionMessage}
    </div>
  );
}

export interface NavigationAnnouncementProps {
  /** Page title */
  pageTitle: string;
  /** Section name */
  section?: string;
  /** Whether to announce */
  announce?: boolean;
  /** Custom CSS class */
  className?: string;
}

/**
 * Navigation announcement component for page changes
 */
export function NavigationAnnouncement({
  pageTitle,
  section,
  announce = true,
  className = ''
}: NavigationAnnouncementProps) {
  const { announce } = useAnnouncement();
  const previousPageRef = useRef<string>('');

  useEffect(() => {
    if (!announce) return;

    const currentPage = section ? `${pageTitle}, ${section}` : pageTitle;
    if (currentPage !== previousPageRef.current) {
      announce(currentPage, {
        clearPrevious: true,
        priority: 'polite'
      });
      previousPageRef.current = currentPage;
    }
  }, [pageTitle, section, announce, announce]);

  return (
    <div
      className={`sr-only ${className}`}
      aria-live="polite"
      aria-atomic="true"
      role="status"
      aria-label="Page navigation"
    >
      {section ? `${pageTitle}, ${section}` : pageTitle}
    </div>
  );
}

export default ScreenReaderAnnouncement;