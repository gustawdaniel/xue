import { protectedProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "../storage/prisma";
import { Lang } from "database";
import { ObjectIdSchema } from "../schemas/ObjectIdSchema";
import { TRPCError } from "@trpc/server";

export const newCourse = protectedProcedure
  .input(z.object({
    target_lang: z.nativeEnum(Lang),
    source_set_id: ObjectIdSchema
  }))
  .mutation(async ({ input, ctx }) => {
    const existingCourse = await prisma.courses.findFirst({
      where: {
        target_lang: input.target_lang,
        source_set_id: input.source_set_id
      }
    });

    if (existingCourse) throw new TRPCError({ code: "CONFLICT", message: "Course already exists" });

    return await prisma.courses.create({
      data: {
        target_lang: input.target_lang,
        source_set_id: input.source_set_id,
        user_id: ctx.user_id,
        iteration: 0
      },
      include: {
        source_set: true
      }
    });
  });
