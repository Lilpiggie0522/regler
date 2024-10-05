import { NextResponse } from 'next/server';

export async function POST() {
    const data = {
        studentName: 'Avgust Vila',
        email: 'z5361545@ad.unsw.edu.au',
        authCode: '114514'
    }
    try {  
        const response = await fetch('http://localhost:3000/api/mailingSystem/sendAuthCode', {method: 'POST', body: JSON.stringify(data)})
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
