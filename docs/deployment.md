# Deployment Guide

## Overview

This guide covers deploying the Fragrance Management System to various environments including development, staging, and production. The system supports multiple deployment strategies including Docker containers, cloud platforms, and traditional server deployments.

## Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose (for containerized deployments)
- Access to target deployment environment
- Required environment variables and secrets

## Environment Setup

### Required Environment Variables

Create environment-specific `.env` files:

#### Development (.env.development)
```bash
# Application
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/fragrance_dev
DATABASE_SSL=false

# Authentication
JWT_SECRET=your-development-jwt-secret
JWT_EXPIRES_IN=24h
SESSION_SECRET=your-development-session-secret

# Pega Integration
PEGA_API_URL=https://dev-pega.example.com
PEGA_API_KEY=your-dev-pega-api-key
PEGA_CLIENT_ID=your-dev-pega-client-id
PEGA_CLIENT_SECRET=your-dev-pega-client-secret

# Email
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASS=your-mailtrap-pass
EMAIL_FROM=noreply@dev.fragrance-management.com

# File Storage
STORAGE_PROVIDER=local
STORAGE_PATH=./uploads
MAX_FILE_SIZE=10485760

# Monitoring
LOG_LEVEL=debug
ENABLE_METRICS=true
```

#### Staging (.env.staging)
```bash
# Application
NODE_ENV=staging
PORT=3000
NEXT_PUBLIC_APP_URL=https://staging.fragrance-management.com

# Database
DATABASE_URL=postgresql://user:password@staging-db:5432/fragrance_staging
DATABASE_SSL=true

# Authentication
JWT_SECRET=your-staging-jwt-secret
JWT_EXPIRES_IN=8h
SESSION_SECRET=your-staging-session-secret

# Pega Integration
PEGA_API_URL=https://staging-pega.example.com
PEGA_API_KEY=your-staging-pega-api-key
PEGA_CLIENT_ID=your-staging-pega-client-id
PEGA_CLIENT_SECRET=your-staging-pega-client-secret

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@staging.fragrance-management.com

# File Storage
STORAGE_PROVIDER=aws
AWS_REGION=us-east-1
AWS_BUCKET=fragrance-staging-uploads
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# Monitoring
LOG_LEVEL=info
ENABLE_METRICS=true
SENTRY_DSN=your-sentry-dsn
```

#### Production (.env.production)
```bash
# Application
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://fragrance-management.com

# Database
DATABASE_URL=postgresql://user:password@prod-db:5432/fragrance_prod
DATABASE_SSL=true

# Authentication
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=4h
SESSION_SECRET=your-production-session-secret

# Pega Integration
PEGA_API_URL=https://pega.example.com
PEGA_API_KEY=your-production-pega-api-key
PEGA_CLIENT_ID=your-production-pega-client-id
PEGA_CLIENT_SECRET=your-production-pega-client-secret

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@fragrance-management.com

# File Storage
STORAGE_PROVIDER=aws
AWS_REGION=us-east-1
AWS_BUCKET=fragrance-prod-uploads
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# Monitoring
LOG_LEVEL=warn
ENABLE_METRICS=true
SENTRY_DSN=your-sentry-dsn
```

## Docker Deployment

### Dockerfile

The application includes a multi-stage Dockerfile optimized for production:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

#### Development (docker-compose.yml)
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/fragrance_dev
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=fragrance_dev
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app

volumes:
  postgres_data:
```

#### Production (docker-compose.prod.yml)
```yaml
version: '3.8'

services:
  app:
    build: .
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - SESSION_SECRET=${SESSION_SECRET}
    restart: unless-stopped
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    restart: unless-stopped
    depends_on:
      - app

volumes:
  postgres_data:
```

### Deployment Commands

```bash
# Build and run development environment
docker-compose up --build

# Build and run production environment
docker-compose -f docker-compose.prod.yml up --build -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Clean up
docker-compose down -v
```

## Cloud Platform Deployments

### AWS Deployment

#### Using AWS App Runner

1. **Create App Runner Service**:
   ```bash
   aws apprunner create-service \
     --service-name fragrance-management \
     --source-configuration '{
       "ImageRepository": {
         "ImageIdentifier": "your-account.dkr.ecr.us-east-1.amazonaws.com/fragrance-management:latest",
         "ImageConfiguration": {
           "Port": "3000",
           "RuntimeEnvironmentVariables": {
             "NODE_ENV": "production",
             "DATABASE_URL": "postgresql://user:pass@rds-endpoint:5432/fragrance_prod"
           }
         },
         "ImageRepositoryType": "ECR"
       }
     }'
   ```

2. **Set up RDS Database**:
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier fragrance-prod-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username postgres \
     --master-user-password your-secure-password \
     --allocated-storage 20
   ```

3. **Configure S3 for file storage**:
   ```bash
   aws s3 mb s3://fragrance-prod-uploads
   aws s3api put-bucket-cors \
     --bucket fragrance-prod-uploads \
     --cors-configuration '{
       "CORSRules": [
         {
           "AllowedOrigins": ["https://fragrance-management.com"],
           "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
           "AllowedHeaders": ["*"]
         }
       ]
     }'
   ```

#### Using AWS ECS with Fargate

1. **Create ECS Cluster**:
   ```bash
   aws ecs create-cluster --cluster-name fragrance-cluster
   ```

2. **Create Task Definition**:
   ```json
   {
     "family": "fragrance-task",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "512",
     "memory": "1024",
     "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
     "containerDefinitions": [
       {
         "name": "fragrance-app",
         "image": "your-account.dkr.ecr.us-east-1.amazonaws.com/fragrance-management:latest",
         "portMappings": [
           {
             "containerPort": 3000,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "NODE_ENV",
             "value": "production"
           }
         ],
         "secrets": [
           {
             "name": "DATABASE_URL",
             "valueFrom": "arn:aws:secretsmanager:us-east-1:account:secret:fragrance/database-url"
           }
         ],
         "logConfiguration": {
           "logDriver": "awslogs",
           "options": {
             "awslogs-group": "/ecs/fragrance-app",
             "awslogs-region": "us-east-1",
             "awslogs-stream-prefix": "ecs"
           }
         }
       }
     ]
   }
   ```

3. **Create Service**:
   ```bash
   aws ecs create-service \
     --cluster fragrance-cluster \
     --service-name fragrance-service \
     --task-definition fragrance-task \
     --desired-count 2 \
     --launch-type FARGATE \
     --network-configuration "awsvpcConfiguration={subnets=[subnet-12345],securityGroups=[sg-12345],assignPublicIp=ENABLED}"
   ```

### Google Cloud Platform Deployment

#### Using Cloud Run

1. **Build and push image**:
   ```bash
   gcloud builds submit --tag gcr.io/your-project/fragrance-management
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy fragrance-management \
     --image gcr.io/your-project/fragrance-management \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars NODE_ENV=production \
     --set-secrets DATABASE_URL=database-url:latest
   ```

3. **Set up Cloud SQL**:
   ```bash
   gcloud sql instances create fragrance-db \
     --database-version POSTGRES_15 \
     --tier db-f1-micro \
     --region us-central1
   ```

### Azure Deployment

#### Using Azure Container Instances

1. **Create Resource Group**:
   ```bash
   az group create --name fragrance-rg --location eastus
   ```

2. **Deploy Container Instance**:
   ```bash
   az container create \
     --resource-group fragrance-rg \
     --name fragrance-app \
     --image your-registry.azurecr.io/fragrance-management:latest \
     --dns-name-label fragrance-app \
     --ports 3000 \
     --environment-variables NODE_ENV=production \
     --secure-environment-variables DATABASE_URL=your-database-url
   ```

3. **Set up Azure Database for PostgreSQL**:
   ```bash
   az postgres flexible-server create \
     --resource-group fragrance-rg \
     --name fragrance-db \
     --admin-user postgres \
     --admin-password your-secure-password \
     --sku-name Standard_B1ms \
     --tier Burstable
   ```

## Traditional Server Deployment

### Ubuntu/Debian Server

1. **Install Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Install PostgreSQL**:
   ```bash
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

3. **Install Redis**:
   ```bash
   sudo apt-get install redis-server
   sudo systemctl start redis-server
   sudo systemctl enable redis-server
   ```

4. **Install Nginx**:
   ```bash
   sudo apt-get install nginx
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

5. **Deploy Application**:
   ```bash
   # Clone repository
   git clone https://github.com/your-org/fragrance-management.git
   cd fragrance-management

   # Install dependencies
   npm ci --production

   # Build application
   npm run build

   # Set up environment variables
   cp .env.production .env

   # Install PM2 for process management
   npm install -g pm2

   # Start application
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name fragrance-management.com www.fragrance-management.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name fragrance-management.com www.fragrance-management.com;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Proxy to Next.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Uploads
    location /uploads {
        alias /var/www/fragrance-management/uploads;
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

### PM2 Ecosystem Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'fragrance-management',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    }
  ]
};
```

## Database Migrations

### Running Migrations

```bash
# Development
npm run db:migrate:dev

# Staging
npm run db:migrate:staging

# Production
npm run db:migrate:prod
```

### Creating Migrations

```bash
# Create new migration
npm run db:migrate:create -- --name add-user-roles

# Generate migration from model changes
npm run db:migrate:generate -- --name update-perfume-schema
```

## Health Checks and Monitoring

### Health Check Endpoints

- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed health check with dependencies
- `GET /api/metrics` - Application metrics

### Monitoring Setup

1. **Install monitoring tools**:
   ```bash
   npm install @sentry/nextjs @vercel/analytics
   ```

2. **Configure Sentry**:
   ```javascript
   // sentry.client.config.js
   import * as Sentry from '@sentry/nextjs';

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
   });
   ```

3. **Set up log aggregation**:
   ```bash
   # Using ELK Stack
   docker-compose -f docker-compose.monitoring.yml up -d
   ```

## Backup and Recovery

### Database Backup

```bash
# Create backup
pg_dump -h localhost -U postgres -d fragrance_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql -h localhost -U postgres -d fragrance_prod < backup_20240115_103000.sql
```

### Automated Backups

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/fragrance-management"
DB_NAME="fragrance_prod"

mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h localhost -U postgres -d $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# File backup
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz /var/www/fragrance-management/uploads

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

## Security Considerations

### SSL/TLS Configuration

1. **Obtain SSL certificates**:
   ```bash
   # Using Let's Encrypt
   sudo certbot --nginx -d fragrance-management.com
   ```

2. **Configure HSTS**:
   ```nginx
   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
   ```

### Firewall Configuration

```bash
# UFW configuration
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Environment Security

1. **Use secrets management**:
   ```bash
   # AWS Secrets Manager
   aws secretsmanager create-secret \
     --name fragrance/database-url \
     --secret-string "postgresql://user:pass@host:5432/db"
   ```

2. **Rotate secrets regularly**:
   ```bash
   # Rotate JWT secret
   aws secretsmanager update-secret \
     --secret-id fragrance/jwt-secret \
     --secret-string "new-jwt-secret"
   ```

## Troubleshooting

### Common Issues

1. **Application won't start**:
   ```bash
   # Check logs
   pm2 logs fragrance-management
   
   # Check environment variables
   pm2 env 0
   ```

2. **Database connection issues**:
   ```bash
   # Test connection
   psql -h localhost -U postgres -d fragrance_prod
   
   # Check database status
   sudo systemctl status postgresql
   ```

3. **Memory issues**:
   ```bash
   # Monitor memory usage
   pm2 monit
   
   # Restart with more memory
   pm2 restart fragrance-management --max-memory-restart 2G
   ```

### Performance Optimization

1. **Enable caching**:
   ```bash
   # Redis caching
   redis-cli ping
   ```

2. **Optimize database**:
   ```sql
   -- Analyze query performance
   EXPLAIN ANALYZE SELECT * FROM perfumes WHERE category = 'aquatic';
   
   -- Create indexes
   CREATE INDEX idx_perfumes_category ON perfumes(category);
   ```

3. **CDN setup**:
   ```bash
   # CloudFront distribution
   aws cloudfront create-distribution \
     --distribution-config file://cloudfront-config.json
   ```

## Rollback Procedures

### Application Rollback

```bash
# Using PM2
pm2 stop fragrance-management
pm2 start ecosystem.config.js --env previous

# Using Docker
docker-compose down
docker-compose -f docker-compose.previous.yml up -d
```

### Database Rollback

```bash
# Restore from backup
psql -h localhost -U postgres -d fragrance_prod < backup_20240114_103000.sql
```

## Maintenance

### Regular Maintenance Tasks

1. **Update dependencies**:
   ```bash
   npm audit
   npm update
   ```

2. **Clean up logs**:
   ```bash
   find /var/log -name "*.log" -mtime +30 -delete
   ```

3. **Monitor disk space**:
   ```bash
   df -h
   du -sh /var/www/fragrance-management/uploads
   ```

### Scheduled Maintenance

```bash
# Crontab entries
0 2 * * * /var/www/fragrance-management/scripts/backup.sh
0 3 * * 0 /var/www/fragrance-management/scripts/cleanup.sh
0 4 * * 1 /var/www/fragrance-management/scripts/update-deps.sh
```

## Support and Documentation

- **Deployment Issues**: [GitHub Issues](https://github.com/fragrance-management/deployment/issues)
- **Documentation**: [Deployment Docs](https://docs.fragrance-management.com/deployment)
- **Support Email**: deployment-support@fragrance-management.com
- **Status Page**: [System Status](https://status.fragrance-management.com)
