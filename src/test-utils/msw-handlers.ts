import { http, HttpResponse } from 'msw';
import { createUser, createIngredient, createApiResponse, createPaginatedResponse } from './factories';
import { API_ENDPOINTS } from '@/config/constants';

// Mock data
const mockUsers = [
  createUser({ id: '1', email: 'admin@example.com', firstName: 'Admin', lastName: 'User' }),
  createUser({ id: '2', email: 'user@example.com', firstName: 'Test', lastName: 'User' }),
];

const mockIngredients = [
  createIngredient({ id: '1', name: 'Lavender Oil' }),
  createIngredient({ id: '2', name: 'Rose Extract' }),
  createIngredient({ id: '3', name: 'Vanilla Essence' }),
];

export const handlers = [
  // Auth endpoints
  http.post(API_ENDPOINTS.AUTH.LOGIN, async ({ request }) => {
    const body = await request.json() as any;
    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json(createApiResponse({
        user: mockUsers[1],
        token: 'mock-token',
      }));
    }
    return HttpResponse.json(createApiResponse(null, { success: false, error: 'Invalid credentials' }), { status: 401 });
  }),

  http.post(API_ENDPOINTS.AUTH.LOGOUT, () => {
    return HttpResponse.json(createApiResponse(null));
  }),

  // Users endpoints
  http.get(API_ENDPOINTS.USERS.LIST, () => {
    return HttpResponse.json(createPaginatedResponse(mockUsers));
  }),

  http.get(`${API_ENDPOINTS.USERS.GET.replace(':id', ':id')}`, ({ params }) => {
    const user = mockUsers.find(u => u.id === params.id);
    if (!user) {
      return HttpResponse.json(createApiResponse(null, { success: false, error: 'User not found' }), { status: 404 });
    }
    return HttpResponse.json(createApiResponse(user));
  }),

  // Ingredients endpoints
  http.get(API_ENDPOINTS.INGREDIENTS.LIST, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    
    return HttpResponse.json(createPaginatedResponse(mockIngredients, {
      pagination: { page, limit, total: mockIngredients.length, totalPages: 1, hasNext: false, hasPrev: false }
    }));
  }),

  http.post(API_ENDPOINTS.INGREDIENTS.CREATE, async ({ request }) => {
    const body = await request.json() as any;
    const newIngredient = createIngredient({ ...body, id: String(Date.now()) });
    return HttpResponse.json(createApiResponse(newIngredient), { status: 201 });
  }),

  http.get(`${API_ENDPOINTS.INGREDIENTS.GET.replace(':id', ':id')}`, ({ params }) => {
    const ingredient = mockIngredients.find(i => i.id === params.id);
    if (!ingredient) {
      return HttpResponse.json(createApiResponse(null, { success: false, error: 'Ingredient not found' }), { status: 404 });
    }
    return HttpResponse.json(createApiResponse(ingredient));
  }),

  http.put(`${API_ENDPOINTS.INGREDIENTS.UPDATE.replace(':id', ':id')}`, async ({ params, request }) => {
    const body = await request.json() as any;
    const ingredient = mockIngredients.find(i => i.id === params.id);
    if (!ingredient) {
      return HttpResponse.json(createApiResponse(null, { success: false, error: 'Ingredient not found' }), { status: 404 });
    }
    const updated = { ...ingredient, ...body };
    return HttpResponse.json(createApiResponse(updated));
  }),

  http.delete(`${API_ENDPOINTS.INGREDIENTS.DELETE.replace(':id', ':id')}`, ({ params }) => {
    const ingredient = mockIngredients.find(i => i.id === params.id);
    if (!ingredient) {
      return HttpResponse.json(createApiResponse(null, { success: false, error: 'Ingredient not found' }), { status: 404 });
    }
    return HttpResponse.json(createApiResponse(null));
  }),
];
