import { publicProcedure } from "../trpc";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../storage/prisma";
import dayjs from "dayjs";
import { tokenizeUser } from "../auth";
import { z } from "zod";

export const googleVerify = publicProcedure
  .input(z.object({ credential: z.string() }))
  .mutation(async ({ input: { credential }, ctx }) => {
    // console.log("credential", credential);
    const client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: ctx.env.GOOGLE_CLIENT_SECRET,
    });
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // console.log("payload", payload);
    if (!payload) throw new Error(`No payload`);
    // console.log("payload.email", payload.email);
    if (!payload.email) throw new Error(`User without email`);

    let user = await prisma.users.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      user = await prisma.users.create({
        data: {
          email: payload.email,
          avatar:
            payload.picture ??
            `https://ui-avatars.com/api/?name=${payload.name}`,
          name: payload.name ?? "",
          last_login_at: dayjs().toDate(),
        },
      });
    } else {
      user = await prisma.users.update({
        where: {
          id: user.id,
        },
        data: {
          last_login_at: dayjs().toDate(),
        },
      });
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        name: user.name,
        roles: user.roles,
        default_course_id: user.default_course_id
      },
      token: tokenizeUser(user),
    };
  });
