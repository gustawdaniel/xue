import { protectedProcedure } from "../trpc";
import { z } from "zod";
import { ObjectIdSchema } from "../schemas/ObjectIdSchema";
import { prisma } from "../storage/prisma";

export const selectDefaultCourse = protectedProcedure
  .input(z.object({
    id: ObjectIdSchema
  }))
  .mutation(async ({input, ctx}) => {
    await prisma.users.update({
      where: {id: ctx.user_id},
      data: {default_course_id: input.id}
    });
    return undefined;
  })
