import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import { createUniqueAuthCode } from "@/lib/authCodeCreation"
import sendAuthCode from "@/lib/sendAuthCode"
import models from "@/models/models"

const {Admin} = models
export async function POST(request: NextRequest) {
  try {
    const {email}: {email: string}  = await request.json()
    await dbConnect()
    const admin = await Admin.findOne({email: email})
    if (!admin) {
      return NextResponse.json("Invalid Email", {status: 401})
    }
    const authCode = await createUniqueAuthCode(email)
    sendAuthCode(email, authCode, admin.role)
    // object id of staff and role
    return NextResponse.json({email: admin.email, role: admin.role, _id: admin._id}, {status: 200})
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error - Team Email:", error)
      return NextResponse.json({error: error.message}, {status: 502})
    }
  }
}
