import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from './util/jwt'
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log(`route is: ${request.url}`)
  const token = request.cookies.get("token")?.value
  if (!token && request.nextUrl.pathname !== '/') {
    console.log('no token, path not / redirect')
    return NextResponse.redirect(new URL('/', request.url))
  }
  try {
    const decoded = await verifyJWT(token!)
    if (request.nextUrl.pathname === '/' && (decoded.role === 'admin' || decoded.role === 'tutor')) {
      return NextResponse.redirect(new URL('/staffCourseList', request.url))
    } else if (request.nextUrl.pathname === '/' && decoded.role === 'student') {
      return NextResponse.redirect(new URL('/studentDetailConfirm', request.url))
    }
    // route guard for admin page
    if (request.nextUrl.pathname === '/lecturer' && decoded.role !== 'admin') {
      if (decoded.role === 'student') {
        return NextResponse.redirect(new URL('/studentDetailConfirm', request.url))
      } else if (decoded.role === 'tutor') {
        return NextResponse.redirect(new URL('/staffCourseList', request.url))  
      }
      return NextResponse.redirect(new URL('/', request.url))  
    }

    // route guard for staffCourseList page
    if (request.nextUrl.pathname === '/staffCourseList' && decoded.role !== 'admin' && decoded.role !== 'tutor') {
      return NextResponse.redirect(new URL('/', request.url))  
    }
    return NextResponse.next()
  } catch (error) {
    console.log("something wrong mate!")
    console.log(error)
    if (request.nextUrl.pathname !== '/') {
      console.log('no token, path not / redirect 22')
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*Login|Mainpage-priscilla-du-preez-unsplash).*)'],
}