import { prisma } from "./storage/prisma";
import { Prisma } from "database";
import hash from "object-hash";

export interface RequestOptions {
  url: string;
  method: "GET" | "POST";
  body?: object | string;
  headers?: Record<string, string>;
}

export class CacheService {
  static httpToKey(options: RequestOptions): string {
    return hash(options);
  }

  static async noWrap<T extends Prisma.InputJsonValue>(
    handler: () => Promise<T>,
    meta: Record<string, string>,
    tags: string[]
  ): Promise<T> {
    return handler();
  }

  async wrap<T extends Prisma.InputJsonValue>(
    handler: () => Promise<T>,
    meta: Prisma.InputJsonValue,
    tags: string[]
  ): Promise<T> {
    const key: string = hash(meta);
    let value = await this.get<T>(key);
    if (value) {
      console.log("cache USED", meta)
      return value;
    }
    value = await handler();
    await this.set(key, value, meta, tags);
    console.log("cache SAVED", meta)
    return value;
  }

  async set<T extends Prisma.InputJsonValue>(
    key: string,
    value: T,
    meta: Prisma.InputJsonValue,
    tags: string[]
  ): Promise<void> {
    await prisma.caches.create({
      data: {
        key,
        value,
        meta,
        tags,
      },
    });
  }

  async get<T extends Prisma.InputJsonValue>(key: string): Promise<T | null> {
    const record = await prisma.caches.findUnique({
      where: {
        key,
      },
    });

    return record ? (record.value as T) : null;
  }
}
