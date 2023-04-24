import { CacheService } from "../src";

it("no wrap", async () => {
  expect(await CacheService.noWrap(async () => 1, {}, [])).toEqual(1);
});
