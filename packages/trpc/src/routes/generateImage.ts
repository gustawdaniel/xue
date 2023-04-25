import { protectedProcedure } from "../trpc";
import { z } from "zod";
import Replicate, { WebhookEventType } from "replicate";
import { CacheService } from "cache-service";
import assert from "assert/strict";

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

    const cacheService = new CacheService();

    const model = "ai-forever/kandinsky-2:601eea49d49003e6ea75a11527209c4f510a93e2112c969d548fbb45b9c4f19f";
    const options: ReplicateOptions = {
      input: {
        prompt: input.prompt
      }
    };

    return cacheService.wrap<string>(async () => {

      const replicate = new Replicate({
        auth: ctx.env.REPLICATE_API_TOKEN
      });

      // https://replicate.com/ai-forever/kandinsky-2/api

      const [image] = await replicate.run(
        model,
        options
      ) as [string];

      console.log("image", image);

      assert.ok(Boolean(image))
      assert.ok(image.startsWith('https://'))

      return image;
    }, { type: "image", model, options, provider: "replicate" }, ["replicate"]);

  });
