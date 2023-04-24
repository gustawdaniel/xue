import { protectedProcedure } from "../trpc";
import { z } from "zod";
import { ObjectIdSchema } from "../schemas/ObjectIdSchema";
import { prisma } from "../storage/prisma";
import { TRPCError } from "@trpc/server";
import { WordSelector } from "words-selector";

export const findRandomWord = protectedProcedure
  .input(
    z.object({
      course_id: ObjectIdSchema,
      futureAnswers: z.array(z.number()).default([])
    })
  )
  .query(async ({ input, ctx }) => {
    const course = await prisma.courses.findFirst({
      where: {
        id: input.course_id
      }
    });

    if (!course)
      throw new TRPCError({
        message: `Course with given ID ${input.course_id} not found`,
        code: "BAD_REQUEST"
      });

    const checked_iteration = course.iteration + input.futureAnswers.length;

    console.log("checked_iteration", checked_iteration);

    if (checked_iteration) {
      const repetition = await prisma.repetitions.findUnique({
        where: {
          user_id_course_id_iteration: {
            user_id: ctx.user_id,
            iteration: checked_iteration,
            course_id: course.id
          }
        }
      });

      if (repetition) {
        return { new: false, word: repetition.word, iteration: checked_iteration };
      }
    }

    const answers = await prisma.answers.findMany({
      where: {
        course_id: input.course_id
      },
      select: {
        word_range: true,
        is_correct: true
      },
      orderBy: {
        answered_at: "asc"
      },
      take: 10
    });

    const r = answers.length ? answers[answers.length - 1].word_range : 0;

    const ws = new WordSelector({
      history_ranges: course ? course.history_ranges : [],
      r,
      rMax: 1000,
      pC: 0.5,
      answersCorrectness: answers.map((answer) => Number(answer.is_correct))
    });

    if (Array.isArray(input.futureAnswers)) {
      input.futureAnswers.forEach((answer) => {
        ws.getWord();
        ws.saveAnswer(answer);
      });
    }

    const range: number = ws.getWord();

    const wordOrNull = await prisma.frequencies.findFirst({
      where: {
        range: { equals: range },
        set_id: course.source_set_id
      }
    });

    if (!wordOrNull)
      throw new TRPCError({
        message: `No word found for range = ${range}`,
        code: "NOT_FOUND"
      });

    return {
      new: true,
      word: wordOrNull.word,
      iteration: checked_iteration ?? 0
    };
  });
