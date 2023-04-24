import { protectedProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "../storage/prisma";
import { TRPCError } from "@trpc/server";
import { WordSelector } from "words-selector";
import dayjs from "dayjs";
import { supermemo, SuperMemoGrade, SuperMemoItem } from 'supermemo'
import {answers} from 'database';

export const createAnswer = protectedProcedure
  .input(z.object({
    word: z.string(),
    answer_text: z.string(),
    displayed_at: z.date()
  }))
  .mutation(async ({ input, ctx }): Promise<answers> => {

    const user = await prisma.users.findUnique({
      where: {
        id: ctx.user_id
      }
    });
    if (!user) throw new TRPCError({ code: "FORBIDDEN", message: "no logged it" });

    if (!user.default_course_id) throw new TRPCError({ code: "NOT_FOUND", message: "No default course for user" });

    let course = await prisma.courses.findUnique({
      where: { id: user.default_course_id }, include: {
        source_set: true
      }
    });

    if (!course) throw new TRPCError({ code: "FORBIDDEN", message: "no default course selected" });

    const from_lang = course.source_set.lang;
    const to_lang = course.target_lang;

    console.log({
        from_text: input.word,
        from_lang,
        to_lang
      })

    const translations = await prisma.translations.findMany({
      where: {
        from_text: input.word,
        from_lang,
        to_lang
      }
    });

// const word = await prisma.words.findUnique({
//   where: {
//     id: args.data.word.connect?.id,
//   },
// })

// if (!word) throw new Error(`Word with id ${args.data.word.connect?.id} not found.`)
// const { source, target, answer: answer_text } = args.data

    console.dir(translations)

    const is_correct = Boolean(translations.find((t) => t.to_text === input.answer_text)) ||
      Boolean(translations.find((t) => t.meanings.find(m => m.to_text === input.answer_text)));


    console.log("is_correct", is_correct);
// console.log('is_correct', is_correct, word, target, answer_text)

    // const where = {
    //   target: args.data.target,
    //   source: args.data.source,
    //   user_id: ctx.user?.id ?? ""
    // };

    const frequency = await prisma.frequencies.findUnique({
      where: {
        set_id_word: {
          set_id: course.source_set.id,
          word: input.word
        }
      }
    });

    if (!frequency) throw new TRPCError({
      code: "NOT_FOUND",
      message: `Frequency for word ${input.word} not found in set ${course.source_set.name}`
    });

// let course = await prisma.courses.findFirst({ where })

    const ws = new WordSelector({
      history_ranges: course ? course.history_ranges : []
    });

    ws.update_history_ranges(frequency.range);

// console.log('ws.history_ranges', ws.history_ranges)

    course = await prisma.courses.update({
      where: {
        id: course.id
      },
      data: {
        history_ranges: ws.history_ranges,
        iteration: course.iteration + 1
      },
      include: {
        source_set: true
      }
    });

    const answer = await prisma.answers.create({
      data: {
        user_id: ctx.user_id,
        answer: input.answer_text,
        displayed_at: input.displayed_at,
        word: input.word,
        answered_at: dayjs().toDate(),
        is_correct,
        word_range: frequency.range,
        from_lang,
        to_lang,
        iteration: course ? course.iteration : 0,
        course_id: course.id
      }
    });

// 1. find repetition
    const repetition = await prisma.repetitions.findFirst({
      where: {
        to_lang,
        from_lang,
        user_id: ctx.user_id,
        word: input.word
      },
      include: {
        answer: true
      }
    });
    if (repetition || !is_correct) {
      let superMemoItem: SuperMemoItem = {
        interval: repetition ? repetition.iteration - repetition.created_at_iteration : 1,
        repetition: repetition ? repetition.super_memo.repetition : 2,
        efactor: repetition ? repetition.super_memo.efactor : 2.5
      };
      superMemoItem = supermemo(superMemoItem, Math.round(5 * Number(is_correct)) as SuperMemoGrade);

      // not optimal code but solving problem now
      // todo test it influence on optimization in future, it can be awful
      // potentially dispatch to queue or other microservice in future
      let iteration = course.iteration + superMemoItem.interval;
      let existingRepetitionOnExpectedIteration;
      do {
        existingRepetitionOnExpectedIteration = await prisma.repetitions.findUnique({
          where: {
            user_id_course_id_iteration: {
              user_id: ctx.user_id,
              iteration,
              course_id: course.id
            }
          }
        });
        if (existingRepetitionOnExpectedIteration) {
          iteration++;
        }
      } while (existingRepetitionOnExpectedIteration);

      const repetitionCommonPayload = {
        answer: {
          connect: {
            id: answer.id
          }
        },
        word: input.word,
        user: {
          connect: {
            id: ctx.user_id
          }
        },
        course: {
          connect: {
            id: course.id
          }
        },
        from_lang,
        to_lang,
        created_at: dayjs().toDate(),
        created_at_iteration: course.iteration,
        iteration,
        super_memo: { set: superMemoItem }
      };

      if (repetition) {
        await prisma.repetitions.update({
          where: { id: repetition.id },
          data: {
            history: {
              push: {
                answered_at: dayjs().toDate(),
                created_at: repetition.created_at,
                prev_answer_id: repetition.answer_id,
                next_answer_id: answer.id,
                prev_correctness: Number(repetition.answer.is_correct),
                next_correctness: Number(is_correct),
                prev_iteration: repetition.created_at_iteration,
                next_iteration: repetition.iteration,
                super_memo: repetition.super_memo
              }
            },
            ...repetitionCommonPayload
          }
        });
      } else {
        await prisma.repetitions.create({
          data: {
            ...repetitionCommonPayload,
            history: {
              set: []
            }
          }
        });
      }
    }

    return answer;
  });
