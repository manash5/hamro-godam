import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock dependencies if needed (e.g., TokenManager, Sidebar, etc.)
jest.mock('@/utils/tokenManager');

const mockProducts = [
  {
    id: '1',
    name: 'Test Product',
    description: 'A product for testing',
    stock: 10,
    price: 99.99,
    category: 'Electronics',
    image: '',
    status: true,
    supplier: 'supplierid1',
  },
];

describe('Product API', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url, options) => {
      if (url === '/api/product' && (!options || options.method === 'GET')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockProducts }),
          ok: true,
        });
      }
      if (url === '/api/product' && options && options.method === 'POST') {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockProducts[0], message: 'Product created successfully' }),
          ok: true,
        });
      }
      // Default fallback
      return Promise.resolve({
        json: () => Promise.resolve({}),
        ok: false,
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches products successfully', async () => {
    const res = await fetch('/api/product');
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(data.data).toEqual(mockProducts);
  });

  it('creates a product successfully', async () => {
    const newProduct = {
      name: 'Test Product',
      description: 'A product for testing',
      stock: 10,
      price: 99.99,
      category: 'Electronics',
      image: '',
      status: true,
      supplier: 'supplierid1',
    };
    const res = await fetch('/api/product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(data.data).toMatchObject(newProduct);
    expect(data.message).toBe('Product created successfully');
  });
}); 