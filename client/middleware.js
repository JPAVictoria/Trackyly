import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null; 
  const pathname = request.nextUrl.pathname

  const publicPaths = ['/pages/login', '/pages/register']

  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/pages/login', request.url))
  }

  if (user?.role === 'ADMIN') {
    return NextResponse.next()
  }

  if (user?.role === 'MERCHANDISER') {
    const allowedPaths = [
      '/pages/merchandiserDashboard',
      '/pages/conforme',
      '/pages/createForm'
    ]

    const isAllowed = allowedPaths.some(path => pathname.startsWith(path))
    
    if (!isAllowed) {
      return NextResponse.redirect(new URL('/pages/unauthorized', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/pages/adminDashboard/:path*',
    '/pages/conforme/:path*',
    '/pages/createForm/:path*',
    '/pages/forgot-password/:path*',
    '/pages/reset-password/:path*',
    '/pages/userRoles/:path*',
    '/pages/merchandiserDashboard/:path*',
    '/pages/forms/:path*',
  ],
}