# Migration Documentation

## Overview

This document provides comprehensive migration guides for the Fragrance Management System, including database migrations, configuration updates, and system upgrades.

## Migration Types

### Database Migrations

#### Schema Migrations
- Table structure changes
- Index modifications
- Constraint updates
- Data type conversions

#### Data Migrations
- Data transformation
- Data cleanup
- Data validation
- Data archival

#### System Migrations
- Environment migrations
- Configuration updates
- Dependency upgrades
- Infrastructure changes

## Migration Strategy

### Planning Phase
1. **Assessment**
   - Current system analysis
   - Migration requirements
   - Risk assessment
   - Timeline planning

2. **Design**
   - Migration architecture
   - Rollback strategy
   - Testing approach
   - Monitoring plan

3. **Preparation**
   - Backup procedures
   - Migration scripts
   - Testing environment
   - Documentation updates

### Execution Phase
1. **Pre-migration**
   - System backup
   - Environment preparation
   - Validation checks
   - Stakeholder notification

2. **Migration**
   - Script execution
   - Progress monitoring
   - Error handling
   - Validation testing

3. **Post-migration**
   - System verification
   - Performance testing
   - User acceptance testing
   - Documentation updates

## Database Migrations

### Migration Tools

#### Prisma Migrations
```bash
# Create migration
npx prisma migrate dev --name add_ingredient_categories

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Generate client
npx prisma generate
```

#### Custom Migration Scripts
```javascript
// Migration script example
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateIngredientCategories() {
  try {
    // Add new column
    await prisma.$executeRaw`
      ALTER TABLE ingredients 
      ADD COLUMN category_id INTEGER REFERENCES categories(id);
    `;

    // Migrate existing data
    await prisma.$executeRaw`
      UPDATE ingredients 
      SET category_id = (
        SELECT id FROM categories 
        WHERE name = ingredients.category
      );
    `;

    // Drop old column
    await prisma.$executeRaw`
      ALTER TABLE ingredients 
      DROP COLUMN category;
    `;

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateIngredientCategories();
```

### Migration Examples

#### Adding New Tables
```sql
-- Create ingredients table
CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(100),
    supplier VARCHAR(255),
    cost DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,
    minimum_stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_ingredients_name ON ingredients(name);
CREATE INDEX idx_ingredients_category ON ingredients(category);
CREATE INDEX idx_ingredients_supplier ON ingredients(supplier);
```

#### Modifying Existing Tables
```sql
-- Add new columns
ALTER TABLE ingredients 
ADD COLUMN 
    unit VARCHAR(50) DEFAULT 'g',
    expiry_date DATE,
    batch_number VARCHAR(100);

-- Modify existing columns
ALTER TABLE ingredients 
ALTER COLUMN cost TYPE DECIMAL(12,4);

-- Add constraints
ALTER TABLE ingredients 
ADD CONSTRAINT check_positive_cost 
CHECK (cost >= 0);

ALTER TABLE ingredients 
ADD CONSTRAINT check_positive_stock 
CHECK (stock_quantity >= 0);
```

#### Data Migration Examples
```sql
-- Migrate category data
INSERT INTO categories (name, description, created_at)
SELECT DISTINCT 
    category, 
    'Migrated from ingredients table',
    CURRENT_TIMESTAMP
FROM ingredients 
WHERE category IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Update ingredient categories
UPDATE ingredients 
SET category_id = (
    SELECT id FROM categories 
    WHERE categories.name = ingredients.category
);
```

## Configuration Migrations

### Environment Configuration Updates

#### Configuration Versioning
```javascript
// Configuration version tracking
const CONFIG_VERSION = '1.2.0';

const configMigration = {
  from: '1.1.0',
  to: '1.2.0',
  steps: [
    {
      name: 'Update API endpoints',
      description: 'Migrate to new API endpoint structure',
      transform: (config) => {
        const newConfig = { ...config };
        if (config.api && config.api.endpoints) {
          newConfig.api.endpoints = {
            ...config.api.endpoints,
            v2: config.api.endpoints.base + '/v2',
          };
        }
        return newConfig;
      }
    },
    {
      name: 'Update database configuration',
      description: 'Migrate to new database configuration format',
      transform: (config) => {
        const newConfig = { ...config };
        if (config.database && config.database.connection) {
          newConfig.database.connection = {
            ...config.database.connection,
            ssl: config.database.connection.ssl || false,
            sslMode: config.database.connection.ssl ? 'require' : 'disable',
          };
        }
        return newConfig;
      }
    }
  ]
};
```

#### Feature Flag Migrations
```javascript
// Feature flag migration
const featureFlagMigration = {
  'enable-new-dashboard': {
    from: 'beta-dashboard',
    transform: (value) => value === true ? 'enabled' : 'disabled'
  },
  'api-version': {
    from: 'v1-api',
    transform: (value) => value === true ? 'v2' : 'v1'
  }
};

function migrateFeatureFlags(flags) {
  const migratedFlags = {};
  
  for (const [key, value] of Object.entries(flags)) {
    const migration = featureFlagMigration[key];
    if (migration) {
      migratedFlags[migration.from] = migration.transform(value);
    } else {
      migratedFlags[key] = value;
    }
  }
  
  return migratedFlags;
}
```

## System Upgrades

### Application Version Upgrades

#### Node.js Version Upgrade
```bash
# Update Node.js version
nvm install 18.17.0
nvm use 18.17.0

# Update dependencies
npm update

# Test compatibility
npm run test
npm run build
```

#### Package Updates
```bash
# Update all packages
npm update

# Update specific packages
npm update @prisma/client prisma

# Check for vulnerabilities
npm audit
npm audit fix
```

### Infrastructure Migrations

#### Docker Migration
```dockerfile
# Dockerfile migration example
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Kubernetes Migration
```yaml
# kubernetes-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fragrance-app
  labels:
    app: fragrance-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fragrance-app
  template:
    metadata:
      labels:
        app: fragrance-app
    spec:
      containers:
      - name: fragrance-app
        image: fragrance-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

## Migration Testing

### Testing Strategy

#### Unit Testing
```javascript
// Migration test example
describe('Ingredient Category Migration', () => {
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE ingredients, categories CASCADE`;
  });

  it('should migrate ingredient categories correctly', async () => {
    // Setup test data
    await prisma.ingredient.create({
      data: {
        name: 'Lavender Oil',
        category: 'Essential Oil',
        cost: 15.50,
      },
    });

    // Run migration
    await migrateIngredientCategories();

    // Verify migration
    const ingredient = await prisma.ingredient.findFirst({
      where: { name: 'Lavender Oil' },
      include: { category: true },
    });

    expect(ingredient.category.name).toBe('Essential Oil');
  });
});
```

#### Integration Testing
```javascript
// Integration test for configuration migration
describe('Configuration Migration', () => {
  it('should migrate configuration correctly', () => {
    const oldConfig = {
      version: '1.1.0',
      api: {
        endpoints: {
          base: 'https://api.example.com',
        },
      },
    };

    const migratedConfig = migrateConfiguration(oldConfig);

    expect(migratedConfig.version).toBe('1.2.0');
    expect(migratedConfig.api.endpoints.v2).toBe('https://api.example.com/v2');
  });
});
```

### Rollback Procedures

#### Database Rollback
```sql
-- Rollback ingredient categories migration
BEGIN;

-- Restore old column
ALTER TABLE ingredients 
ADD COLUMN category VARCHAR(100);

-- Restore data
UPDATE ingredients 
SET category = (
    SELECT name FROM categories 
    WHERE categories.id = ingredients.category_id
);

-- Drop new column
ALTER TABLE ingredients 
DROP COLUMN category_id;

COMMIT;
```

#### Configuration Rollback
```javascript
// Configuration rollback
function rollbackConfiguration(config, targetVersion) {
  const rollbackSteps = getRollbackSteps(config.version, targetVersion);
  
  let rolledBackConfig = { ...config };
  
  for (const step of rollbackSteps) {
    rolledBackConfig = step.rollback(rolledBackConfig);
  }
  
  rolledBackConfig.version = targetVersion;
  return rolledBackConfig;
}
```

## Migration Checklist

### Pre-migration
- [ ] Backup current system
- [ ] Test migration in staging environment
- [ ] Prepare rollback procedures
- [ ] Notify stakeholders
- [ ] Schedule maintenance window
- [ ] Prepare monitoring tools

### During Migration
- [ ] Execute migration scripts
- [ ] Monitor progress and errors
- [ ] Validate data integrity
- [ ] Test critical functionality
- [ ] Update documentation
- [ ] Communicate status updates

### Post-migration
- [ ] Verify system functionality
- [ ] Run performance tests
- [ ] Update monitoring configurations
- [ ] Train users on changes
- [ ] Archive old data
- [ ] Document lessons learned

## Troubleshooting

### Common Issues

#### Migration Failures
1. **Database Connection Issues**
   - Check connection strings
   - Verify database permissions
   - Test network connectivity

2. **Data Validation Errors**
   - Review data quality
   - Fix invalid data
   - Update validation rules

3. **Performance Issues**
   - Monitor migration progress
   - Optimize migration scripts
   - Consider batch processing

### Recovery Procedures

#### Partial Migration Recovery
```sql
-- Check migration status
SELECT * FROM _prisma_migrations 
ORDER BY finished_at DESC;

-- Resume failed migration
npx prisma migrate resolve --applied <migration_name>
```

#### Complete System Recovery
```bash
# Restore from backup
pg_restore -d fragrance_prod backup_20231201.sql

# Verify restoration
psql -d fragrance_prod -c "SELECT COUNT(*) FROM ingredients;"

# Restart application
docker-compose restart app
```

## Best Practices

### Migration Planning
1. **Incremental Migrations**: Break large migrations into smaller steps
2. **Backward Compatibility**: Maintain compatibility during transitions
3. **Testing**: Thoroughly test all migrations
4. **Documentation**: Document all changes and procedures

### Risk Mitigation
1. **Backup Strategy**: Multiple backup types and locations
2. **Rollback Plans**: Tested rollback procedures
3. **Monitoring**: Real-time migration monitoring
4. **Communication**: Clear stakeholder communication

### Performance Considerations
1. **Batch Processing**: Process large datasets in batches
2. **Offline Hours**: Schedule during low-traffic periods
3. **Resource Planning**: Ensure adequate system resources
4. **Progress Tracking**: Monitor migration progress

## References

- [Database Migration Best Practices](./database-migrations.md)
- [Configuration Management Guide](./configuration-management.md)
- [Deployment Procedures](./deployment.md)
- [Rollback Procedures](./rollback-procedures.md)
