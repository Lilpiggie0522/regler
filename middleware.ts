import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from './util/jwt'
import { JWTPayload } from 'jose'
// This function can be marked `async` if using `await` inside
const PROTECTED_ROUTES = [
  {
    pathRegex: "/lecturer.*",
    access: ["admin"],
    redirect: { tutor: '/staffCourseList', student: '/studentDetailConfirm', admin: '/' }
  },
  {
    pathRegex: "/teamEvaluationForm.*",
    access: ["student"],
    redirect: { tutor: '/staffCourseList', admin: '/staffCourseList', student: '/' }
  },
  {
    pathRegex: "/staffCourseList",
    access: ["admin", "tutor"],
    redirect: { tutor: '/', admin: '/', student: '/studentDetailConfirm' }
  },
  {
    pathRegex: "/studentDetailConfirm",
    access: ["student"],
    redirect: { tutor: '/staffCourseList', admin: '/staffCourseList', student: '/' }
  },
  {
    pathRegex: "/api/adminSystem/courses/.*",
    access: ["admin", "tutor"],
    redirect: { tutor: '/staffCourseList', admin: '/staffCourseList', student: '/studentDetailConfirm' }
  },
  {
    pathRegex: "/api/adminSystem/initialise",
    access: ["admin"],
    redirect: { tutor: '/staffCourseList', admin: '/staffCourseList', student: '/studentDetailConfirm' }
  },
  {
    pathRegex: "/api/issueSystem/.*",
    access: ["student"],
    redirect: { tutor: '/staffCourseList', admin: '/staffCourseList', student: '/studentDetailConfirm' }
  },
  {
    pathRegex: "/api/staff/.*",
    access: ["admin"],
    redirect: { tutor: '/staffCourseList', admin: '/staffCourseList', student: '/studentDetailConfirm' }
  },
  {
    pathRegex: "/api/util/.*",
    access: ["admin", "tutor"],
    redirect: { tutor: '/staffCourseList', admin: '/staffCourseList', student: '/studentDetailConfirm' }
  }
]
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const path = request.nextUrl.pathname

  for (const item of PROTECTED_ROUTES) {
    const compiledRegex = new RegExp(item.pathRegex)
    if (path.match(compiledRegex)) {
      try {
        const payload: JWTPayload = await verifyJWT(token)
        const role: string = payload.role as string
        if (!item.access.includes(role)) {
          if (role === 'student') {
            return NextResponse.redirect(new URL(item.redirect[role], request.url))
          } else if (role === 'tutor') {
            return NextResponse.redirect(new URL(item.redirect[role], request.url))
          } else {
            return NextResponse.redirect(new URL(item.redirect["admin"], request.url))
          }
        }
      } catch (error) {
        console.log("no token provided")
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*Login|Mainpage-prisci).*)'],
}