import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl

    // Define protected routes
    const protectedRoutes = ['/', '/dashboard']
    const authRoutes = ['/login']

    if (!user && protectedRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    

    return NextResponse.next()
  } catch (e) {
    // This catch block is for unexpected errors during Supabase client creation or auth.
    // It's good practice to log these errors in a real application.
    console.error("Middleware error:", e)
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)', // Exclude static files
  ],
}