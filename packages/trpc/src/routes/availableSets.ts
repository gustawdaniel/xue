import { protectedProcedure } from "../trpc";
import { prisma } from "../storage/prisma";

export const availableSets = protectedProcedure.query(() => {
  return prisma.sets.findMany({})
})
