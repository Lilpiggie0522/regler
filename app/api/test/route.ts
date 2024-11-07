import { NextRequest, NextResponse } from 'next/server';

// Mock data for assignments
let assignments = ['assignment1', 'assignment2'];

// Mock GET method
export async function GET(request: NextRequest) {
    // Simulate fetching assignments
    return NextResponse.json({ assignments }, { status: 200 });
}

// Mock PUT method
export async function PUT(request: NextRequest) {
    try {
        const { assignments: updatedAssignments } = await request.json(); // Get the assignments from the request body

        // Update the assignments with the new assignments
        assignments = updatedAssignments;

        return NextResponse.json({ message: 'Assignments updated successfully!', assignments }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update assignments.' }, { status: 500 });
    }
}
