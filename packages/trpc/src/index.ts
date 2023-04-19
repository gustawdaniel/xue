import { publicProcedure, router } from "./trpc";
import { prisma } from "./storage/prisma";
import { z } from "zod";
import {OAuth2Client} from 'google-auth-library';
import { tokenizeUser } from "./auth";

const envVariables = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  JWT_SECRET_KEY: z.string()
})

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}

export const appRouter = router({
  userList: publicProcedure
    .query(async () => {
      const users = await prisma.users.findMany();
      console.log("users", users);
      return users;
    }),

  googleVerify: publicProcedure
    .input(z.object({ credential: z.string() }))
    .mutation(async ({ input: { credential } }) => {
        console.log("credential", credential);
        const client = new OAuth2Client({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET
        });
        console.log("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        console.log("payload", payload);
        if (!payload) throw new Error(`No payload`);
        console.log("payload.email", payload.email);
        if (!payload.email) throw new Error(`User without email`);

        let user = await prisma.users.findUnique({
          where: {
            email: payload.email
          }
        });

        if (!user) {
          user = await prisma.users.create({
            data: {
              email: payload.email,
              avatar: payload.picture ?? `https://ui-avatars.com/api/?name=${payload.name}`,
              name: payload.name ?? "",
            }
          });
        }

        return {
          user: {
            id: user.id,
            email: user.email,
            avatar: user.avatar,
            name: user.name,
            roles: user.roles
          },
          token: tokenizeUser(user)
        };

    })
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
