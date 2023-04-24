import jwt from "jsonwebtoken";
import { JWTUser } from "./auth";

const jwtKey = process.env.JWT_SECRET_KEY;
export const getUser = (token?: string): JWTUser | undefined => {
  if (!token) {
    return undefined;
  } else {
    token = token.replace(/^Bearer\s+/, "");
    try {
      return jwt.verify(token, jwtKey) as unknown as JWTUser;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }
};
