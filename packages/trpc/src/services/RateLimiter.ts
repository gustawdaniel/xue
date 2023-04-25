import { redis } from "../storage/redis";

const multi = 60;
const defaultLimit = 1440 * multi; // 24 * 60 - number of minutes in day
const defaultPeriodSec = 24 * 60 * 60;

export type ActionType = 'sentence' | 'image' | 'translation';

const actionPrice: Map<ActionType, number> = new Map([
  ['translation', multi],
  ['sentence', 5 * multi],
  ['image', 10 * multi],
]);

export class RateLimiter {
  static key(userId: string): string {
    return `limit:${userId}`;
  }

  static async isLimited(userId: string, type: ActionType): Promise<boolean> {
    const price: number = actionPrice.get(type) ?? 0;

    if(!price) {
      console.log(`No price for action: ${type}`);
      return true;
    }

    const leftTokens = await RateLimiter.getLimit(userId);

    if (leftTokens >= price) {
      await redis.decrby(RateLimiter.key(userId), price / multi);
      return false; // not blocked
    }
    return true; // yes limited
  }

  static async setUsage(userId: string, type: ActionType) {
    const price: number = actionPrice.get(type) ?? 0;
    await redis.decrby(RateLimiter.key(userId), price);
  }

  static async getLimit(userId: string): Promise<number> {
    const key = RateLimiter.key(userId);
    const isNew = Boolean(await redis.setnx(key, defaultLimit)); // return 1 if is new, and 0 if exists
    if (isNew) {
      await redis.expire(key, defaultPeriodSec);
    }

    return  Number(await redis.get(key) ?? 0);
  }
}
