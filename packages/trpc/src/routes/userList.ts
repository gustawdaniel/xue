import { publicProcedure } from "../trpc";
import { prisma } from "../storage/prisma";

export const userList = publicProcedure
  .query(async () => {
    const users = await prisma.users.findMany();
    console.log("users", users);
    return users;
  });
