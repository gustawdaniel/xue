import { appRouter } from "../src";
import { prisma } from "../src/storage/prisma";
import assert from "assert";
import { tokenizeUser } from "../src/auth";
import { getUser } from "../src/getUser";

it("findRandomWord", async () => {
  const user = await prisma.users.findFirst({
    where: { email: "gustaw.daniel@gmail.com" },
  });

  expect(user).toBeDefined();
  assert.ok(user);

  const course = await prisma.courses.findFirst({
    where: {
      user_id: user.id,
    },
  });

  expect(course).toBeDefined();
  assert.ok(course);

  const word = await appRouter
    .createCaller({
      user_id: user.id,
      user: getUser(tokenizeUser(user)),
      auth: true,
      env: {}
    })
    .findRandomWord({ course_id: course.id });

  expect(word).toBeDefined();
  expect(word.new).toBeTruthy();
  expect(word.word).toBe("the");
});
