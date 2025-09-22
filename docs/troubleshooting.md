# Troubleshooting Guide

## Overview

This comprehensive troubleshooting guide helps you diagnose and resolve common issues with the Fragrance Management System. The guide is organized by problem categories and includes step-by-step solutions, diagnostic tools, and escalation procedures.

## Table of Contents

1. [Quick Diagnostics](#quick-diagnostics)
2. [Authentication Issues](#authentication-issues)
3. [Performance Problems](#performance-problems)
4. [Data Issues](#data-issues)
5. [Configuration Problems](#configuration-problems)
6. [Integration Issues](#integration-issues)
7. [Browser Compatibility](#browser-compatibility)
8. [Network Connectivity](#network-connectivity)
9. [File Upload Problems](#file-upload-problems)
10. [Reporting Issues](#reporting-issues)
11. [System Errors](#system-errors)
12. [Diagnostic Tools](#diagnostic-tools)
13. [Escalation Procedures](#escalation-procedures)

## Quick Diagnostics

### System Health Check

Before diving into specific issues, perform these basic checks:

1. **Check System Status**: Visit the system status page
2. **Verify Internet Connection**: Ensure stable connectivity
3. **Clear Browser Cache**: Clear cookies and cached data
4. **Try Different Browser**: Test with alternative browser
5. **Check Browser Console**: Look for JavaScript errors

### Common Quick Fixes

```bash
# Clear browser cache (Chrome)
Ctrl + Shift + Delete

# Hard refresh (Chrome)
Ctrl + F5

# Check system status
curl -I https://fragrance-management.com/api/health
```

## Authentication Issues

### Login Problems

#### Issue: Cannot Log In

**Symptoms**:
- Login form not accepting credentials
- "Invalid credentials" error message
- Login button not responding

**Diagnostic Steps**:
1. Verify username and password
2. Check Caps Lock status
3. Test with different browser
4. Check system status page

**Solutions**:
```bash
# Check if user exists
SELECT * FROM users WHERE email = 'user@example.com';

# Verify password hash
SELECT password_hash FROM users WHERE email = 'user@example.com';

# Check account status
SELECT is_active, last_login_at FROM users WHERE email = 'user@example.com';
```

**Common Causes**:
- Incorrect credentials
- Account locked/disabled
- System maintenance
- Browser compatibility issues

#### Issue: Session Timeout

**Symptoms**:
- Frequent logout messages
- "Session expired" errors
- Need to re-login frequently

**Diagnostic Steps**:
1. Check session timeout settings
2. Verify browser cookie settings
3. Test with different browser
4. Check system logs

**Solutions**:
```javascript
// Check session configuration
const sessionConfig = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: true,
  httpOnly: true,
  sameSite: 'strict'
};

// Verify session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: sessionConfig
}));
```

#### Issue: Two-Factor Authentication Problems

**Symptoms**:
- 2FA code not working
- SMS not received
- Authenticator app issues

**Diagnostic Steps**:
1. Check time synchronization
2. Verify phone number
3. Test backup codes
4. Check 2FA configuration

**Solutions**:
```bash
# Verify 2FA setup
SELECT two_factor_enabled, two_factor_secret FROM users WHERE id = 'user-id';

# Check backup codes
SELECT backup_codes FROM user_security WHERE user_id = 'user-id';

# Reset 2FA if needed
UPDATE users SET two_factor_enabled = false WHERE id = 'user-id';
```

### Password Issues

#### Issue: Password Reset Not Working

**Symptoms**:
- Reset email not received
- Reset link expired
- New password not accepted

**Diagnostic Steps**:
1. Check email delivery
2. Verify reset token validity
3. Check password policy
4. Test email configuration

**Solutions**:
```sql
-- Check reset tokens
SELECT * FROM password_reset_tokens WHERE email = 'user@example.com';

-- Verify token expiration
SELECT * FROM password_reset_tokens 
WHERE email = 'user@example.com' 
AND expires_at > NOW();

-- Check password policy
SELECT min_length, require_uppercase, require_numbers 
FROM password_policies WHERE is_active = true;
```

## Performance Problems

### Slow Loading Times

#### Issue: Page Loading Slowly

**Symptoms**:
- Pages take >5 seconds to load
- Spinning loading indicators
- Timeout errors

**Diagnostic Steps**:
1. Check network speed
2. Monitor browser performance
3. Check server response times
4. Analyze database queries

**Solutions**:
```bash
# Check server response time
curl -w "@curl-format.txt" -o /dev/null -s "https://fragrance-management.com"

# Monitor database performance
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

# Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
WHERE mean_time > 1000 
ORDER BY mean_time DESC;
```

#### Issue: Database Performance

**Symptoms**:
- Slow query execution
- High CPU usage
- Connection timeouts

**Diagnostic Steps**:
1. Monitor database metrics
2. Check query execution plans
3. Analyze index usage
4. Review connection pool

**Solutions**:
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Analyze slow queries
EXPLAIN ANALYZE SELECT * FROM perfumes WHERE category = 'aquatic';

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read 
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;

-- Create missing indexes
CREATE INDEX idx_perfumes_category ON perfumes(category);
CREATE INDEX idx_perfumes_status ON perfumes(status);
CREATE INDEX idx_perfumes_created_at ON perfumes(created_at);
```

### Memory Issues

#### Issue: High Memory Usage

**Symptoms**:
- Browser crashes
- System slowdown
- Out of memory errors

**Diagnostic Steps**:
1. Monitor browser memory usage
2. Check server memory consumption
3. Analyze memory leaks
4. Review application logs

**Solutions**:
```javascript
// Monitor memory usage
console.log('Memory usage:', process.memoryUsage());

// Check for memory leaks
const heapUsed = process.memoryUsage().heapUsed;
console.log('Heap used:', heapUsed / 1024 / 1024, 'MB');

// Optimize memory usage
// Use streaming for large datasets
const stream = fs.createReadStream('large-file.csv');
stream.pipe(csvParser);
```

## Data Issues

### Data Not Saving

#### Issue: Form Data Not Persisting

**Symptoms**:
- Form submissions fail
- Data disappears after save
- Validation errors

**Diagnostic Steps**:
1. Check form validation
2. Verify database connection
3. Review error logs
4. Test with simple data

**Solutions**:
```javascript
// Check form validation
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  category: z.enum(['fresh', 'floral', 'oriental'])
});

// Verify database connection
try {
  await db.query('SELECT 1');
  console.log('Database connected');
} catch (error) {
  console.error('Database connection failed:', error);
}

// Check transaction handling
await db.transaction(async (trx) => {
  await trx('perfumes').insert(perfumeData);
  await trx('formulas').insert(formulaData);
});
```

#### Issue: Data Corruption

**Symptoms**:
- Inconsistent data display
- Missing records
- Duplicate entries

**Diagnostic Steps**:
1. Check data integrity
2. Verify foreign key constraints
3. Review data validation
4. Check for concurrent updates

**Solutions**:
```sql
-- Check data integrity
SELECT COUNT(*) FROM perfumes WHERE id NOT IN (
  SELECT DISTINCT perfume_id FROM formulas WHERE perfume_id IS NOT NULL
);

-- Verify foreign key constraints
SELECT conname, conrelid::regclass, confrelid::regclass 
FROM pg_constraint 
WHERE contype = 'f';

-- Check for duplicates
SELECT name, COUNT(*) 
FROM perfumes 
GROUP BY name 
HAVING COUNT(*) > 1;
```

### Data Synchronization Issues

#### Issue: Data Not Updating

**Symptoms**:
- Changes not reflected
- Stale data display
- Cache issues

**Diagnostic Steps**:
1. Check cache invalidation
2. Verify real-time updates
3. Review data refresh logic
4. Test with different users

**Solutions**:
```javascript
// Implement cache invalidation
const invalidateCache = (key) => {
  redis.del(key);
  redis.del(`${key}:*`);
};

// Real-time updates
io.emit('perfume:updated', {
  id: perfumeId,
  data: updatedData
});

// Data refresh
const refreshData = async () => {
  const data = await fetchLatestData();
  setData(data);
};
```

## Configuration Problems

### Environment Configuration

#### Issue: Configuration Not Loading

**Symptoms**:
- Default values used
- Environment variables not recognized
- Configuration errors

**Diagnostic Steps**:
1. Check environment file
2. Verify variable names
3. Check file permissions
4. Review configuration loading

**Solutions**:
```bash
# Check environment variables
echo $NODE_ENV
echo $DATABASE_URL
echo $JWT_SECRET

# Verify .env file
cat .env.development
cat .env.production

# Check file permissions
ls -la .env*
```

```javascript
// Verify configuration loading
console.log('Environment:', process.env.NODE_ENV);
console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
console.log('JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'Not set');

// Configuration validation
const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32)
});
```

### Feature Configuration

#### Issue: Features Not Working

**Symptoms**:
- Feature flags not applied
- Missing functionality
- Configuration errors

**Diagnostic Steps**:
1. Check feature flags
2. Verify user permissions
3. Review configuration files
4. Test with different users

**Solutions**:
```javascript
// Check feature flags
const isFeatureEnabled = (feature) => {
  return config.features[feature] && user.permissions.includes(feature);
};

// Verify feature configuration
const featureConfig = {
  pegaIntegration: process.env.PEGA_ENABLED === 'true',
  advancedAnalytics: process.env.ANALYTICS_ENABLED === 'true',
  realTimeUpdates: process.env.REALTIME_ENABLED === 'true'
};
```

## Integration Issues

### Pega Integration

#### Issue: Pega API Connection Failed

**Symptoms**:
- Pega data not loading
- API timeout errors
- Authentication failures

**Diagnostic Steps**:
1. Check API endpoint
2. Verify credentials
3. Test network connectivity
4. Review API logs

**Solutions**:
```bash
# Test Pega API connectivity
curl -H "Authorization: Bearer $PEGA_TOKEN" \
  "$PEGA_API_URL/api/cases"

# Check API response
curl -w "@curl-format.txt" -o /dev/null -s \
  "$PEGA_API_URL/api/health"
```

```javascript
// Pega API client
const pegaClient = new PegaClient({
  baseURL: process.env.PEGA_API_URL,
  apiKey: process.env.PEGA_API_KEY,
  timeout: 30000
});

// Error handling
try {
  const cases = await pegaClient.getCases();
  return cases;
} catch (error) {
  console.error('Pega API error:', error);
  throw new Error('Failed to fetch Pega data');
}
```

### Email Integration

#### Issue: Email Not Sending

**Symptoms**:
- Emails not delivered
- SMTP errors
- Authentication failures

**Diagnostic Steps**:
1. Check SMTP configuration
2. Verify email credentials
3. Test email delivery
4. Review email logs

**Solutions**:
```javascript
// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

// Test email sending
const testEmail = async () => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email'
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};
```

## Browser Compatibility

### Browser-Specific Issues

#### Issue: Chrome Compatibility

**Symptoms**:
- JavaScript errors
- CSS rendering issues
- Performance problems

**Solutions**:
```javascript
// Check Chrome version
const isChrome = /Chrome/.test(navigator.userAgent);
const chromeVersion = parseInt(navigator.userAgent.match(/Chrome\/(\d+)/)[1]);

if (chromeVersion < 90) {
  console.warn('Chrome version too old, please update');
}

// Chrome-specific fixes
if (isChrome) {
  // Apply Chrome-specific optimizations
  document.documentElement.style.setProperty('--chrome-optimization', 'true');
}
```

#### Issue: Firefox Compatibility

**Symptoms**:
- Layout issues
- JavaScript errors
- Feature not working

**Solutions**:
```javascript
// Firefox detection
const isFirefox = /Firefox/.test(navigator.userAgent);

if (isFirefox) {
  // Apply Firefox-specific fixes
  document.documentElement.style.setProperty('--firefox-optimization', 'true');
}
```

### JavaScript Errors

#### Issue: JavaScript Not Loading

**Symptoms**:
- Page not interactive
- Console errors
- Features not working

**Diagnostic Steps**:
1. Check browser console
2. Verify JavaScript files
3. Check network requests
4. Review error messages

**Solutions**:
```javascript
// Error handling
window.addEventListener('error', (event) => {
  console.error('JavaScript error:', event.error);
  // Send error to monitoring service
  sendErrorToMonitoring(event.error);
});

// Check if JavaScript is enabled
if (typeof window === 'undefined') {
  console.error('JavaScript is disabled');
}
```

## Network Connectivity

### Connection Issues

#### Issue: Network Timeout

**Symptoms**:
- Request timeouts
- Slow responses
- Connection errors

**Diagnostic Steps**:
1. Check internet connection
2. Test network speed
3. Verify DNS resolution
4. Check firewall settings

**Solutions**:
```bash
# Test network connectivity
ping google.com
ping fragrance-management.com

# Check DNS resolution
nslookup fragrance-management.com

# Test network speed
curl -w "@curl-format.txt" -o /dev/null -s "https://fragrance-management.com"
```

#### Issue: DNS Resolution Problems

**Symptoms**:
- Cannot reach website
- DNS errors
- Connection failures

**Solutions**:
```bash
# Flush DNS cache
sudo dscacheutil -flushcache  # macOS
ipconfig /flushdns             # Windows
sudo systemctl flush-dns       # Linux

# Use alternative DNS
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
echo "nameserver 8.8.4.4" | sudo tee -a /etc/resolv.conf
```

## File Upload Problems

### Upload Failures

#### Issue: Files Not Uploading

**Symptoms**:
- Upload progress stuck
- File upload errors
- Large files failing

**Diagnostic Steps**:
1. Check file size limits
2. Verify file types
3. Test network connection
4. Review server logs

**Solutions**:
```javascript
// File upload configuration
const uploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  maxFiles: 5
};

// File validation
const validateFile = (file) => {
  if (file.size > uploadConfig.maxFileSize) {
    throw new Error('File too large');
  }
  if (!uploadConfig.allowedTypes.includes(file.type)) {
    throw new Error('File type not allowed');
  }
};
```

#### Issue: Large File Uploads

**Symptoms**:
- Timeout errors
- Memory issues
- Upload failures

**Solutions**:
```javascript
// Chunked upload for large files
const uploadChunk = async (file, chunkIndex, totalChunks) => {
  const chunkSize = 1024 * 1024; // 1MB chunks
  const start = chunkIndex * chunkSize;
  const end = Math.min(start + chunkSize, file.size);
  const chunk = file.slice(start, end);
  
  const formData = new FormData();
  formData.append('chunk', chunk);
  formData.append('chunkIndex', chunkIndex);
  formData.append('totalChunks', totalChunks);
  formData.append('fileId', fileId);
  
  return fetch('/api/upload/chunk', {
    method: 'POST',
    body: formData
  });
};
```

## Reporting Issues

### Report Generation Problems

#### Issue: Reports Not Generating

**Symptoms**:
- Report generation fails
- Empty reports
- Timeout errors

**Diagnostic Steps**:
1. Check data availability
2. Verify report parameters
3. Review query performance
4. Check system resources

**Solutions**:
```sql
-- Check data availability
SELECT COUNT(*) FROM perfumes WHERE created_at >= '2024-01-01';

-- Optimize report queries
EXPLAIN ANALYZE SELECT p.*, f.* 
FROM perfumes p 
JOIN formulas f ON p.formula_id = f.id 
WHERE p.created_at >= '2024-01-01';

-- Create report indexes
CREATE INDEX idx_perfumes_report_date ON perfumes(created_at, status);
CREATE INDEX idx_formulas_report ON formulas(perfume_id, created_at);
```

#### Issue: Report Performance

**Symptoms**:
- Slow report generation
- High resource usage
- Timeout errors

**Solutions**:
```javascript
// Implement report caching
const generateReport = async (params) => {
  const cacheKey = `report:${JSON.stringify(params)}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const report = await buildReport(params);
  await redis.setex(cacheKey, 3600, JSON.stringify(report)); // 1 hour cache
  
  return report;
};
```

## System Errors

### Application Errors

#### Issue: 500 Internal Server Error

**Symptoms**:
- Server error pages
- Application crashes
- Error logs

**Diagnostic Steps**:
1. Check application logs
2. Review error details
3. Verify system resources
4. Check database connection

**Solutions**:
```javascript
// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Application error:', error);
  
  // Log error details
  logger.error({
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    user: req.user?.id
  });
  
  // Return appropriate response
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});
```

#### Issue: Database Connection Errors

**Symptoms**:
- Database timeout
- Connection pool exhausted
- Query failures

**Solutions**:
```javascript
// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Connection health check
const checkDatabaseHealth = async () => {
  try {
    await pool.query('SELECT 1');
    return { status: 'healthy', connections: pool.totalCount };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};
```

## Diagnostic Tools

### Built-in Diagnostics

#### System Health Check

```bash
# Check system health
curl -H "Authorization: Bearer $TOKEN" \
  "https://fragrance-management.com/api/health"

# Detailed health check
curl -H "Authorization: Bearer $TOKEN" \
  "https://fragrance-management.com/api/health/detailed"
```

#### Performance Monitoring

```javascript
// Performance monitoring
const performanceMonitor = {
  startTime: Date.now(),
  
  measure: (name, fn) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name}: ${end - start}ms`);
    return result;
  },
  
  memoryUsage: () => {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }
};
```

### External Tools

#### Browser Developer Tools

1. **Console**: Check for JavaScript errors
2. **Network**: Monitor request/response times
3. **Performance**: Analyze page performance
4. **Application**: Check storage and cache

#### Database Tools

```sql
-- Check database performance
SELECT * FROM pg_stat_activity WHERE state = 'active';

-- Monitor slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan 
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;
```

## Escalation Procedures

### Support Levels

#### Level 1: Basic Support
- **Scope**: User account issues, basic functionality
- **Response Time**: 4 hours
- **Resolution Time**: 24 hours

#### Level 2: Technical Support
- **Scope**: System configuration, integration issues
- **Response Time**: 2 hours
- **Resolution Time**: 48 hours

#### Level 3: System Administration
- **Scope**: Server issues, database problems
- **Response Time**: 1 hour
- **Resolution Time**: 24 hours

#### Level 4: Development Team
- **Scope**: Code bugs, feature requests
- **Response Time**: 4 hours
- **Resolution Time**: 1 week

### Escalation Criteria

#### Immediate Escalation
- System down
- Data loss
- Security breach
- Performance degradation >50%

#### Standard Escalation
- Feature not working
- Performance issues
- Integration problems
- User experience issues

### Contact Information

#### Support Channels
- **Email**: support@fragrance-management.com
- **Phone**: +1-800-FRAGRANCE
- **Live Chat**: Available 24/7
- **Ticket System**: https://support.fragrance-management.com

#### Emergency Contacts
- **Critical Issues**: +1-800-FRAGRANCE-EMERGENCY
- **Security Issues**: security@fragrance-management.com
- **System Administrator**: admin@fragrance-management.com

### Documentation Requirements

#### Issue Reports Should Include
1. **Problem Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to recreate the problem
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment Details**: Browser, OS, user role
6. **Error Messages**: Any error messages or logs
7. **Screenshots**: Visual evidence of the problem

#### Resolution Documentation
1. **Root Cause**: What caused the issue
2. **Solution**: How the problem was resolved
3. **Prevention**: Steps to prevent recurrence
4. **Lessons Learned**: Insights for future issues

## Prevention Strategies

### Proactive Monitoring

```javascript
// Health check endpoint
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      email: await checkEmail(),
      pega: await checkPega()
    }
  };
  
  res.json(health);
});
```

### Regular Maintenance

1. **Database Maintenance**: Regular cleanup and optimization
2. **Log Rotation**: Prevent log files from growing too large
3. **Cache Management**: Regular cache invalidation
4. **Security Updates**: Keep system and dependencies updated

### User Education

1. **Training Programs**: Regular user training sessions
2. **Documentation**: Keep user guides updated
3. **Best Practices**: Share tips and best practices
4. **Feedback Collection**: Gather user feedback for improvements

## Conclusion

This troubleshooting guide provides comprehensive solutions for common issues with the Fragrance Management System. For issues not covered in this guide, please contact our support team with detailed information about the problem.

Remember to:
- Always check the system status page first
- Gather as much information as possible before contacting support
- Follow the escalation procedures for urgent issues
- Document solutions for future reference

For additional support, visit our support portal at https://support.fragrance-management.com or contact us at support@fragrance-management.com.
