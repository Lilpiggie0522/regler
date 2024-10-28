export interface ImageKitAuth {

    token: string;
    expire: string;
    signature: string;
    
  }
// required parameter to fetch images
export const urlEndpoint : string = 'https://ik.imagekit.io/8rwehsppf/KZ';

// optional parameters (needed for client-side upload)
export const publicKey : string = 'public_9RihJvmeroH9Gc8zBNZRFHhPMbA='; 
export const authenticator =  async () => {
    try {
        const response = await fetch('http://localhost:3000/api/util/imagekit');

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json() as ImageKitAuth;
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        console.log(error);
        throw error;
    }
};
