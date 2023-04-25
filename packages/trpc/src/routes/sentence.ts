import { protectedProcedure } from "../trpc";
import { z } from "zod";
import { GPT3, GptSimpleResponse } from "gpt3-api";
import { CacheService } from "cache-service";
import { RateLimiter } from "../services/RateLimiter";
import { TRPCError } from "@trpc/server";
import { writeInfluxLog } from "../storage/influx";

export const sentence = protectedProcedure
  .input(z.object({
    messages: z.array(z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string()
    }))
  }))
  .query(async ({ input, ctx }): Promise<GptSimpleResponse> => {
    if (await RateLimiter.isLimited(ctx.user_id, "sentence")) {
      throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
    }

    const cacheService = new CacheService();

    const gpt = new GPT3({
      apiKey: ctx.env.OPENAI_API_KEY,
      cacheService
    });

    const gptResponse = await gpt.ask(input.messages);

    if (cacheService.cacheMissed()) {
      await RateLimiter.setUsage(ctx.user_id, "sentence");
      writeInfluxLog(ctx.user_id, "sentence", cacheService.timeUsedNanoSeconds, ["openai"])
    }

    return gptResponse;
  });

