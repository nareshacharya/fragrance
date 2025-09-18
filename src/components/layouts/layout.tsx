import * as React from 'react'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

interface HeaderProps {
  children: React.ReactNode
  className?: string
}

interface SidebarProps {
  children: React.ReactNode
  className?: string
  collapsed?: boolean
}

interface MainProps {
  children: React.ReactNode
  className?: string
}

interface FooterProps {
  children: React.ReactNode
  className?: string
}

const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'min-h-screen bg-white dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
Layout.displayName = 'Layout'

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, children, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        'sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-950/95 dark:supports-[backdrop-filter]:bg-neutral-950/60',
        className
      )}
      {...props}
    >
      {children}
    </header>
  )
)
Header.displayName = 'Header'

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, children, collapsed = false, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(
        'fixed left-0 top-0 z-40 h-full w-64 border-r border-neutral-200 bg-white transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-950',
        collapsed && 'w-16',
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
)
Sidebar.displayName = 'Sidebar'

const Main = React.forwardRef<HTMLElement, MainProps>(
  ({ className, children, ...props }, ref) => (
    <main
      ref={ref}
      className={cn(
        'flex-1 overflow-auto bg-neutral-50/50 dark:bg-neutral-900/50',
        className
      )}
      {...props}
    >
      {children}
    </main>
  )
)
Main.displayName = 'Main'

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, children, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn(
        'border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
        className
      )}
      {...props}
    >
      {children}
    </footer>
  )
)
Footer.displayName = 'Footer'

// Layout with sidebar
const LayoutWithSidebar = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex h-screen', className)}
      {...props}
    >
      {children}
    </div>
  )
)
LayoutWithSidebar.displayName = 'LayoutWithSidebar'

// Content area for layouts with sidebar
const ContentArea = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-1 flex-col overflow-hidden', className)}
      {...props}
    >
      {children}
    </div>
  )
)
ContentArea.displayName = 'ContentArea'

export {
  Layout,
  Header,
  Sidebar,
  Main,
  Footer,
  LayoutWithSidebar,
  ContentArea,
}
