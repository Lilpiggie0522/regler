
import { NextResponse } from "next/server";
import { imagekit } from "./imagekit";



 
export async function GET() {
    const result = imagekit.getAuthenticationParameters();
    return NextResponse.json(result, {status: 200});
}

