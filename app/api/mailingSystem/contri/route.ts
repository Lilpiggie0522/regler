import { NextResponse } from "next/server"
import { gitContribution } from "@/lib/gitContribution"

/*
    Input: 
        - owner: Owner of project
        - repo: Repo name
    Output: 
        Return contributor lists
*/
export async function GET() {
  const owner = "ruiqidiaodrq"
  const repo = "TEST3900"
    
  try {
    const contributorList = await gitContribution(owner, repo)
    if (!contributorList) {
      return NextResponse.json({ error: "Error" }, { status: 500 })
    }
    console.log(contributorList)

    return NextResponse.json({ message: "Completed" }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: `${error.message}` }, { status: 500 })
    }
  }
}