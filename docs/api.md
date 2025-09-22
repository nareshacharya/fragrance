# API Documentation

## Overview

The Fragrance Management System provides a comprehensive REST API for managing perfume formulas, ingredients, projects, and case management. This document describes the API endpoints, request/response formats, authentication, and usage examples.

## Base URL

```
https://api.fragrance-management.com/v1
```

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting an Access Token

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "perfumer"
    }
  }
}
```

## Error Handling

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { ... },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

## Endpoints

### Authentication

#### POST /auth/login
Authenticate user and get access token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "perfumer",
      "department": "development"
    }
  }
}
```

#### POST /auth/logout
Logout user and invalidate token.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /auth/profile
Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "perfumer",
    "department": "development",
    "isActive": true,
    "lastLoginAt": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Perfumes

#### GET /perfumes
Get list of perfumes with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search term
- `category` (string): Filter by category
- `status` (string): Filter by status
- `sortBy` (string): Sort field
- `sortOrder` (string): Sort order (asc/desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "perfume-123",
      "name": "Ocean Breeze",
      "description": "Fresh aquatic fragrance",
      "category": "aquatic",
      "status": "approved",
      "formula": {
        "id": "formula-123",
        "name": "Ocean Breeze Formula",
        "ingredients": [...],
        "totalWeight": 1000,
        "concentration": 15
      },
      "notes": ["fresh", "marine"],
      "tags": ["summer", "daytime"],
      "createdBy": "user-123",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "version": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET /perfumes/:id
Get specific perfume by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "perfume-123",
    "name": "Ocean Breeze",
    "description": "Fresh aquatic fragrance",
    "category": "aquatic",
    "status": "approved",
    "formula": {
      "id": "formula-123",
      "name": "Ocean Breeze Formula",
      "ingredients": [
        {
          "id": "ingredient-1",
          "name": "Bergamot",
          "type": "essential_oil",
          "concentration": 20,
          "weight": 200,
          "unit": "mg",
          "supplier": "Supplier A",
          "cost": 0.50
        }
      ],
      "totalWeight": 1000,
      "concentration": 15,
      "ph": 6.5,
      "alcoholContent": 70,
      "notes": "Balanced formula with fresh top notes"
    },
    "notes": ["fresh", "marine"],
    "tags": ["summer", "daytime"],
    "createdBy": "user-123",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "version": 1
  }
}
```

#### POST /perfumes
Create a new perfume.

**Request:**
```json
{
  "name": "Ocean Breeze",
  "description": "Fresh aquatic fragrance",
  "category": "aquatic",
  "formula": {
    "name": "Ocean Breeze Formula",
    "ingredients": [
      {
        "name": "Bergamot",
        "type": "essential_oil",
        "concentration": 20,
        "weight": 200,
        "unit": "mg",
        "supplier": "Supplier A",
        "cost": 0.50
      }
    ],
    "concentration": 15,
    "ph": 6.5,
    "alcoholContent": 70,
    "notes": "Balanced formula with fresh top notes"
  },
  "notes": ["fresh", "marine"],
  "tags": ["summer", "daytime"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "perfume-123",
    "name": "Ocean Breeze",
    "description": "Fresh aquatic fragrance",
    "category": "aquatic",
    "status": "draft",
    "formula": { ... },
    "notes": ["fresh", "marine"],
    "tags": ["summer", "daytime"],
    "createdBy": "user-123",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "version": 1
  }
}
```

#### PUT /perfumes/:id
Update an existing perfume.

**Request:**
```json
{
  "name": "Ocean Breeze Updated",
  "description": "Updated description",
  "status": "in_review"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "perfume-123",
    "name": "Ocean Breeze Updated",
    "description": "Updated description",
    "status": "in_review",
    "version": 2,
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

#### DELETE /perfumes/:id
Delete a perfume.

**Response:**
```json
{
  "success": true,
  "message": "Perfume deleted successfully"
}
```

### Ingredients

#### GET /ingredients
Get list of ingredients with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search term
- `type` (string): Filter by ingredient type
- `category` (string): Filter by category
- `supplier` (string): Filter by supplier

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ingredient-123",
      "name": "Bergamot Essential Oil",
      "type": "essential_oil",
      "category": "citrus",
      "supplier": "Supplier A",
      "cost": 0.50,
      "unit": "ml",
      "stockLevel": 1000,
      "minStockLevel": 100,
      "maxStockLevel": 5000,
      "notes": "High quality bergamot oil",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "totalPages": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET /ingredients/:id
Get specific ingredient by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ingredient-123",
    "name": "Bergamot Essential Oil",
    "type": "essential_oil",
    "category": "citrus",
    "supplier": "Supplier A",
    "cost": 0.50,
    "unit": "ml",
    "stockLevel": 1000,
    "minStockLevel": 100,
    "maxStockLevel": 5000,
    "notes": "High quality bergamot oil",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### POST /ingredients
Create a new ingredient.

**Request:**
```json
{
  "name": "Bergamot Essential Oil",
  "type": "essential_oil",
  "category": "citrus",
  "supplier": "Supplier A",
  "cost": 0.50,
  "unit": "ml",
  "stockLevel": 1000,
  "minStockLevel": 100,
  "maxStockLevel": 5000,
  "notes": "High quality bergamot oil"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ingredient-123",
    "name": "Bergamot Essential Oil",
    "type": "essential_oil",
    "category": "citrus",
    "supplier": "Supplier A",
    "cost": 0.50,
    "unit": "ml",
    "stockLevel": 1000,
    "minStockLevel": 100,
    "maxStockLevel": 5000,
    "notes": "High quality bergamot oil",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### PUT /ingredients/:id
Update an existing ingredient.

**Request:**
```json
{
  "stockLevel": 1200,
  "cost": 0.55
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ingredient-123",
    "stockLevel": 1200,
    "cost": 0.55,
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

#### DELETE /ingredients/:id
Delete an ingredient.

**Response:**
```json
{
  "success": true,
  "message": "Ingredient deleted successfully"
}
```

### Projects

#### GET /projects
Get list of projects with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search term
- `status` (string): Filter by status
- `priority` (string): Filter by priority
- `assignedTo` (string): Filter by assigned user

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "project-123",
      "name": "Summer Collection 2024",
      "description": "Development of summer fragrance collection",
      "status": "active",
      "priority": "high",
      "assignedTo": ["user-123", "user-456"],
      "perfumes": ["perfume-123", "perfume-456"],
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-06-30T23:59:59Z",
      "budget": 50000,
      "progress": 65,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "totalPages": 2,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET /projects/:id
Get specific project by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "project-123",
    "name": "Summer Collection 2024",
    "description": "Development of summer fragrance collection",
    "status": "active",
    "priority": "high",
    "assignedTo": ["user-123", "user-456"],
    "perfumes": ["perfume-123", "perfume-456"],
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-06-30T23:59:59Z",
    "budget": 50000,
    "progress": 65,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### POST /projects
Create a new project.

**Request:**
```json
{
  "name": "Summer Collection 2024",
  "description": "Development of summer fragrance collection",
  "priority": "high",
  "assignedTo": ["user-123", "user-456"],
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-06-30T23:59:59Z",
  "budget": 50000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "project-123",
    "name": "Summer Collection 2024",
    "description": "Development of summer fragrance collection",
    "status": "planning",
    "priority": "high",
    "assignedTo": ["user-123", "user-456"],
    "perfumes": [],
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-06-30T23:59:59Z",
    "budget": 50000,
    "progress": 0,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### PUT /projects/:id
Update an existing project.

**Request:**
```json
{
  "status": "active",
  "progress": 75
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "project-123",
    "status": "active",
    "progress": 75,
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

#### DELETE /projects/:id
Delete a project.

**Response:**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

### Case Management

#### GET /cases
Get list of cases with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search term
- `status` (string): Filter by status
- `priority` (string): Filter by priority
- `assignedTo` (string): Filter by assigned user
- `projectId` (string): Filter by project

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "case-123",
      "title": "Formula Review Required",
      "description": "Review and approve Ocean Breeze formula",
      "status": "pending_review",
      "priority": "high",
      "assignedTo": "user-123",
      "projectId": "project-123",
      "perfumeId": "perfume-123",
      "dueDate": "2024-01-20T23:59:59Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET /cases/:id
Get specific case by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "case-123",
    "title": "Formula Review Required",
    "description": "Review and approve Ocean Breeze formula",
    "status": "pending_review",
    "priority": "high",
    "assignedTo": "user-123",
    "projectId": "project-123",
    "perfumeId": "perfume-123",
    "dueDate": "2024-01-20T23:59:59Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### POST /cases
Create a new case.

**Request:**
```json
{
  "title": "Formula Review Required",
  "description": "Review and approve Ocean Breeze formula",
  "priority": "high",
  "assignedTo": "user-123",
  "projectId": "project-123",
  "perfumeId": "perfume-123",
  "dueDate": "2024-01-20T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "case-123",
    "title": "Formula Review Required",
    "description": "Review and approve Ocean Breeze formula",
    "status": "open",
    "priority": "high",
    "assignedTo": "user-123",
    "projectId": "project-123",
    "perfumeId": "perfume-123",
    "dueDate": "2024-01-20T23:59:59Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### PUT /cases/:id
Update an existing case.

**Request:**
```json
{
  "status": "in_progress",
  "assignedTo": "user-456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "case-123",
    "status": "in_progress",
    "assignedTo": "user-456",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

#### DELETE /cases/:id
Delete a case.

**Response:**
```json
{
  "success": true,
  "message": "Case deleted successfully"
}
```

### File Upload

#### POST /upload
Upload files (images, documents, etc.).

**Request:**
```
Content-Type: multipart/form-data

file: <file>
type: image|document|formula
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "file-123",
    "name": "formula-image.jpg",
    "size": 1024000,
    "type": "image/jpeg",
    "url": "https://storage.example.com/files/file-123.jpg",
    "uploadedAt": "2024-01-15T10:30:00Z",
    "uploadedBy": "user-123"
  }
}
```

### Notifications

#### GET /notifications
Get user notifications.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `unread` (boolean): Filter unread notifications

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "notification-123",
      "title": "New Case Assigned",
      "message": "You have been assigned to review Ocean Breeze formula",
      "type": "info",
      "read": false,
      "userId": "user-123",
      "createdAt": "2024-01-15T10:30:00Z",
      "actionUrl": "/cases/case-123"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

#### PUT /notifications/:id/read
Mark notification as read.

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### Analytics

#### GET /analytics/dashboard
Get dashboard analytics data.

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "2024-01",
    "metrics": {
      "totalPerfumes": 150,
      "activeProjects": 25,
      "pendingCases": 45,
      "totalIngredients": 500
    },
    "trends": [
      {
        "date": "2024-01-01",
        "value": 10,
        "label": "New Perfumes"
      },
      {
        "date": "2024-01-02",
        "value": 15,
        "label": "New Perfumes"
      }
    ]
  }
}
```

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Authenticated users**: 1000 requests per hour
- **Unauthenticated users**: 100 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
```

## Webhooks

The API supports webhooks for real-time notifications:

### Webhook Events

- `perfume.created`
- `perfume.updated`
- `perfume.deleted`
- `project.created`
- `project.updated`
- `case.created`
- `case.updated`
- `case.completed`

### Webhook Payload

```json
{
  "event": "perfume.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": "perfume-123",
    "name": "Ocean Breeze",
    "createdBy": "user-123"
  }
}
```

## SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @fragrance-management/api-client
```

```typescript
import { FragranceApiClient } from '@fragrance-management/api-client';

const client = new FragranceApiClient({
  baseUrl: 'https://api.fragrance-management.com/v1',
  token: 'your-jwt-token'
});

// Get perfumes
const perfumes = await client.perfumes.list({
  page: 1,
  limit: 20,
  search: 'ocean'
});

// Create perfume
const newPerfume = await client.perfumes.create({
  name: 'Ocean Breeze',
  description: 'Fresh aquatic fragrance',
  category: 'aquatic'
});
```

### Python

```bash
pip install fragrance-management-api
```

```python
from fragrance_management_api import FragranceApiClient

client = FragranceApiClient(
    base_url='https://api.fragrance-management.com/v1',
    token='your-jwt-token'
)

# Get perfumes
perfumes = client.perfumes.list(
    page=1,
    limit=20,
    search='ocean'
)

# Create perfume
new_perfume = client.perfumes.create({
    'name': 'Ocean Breeze',
    'description': 'Fresh aquatic fragrance',
    'category': 'aquatic'
})
```

## Testing

### Postman Collection

A Postman collection is available for testing the API:

1. Import the collection from `/docs/postman/Fragrance-API.postman_collection.json`
2. Set up environment variables:
   - `base_url`: `https://api.fragrance-management.com/v1`
   - `token`: Your JWT token
3. Run the collection to test all endpoints

### API Testing

```bash
# Test authentication
curl -X POST https://api.fragrance-management.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Test getting perfumes
curl -X GET https://api.fragrance-management.com/v1/perfumes \
  -H "Authorization: Bearer your-jwt-token"
```

## Support

For API support and questions:

- **Documentation**: [https://docs.fragrance-management.com](https://docs.fragrance-management.com)
- **Support Email**: api-support@fragrance-management.com
- **GitHub Issues**: [https://github.com/fragrance-management/api/issues](https://github.com/fragrance-management/api/issues)
- **Status Page**: [https://status.fragrance-management.com](https://status.fragrance-management.com)
