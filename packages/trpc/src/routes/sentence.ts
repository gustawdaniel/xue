import { protectedProcedure } from "../trpc";
import { z } from "zod";
import { GPT3, GptSimpleResponse } from "gpt3-api";
import { CacheService } from "cache-service";

export const sentence = protectedProcedure
  .input(z.object({
    messages: z.array(z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string()
    }))
  }))
  .query(async ({ input, ctx }): Promise<GptSimpleResponse> => {
    const cacheService = new CacheService();

    const gpt = new GPT3({
      apiKey: ctx.env.OPENAI_API_KEY,
      cacheService
    });

    return gpt.ask(input.messages);
  });

