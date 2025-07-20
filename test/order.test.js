import '@testing-library/jest-dom';

jest.mock('@/utils/tokenManager');

const mockOrders = [
  {
    id: '1',
    customerName: 'John Doe',
    customerNumber: 1234567890,
    customerAddress: '123 Main St',
    productName: ['Product A', 'Product B'],
    productQuantity: [2, 1],
    totalAmount: 299.99,
    status: 'pending',
    payment: 'Cash',
    deliveryDate: '2024-06-01T00:00:00.000Z',
    deliveryBy: 'ram hari',
  },
];

describe('Order API', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url, options) => {
      if (url === '/api/order' && (!options || options.method === 'GET')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockOrders }),
          ok: true,
        });
      }
      if (url === '/api/order' && options && options.method === 'POST') {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockOrders[0], message: 'Order created successfully' }),
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

  it('fetches orders successfully', async () => {
    const res = await fetch('/api/order');
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(data.data).toEqual(mockOrders);
  });

  it('creates an order successfully', async () => {
    const newOrder = {
      customerName: 'John Doe',
      customerNumber: 1234567890,
      customerAddress: '123 Main St',
      productName: ['Product A', 'Product B'],
      productQuantity: [2, 1],
      totalAmount: 299.99,
      status: 'pending',
      payment: 'Cash',
      deliveryDate: '2024-06-01T00:00:00.000Z',
      deliveryBy: 'ram hari',
    };
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    });
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(data.data).toMatchObject(newOrder);
    expect(data.message).toBe('Order created successfully');
  });
}); 