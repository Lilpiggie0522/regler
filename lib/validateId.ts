import mongoose from "mongoose"
import { NextResponse } from "next/server";
export const validateId = async (id: string, collectionName: string): Promise<NextResponse | null> => {
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ error: `Invalid ${collectionName} ID` }, { status: 400 });
    }
    try {
        const model = await mongoose.models[collectionName].findById(id);
        if (!model) {
            return NextResponse.json({ error: `${collectionName} not found` }, { status: 404 });
        }
        return null; // Valid ID, no issues found
    } catch (error) {
        console.error(`Error validating ID in collection ${collectionName}:`, error);
        return NextResponse.json({ error: `Error validating ${collectionName} ID` }, { status: 500 });
    }
};