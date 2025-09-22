# Development Guide

This guide provides comprehensive instructions for setting up the development environment, coding standards, testing procedures, and contribution workflow for the Fragrance App.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher (comes with Node.js)
- **PostgreSQL**: Version 14 or higher
- **Git**: Latest version
- **VS Code**: Recommended IDE with extensions

### Required VS Code Extensions

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "ms-vscode.vscode-jest",
    "ms-playwright.playwright"
  ]
}
```

### Environment Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd fragrance
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```

4. **Configure your environment**:
   Edit `.env.local` with your local settings:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=fragrance_dev
   DB_USER=postgres
   DB_PASSWORD=your_password

   # Authentication
   JWT_SECRET=your-development-jwt-secret-key

   # API
   PEGA_DX_BASE_URL=http://localhost:8080
   PEGA_DX_API_KEY=your-api-key

   # Email (optional for development)
   SMTP_HOST=localhost
   SMTP_PORT=1025
   SMTP_USERNAME=
   SMTP_PASSWORD=
   SMTP_FROM=dev@fragrance-app.com
   ```

5. **Set up the database**:
   ```bash
   # Create database
   createdb fragrance_dev

   # Run migrations
   npm run db:migrate

   # Seed development data (optional)
   npm run db:seed
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## 🏗️ Project Structure

### Directory Organization

```
fragrance/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── ingredients/         # Ingredient management pages
│   │   ├── login/              # Authentication pages
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── auth/               # Authentication components
│   │   ├── ingredients/        # Ingredient management components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── layout/             # Layout components
│   │   ├── navigation/         # Navigation components
│   │   └── providers/          # Context providers
│   ├── config/                 # Configuration system
│   │   ├── features/           # Feature-based configuration
│   │   ├── environments/       # Environment-specific configs
│   │   ├── loader.ts           # Configuration loader
│   │   ├── validation.ts       # Configuration validation
│   │   ├── utils.ts            # Configuration utilities
│   │   └── index.ts            # Main configuration interface
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-debounce.ts     # Debounce hook
│   │   ├── use-ingredients.ts  # Ingredients hook
│   │   └── use-navigation.ts  # Navigation hook
│   ├── lib/                    # Utility libraries
│   │   ├── api/                # API client and services
│   │   ├── auth/               # Authentication utilities
│   │   ├── accessibility/      # Accessibility utilities
│   │   ├── csv-utils.ts        # CSV processing utilities
│   │   └── utils.ts            # General utilities
│   ├── types/                  # TypeScript type definitions
│   │   ├── accessibility.ts    # Accessibility types
│   │   ├── api.ts              # API types
│   │   ├── ingredient.ts       # Ingredient types
│   │   ├── navigation.ts        # Navigation types
│   │   └── theme.ts            # Theme types
│   └── test-utils/             # Testing utilities
│       ├── factories.ts        # Test data factories
│       ├── helpers.ts          # Test helpers
│       ├── mocks.ts            # Mock implementations
│       ├── render.tsx          # Custom render function
│       └── test-config.ts      # Test configuration
├── docs/                       # Documentation
├── e2e/                        # End-to-end tests
├── public/                     # Static assets
├── scripts/                    # Build and utility scripts
├── .github/                    # GitHub workflows and templates
├── jest.config.js              # Jest configuration
├── playwright.config.ts        # Playwright configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

### Component Organization

Components are organized by feature domain:

```
src/components/
├── auth/                       # Authentication components
│   ├── login-form.tsx          # Login form
│   ├── user-profile.tsx        # User profile
│   ├── protected-route.tsx     # Route protection
│   └── role-guard.tsx          # Role-based access control
├── ingredients/                # Ingredient management
│   ├── ingredient-list.tsx     # Ingredient listing
│   ├── ingredient-form.tsx     # Ingredient form
│   ├── ingredient-card.tsx     # Ingredient card
│   ├── ingredient-search.tsx   # Search functionality
│   └── ingredient-filters.tsx  # Filtering options
├── ui/                         # Reusable UI components
│   ├── button.tsx              # Button component
│   ├── input.tsx               # Input component
│   ├── modal.tsx                # Modal component
│   └── table.tsx                # Table component
└── layout/                     # Layout components
    ├── header.tsx               # Application header
    ├── sidebar.tsx              # Sidebar navigation
    └── footer.tsx               # Application footer
```

## 🎨 Coding Standards

### TypeScript Guidelines

1. **Use strict TypeScript**:
   ```typescript
   // ✅ Good: Explicit types
   interface User {
     id: string;
     name: string;
     email: string;
   }

   // ❌ Bad: Any types
   const user: any = { id: 1, name: 'John' };
   ```

2. **Prefer interfaces over types for objects**:
   ```typescript
   // ✅ Good: Interface for object shapes
   interface ApiResponse {
     data: any;
     status: number;
   }

   // ✅ Good: Type for unions
   type Status = 'loading' | 'success' | 'error';
   ```

3. **Use proper error handling**:
   ```typescript
   // ✅ Good: Proper error handling
   try {
     const result = await apiCall();
     return result;
   } catch (error) {
     console.error('API call failed:', error);
     throw new Error('Failed to fetch data');
   }
   ```

### React Guidelines

1. **Use functional components with hooks**:
   ```typescript
   // ✅ Good: Functional component with hooks
   const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
     const [isEditing, setIsEditing] = useState(false);
     
     const handleEdit = useCallback(() => {
       setIsEditing(true);
     }, []);

     return (
       <div>
         <h1>{user.name}</h1>
         <button onClick={handleEdit}>Edit</button>
       </div>
     );
   };
   ```

2. **Use proper prop types**:
   ```typescript
   // ✅ Good: Proper prop interface
   interface ButtonProps {
     children: React.ReactNode;
     onClick: () => void;
     variant?: 'primary' | 'secondary';
     disabled?: boolean;
   }

   const Button: React.FC<ButtonProps> = ({ 
     children, 
     onClick, 
     variant = 'primary', 
     disabled = false 
   }) => {
     return (
       <button 
         className={`btn btn-${variant}`}
         onClick={onClick}
         disabled={disabled}
       >
         {children}
       </button>
     );
   };
   ```

3. **Use proper state management**:
   ```typescript
   // ✅ Good: Local state for component-specific data
   const [isOpen, setIsOpen] = useState(false);

   // ✅ Good: Context for shared state
   const { user, setUser } = useAuth();

   // ✅ Good: Custom hooks for complex logic
   const { ingredients, loading, error } = useIngredients();
   ```

### CSS and Styling

1. **Use Tailwind CSS classes**:
   ```typescript
   // ✅ Good: Tailwind classes
   <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
     <h2 className="text-xl font-semibold text-gray-900">Title</h2>
     <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
       Action
     </button>
   </div>
   ```

2. **Create reusable component styles**:
   ```typescript
   // ✅ Good: Component-specific styles
   const buttonVariants = {
     primary: 'bg-blue-600 text-white hover:bg-blue-700',
     secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
     danger: 'bg-red-600 text-white hover:bg-red-700',
   };

   const Button: React.FC<ButtonProps> = ({ variant = 'primary', ...props }) => {
     return (
       <button 
         className={`px-4 py-2 rounded-md font-medium ${buttonVariants[variant]}`}
         {...props}
       />
     );
   };
   ```

3. **Use CSS modules for complex styles**:
   ```typescript
   // ✅ Good: CSS modules for complex components
   import styles from './ComplexComponent.module.css';

   const ComplexComponent: React.FC = () => {
     return (
       <div className={styles.container}>
         <div className={styles.header}>Header</div>
         <div className={styles.content}>Content</div>
       </div>
     );
   };
   ```

### File Naming Conventions

1. **Use kebab-case for files**:
   ```
   ✅ Good:
   - user-profile.tsx
   - ingredient-list.tsx
   - api-client.ts

   ❌ Bad:
   - UserProfile.tsx
   - ingredientList.tsx
   - apiClient.ts
   ```

2. **Use descriptive names**:
   ```
   ✅ Good:
   - ingredient-search-form.tsx
   - user-authentication-service.ts
   - database-connection-pool.ts

   ❌ Bad:
   - form.tsx
   - service.ts
   - pool.ts
   ```

3. **Group related files**:
   ```
   ✅ Good:
   components/
   ├── auth/
   │   ├── login-form.tsx
   │   ├── login-form.test.tsx
   │   └── login-form.stories.tsx
   ```

## 🧪 Testing Guidelines

### Unit Testing

1. **Test component behavior**:
   ```typescript
   // ✅ Good: Test component behavior
   describe('LoginForm', () => {
     it('should submit form with valid credentials', async () => {
       const mockOnSubmit = jest.fn();
       render(<LoginForm onSubmit={mockOnSubmit} />);
       
       await user.type(screen.getByLabelText('Email'), 'test@example.com');
       await user.type(screen.getByLabelText('Password'), 'password123');
       await user.click(screen.getByRole('button', { name: 'Login' }));
       
       expect(mockOnSubmit).toHaveBeenCalledWith({
         email: 'test@example.com',
         password: 'password123',
       });
     });
   });
   ```

2. **Test utility functions**:
   ```typescript
   // ✅ Good: Test utility functions
   describe('formatDate', () => {
     it('should format date correctly', () => {
       const date = new Date('2023-12-25');
       const formatted = formatDate(date);
       expect(formatted).toBe('Dec 25, 2023');
     });
   });
   ```

3. **Test custom hooks**:
   ```typescript
   // ✅ Good: Test custom hooks
   describe('useIngredients', () => {
     it('should fetch ingredients on mount', async () => {
       const { result } = renderHook(() => useIngredients());
       
       expect(result.current.loading).toBe(true);
       
       await waitFor(() => {
         expect(result.current.loading).toBe(false);
         expect(result.current.ingredients).toHaveLength(3);
       });
     });
   });
   ```

### Integration Testing

1. **Test API integration**:
   ```typescript
   // ✅ Good: Test API integration
   describe('Ingredients API', () => {
     it('should create new ingredient', async () => {
       const ingredientData = {
         name: 'Test Ingredient',
         category: 'Essential Oil',
       };
       
       const response = await createIngredient(ingredientData);
       
       expect(response.status).toBe(201);
       expect(response.data.name).toBe('Test Ingredient');
     });
   });
   ```

2. **Test database operations**:
   ```typescript
   // ✅ Good: Test database operations
   describe('Ingredient Repository', () => {
     it('should save ingredient to database', async () => {
       const ingredient = await ingredientRepository.save({
         name: 'Test Ingredient',
         category: 'Essential Oil',
       });
       
       expect(ingredient.id).toBeDefined();
       expect(ingredient.name).toBe('Test Ingredient');
     });
   });
   ```

### End-to-End Testing

1. **Test user journeys**:
   ```typescript
   // ✅ Good: Test user journeys
   test('user can create new ingredient', async ({ page }) => {
     await page.goto('/ingredients');
     await page.click('text=Add New Ingredient');
     
     await page.fill('[data-testid="ingredient-name"]', 'Test Ingredient');
     await page.selectOption('[data-testid="ingredient-category"]', 'Essential Oil');
     await page.click('text=Save');
     
     await expect(page.locator('text=Test Ingredient')).toBeVisible();
   });
   ```

2. **Test accessibility**:
   ```typescript
   // ✅ Good: Test accessibility
   test('ingredient form is accessible', async ({ page }) => {
     await page.goto('/ingredients/create');
     
     // Check for proper labels
     await expect(page.locator('label[for="ingredient-name"]')).toBeVisible();
     
     // Check keyboard navigation
     await page.keyboard.press('Tab');
     await expect(page.locator('[data-testid="ingredient-name"]')).toBeFocused();
   });
   ```

### Testing Best Practices

1. **Use descriptive test names**:
   ```typescript
   // ✅ Good: Descriptive test names
   it('should display error message when ingredient name is empty', () => {
     // test implementation
   });

   // ❌ Bad: Vague test names
   it('should work', () => {
     // test implementation
   });
   ```

2. **Use proper test data**:
   ```typescript
   // ✅ Good: Use test factories
   const createTestIngredient = (overrides = {}) => ({
     id: '1',
     name: 'Test Ingredient',
     category: 'Essential Oil',
     ...overrides,
   });

   // ❌ Bad: Hardcoded test data
   const ingredient = {
     id: '1',
     name: 'Test Ingredient',
     category: 'Essential Oil',
   };
   ```

3. **Clean up after tests**:
   ```typescript
   // ✅ Good: Clean up after tests
   afterEach(() => {
     cleanup();
     jest.clearAllMocks();
   });
   ```

## 🔧 Development Workflow

### Git Workflow

1. **Create feature branches**:
   ```bash
   git checkout -b feature/ingredient-search
   git checkout -b bugfix/login-validation
   git checkout -b hotfix/security-patch
   ```

2. **Commit frequently with descriptive messages**:
   ```bash
   git add .
   git commit -m "feat: add ingredient search functionality

   - Add search input component
   - Implement debounced search
   - Add search results display
   - Add search filters"
   ```

3. **Push and create pull requests**:
   ```bash
   git push origin feature/ingredient-search
   ```

### Code Review Process

1. **Self-review before submitting**:
   - Run tests: `npm test`
   - Check linting: `npm run lint`
   - Verify TypeScript: `npm run type-check`
   - Test accessibility: `npm run test:a11y`

2. **Pull request checklist**:
   - [ ] Tests pass
   - [ ] Code is properly formatted
   - [ ] TypeScript types are correct
   - [ ] Accessibility requirements met
   - [ ] Documentation updated
   - [ ] Breaking changes documented

3. **Review guidelines**:
   - Focus on code quality and maintainability
   - Check for security vulnerabilities
   - Verify test coverage
   - Ensure accessibility compliance

### Continuous Integration

The project uses GitHub Actions for CI/CD:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm run test:e2e
```

## 🚀 Performance Guidelines

### React Performance

1. **Use React.memo for expensive components**:
   ```typescript
   // ✅ Good: Memoize expensive components
   const ExpensiveComponent = React.memo(({ data }) => {
     return <div>{/* expensive rendering */}</div>;
   });
   ```

2. **Use useMemo for expensive calculations**:
   ```typescript
   // ✅ Good: Memoize expensive calculations
   const ExpensiveComponent = ({ items }) => {
     const sortedItems = useMemo(() => {
       return items.sort((a, b) => a.name.localeCompare(b.name));
     }, [items]);

     return <div>{/* render sorted items */}</div>;
   };
   ```

3. **Use useCallback for event handlers**:
   ```typescript
   // ✅ Good: Memoize event handlers
   const Component = ({ onItemClick }) => {
     const handleClick = useCallback((id) => {
       onItemClick(id);
     }, [onItemClick]);

     return <button onClick={handleClick}>Click me</button>;
   };
   ```

### Bundle Optimization

1. **Use dynamic imports for code splitting**:
   ```typescript
   // ✅ Good: Dynamic imports
   const LazyComponent = dynamic(() => import('./LazyComponent'), {
     loading: () => <div>Loading...</div>,
   });
   ```

2. **Optimize images**:
   ```typescript
   // ✅ Good: Optimized images
   import Image from 'next/image';

   <Image
     src="/ingredient.jpg"
     alt="Ingredient"
     width={300}
     height={200}
     priority={false}
   />
   ```

3. **Use proper imports**:
   ```typescript
   // ✅ Good: Specific imports
   import { Button } from '@/components/ui/button';

   // ❌ Bad: Barrel imports
   import { Button } from '@/components/ui';
   ```

## 🔒 Security Guidelines

### Input Validation

1. **Validate all inputs**:
   ```typescript
   // ✅ Good: Input validation
   const validateIngredient = (data: any) => {
     const schema = z.object({
       name: z.string().min(1).max(100),
       category: z.string().min(1).max(50),
       description: z.string().max(1000).optional(),
     });

     return schema.parse(data);
   };
   ```

2. **Sanitize user input**:
   ```typescript
   // ✅ Good: Input sanitization
   const sanitizeInput = (input: string) => {
     return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
   };
   ```

### Authentication

1. **Use secure session management**:
   ```typescript
   // ✅ Good: Secure session configuration
   const sessionConfig = {
     secure: process.env.NODE_ENV === 'production',
     httpOnly: true,
     sameSite: 'strict',
     maxAge: 2 * 60 * 60 * 1000, // 2 hours
   };
   ```

2. **Implement proper authorization**:
   ```typescript
   // ✅ Good: Role-based authorization
   const requireRole = (role: string) => {
     return (req: Request, res: Response, next: NextFunction) => {
       if (!req.user || !req.user.roles.includes(role)) {
         return res.status(403).json({ error: 'Forbidden' });
       }
       next();
     };
   };
   ```

## 📚 Documentation Standards

### Code Documentation

1. **Document complex functions**:
   ```typescript
   /**
    * Calculates the similarity between two ingredients based on their properties
    * @param ingredient1 - First ingredient to compare
    * @param ingredient2 - Second ingredient to compare
    * @param weights - Optional weights for different properties
    * @returns Similarity score between 0 and 1
    */
   const calculateSimilarity = (
     ingredient1: Ingredient,
     ingredient2: Ingredient,
     weights?: SimilarityWeights
   ): number => {
     // implementation
   };
   ```

2. **Document component props**:
   ```typescript
   interface IngredientCardProps {
     /** The ingredient data to display */
     ingredient: Ingredient;
     /** Whether the card is in edit mode */
     isEditing?: boolean;
     /** Callback when the ingredient is updated */
     onUpdate?: (ingredient: Ingredient) => void;
     /** Callback when the ingredient is deleted */
     onDelete?: (id: string) => void;
   }
   ```

3. **Document configuration options**:
   ```typescript
   /**
    * Configuration options for the ingredient management system
    */
   interface IngredientConfig {
     /** Maximum number of ingredients per user */
     maxIngredientsPerUser: number;
     /** Whether to enable ingredient versioning */
     enableVersioning: boolean;
     /** Whether to enable ingredient categories */
     enableCategories: boolean;
   }
   ```

### README Files

1. **Component README**:
   ```markdown
   # IngredientCard Component

   A reusable card component for displaying ingredient information.

   ## Usage

   ```typescript
   import { IngredientCard } from '@/components/ingredients/ingredient-card';

   <IngredientCard
     ingredient={ingredient}
     isEditing={false}
     onUpdate={handleUpdate}
     onDelete={handleDelete}
   />
   ```

   ## Props

   | Prop | Type | Required | Description |
   |------|------|----------|-------------|
   | ingredient | Ingredient | Yes | The ingredient data to display |
   | isEditing | boolean | No | Whether the card is in edit mode |
   | onUpdate | function | No | Callback when ingredient is updated |
   | onDelete | function | No | Callback when ingredient is deleted |

   ## Examples

   See the Storybook stories for more examples.
   ```

## 🐛 Debugging

### Development Tools

1. **Use React Developer Tools**:
   - Install the React Developer Tools browser extension
   - Use the Profiler to identify performance issues
   - Use the Components tab to inspect component state

2. **Use Next.js debugging**:
   ```bash
   # Enable Next.js debugging
   DEBUG=next:* npm run dev
   ```

3. **Use TypeScript debugging**:
   ```bash
   # Enable TypeScript debugging
   npm run type-check -- --verbose
   ```

### Common Issues

1. **Configuration not loading**:
   ```typescript
   // Check environment variables
   console.log('NODE_ENV:', process.env.NODE_ENV);
   console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
   ```

2. **Database connection issues**:
   ```typescript
   // Check database connection
   try {
     await db.authenticate();
     console.log('Database connection established');
   } catch (error) {
     console.error('Database connection failed:', error);
   }
   ```

3. **API integration issues**:
   ```typescript
   // Check API configuration
   console.log('Pega DX Base URL:', process.env.PEGA_DX_BASE_URL);
   console.log('API Key:', process.env.PEGA_DX_API_KEY ? 'Set' : 'Not set');
   ```

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Library Documentation](https://testing-library.com/docs/)

---

This development guide provides comprehensive instructions for contributing to the Fragrance App. For specific implementation details, refer to the individual component documentation and code examples.

