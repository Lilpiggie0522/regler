import dbConnect from '@/lib/dbConnect';
import csvParser from "csv-parser";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

type rawResult = {
    email: string;
    group_id: string;
    group_id2: string;
    mentor: string;
    class: string;
    groupname: string;
    zid: string;
    name: string;
}

interface csvType {
    name: string,
    zid: number,
    groupname: string,
    class: string,
    mentor: string,
    group_id: number,
    group_id2: number,
    email: string
}

export async function POST(req: NextRequest) {
    await dbConnect()
    console.log("request received")
    const formData = await req.formData()
    const file = formData.get('csv') as File
    if (!file) {
        return NextResponse.json({ message: 'No file found!' }, { status: 409 })
    }
    const filename: string = file.name
    console.log(`name is ${filename}`)
    const courseRegex = /COMP[0-9]{4}/
    const course = filename.match(courseRegex)?.[0]
    if (!course) {
        console.log("wrong name")
        return NextResponse.json({ message: 'Please include course name in title' }, { status: 406 })
    }
    const arrayBuffer = await file.arrayBuffer()
    const buffer: Buffer = Buffer.from(arrayBuffer)
    const csvStream = Readable.from(buffer)
    const results: rawResult[] = await parseCSV(csvStream)
    // console.log("parsed result is following:")
    // console.log(results)
    const converted: rawResult[] = results.map(row => {
        const lowerCaseRow = Object.fromEntries(
            Object.entries(row).map(([key, value]) => [key.toLowerCase().replace(/\s+/g, ''), value])
        ) as rawResult
        return lowerCaseRow
    })
    // console.log("converted result is following:")
    // console.log(converted)
    const validResults: rawResult[] = converted.filter(row =>
        row.name && row.zid && row.groupname && row.class
        && row.mentor && row.group_id && row.group_id2
        && row.email
    )
    console.log("valid results are: ")
    console.log(validResults)

    
    return NextResponse.json(results, { status: 200 })
}

function parseCSV(stream: Readable): Promise<rawResult[]> {
    const results: any = []
    return new Promise((resolve, reject) => {
        stream.pipe(csvParser())
            .on('data', (row) => {
                results.push(row)
            })
            .on('end', () => resolve(results))
            .on('error', (err) => reject(err))
    })
}