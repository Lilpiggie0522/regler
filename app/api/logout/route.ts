import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const res: NextResponse = NextResponse.json({message: "Logout Successful"}, {status: 200})
    res.cookies.set("token", "", {expires: Date.now(), httpOnly: true})
    return res;
}