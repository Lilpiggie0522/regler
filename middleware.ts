import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from './util/jwt'
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log("middleware triggered")
  const token = request.cookies.get("token")?.value
  if (!token) {
    console.log("not a single token")
    return NextResponse.redirect(new URL('/', request.url))
  }
  try {
    const decoded = await verifyJWT(token)
    console.log('cookie is: ')
    console.log(decoded)
    if (request.nextUrl.pathname === '/lecturer' && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/studentDetailConfirm', request.url))
    }
    return NextResponse.next()
  } catch (error) {
    console.log("something wrong mate!")
    console.log(error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|$|.*Login).*)'],
}