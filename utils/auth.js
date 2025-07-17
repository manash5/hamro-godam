import jwt from 'jsonwebtoken';

const secretKey = process.env.secretKey;

// List of public paths (no token required)
const publicPaths = [
  '/api/auth/login',
  '/api/register',
  '/login',
  '/register', 
  '/api/upload'
];

export function verifyToken(request) {
  const { pathname } = new URL(request.url);
  if (publicPaths.includes(pathname)) {
    return { valid: true, skip: true };
  }

  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) {
    return { valid: false, message: 'Access denied. No token provided.' };
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, message: 'Invalid or expired token.' };
  }
} 