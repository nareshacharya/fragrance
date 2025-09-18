# Fragrance Management System

Enterprise-grade perfume formula management system for comprehensive fragrance development, tracking, and collaboration across your entire organization.

## 🚀 Overview

The Fragrance Management System is a modern, scalable web application built with Next.js 14+ that provides a comprehensive platform for managing perfume formulas, projects, and team collaboration. Designed for enterprise use, it offers robust security, real-time updates, and seamless integration capabilities.

## ✨ Features

### Core Functionality
- **Formula Management**: Create, edit, and manage complex perfume formulas with precision
- **Project Tracking**: Organize and track fragrance development projects
- **Case Management**: Handle workflow cases and assignments
- **Team Collaboration**: Real-time collaboration tools for distributed teams
- **Analytics & Reporting**: Comprehensive reporting and analytics dashboard
- **File Management**: Secure file upload and management system

### Enterprise Features
- **Role-based Access Control**: Granular permissions and user management
- **Audit Logging**: Complete audit trail for compliance
- **API Integration**: RESTful API with Pega DX integration support
- **Real-time Updates**: Live notifications and updates
- **Multi-environment Support**: Development, staging, and production configurations
- **Security**: Bank-level security with encryption and authentication

## 🛠 Technology Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React 18** - Modern React with concurrent features

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **TypeScript** - Full-stack type safety
- **Zod** - Runtime type validation
- **PostgreSQL** - Primary database
- **Redis** - Caching and session storage

### Development Tools
- **ESLint 9** - Code linting with flat config
- **Prettier** - Code formatting with Tailwind plugin
- **Husky** - Git hooks for code quality
- **Jest** - Testing framework
- **TypeScript** - Static type checking

### Deployment
- **Vercel** - Recommended deployment platform
- **Docker** - Containerization support
- **Standalone Build** - Self-contained deployment

## 📁 Project Structure

```
fragrance/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components
│   │   └── layouts/            # Layout components
│   ├── lib/                    # Utility functions
│   │   └── utils.ts            # Common utilities
│   ├── types/                  # TypeScript definitions
│   │   └── index.ts            # Type definitions
│   └── config/                 # Configuration files
│       ├── env.ts               # Environment validation
│       └── constants.ts         # Application constants
├── .husky/                     # Git hooks
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── eslint.config.mjs           # ESLint configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.mjs          # PostCSS configuration
├── prettier.config.cjs         # Prettier configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **PostgreSQL** 14 or higher (for production)
- **Redis** 6 or higher (for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fragrance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```
   
   > 📋 **Environment Setup**: See [`.env.example`](.env.example) for a complete list of required environment variables with descriptions and example values.

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb fragrance_db
   
   # Run migrations (when available)
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Configuration

The application requires several environment variables to be configured. Copy `.env.example` to `.env.local` and update the values:

```bash
# Application Configuration
NEXT_PUBLIC_APP_NAME="Fragrance Management System"
NEXT_PUBLIC_APP_VERSION="0.1.0"
NEXT_PUBLIC_APP_ENV="development"

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/fragrance_db"

# Authentication Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# API Configuration
API_BASE_URL="http://localhost:3000/api"
```

## 📝 Development Workflow

### Code Quality

The project enforces high code quality standards through automated tools:

- **ESLint**: Code linting with TypeScript and React rules
- **Prettier**: Code formatting with Tailwind CSS class sorting
- **Husky**: Git hooks for pre-commit and pre-push checks
- **TypeScript**: Static type checking

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
npm run type-check      # Run TypeScript type checking

# Testing
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage

# Git Hooks
npm run prepare         # Install Husky hooks
```

### Git Hooks

The project uses Husky for git hooks:

- **Pre-commit**: Runs lint-staged to check and fix staged files
- **Pre-push**: Runs type checking and tests before pushing

## 🏗 Architecture

### Design Principles

- **Modular Architecture**: Clean separation of concerns
- **Type Safety**: Full TypeScript coverage
- **Performance**: Optimized for speed and scalability
- **Security**: Enterprise-grade security measures
- **Maintainability**: Clean code and documentation

### Key Components

1. **App Router**: Next.js 14 App Router for file-based routing
2. **Component Library**: Reusable UI components
3. **Type System**: Comprehensive TypeScript definitions
4. **Configuration**: Environment-based configuration
5. **Utilities**: Shared utility functions

## 🔧 Configuration

### Next.js Configuration

The `next.config.ts` file includes:
- TypeScript support
- Image optimization
- Security headers
- Performance optimizations

### Tailwind CSS Configuration

Custom theme with:
- Perfume industry-inspired color palette
- Custom animations
- Component-specific utilities
- Responsive design system

### ESLint Configuration

ESLint 9 flat config with:
- TypeScript support
- React rules
- Import/export rules
- Prettier integration

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** automatically on push to main branch

### Docker

```bash
# Build Docker image
docker build -t fragrance-management .

# Run container
docker run -p 3000:3000 fragrance-management
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 📊 Monitoring and Analytics

### Performance Monitoring

- Built-in performance monitoring
- Real-time metrics
- Error tracking
- User analytics

### Logging

- Structured logging with JSON format
- Configurable log levels
- Request/response logging
- Error tracking

## 🔒 Security

### Authentication

- JWT-based authentication
- Role-based access control
- Session management
- Password policies

### Data Protection

- Encryption at rest and in transit
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Standards

- Follow TypeScript best practices
- Use meaningful variable names
- Write comprehensive tests
- Document complex functions
- Follow the established file structure

### Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Request review from maintainers
4. Address feedback promptly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation

- [API Documentation](docs/api.md)
- [Component Library](docs/components.md)
- [Deployment Guide](docs/deployment.md)

### Getting Help

- Create an issue for bugs or feature requests
- Check existing issues and discussions
- Join our community discussions

### Contact

- **Email**: support@fragrance-management.com
- **Documentation**: [docs.fragrance-management.com](https://docs.fragrance-management.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/fragrance/issues)

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Project foundation and setup
- ✅ Basic authentication and user management
- ✅ Core formula management features

### Phase 2 (Upcoming)
- 🔄 Pega DX API integration
- 🔄 Advanced analytics and reporting
- 🔄 Real-time collaboration features

### Phase 3 (Future)
- 📋 Mobile application
- 📋 Advanced AI features
- 📋 Third-party integrations

---

**Built with ❤️ for the fragrance industry**
