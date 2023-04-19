import { publicProcedure, router } from "./trpc";
import { prisma } from "./storage/prisma";

export const appRouter = router({
  userList: publicProcedure
    .query(async () => {
      const users = await prisma.users.findMany();
      console.log("users", users);
      return users;
    })
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
