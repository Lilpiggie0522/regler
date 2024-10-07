import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import models from "@/models/models";


const Student = models.Student;

export async function GET() {
    await dbConnect();
    const students = await Student.find({}).exec();
    return NextResponse.json({ students });
}