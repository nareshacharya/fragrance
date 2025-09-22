/**
 * Screen reader utilities for managing announcements, live regions, and assistive technology support
 */

export type AnnouncementPriority = 'polite' | 'assertive' | 'off';

export interface AnnouncementOptions {
  /** Priority of the announcement */
  priority?: AnnouncementPriority;
  /** Whether to clear previous announcements */
  clearPrevious?: boolean;
  /** Custom ID for the announcement element */
  id?: string;
  /** Whether to persist the announcement */
  persistent?: boolean;
  /** Custom CSS class for styling */
  className?: string;
}

export interface LiveRegionOptions {
  /** Priority of the live region */
  priority?: AnnouncementPriority;
  /** Whether the region is atomic */
  atomic?: boolean;
  /** Whether the region is relevant */
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  /** Custom ID for the live region */
  id?: string;
  /** Custom CSS class for styling */
  className?: string;
}

/**
 * Global announcement queue for managing multiple announcements
 */
class AnnouncementManager {
  private announcements: Map<string, HTMLElement> = new Map();
  private queue: Array<{ message: string; options: AnnouncementOptions }> = [];
  private isProcessing = false;

  /**
   * Add an announcement to the queue
   */
  announce(message: string, options: AnnouncementOptions = {}) {
    const {
      priority = 'polite',
      clearPrevious = false,
      id = `announcement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      persistent = false,
      className = ''
    } = options;

    if (clearPrevious) {
      this.clearAll();
    }

    this.queue.push({ message, options: { ...options, id, priority, persistent, className } });
    this.processQueue();
  }

  /**
   * Process the announcement queue
   */
  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const { message, options } = this.queue.shift()!;
      await this.createAnnouncement(message, options);
      
      // Small delay between announcements to prevent overwhelming screen readers
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isProcessing = false;
  }

  /**
   * Create a live region announcement
   */
  private async createAnnouncement(message: string, options: AnnouncementOptions) {
    const { priority, id, persistent, className } = options;

    // Remove existing announcement with the same ID
    if (this.announcements.has(id!)) {
      this.removeAnnouncement(id!);
    }

    const liveRegion = document.createElement('div');
    liveRegion.id = id!;
    liveRegion.setAttribute('aria-live', priority!);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = `sr-only ${className}`.trim();
    liveRegion.textContent = message;

    document.body.appendChild(liveRegion);
    this.announcements.set(id!, liveRegion);

    // Announce the message
    liveRegion.textContent = message;

    // Remove non-persistent announcements after a delay
    if (!persistent) {
      setTimeout(() => {
        this.removeAnnouncement(id!);
      }, 1000);
    }
  }

  /**
   * Remove a specific announcement
   */
  removeAnnouncement(id: string) {
    const announcement = this.announcements.get(id);
    if (announcement && announcement.parentNode) {
      announcement.parentNode.removeChild(announcement);
      this.announcements.delete(id);
    }
  }

  /**
   * Clear all announcements
   */
  clearAll() {
    for (const [id] of this.announcements) {
      this.removeAnnouncement(id);
    }
    this.queue = [];
  }

  /**
   * Clear announcements by priority
   */
  clearByPriority(priority: AnnouncementPriority) {
    for (const [id, element] of this.announcements) {
      if (element.getAttribute('aria-live') === priority) {
        this.removeAnnouncement(id);
      }
    }
  }
}

// Global announcement manager instance
const announcementManager = new AnnouncementManager();

/**
 * Announce a message to screen readers
 */
export function announce(
  message: string,
  options: AnnouncementOptions = {}
): void {
  announcementManager.announce(message, options);
}

/**
 * Create a persistent live region for dynamic content
 */
export function createLiveRegion(options: LiveRegionOptions = {}): HTMLElement {
  const {
    priority = 'polite',
    atomic = true,
    relevant = 'additions text',
    id = `live-region-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    className = ''
  } = options;

  const liveRegion = document.createElement('div');
  liveRegion.id = id;
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.setAttribute('aria-atomic', atomic.toString());
  liveRegion.setAttribute('aria-relevant', relevant);
  liveRegion.className = `sr-only ${className}`.trim();

  document.body.appendChild(liveRegion);
  return liveRegion;
}

/**
 * Update a live region with new content
 */
export function updateLiveRegion(
  liveRegion: HTMLElement,
  content: string,
  clearFirst = false
): void {
  if (clearFirst) {
    liveRegion.textContent = '';
  }
  
  // Force screen reader to announce the change
  liveRegion.textContent = content;
}

/**
 * Remove a live region
 */
export function removeLiveRegion(liveRegion: HTMLElement): void {
  if (liveRegion.parentNode) {
    liveRegion.parentNode.removeChild(liveRegion);
  }
}

/**
 * Create a status announcement for form validation
 */
export function announceFormStatus(
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'info'
): void {
  const priority: AnnouncementPriority = type === 'error' ? 'assertive' : 'polite';
  
  announce(message, {
    priority,
    clearPrevious: type === 'error' // Clear previous errors
  });
}

/**
 * Announce page navigation
 */
export function announceNavigation(
  pageTitle: string,
  section?: string
): void {
  const message = section ? `${pageTitle}, ${section}` : pageTitle;
  
  announce(message, {
    priority: 'polite',
    clearPrevious: true
  });
}

/**
 * Create a screen reader only element
 */
export function createScreenReaderOnly(
  content: string,
  className = ''
): HTMLElement {
  const element = document.createElement('span');
  element.className = `sr-only ${className}`.trim();
  element.textContent = content;
  return element;
}

/**
 * Clear all announcements and live regions
 */
export function clearAllAnnouncements(): void {
  announcementManager.clearAll();
}

/**
 * Clear announcements by priority
 */
export function clearAnnouncementsByPriority(priority: AnnouncementPriority): void {
  announcementManager.clearByPriority(priority);
}