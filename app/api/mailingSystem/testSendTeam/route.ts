import { NextResponse } from "next/server"

export async function POST() {
  // Sample input
  // const input = {
  //     teamId: '6700eaee7ae942fe983415c8',
  //     courseId: '67187e110571bd5e45bca1f4',
  //     studentId: '67187e120571bd5e45bca21f',
  //     issueId: '670799fbb7b79c4588c8177d',
  // }
  // 67187e130571bd5e45bca266
  const input = {
    teamId: "6721b7b36f957635b8f01964",
    courseId: "6719b68d2dc4deb099b5a99a",
    studentId: "67187e120571bd5e45bca225",
    issueId: "6721b89e6f957635b8f1caf5",
  }

  // sample input - general
  // const input = {
  //     teamId: '671b324f6f957635b88e6d86',
  //     courseId: '671b2e336f957635b8875eb4',
  //     studentId: '67187e120571bd5e45bca228',
  //     issueId: '671b30806f957635b88b49f8',
  // }

  try {  
    const response = await fetch("http://localhost:3000/api/mailingSystem/sendTeam", {
      method: "POST", 
      headers: { "Content-Type": "application/json", }, 
      body: JSON.stringify(input)})
    const result = await response.json()
    if (!response.ok) {
      throw new Error(`HTTP Status: ${response.status}`)
    }
    return NextResponse.json({data: result}, {status: response.status})
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({error: error.message}, {status: 502})
    }
  }
}
