import { SignJWT, jwtVerify} from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)
export async function signJWT(id: string, userGroup: string) {
  const alg = "HS256"
  const token = await new SignJWT({ id: id, role: userGroup })
    .setProtectedHeader({alg})
    .setExpirationTime("2h")
    .sign(secret)
  return token
}

export async function verifyJWT(token: string | undefined) {
  if (!token) {
    throw Error("no token")
  }
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    throw error
  }
}