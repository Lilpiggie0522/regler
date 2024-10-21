import { SignJWT, jwtVerify} from 'jose'

const secret = new TextEncoder().encode('shhhhh, piggie is coming!')
export async function signJWT(id: string, userGroup: string) {
    const alg = 'HS256'
    const token = await new SignJWT({ id: id, role: userGroup })
    .setProtectedHeader({alg})
    .setExpirationTime('2h')
    .sign(secret)
    return token
}

export async function verifyJWT(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) {
        throw error;
    }
}