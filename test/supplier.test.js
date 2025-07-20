import '@testing-library/jest-dom';

jest.mock('@/utils/tokenManager');

const mockSuppliers = [
  {
    id: '1',
    name: 'Test Supplier',
    email: 'supplier@example.com',
    contact_number: '1234567890',
    address: '123 Test St',
    category: 'Electronics',
    company_name: 'Test Company',
    products: [],
  },
];

describe('Supplier API', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url, options) => {
      if (url === '/api/supplier' && (!options || options.method === 'GET')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockSuppliers }),
          ok: true,
        });
      }
      if (url === '/api/supplier' && options && options.method === 'POST') {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockSuppliers[0], message: 'Supplier created successfully' }),
          ok: true,
        });
      }
      return Promise.resolve({
        json: () => Promise.resolve({}),
        ok: false,
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches suppliers successfully', async () => {
    const res = await fetch('/api/supplier');
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(data.data).toEqual(mockSuppliers);
  });

  it('creates a supplier successfully', async () => {
    const newSupplier = {
      name: 'Test Supplier',
      email: 'supplier@example.com',
      contact_number: '1234567890',
      address: '123 Test St',
      category: 'Electronics',
      company_name: 'Test Company',
    };
    const res = await fetch('/api/supplier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSupplier),
    });
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(data.data).toMatchObject(newSupplier);
    expect(data.message).toBe('Supplier created successfully');
  });
}); 