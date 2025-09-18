import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
import { Button } from './button'
import { Badge } from './badge'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area where you can place any content.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
}

export const Simple: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent className="p-6">
        <p>Simple card with just content.</p>
      </CardContent>
    </Card>
  ),
}

export const WithHeader: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Perfume Formula</CardTitle>
        <CardDescription>Created by John Doe on March 15, 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <p>A beautiful floral fragrance with notes of rose, jasmine, and vanilla.</p>
      </CardContent>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent className="p-6">
        <p>Card content with footer actions.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
}

export const PerfumeCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Midnight Rose</CardTitle>
          <Badge variant="success">Approved</Badge>
        </div>
        <CardDescription>Floral Oriental • Created by Sarah Chen</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            A sophisticated blend of dark roses, amber, and sandalwood.
          </p>
          <div className="flex gap-2">
            <Badge variant="outline">Rose</Badge>
            <Badge variant="outline">Amber</Badge>
            <Badge variant="outline">Sandalwood</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">View Details</Button>
        <Button size="sm">Edit Formula</Button>
      </CardFooter>
    </Card>
  ),
}

export const ProjectCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Spring Collection 2024</CardTitle>
          <Badge variant="warning">In Progress</Badge>
        </div>
        <CardDescription>Project Manager: Alex Rodriguez</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Development of 5 new fragrances for the spring collection.
          </p>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>60%</span>
            </div>
            <div className="h-2 bg-neutral-200 rounded-full dark:bg-neutral-700">
              <div className="h-2 bg-primary-600 rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">View Project</Button>
        <Button size="sm">Update Status</Button>
      </CardFooter>
    </Card>
  ),
}

export const IngredientCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Rose Absolute</CardTitle>
        <CardDescription>Essential Oil • CAS: 8007-01-0</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Supplier:</span>
            <span>Givaudan</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Price:</span>
            <span>$2,450/kg</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Stock:</span>
            <span className="text-green-600 dark:text-green-400">In Stock</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  ),
}

export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Card 1</CardTitle>
          <CardDescription>Description for card 1</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for card 1</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card 2</CardTitle>
          <CardDescription>Description for card 2</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for card 2</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card 3</CardTitle>
          <CardDescription>Description for card 3</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for card 3</p>
        </CardContent>
      </Card>
    </div>
  ),
}
