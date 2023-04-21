import { appRouter } from "../src";
import packageJson from '../package.json'

it("i can read version", async () => {
  const version = await appRouter.createCaller({
    user_id: "",
    auth: false,
    user: undefined
  }).version();

  expect(version).toBeDefined()
  expect(version.version).toStrictEqual(packageJson.version)
});
