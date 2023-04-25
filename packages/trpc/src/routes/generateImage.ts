import { protectedProcedure } from "../trpc";
import { z } from "zod";
import Replicate, { WebhookEventType } from "replicate";
import { CacheService } from "cache-service";
import assert from "assert/strict";
import { RateLimiter } from "../services/RateLimiter";
import { TRPCError } from "@trpc/server";
import { writeInfluxLog } from "../storage/influx";

type ReplicateOptions = {
  input: object;
  wait?: boolean | { interval?: number; maxAttempts?: number };
  webhook?: string;
  webhook_events_filter?: WebhookEventType[];
}

export const generateImage = protectedProcedure
  .input(z.object({
    prompt: z.string()
  }))
  .query(async ({ ctx, input }) => {
    if(await RateLimiter.isLimited(ctx.user_id, 'image')) {
      throw new TRPCError({code: 'TOO_MANY_REQUESTS'})
    }

    const cacheService = new CacheService();

    const model = "ai-forever/kandinsky-2:601eea49d49003e6ea75a11527209c4f510a93e2112c969d548fbb45b9c4f19f";
    const options: ReplicateOptions = {
      input: {
        prompt: input.prompt
      }
    };

    const image = await cacheService.wrap<string>(async () => {

      const replicate = new Replicate({
        auth: ctx.env.REPLICATE_API_TOKEN
      });

      // https://replicate.com/ai-forever/kandinsky-2/api

      const [image] = await replicate.run(
        model,
        options
      ) as [string];

      assert.ok(Boolean(image))
      assert.ok(image.startsWith('https://'))

      return image;
    }, { type: "image", model, options, provider: "replicate" }, ["replicate"]);

    if(cacheService.cacheMissed()) {
      await RateLimiter.setUsage(ctx.user_id, 'image')
      writeInfluxLog(ctx.user_id, "image", cacheService.timeUsedNanoSeconds, ["replicate"])
    }

    return image;
  });
