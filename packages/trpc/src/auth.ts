import { users } from "database";
import dayjs from "dayjs";
import jwt from 'jsonwebtoken'

const jwtKey = process.env.JWT_SECRET_KEY ?? 'test';
const issuer = `xue`;

export function tokenizeUser(user: Pick<users, 'id' | 'email' | 'roles'>): string {
  return jwt.sign({
    sub: user.id,
    email: user.email,
    iss: issuer,
    roles: user.roles,
    exp: dayjs().add(1, 'month').unix()
  }, jwtKey)
}
