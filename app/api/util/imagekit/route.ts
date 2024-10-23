import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
    urlEndpoint: 'https://ik.imagekit.io/8rwehsppf/KZ',
    publicKey: 'public_9RihJvmeroH9Gc8zBNZRFHhPMbA=',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  });
 
export async function GET(res : NextResponse) {
  const result = imagekit.getAuthenticationParameters();
  return NextResponse.json(result, {status: 200});
}
