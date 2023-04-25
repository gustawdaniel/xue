import { protectedProcedure } from "../trpc";
import { RateLimiter } from "../services/RateLimiter";

export const myLimit = protectedProcedure
  .query(({ ctx }): Promise<number> => {
    return RateLimiter.getLimit(ctx.user_id);
  });
