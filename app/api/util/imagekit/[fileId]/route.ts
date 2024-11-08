import { NextRequest, NextResponse } from "next/server";
import { imagekit } from "../imagekit";

type Params = {
    params: {
      fileId: string
    }
  }
async function deleteImageKitFile(fileId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
        imagekit.deleteFile(fileId, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}
export async function DELETE(req : NextRequest, { params } : Params) {
    try {
        const fileId = params.fileId;
        if (!fileId) {
            return NextResponse.json({ error: "File ID is required" }, { status: 400 });
        }
  
        const result = await deleteImageKitFile(fileId);
        console.log(result);
        return NextResponse.json({ message: "File deleted successfully", result }, { status: 200 });
  
    } catch (error) {
        console.error("Error deleting file:", error);
        return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }
}