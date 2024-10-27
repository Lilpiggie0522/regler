import { middleware } from "@/middleware";
import { NextRequest, NextResponse } from "next/server";
import { signJWT } from "@/util/jwt";

describe("Tests for user access control on pages", () => {
    it("should redirect to main page, since there is no token", async () => {
        const req = new NextRequest("http://localhost:3000/lecturer")
        const res = await middleware(req)
        expect(res.status).toBe(307)
        const redirectedUrl = res.headers.get('location')
        expect(redirectedUrl).toEqual("http://localhost:3000/")
    })

    it("should not redirect, lecturer role with valid token has access to lecturer page", async () => {
        const token = await signJWT('piggie337', 'admin')
        const req = new NextRequest("http://localhost:3000/lecturer", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(200)
    })

    it("should redirect, tutor role with valid token has no access to lecturer page", async () => {
        const token = await signJWT('piggie337', 'tutor')
        const req = new NextRequest("http://localhost:3000/lecturer", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(307)
        const redirectedUrl = res.headers.get('location')
        expect(redirectedUrl).toEqual("http://localhost:3000/staffCourseList")
    })

    it("should redirect, student role with valid token has no access to lecturer page", async () => {
        const token = await signJWT('piggie337', 'student')
        const req = new NextRequest("http://localhost:3000/lecturer", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(307)
        const redirectedUrl = res.headers.get('location')
        expect(redirectedUrl).toEqual("http://localhost:3000/studentDetailConfirm")
    })

    it("should redirect to main page, since there is no token", async () => {
        const req = new NextRequest("http://localhost:3000/teamEvaluationForm")
        const res = await middleware(req)
        expect(res.status).toBe(307)
        const redirectedUrl = res.headers.get('location')
        expect(redirectedUrl).toEqual("http://localhost:3000/")
    })

    it("should not redirect, student role with valid token has access to evaluationForm page", async () => {
        const token = await signJWT('piggie337', 'student')
        const req = new NextRequest("http://localhost:3000/teamEvaluationForm", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(200)
    })

    it("should redirect, admin role with valid token has no access to evaluationForm page", async () => {
        const token = await signJWT('piggie337', 'admin')
        const req = new NextRequest("http://localhost:3000/teamEvaluationForm", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(307)
        const redirectedUrl = res.headers.get('location')
        expect(redirectedUrl).toEqual("http://localhost:3000/staffCourseList")
    })

    it("should redirect, tutor role with valid token has no access to evaluationForm page", async () => {
        const token = await signJWT('piggie337', 'tutor')
        const req = new NextRequest("http://localhost:3000/teamEvaluationForm", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(307)
        const redirectedUrl = res.headers.get('location')
        expect(redirectedUrl).toEqual("http://localhost:3000/staffCourseList")
    })

    it("should redirect to main page, since there is no token", async () => {
        const req = new NextRequest("http://localhost:3000/staffCourseList")
        const res = await middleware(req)
        expect(res.status).toBe(307)
        const redirectedUrl = res.headers.get('location')
        expect(redirectedUrl).toEqual("http://localhost:3000/")
    })

    it("should not redirect, admin role with valid token has access to staffCourseList page", async () => {
        const token = await signJWT('piggie337', 'admin')
        const req = new NextRequest("http://localhost:3000/staffCourseList", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(200)
    })

    it("should not redirect, tutor role with valid token has access to staffCourseList page", async () => {
        const token = await signJWT('piggie337', 'tutor')
        const req = new NextRequest("http://localhost:3000/staffCourseList", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(200)
    })

    it("should redirect, student role with valid token has no access to staffCourseList page", async () => {
        const token = await signJWT('piggie337', 'student')
        const req = new NextRequest("http://localhost:3000/staffCourseList", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(307)
        const redirectedUrl = res.headers.get('location')
        expect(redirectedUrl).toEqual("http://localhost:3000/studentDetailConfirm")
    })

    it("should redirect to main page, since there is no token", async () => {
        const req = new NextRequest("http://localhost:3000/studentDetailConfirm")
        const res = await middleware(req)
        expect(res.status).toBe(307)
        const redirectedUrl = res.headers.get('location')
        expect(redirectedUrl).toEqual("http://localhost:3000/")
    })

    it("should not redirect, student role with valid token has access to studentDetailConfirm page", async () => {
        const token = await signJWT('piggie337', 'student')
        const req = new NextRequest("http://localhost:3000/studentDetailConfirm", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(200)
    })

    it("should redirect, admin role with valid token has no access to studentDetailConfirm page", async () => {
        const token = await signJWT('piggie337', 'admin')
        const req = new NextRequest("http://localhost:3000/studentDetailConfirm", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(307)
        const redirectedUrl = res.headers.get('location')
        expect(redirectedUrl).toEqual("http://localhost:3000/staffCourseList")
    })

    it("should redirect, tutor role with valid token has no access to studentDetailConfirm page", async () => {
        const token = await signJWT('piggie337', 'tutor')
        const req = new NextRequest("http://localhost:3000/studentDetailConfirm", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(307)
        const redirectedUrl = res.headers.get('location')
        expect(redirectedUrl).toEqual("http://localhost:3000/staffCourseList")
    })
})

describe("Tests for user access contorl on api end points", () => {
    it("should return 401 code, since no token", async () => {
        const req = new NextRequest("http://localhost:3000/api/adminSystem/courses/3")
        const res = await middleware(req)
        expect(res.status).toBe(401)
    })

    it("should return 200 code, admin has access to /api/adminSystem/courses/3", async () => {
        const token = await signJWT('piggie337', 'admin')
        const req = new NextRequest("http://localhost:3000/api/adminSystem/courses/3", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(200)
    })

    it("should return 200 code, tutor has access to /api/adminSystem/courses/3", async () => {
        const token = await signJWT('piggie337', 'tutor')
        const req = new NextRequest("http://localhost:3000/api/adminSystem/courses/3", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(200)
    })

    it("should not return 200 code, but return a 401 code, student has no access to /api/adminSystem/courses/3", async () => {
        const token = await signJWT('piggie337', 'student')
        const req = new NextRequest("http://localhost:3000/api/adminSystem/courses/3", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(401)
    })

    it("should return 401 code, since no token", async () => {
        const req = new NextRequest("http://localhost:3000/api/adminSystem/initialise")
        const res = await middleware(req)
        expect(res.status).toBe(401)
    })
    
    it("should return 200 code, admin has access to /api/adminSystem/initialise", async () => {
        const token = await signJWT('piggie337', 'admin')
        const req = new NextRequest("http://localhost:3000/api/adminSystem/initialise", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(200)
    })

    it("should not return 200 code, but return a 401 code, tutor has no access to /api/adminSystem/adminSystem/initialise", async () => {
        const token = await signJWT('piggie337', 'tutor')
        const req = new NextRequest("http://localhost:3000/api/adminSystem/initialise", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(401)
    })

    it("should not return 200 code, but return a 401 code, student has no access to /api/adminSystem/adminSystem/initialise", async () => {
        const token = await signJWT('piggie337', 'student')
        const req = new NextRequest("http://localhost:3000/api/adminSystem/initialise", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(401)
    })

    it("should return 401 code, since no token", async () => {
        const req = new NextRequest("http://localhost:3000/api/issueSystem/createIssue")
        const res = await middleware(req)
        expect(res.status).toBe(401)
    })

    it("should return 200 code, student has access to /api/issueSystem/createIssue", async () => {
        const token = await signJWT('piggie337', 'student')
        const req = new NextRequest("http://localhost:3000/api/issueSystem/createIssue", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(200)
    })

    it("should not return 200 code, but return a 401 code admin has no access to /api/issueSystem/createIssue", async () => {
        const token = await signJWT('piggie337', 'admin')
        const req = new NextRequest("http://localhost:3000/api/issueSystem/createIssue", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(401)
    })

    it("should not return 200 code, but return a 401 code tutor has no access to /api/issueSystem/createIssue", async () => {
        const token = await signJWT('piggie337', 'tutor')
        const req = new NextRequest("http://localhost:3000/api/issueSystem/createIssue", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(401)
    })

    it("should return 401 code, since no token", async () => {
        const req = new NextRequest("http://localhost:3000/api/issueSystem/updateIssue")
        const res = await middleware(req)
        expect(res.status).toBe(401)
    })

    it("should return 200 code, student has access to /api/issueSystem/updateIssue", async () => {
        const token = await signJWT('piggie337', 'student')
        const req = new NextRequest("http://localhost:3000/api/issueSystem/updateIssue", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(200)
    })

    it("should not return 200 code, but return a 401 code admin has no access to /api/issueSystem/updateIssue", async () => {
        const token = await signJWT('piggie337', 'admin')
        const req = new NextRequest("http://localhost:3000/api/issueSystem/updateIssue", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(401)
    })

    it("should not return 200 code, but return a 401 code tutor has no access to /api/issueSystem/updateIssue", async () => {
        const token = await signJWT('piggie337', 'tutor')
        const req = new NextRequest("http://localhost:3000/api/issueSystem/updateIssue", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(401)
    })

    it("should return 401 code, since no token", async () => {
        const req = new NextRequest("http://localhost:3000/api/staff/readCsv")
        const res = await middleware(req)
        expect(res.status).toBe(401)
    })

    it("should return 200 code, admin has access to /api/staff/readCsv", async () => {
        const token = await signJWT('piggie337', 'admin')
        const req = new NextRequest("http://localhost:3000/api/staff/readCsv", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(200)
    })

    it("should not return 200 code, but return a 401 code, tutor has no access to /api/staff/readCsv", async () => {
        const token = await signJWT('piggie337', 'tutor')
        const req = new NextRequest("http://localhost:3000/api/staff/readCsv", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(401)
    })

    it("should not return 200 code, but return a 401 code, student has no access to /api/staff/readCsv", async () => {
        const token = await signJWT('piggie337', 'student')
        const req = new NextRequest("http://localhost:3000/api/staff/readCsv", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(401)
    })

    it("should return 401 code, since no token", async () => {
        const req = new NextRequest("http://localhost:3000/api/util/getTeamById/3")
        const res = await middleware(req)
        expect(res.status).toBe(401)
    })

    it("should return 200 code, admin has access to /api/util/.*", async () => {
        const token = await signJWT('piggie337', 'admin')
        const req = new NextRequest("http://localhost:3000/api/util/getTeamById/3", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(200)
    })

    it("should return 200 code, tutor has access to /api/util/.*", async () => {
        const token = await signJWT('piggie337', 'tutor')
        const req = new NextRequest("http://localhost:3000/api/util/getTeamById/3", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(200)
    })

    it("should not return 200 code, but a 401 code, student has no access to /api/util/.*", async () => {
        const token = await signJWT('piggie337', 'student')
        const req = new NextRequest("http://localhost:3000/api/util/getTeamById/3", {
            headers: {
                cookie: `token=${token}; HttpOnly; Path=/`
            }
        })
        const res = await middleware(req)
        expect(res.status).toBe(401)
    })
})