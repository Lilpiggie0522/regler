import ImageKit from "imagekit";
export const imagekit = new ImageKit({
    urlEndpoint: "https://ik.imagekit.io/8rwehsppf/KZ",
    publicKey: "public_9RihJvmeroH9Gc8zBNZRFHhPMbA=",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
});