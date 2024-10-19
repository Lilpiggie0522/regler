import jwt from 'jsonwebtoken'

export function signJWT(zid: string, userGroup: string) {
    const token = jwt.sign({
        data: {
            zid: 'piggie',
            userGroup: 'staff',
            teamId: '1'
        },
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2)
    }, 'shhhhh')
    console.log(token)
}