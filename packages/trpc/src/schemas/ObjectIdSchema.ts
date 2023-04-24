import { z } from "zod";

export const ObjectIdSchema = z.string().refine((value) => {
  // A valid MongoDB ObjectID is a 24-character hex string
  const hexRegExp = /^[0-9a-fA-F]{24}$/;
  return hexRegExp.test(value);
}, "Invalid MongoDB ObjectID");
