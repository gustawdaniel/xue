import { protectedProcedure } from "../trpc";
import { prisma } from "../storage/prisma";
import { TRPCError } from "@trpc/server";
import { courses, sets } from "database";

export const defaultCourse = protectedProcedure
  .query(async ({ ctx }): Promise<(courses & {source_set: sets}) | null> => {
    const user = await prisma.users.findUnique({
      where: {
        id: ctx.user_id
      }
    });
    if (!user) throw new TRPCError({ code: "FORBIDDEN", message: "no logged it" });

    if (!user.default_course_id) return null;

    return await prisma.courses.findUnique({
      where: { id: user.default_course_id }, include: {
        source_set: true
      }
    });
  });
