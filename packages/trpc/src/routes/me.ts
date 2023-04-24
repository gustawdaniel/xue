import { protectedProcedure } from "../trpc";
import { prisma } from "../storage/prisma";
import { TRPCError } from "@trpc/server";

export const me = protectedProcedure.query(async ({ ctx }) => {
  const user = await prisma.users.findUnique({ where: { id: ctx.user?.sub } });
  if (!user)
    throw new TRPCError({
      message: `User ${ctx.user?.sub} not fount`,
      code: "FORBIDDEN",
    });
  return user;
});
