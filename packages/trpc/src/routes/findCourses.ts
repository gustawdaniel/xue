import { protectedProcedure } from "../trpc";
import { prisma } from "../storage/prisma";
import { courses, sets } from "database";

export const findCourses = protectedProcedure
  .query(async ({ ctx }): Promise<Array<courses & { source_set: sets }>> => {
    return prisma.courses.findMany({
      where: { user_id: ctx.user_id }, include: {
        source_set: true
      }
    });
  });
