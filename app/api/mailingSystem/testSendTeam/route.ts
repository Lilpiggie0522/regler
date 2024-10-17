import { NextResponse } from 'next/server';

export async function POST() {
    // Sample input
    // Request studentName (optional?), email and authCode
    const input = {
        teamId: '6700eaee7ae942fe983415c8',
        courseId: '6701f96d84f93badca934c10',
        studentId: '670222deb7b79c45884600d7',
        issueId: '670799fbb7b79c4588c8177d',
    }
    try {  
        const response = await fetch('http://localhost:3000/api/mailingSystem/sendTeam', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', }, 
            body: JSON.stringify(input)})
        const result = await response.json();
        if (!response.ok) {
            throw new Error(`HTTP Status: ${response.status}`);
        }
        return NextResponse.json({data: result}, {status: response.status})
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({error: error.message}, {status: 502})
        }
    }
}
