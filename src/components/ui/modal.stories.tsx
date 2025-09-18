import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from './modal'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onOpenChange: fn(),
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>Open Modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Modal Title</ModalTitle>
          <ModalDescription>
            This is a modal description. It provides context about what the modal is for.
          </ModalDescription>
        </ModalHeader>
        <div className="py-4">
          <p>Modal content goes here.</p>
        </div>
        <ModalFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
}

export const ConfirmationDialog: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="destructive">Delete Item</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Delete Item</ModalTitle>
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
}

export const FormModal: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>Add New Perfume</Button>
      </ModalTrigger>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle>Add New Perfume</ModalTitle>
          <ModalDescription>
            Create a new perfume formula in the system.
          </ModalDescription>
        </ModalHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="name">Perfume Name</Label>
            <Input id="name" placeholder="Enter perfume name" />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" placeholder="Enter category" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Enter description" />
          </div>
        </div>
        <ModalFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Create Perfume</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
}

export const LargeModal: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>Open Large Modal</Button>
      </ModalTrigger>
      <ModalContent className="max-w-2xl">
        <ModalHeader>
          <ModalTitle>Large Modal</ModalTitle>
          <ModalDescription>
            This is a larger modal with more content.
          </ModalDescription>
        </ModalHeader>
        <div className="py-4 space-y-4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="field1">Field 1</Label>
              <Input id="field1" placeholder="Enter value" />
            </div>
            <div>
              <Label htmlFor="field2">Field 2</Label>
              <Input id="field2" placeholder="Enter value" />
            </div>
          </div>
        </div>
        <ModalFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
}

export const WithoutCloseButton: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>Open Modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Modal Without Close Button</ModalTitle>
          <ModalDescription>
            This modal doesn't have a close button in the header.
          </ModalDescription>
        </ModalHeader>
        <div className="py-4">
          <p>You can only close this modal using the footer buttons.</p>
        </div>
        <ModalFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
}

export const AlertModal: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline">Show Alert</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Important Notice</ModalTitle>
          <ModalDescription>
            This is an important alert message.
          </ModalDescription>
        </ModalHeader>
        <div className="py-4">
          <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Warning</span>
          </div>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Please review your changes before proceeding. This action will affect multiple records.
          </p>
        </div>
        <ModalFooter>
          <Button>I Understand</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
}
