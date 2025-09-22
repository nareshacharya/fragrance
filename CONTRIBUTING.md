# Contributing to Fragrance Management System

Thank you for your interest in contributing to the Fragrance Management System! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 18.x or later
- npm 9.x or later (or yarn/pnpm)
- Git
- Docker and Docker Compose (for local development)
- PostgreSQL 14+ (or use Docker)
- Redis (or use Docker)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/fragrance.git
   cd fragrance
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/original-owner/fragrance.git
   ```

## Development Setup

### Environment Setup

1. **Copy environment files:**
   ```bash
   cp .env.example .env.local
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development services:**
   ```bash
   docker-compose up -d
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

### Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
npm run test:watch
npm run test:coverage

# Run linting
npm run lint
npm run lint:fix

# Run type checking
npm run type-check

# Run all checks
npm run check

# Database commands
npm run db:migrate
npm run db:reset
npm run db:seed

# Docker commands
npm run docker:dev
npm run docker:build
npm run docker:test
```

## Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- **Bug fixes**: Fix existing issues
- **Feature additions**: Add new functionality
- **Documentation**: Improve or add documentation
- **Testing**: Add or improve tests
- **Performance**: Optimize performance
- **Security**: Address security concerns
- **Refactoring**: Improve code quality

### Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number
   ```

2. **Make your changes:**
   - Write clean, readable code
   - Add tests for new functionality
   - Update documentation as needed
   - Follow coding standards

3. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add ingredient search functionality"
   ```

4. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request:**
   - Provide a clear description
   - Reference any related issues
   - Include screenshots if applicable
   - Ensure all checks pass

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Examples:**
```
feat(auth): add two-factor authentication
fix(api): resolve ingredient validation error
docs(readme): update installation instructions
test(ingredients): add unit tests for CRUD operations
```

## Pull Request Process

### Before Submitting

1. **Ensure tests pass:**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

2. **Update documentation** if needed

3. **Add tests** for new functionality

4. **Update changelog** if applicable

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests pass locally
- [ ] No merge conflicts

## Related Issues
Closes #123
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** in staging environment
4. **Approval** from at least one maintainer
5. **Merge** after all requirements met

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. 1.0.0]

**Additional context**
Any other context about the problem.
```

### Feature Requests

For feature requests, please include:

```markdown
**Feature Description**
A clear description of the feature.

**Use Case**
Describe the use case and why this feature would be valuable.

**Proposed Solution**
Describe how you'd like this feature to work.

**Alternatives Considered**
Describe any alternative solutions you've considered.

**Additional Context**
Any other context or screenshots about the feature request.
```

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Prefer functional components with hooks
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### React/Next.js

- Use Next.js App Router patterns
- Implement proper error boundaries
- Use server components when appropriate
- Follow React best practices
- Implement proper accessibility (a11y)

### Database

- Use Prisma ORM for database operations
- Write efficient queries
- Add proper indexes
- Use transactions when needed
- Follow naming conventions

### API Design

- Follow RESTful conventions
- Use proper HTTP status codes
- Implement proper error handling
- Add input validation
- Document API endpoints

## Testing

### Test Structure

```
src/
├── __tests__/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── components/
│   └── __tests__/
└── lib/
    └── __tests__/
```

### Testing Guidelines

- **Unit tests**: Test individual functions/components
- **Integration tests**: Test component interactions
- **E2E tests**: Test user workflows
- **Coverage**: Maintain >80% test coverage
- **Mocking**: Mock external dependencies

### Test Examples

```typescript
// Unit test example
import { render, screen } from '@testing-library/react';
import { IngredientCard } from './IngredientCard';

describe('IngredientCard', () => {
  it('renders ingredient information correctly', () => {
    const ingredient = {
      id: '1',
      name: 'Lavender Oil',
      category: 'Essential Oil',
      cost: 15.50,
    };

    render(<IngredientCard ingredient={ingredient} />);
    
    expect(screen.getByText('Lavender Oil')).toBeInTheDocument();
    expect(screen.getByText('Essential Oil')).toBeInTheDocument();
    expect(screen.getByText('$15.50')).toBeInTheDocument();
  });
});
```

## Documentation

### Documentation Standards

- Use Markdown for documentation
- Include code examples
- Keep documentation up-to-date
- Use clear, concise language
- Include screenshots when helpful

### Documentation Structure

```
docs/
├── api.md
├── architecture.md
├── deployment.md
├── development.md
├── user-guide.md
└── troubleshooting.md
```

### Writing Guidelines

- Start with an overview
- Provide step-by-step instructions
- Include prerequisites
- Add troubleshooting sections
- Link to related documentation

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Release notes prepared
- [ ] Security review completed

## Getting Help

### Resources

- **Documentation**: Check the `/docs` directory
- **Issues**: Search existing issues on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our community Discord server

### Contact

- **Maintainers**: @maintainer1, @maintainer2
- **Email**: dev-team@fragrance-app.com
- **Website**: https://fragrance-app.com

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project README
- Annual contributor appreciation

Thank you for contributing to the Fragrance Management System! 🎉
