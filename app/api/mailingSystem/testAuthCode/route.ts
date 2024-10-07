import { NextResponse } from 'next/server';

export async function POST() {
    // Sample input
    // Request studentName (optional?), email and authCode
    const input = {
        studentName: 'Cow Horse',
        email: 'cowhorse3900@outlook.com',
        authCode: '114514'
    }
    try {  
        const response = await fetch('http://localhost:3000/api/mailingSystem/sendAuthCode', {method: 'POST', body: JSON.stringify(input)})
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
