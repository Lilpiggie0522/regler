import { NextResponse } from "next/server"

export async function GET() {
  //await dbConnect();
  //const students = await Student.find({}).exec();
  return NextResponse.json({ msg : "ni hao" })
}