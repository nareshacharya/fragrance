#!/usr/bin/env node

/**
 * Development Setup Script
 * Sets up the development environment with all necessary configurations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Development configuration templates
const devConfigs = {
  '.env.development': `# Development Environment Configuration
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/fragrance_dev
DATABASE_SSL=false

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=dev-jwt-secret-change-in-production-32-chars
JWT_EXPIRES_IN=24h
SESSION_SECRET=dev-session-secret-change-in-production-32-chars

# Pega Integration (Development)
PEGA_API_URL=http://localhost:8080
PEGA_API_KEY=dev-pega-api-key
PEGA_CLIENT_ID=dev-pega-client-id
PEGA_CLIENT_SECRET=dev-pega-client-secret
PEGA_ENABLED=true

# Email (Development - Mailhog)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=dev@fragrance-management.local
EMAIL_ENABLED=true

# File Storage (Development - Local)
STORAGE_PROVIDER=local
STORAGE_PATH=./uploads
MAX_FILE_SIZE=10485760

# Monitoring (Development)
LOG_LEVEL=debug
ENABLE_METRICS=true
ENABLE_TRACING=true
SENTRY_DSN=

# Security (Development)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
CSRF_ENABLED=false
HELMET_ENABLED=true
RATE_LIMIT_ENABLED=false

# Feature Flags (Development)
PEGA_INTEGRATION=true
ADVANCED_ANALYTICS=true
REAL_TIME_UPDATES=true
FILE_UPLOAD=true
NOTIFICATIONS=true
CASE_MANAGEMENT=true
INGREDIENT_MANAGEMENT=true

# Development Tools
HOT_RELOAD=true
DEBUG_MODE=true
MOCK_DATA=true
PERFORMANCE_MONITORING=true
ERROR_REPORTING=true`,

  '.env.test': `# Test Environment Configuration
NODE_ENV=test
PORT=3001
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/fragrance_test
DATABASE_SSL=false

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=test-jwt-secret-change-in-production-32-chars
JWT_EXPIRES_IN=1h
SESSION_SECRET=test-session-secret-change-in-production-32-chars

# Pega Integration (Test)
PEGA_API_URL=http://localhost:8080
PEGA_API_KEY=test-pega-api-key
PEGA_CLIENT_ID=test-pega-client-id
PEGA_CLIENT_SECRET=test-pega-client-secret
PEGA_ENABLED=false

# Email (Test)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=test@fragrance-management.local
EMAIL_ENABLED=false

# File Storage (Test)
STORAGE_PROVIDER=local
STORAGE_PATH=./test-uploads
MAX_FILE_SIZE=1048576

# Monitoring (Test)
LOG_LEVEL=error
ENABLE_METRICS=false
ENABLE_TRACING=false
SENTRY_DSN=

# Security (Test)
CORS_ORIGINS=http://localhost:3001
CSRF_ENABLED=false
HELMET_ENABLED=false
RATE_LIMIT_ENABLED=false

# Feature Flags (Test)
PEGA_INTEGRATION=false
ADVANCED_ANALYTICS=false
REAL_TIME_UPDATES=false
FILE_UPLOAD=true
NOTIFICATIONS=false
CASE_MANAGEMENT=true
INGREDIENT_MANAGEMENT=true

# Development Tools
HOT_RELOAD=false
DEBUG_MODE=false
MOCK_DATA=true
PERFORMANCE_MONITORING=false
ERROR_REPORTING=false`,

  'docker-compose.dev.yml': `# Development Docker Compose
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      - db
      - redis
      - mailhog
    networks:
      - dev-network

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=fragrance_dev
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    networks:
      - dev-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_dev_data:/data
    networks:
      - dev-network

  mailhog:
    image: mailhog/mailhog:latest
    ports:
      - "1025:1025"  # SMTP
      - "8025:8025"  # Web UI
    networks:
      - dev-network

volumes:
  postgres_dev_data:
  redis_dev_data:

networks:
  dev-network:
    driver: bridge`,

  'nginx/nginx.dev.conf': `# Development Nginx Configuration
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/ {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}`,

  'scripts/init-db.sql': `-- Database initialization script
-- This script sets up the initial database structure

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'perfumer',
    department VARCHAR(50) NOT NULL DEFAULT 'development',
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create perfumes table
CREATE TABLE IF NOT EXISTS perfumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    formula_id UUID,
    notes TEXT[],
    tags TEXT[],
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    version INTEGER NOT NULL DEFAULT 1
);

-- Create formulas table
CREATE TABLE IF NOT EXISTS formulas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    ingredients JSONB NOT NULL,
    total_weight DECIMAL(10,2) NOT NULL,
    concentration DECIMAL(5,2) NOT NULL,
    ph DECIMAL(3,1),
    alcohol_content DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    supplier VARCHAR(255),
    cost DECIMAL(10,2),
    unit VARCHAR(20) NOT NULL,
    stock_level DECIMAL(10,2) NOT NULL DEFAULT 0,
    min_stock_level DECIMAL(10,2) NOT NULL DEFAULT 0,
    max_stock_level DECIMAL(10,2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'planning',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    assigned_to UUID[] NOT NULL DEFAULT '{}',
    perfumes UUID[] NOT NULL DEFAULT '{}',
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    budget DECIMAL(12,2),
    progress DECIMAL(5,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create cases table
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    assigned_to UUID NOT NULL REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    perfume_id UUID REFERENCES perfumes(id),
    due_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_perfumes_category ON perfumes(category);
CREATE INDEX IF NOT EXISTS idx_perfumes_status ON perfumes(status);
CREATE INDEX IF NOT EXISTS idx_perfumes_created_by ON perfumes(created_by);
CREATE INDEX IF NOT EXISTS idx_ingredients_type ON ingredients(type);
CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_assigned_to ON cases(assigned_to);

-- Insert default data
INSERT INTO users (email, password_hash, first_name, last_name, role, department) VALUES
('admin@fragrance-management.com', '$2b$10$example.hash.here', 'Admin', 'User', 'administrator', 'management'),
('perfumer@fragrance-management.com', '$2b$10$example.hash.here', 'John', 'Perfumer', 'perfumer', 'development'),
('manager@fragrance-management.com', '$2b$10$example.hash.here', 'Jane', 'Manager', 'lab_manager', 'quality')
ON CONFLICT (email) DO NOTHING;`,

  'scripts/dev-data.sql': `-- Development data script
-- This script populates the database with sample data for development

-- Insert sample ingredients
INSERT INTO ingredients (name, type, category, supplier, cost, unit, stock_level, min_stock_level, max_stock_level) VALUES
('Bergamot Essential Oil', 'essential_oil', 'citrus', 'Supplier A', 0.50, 'ml', 1000, 100, 5000),
('Lavender Essential Oil', 'essential_oil', 'floral', 'Supplier B', 0.75, 'ml', 800, 100, 3000),
('Sandalwood Essential Oil', 'essential_oil', 'woody', 'Supplier C', 1.20, 'ml', 500, 50, 2000),
('Vanilla Extract', 'natural_extract', 'gourmand', 'Supplier D', 0.30, 'ml', 2000, 200, 10000),
('Musk Synthetic', 'synthetic', 'oriental', 'Supplier E', 0.80, 'ml', 600, 100, 4000)
ON CONFLICT DO NOTHING;

-- Insert sample formulas
INSERT INTO formulas (name, ingredients, total_weight, concentration, ph, alcohol_content, notes) VALUES
('Ocean Breeze Formula', '[
  {"name": "Bergamot Essential Oil", "concentration": 20, "weight": 200, "unit": "mg"},
  {"name": "Lavender Essential Oil", "concentration": 15, "weight": 150, "unit": "mg"},
  {"name": "Sandalwood Essential Oil", "concentration": 10, "weight": 100, "unit": "mg"}
]', 1000, 15.0, 6.5, 70.0, 'Fresh aquatic fragrance with citrus top notes'),
('Summer Garden Formula', '[
  {"name": "Lavender Essential Oil", "concentration": 25, "weight": 250, "unit": "mg"},
  {"name": "Vanilla Extract", "concentration": 20, "weight": 200, "unit": "mg"},
  {"name": "Musk Synthetic", "concentration": 15, "weight": 150, "unit": "mg"}
]', 1000, 18.0, 6.8, 65.0, 'Floral gourmand with vanilla base')
ON CONFLICT DO NOTHING;

-- Insert sample perfumes
INSERT INTO perfumes (name, description, category, status, formula_id, notes, tags, created_by) VALUES
('Ocean Breeze', 'Fresh aquatic fragrance perfect for summer', 'aquatic', 'approved', 
 (SELECT id FROM formulas WHERE name = 'Ocean Breeze Formula' LIMIT 1),
 ARRAY['fresh', 'marine'], ARRAY['summer', 'daytime'],
 (SELECT id FROM users WHERE email = 'perfumer@fragrance-management.com' LIMIT 1)),
('Summer Garden', 'Floral gourmand with vanilla notes', 'floral', 'in_review',
 (SELECT id FROM formulas WHERE name = 'Summer Garden Formula' LIMIT 1),
 ARRAY['floral', 'vanilla'], ARRAY['summer', 'evening'],
 (SELECT id FROM users WHERE email = 'perfumer@fragrance-management.com' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Insert sample projects
INSERT INTO projects (name, description, status, priority, assigned_to, perfumes, start_date, end_date, budget, progress) VALUES
('Summer Collection 2024', 'Development of summer fragrance collection', 'active', 'high',
 ARRAY[(SELECT id FROM users WHERE email = 'perfumer@fragrance-management.com' LIMIT 1)],
 ARRAY[(SELECT id FROM perfumes WHERE name = 'Ocean Breeze' LIMIT 1)],
 '2024-01-01', '2024-06-30', 50000, 65),
('Holiday Collection 2024', 'Development of holiday fragrance collection', 'planning', 'medium',
 ARRAY[(SELECT id FROM users WHERE email = 'perfumer@fragrance-management.com' LIMIT 1)],
 ARRAY[],
 '2024-07-01', '2024-12-31', 75000, 0)
ON CONFLICT DO NOTHING;

-- Insert sample cases
INSERT INTO cases (title, description, status, priority, assigned_to, project_id, perfume_id, due_date) VALUES
('Formula Review Required', 'Review and approve Ocean Breeze formula', 'pending_review', 'high',
 (SELECT id FROM users WHERE email = 'manager@fragrance-management.com' LIMIT 1),
 (SELECT id FROM projects WHERE name = 'Summer Collection 2024' LIMIT 1),
 (SELECT id FROM perfumes WHERE name = 'Ocean Breeze' LIMIT 1),
 '2024-01-20'),
('Ingredient Stock Alert', 'Bergamot Essential Oil stock is low', 'open', 'medium',
 (SELECT id FROM users WHERE email = 'manager@fragrance-management.com' LIMIT 1),
 NULL, NULL, '2024-01-25')
ON CONFLICT DO NOTHING;`
};

/**
 * Check if command exists
 */
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Create directory if it doesn't exist
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
}

/**
 * Create file if it doesn't exist
 */
function ensureFile(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created file: ${filePath}`);
  } else {
    console.log(`⚠️  File already exists: ${filePath}`);
  }
}

/**
 * Setup development environment
 */
function setupDevelopment() {
  console.log('🚀 Setting up development environment...\n');
  
  // Create necessary directories
  const directories = [
    'uploads',
    'logs',
    'nginx',
    'scripts',
    'ssl',
    'backups',
    'test-uploads'
  ];
  
  directories.forEach(dir => {
    ensureDir(dir);
  });
  
  // Create configuration files
  Object.entries(devConfigs).forEach(([filePath, content]) => {
    ensureFile(filePath, content);
  });
  
  // Make scripts executable
  const scripts = [
    'scripts/validate-config.js',
    'scripts/generate-config-docs.js',
    'scripts/setup-dev.js'
  ];
  
  scripts.forEach(script => {
    if (fs.existsSync(script)) {
      try {
        execSync(`chmod +x ${script}`);
        console.log(`✅ Made executable: ${script}`);
      } catch (error) {
        console.log(`⚠️  Could not make executable: ${script}`);
      }
    }
  });
  
  console.log('\n✅ Development environment setup complete!');
}

/**
 * Check prerequisites
 */
function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...\n');
  
  const prerequisites = [
    { name: 'Node.js', command: 'node', version: '18+' },
    { name: 'npm', command: 'npm', version: '9+' },
    { name: 'Docker', command: 'docker', version: '20+' },
    { name: 'Docker Compose', command: 'docker-compose', version: '2+' }
  ];
  
  const missing = [];
  
  prerequisites.forEach(prereq => {
    if (commandExists(prereq.command)) {
      console.log(`✅ ${prereq.name} is installed`);
    } else {
      console.log(`❌ ${prereq.name} is not installed`);
      missing.push(prereq);
    }
  });
  
  if (missing.length > 0) {
    console.log('\n❌ Missing prerequisites:');
    missing.forEach(prereq => {
      console.log(`  - ${prereq.name} (${prereq.version})`);
    });
    console.log('\nPlease install the missing prerequisites and run this script again.');
    process.exit(1);
  }
  
  console.log('\n✅ All prerequisites are installed!');
}

/**
 * Install dependencies
 */
function installDependencies() {
  console.log('📦 Installing dependencies...\n');
  
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('\n✅ Dependencies installed successfully!');
  } catch (error) {
    console.log('\n❌ Failed to install dependencies');
    console.log('Please run "npm install" manually and try again.');
    process.exit(1);
  }
}

/**
 * Setup database
 */
function setupDatabase() {
  console.log('🗄️  Setting up database...\n');
  
  try {
    // Start database services
    execSync('docker-compose -f docker-compose.dev.yml up -d db redis', { stdio: 'inherit' });
    
    // Wait for database to be ready
    console.log('⏳ Waiting for database to be ready...');
    execSync('sleep 10');
    
    // Run database initialization
    execSync('docker-compose -f docker-compose.dev.yml exec -T db psql -U postgres -d fragrance_dev -f /docker-entrypoint-initdb.d/init-db.sql', { stdio: 'inherit' });
    
    // Run development data
    execSync('docker-compose -f docker-compose.dev.yml exec -T db psql -U postgres -d fragrance_dev -f /docker-entrypoint-initdb.d/dev-data.sql', { stdio: 'inherit' });
    
    console.log('\n✅ Database setup complete!');
  } catch (error) {
    console.log('\n❌ Failed to setup database');
    console.log('Please check Docker and database configuration.');
    process.exit(1);
  }
}

/**
 * Validate configuration
 */
function validateConfiguration() {
  console.log('🔍 Validating configuration...\n');
  
  try {
    execSync('npm run config:validate', { stdio: 'inherit' });
    console.log('\n✅ Configuration validation passed!');
  } catch (error) {
    console.log('\n❌ Configuration validation failed');
    console.log('Please check the configuration files and try again.');
    process.exit(1);
  }
}

/**
 * Generate documentation
 */
function generateDocumentation() {
  console.log('📚 Generating documentation...\n');
  
  try {
    execSync('npm run config:docs', { stdio: 'inherit' });
    console.log('\n✅ Documentation generated successfully!');
  } catch (error) {
    console.log('\n❌ Failed to generate documentation');
    console.log('Please check the configuration and try again.');
    process.exit(1);
  }
}

/**
 * Main setup function
 */
function main() {
  console.log('🎯 Fragrance Management System - Development Setup');
  console.log('================================================\n');
  
  try {
    checkPrerequisites();
    setupDevelopment();
    installDependencies();
    setupDatabase();
    validateConfiguration();
    generateDocumentation();
    
    console.log('\n🎉 Development environment setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Start Docker services: docker-compose -f docker-compose.dev.yml up -d');
    console.log('3. Access the application: http://localhost:3000');
    console.log('4. Access Mailhog: http://localhost:8025');
    console.log('5. Access database: localhost:5432');
    console.log('6. Access Redis: localhost:6379');
    console.log('\n📖 Documentation:');
    console.log('- Configuration: docs/config-generated/');
    console.log('- API: docs/api.md');
    console.log('- User Guide: docs/user-guide.md');
    console.log('- Troubleshooting: docs/troubleshooting.md');
    console.log('\n🔧 Useful commands:');
    console.log('- Validate config: npm run config:validate');
    console.log('- Generate docs: npm run config:docs');
    console.log('- Run tests: npm test');
    console.log('- Run linting: npm run lint');
    console.log('- Run formatting: npm run format');
    
  } catch (error) {
    console.log('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  setupDevelopment,
  checkPrerequisites,
  installDependencies,
  setupDatabase,
  validateConfiguration,
  generateDocumentation
};
