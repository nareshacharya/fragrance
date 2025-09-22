'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useModalKeyboardNavigation } from '../../lib/accessibility/hooks'
import { ARIA_ROLES, KEYBOARD_CODES, STANDARD_LABELS } from '../../lib/accessibility/constants'
import { FocusTrap } from './focus-trap'
import { ScreenReaderAnnouncement } from './screen-reader-announcement'

const Modal = DialogPrimitive.Root

const ModalTrigger = DialogPrimitive.Trigger

const ModalPortal = DialogPrimitive.Portal

const ModalClose = DialogPrimitive.Close

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    title?: string
    description?: string
    initialFocus?: string
  }
>(({ className, children, title, description, initialFocus, ...props }, ref) => {
  const modalRef = React.useRef<HTMLDivElement>(null)
  
  const { modalRef: modalKeyboardRef } = useModalKeyboardNavigation(() => {
    // Handle close via Dialog
    const closeButton = modalRef.current?.querySelector('[data-state]')
    if (closeButton) {
      (closeButton as HTMLElement).click()
    }
  })

  // Combine refs
  React.useImperativeHandle(ref, () => modalRef.current!, [])

  return (
    <ModalPortal>
      <ModalOverlay />
      <FocusTrap
        ref={modalRef}
        active={true}
        initialFocus={initialFocus}
        onEscape={() => {
          // Trigger close via Dialog
          const closeButton = modalRef.current?.querySelector('[data-state]')
          if (closeButton) {
            (closeButton as HTMLElement).click()
          }
        }}
      >
        <DialogPrimitive.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-neutral-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-neutral-800 dark:bg-neutral-950',
            className
          )}
          role={ARIA_ROLES.DIALOG}
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby={description ? "modal-description" : undefined}
          {...props}
        >
          {children}
          
          <DialogPrimitive.Close 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-400"
            aria-label={STANDARD_LABELS.CLOSE}
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">{STANDARD_LABELS.CLOSE}</span>
          </DialogPrimitive.Close>
          
          {/* Screen reader announcement for modal opening */}
          <ScreenReaderAnnouncement
            message={`${title || 'Modal'} opened`}
            politeness="polite"
          />
        </DialogPrimitive.Content>
      </FocusTrap>
    </ModalPortal>
  )
})
ModalContent.displayName = DialogPrimitive.Content.displayName

const ModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
)
ModalHeader.displayName = 'ModalHeader'

const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
)
ModalFooter.displayName = 'ModalFooter'

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    id="modal-title"
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
ModalTitle.displayName = DialogPrimitive.Title.displayName

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    id="modal-description"
    className={cn('text-sm text-neutral-500 dark:text-neutral-400', className)}
    {...props}
  />
))
ModalDescription.displayName = DialogPrimitive.Description.displayName

export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalClose,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
}
