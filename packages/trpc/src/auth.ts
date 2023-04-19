import { users } from "database";
import dayjs from "dayjs";
import jwt from 'jsonwebtoken'

const jwtKey = process.env.JWT_SECRET_KEY ?? 'test';
const issuer = `xue`;

export interface JWTUser {
  sub: string,
  email: string,
  iss: string,
  roles: users['roles'],
  exp: number
}

export function tokenizeUser(user: Pick<users, 'id' | 'email' | 'roles'>): string {
  const pl: JWTUser = {
    sub: user.id,
    email: user.email,
    iss: issuer,
    roles: user.roles,
    exp: dayjs().add(1, 'month').unix()
  };
  return jwt.sign(pl, jwtKey)
}
