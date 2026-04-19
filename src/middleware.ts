import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  if (pathname.startsWith('/admin')) {
    if (!session || (session.user.role !== 'AGENT' && session.user.role !== 'ADMIN')) {
      return NextResponse.redirect(new URL('/auth/login?callbackUrl=' + pathname, req.url))
    }
  }

  if (pathname.startsWith('/account')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login?callbackUrl=' + pathname, req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}
