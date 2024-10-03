import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        console.log("yes")
        const body = await req.json()
        console.log(body)
        return NextResponse.json({data: body}, {status: 200})
    }
}