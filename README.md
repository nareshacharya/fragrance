# Fragrance App

A comprehensive enterprise-grade fragrance management application built with modern web technologies.

## 🚀 Features

- **Authentication & Authorization**: Secure JWT-based authentication with role-based access control
- **Ingredient Management**: Complete CRUD operations for fragrance ingredients with import/export capabilities
- **Case Management**: Workflow-based case management system with Pega DX integration
- **API Integration**: Robust API client with Pega DX integration, retry policies, and monitoring
- **File Management**: Secure file upload, processing, and storage with cloud support
- **Notifications**: Multi-channel notification system (email, SMS, push, in-app)
- **Feature Flags**: Runtime feature toggles with A/B testing capabilities
- **Monitoring**: Comprehensive logging, metrics, and health checks
- **Security**: Enterprise-grade security with CORS, CSRF, rate limiting, and audit logging
- **Accessibility**: WCAG 2.1 AA compliant with comprehensive accessibility features
- **Testing**: Extensive test coverage with unit, integration, and E2E tests

## 🏗️ Architecture

The application follows a modern, scalable architecture with:

- **Frontend**: Next.js 14 with React 18, TypeScript, and Tailwind CSS
- **Backend**: Node.js with Express and comprehensive API layer
- **Database**: PostgreSQL with connection pooling and migrations
- **Authentication**: JWT-based with refresh tokens and session management
- **File Storage**: Local and cloud storage (S3, GCS, Azure) support
- **Monitoring**: Structured logging, metrics collection, and health checks
- **Testing**: Jest, React Testing Library, and Playwright for comprehensive testing

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis (optional, for caching and sessions)
- Docker and Docker Compose (optional, for containerized development)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fragrance
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template and configure your settings:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fragrance_db
DB_USER=postgres
DB_PASSWORD=your_password

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# API
PEGA_DX_BASE_URL=https://api.pega.com
PEGA_DX_API_KEY=your-api-key

# Email (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-username
SMTP_PASSWORD=your-password
SMTP_FROM=noreply@fragrance-app.com
```

### 4. Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed development data (optional)
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with test data
- `npm run db:reset` - Reset database (development only)

### Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── dashboard/          # Dashboard pages
│   ├── ingredients/        # Ingredient management pages
│   ├── login/             # Authentication pages
│   └── ...
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── ingredients/       # Ingredient management components
│   ├── ui/                # Reusable UI components
│   └── ...
├── config/                # Configuration system
│   ├── features/          # Feature-based configuration
│   ├── environments/      # Environment-specific configs
│   └── ...
├── lib/                   # Utility libraries
│   ├── api/               # API client and services
│   ├── auth/              # Authentication utilities
│   ├── accessibility/    # Accessibility utilities
│   └── ...
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── test-utils/            # Testing utilities
```

### Configuration System

The application uses a sophisticated feature-based configuration system:

- **Feature Configurations**: Modular configuration for each feature (auth, api, database, etc.)
- **Environment Overrides**: Environment-specific configuration overrides
- **Validation**: Comprehensive configuration validation with Zod schemas
- **Hot Reload**: Development-time configuration hot reloading
- **Type Safety**: Full TypeScript support with generated types

### Testing

The application has comprehensive test coverage:

- **Unit Tests**: Jest and React Testing Library for component and utility testing
- **Integration Tests**: API and database integration testing
- **E2E Tests**: Playwright for end-to-end testing
- **Accessibility Tests**: Automated accessibility testing
- **Performance Tests**: Performance monitoring and testing

### Code Quality

- **ESLint**: Code linting with custom rules
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks for quality gates
- **Lint-staged**: Pre-commit linting

## 🚀 Deployment

### Environment Configuration

The application supports multiple environments:

- **Development**: Local development with debugging features
- **Staging**: Pre-production testing environment
- **Production**: Live production environment
- **Test**: Automated testing environment

### Docker Deployment

```bash
# Build Docker image
docker build -t fragrance-app .

# Run with Docker Compose
docker-compose up -d
```

### Environment Variables

Required environment variables for production:

```env
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret
DB_HOST=your-db-host
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
PEGA_DX_BASE_URL=https://api.pega.com
PEGA_DX_API_KEY=your-api-key
```

### Health Checks

The application provides health check endpoints:

- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health information
- `GET /metrics` - Application metrics

## 📚 Documentation

- [Architecture Guide](docs/architecture.md) - Detailed architecture documentation
- [Development Guide](docs/development.md) - Development setup and guidelines
- [Configuration Guide](docs/configuration.md) - Configuration system documentation
- [API Documentation](docs/api.md) - API reference and examples
- [Deployment Guide](docs/deployment.md) - Deployment instructions
- [User Guide](docs/user-guide.md) - User documentation
- [Troubleshooting](docs/troubleshooting.md) - Common issues and solutions
- [Security Guide](docs/security.md) - Security features and best practices
- [Performance Guide](docs/performance.md) - Performance optimization guide

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards

- Follow the existing code style
- Write comprehensive tests
- Update documentation as needed
- Ensure accessibility compliance
- Follow security best practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs](docs/) directory
- **Issues**: Report bugs and request features via [GitHub Issues](https://github.com/your-org/fragrance/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/your-org/fragrance/discussions)
- **Security**: Report security issues via [SECURITY.md](SECURITY.md)

## 🏆 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Testing with [Jest](https://jestjs.io/) and [Playwright](https://playwright.dev/)
- Configuration validation with [Zod](https://zod.dev/)

---

**Made with ❤️ by the Fragrance App Team**