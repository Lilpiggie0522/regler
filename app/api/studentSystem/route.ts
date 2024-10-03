import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Student from "@/models/studentModel";

export async function GET() {
    await dbConnect();
    const students = await Student.find({}).exec();
    return NextResponse.json({ students });
}