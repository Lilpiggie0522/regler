import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJWT } from "./util/jwt"
import { JWTPayload } from "jose"
// This function can be marked `async` if using `await` inside
const PROTECTED_ROUTES = [
  {
    pathRegex: "/lecturer.*",
    access: ["admin"],
    redirect: { tutor: "/staffCourseList", student: "/studentDetailConfirm", admin: "/" }
  },
  {
    pathRegex: "/teamEvaluationForm",
    access: ["student"],
    redirect: { tutor: "/staffCourseList", admin: "/staffCourseList", student: "/" }
  },
  {
    pathRegex: "/staffCourseList",
    access: ["admin", "tutor"],
    redirect: { tutor: "/", admin: "/", student: "/studentDetailConfirm" }
  },
  {
    pathRegex: "/staffGroupList",
    access: ["admin", "tutor"],
    redirect: { tutor: "/", admin: "/", student: "/studentDetailConfirm" }
  },
  {
    pathRegex: "/studentDetailConfirm",
    access: ["student"],
    redirect: { tutor: "/staffCourseList", admin: "/staffCourseList", student: "/" }
  },
  {
    pathRegex: "/unifiedInfo",
    access: ["admin", "tutor"],
    redirect: { tutor: "/", admin: "/", student: "/studentDetailConfirm" }
  },
]

const allowedRequest: NextResponse<unknown> = NextResponse.next()
const declinedRequest: NextResponse<unknown> = NextResponse.json("Not authorised to access", { status: 401 })

const PROTECTED_APIs = [
  {
    pathRegex: "/api/adminSystem/courses/.*",
    access: ["admin", "tutor"]
  },
  {
    pathRegex: "/api/adminSystem/initialise",
    access: ["admin", "tutor"]
  },
  {
    pathRegex: "/api/issueSystem/getIssueInfo",
    access: ["student", "admin", "tutor"]
  },
  {
    pathRegex: "/api/issueSystem/createIssue",
    access: ["student"]
  },
  {
    pathRegex: "/api/staff/readCsv",
    access: ["admin"]
  },
  {
    pathRegex: "/api/staff/.*",
    access: ["admin", "tutor"]
  },
  {
    pathRegex: "/api/tutorOpinions/.*",
    access: ["admin", "tutor"]
  },
  {
    pathRegex: "/api/util/.*",
    access: ["admin", "tutor", "student"]
  }
]

export async function middleware(request: NextRequest): Promise<NextResponse> {

  const token = request.cookies.get("token")?.value
  const path = request.nextUrl.pathname

  if (path.includes("/teamEvaluationForm/update")) {
    return allowedRequest  // Allow access without authentication
  }
  for (const api of PROTECTED_APIs) {
    const compiledRegex = new RegExp(api.pathRegex)
    if (path.match(compiledRegex)) {
      try {
        const payload: JWTPayload = await verifyJWT(token)
        const role: string = payload.role as string
        if (!api.access.includes(role)) {
          return declinedRequest
        }
      } catch {
        return declinedRequest
      }
      return allowedRequest
    }
  }

  for (const route of PROTECTED_ROUTES) {
    const compiledRegex = new RegExp(route.pathRegex)
    if (path.match(compiledRegex)) {
      try {
        const payload: JWTPayload = await verifyJWT(token)
        const role: string = payload.role as string
        if (!route.access.includes(role)) {
          if (role === "student") {
            return NextResponse.redirect(new URL(route.redirect[role], request.url))
          } else if (role === "tutor") {
            return NextResponse.redirect(new URL(route.redirect[role], request.url))
          } else {
            return NextResponse.redirect(new URL(route.redirect["admin"], request.url))
          }
        }
      } catch {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
  }
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*Login|Mainpage-prisci).*)"],
}