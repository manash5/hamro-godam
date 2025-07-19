import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const secretKey = process.env.secretKey; 

export async function middleware(request) {
  // Skip middleware for login/register routes
  const publicPaths = ['/api/auth/login', '/api/register', '/login', '/register'];
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Get token from headers
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return new NextResponse(
      JSON.stringify({ message: 'Access denied. No token provided.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, secretKey);
    const response = NextResponse.next();
    return response;
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ message: 'Invalid or expired token.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export const config = {
  matcher: ['/api/:path*'],
};

