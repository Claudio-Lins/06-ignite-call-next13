import { Adapter } from "next-auth/adapters"
import { cookies } from "next/headers"

import prisma from "@/lib/prisma"

export function PrismaAdapter(): Adapter {
  return {
    async createSession({ expires, sessionToken, userId }) {
      const session = await prisma.session.create({
        data: {
          expires,
          session_token: sessionToken,
          user_id: userId,
        },
      })

      return {
        expires: session.expires,
        sessionToken: session.session_token,
        userId: session.user_id,
      }
    },

    async createUser(user) {
      const userIdOnCookies = cookies().get("@ignitecall:userId")?.value

      if (!userIdOnCookies) {
        throw new Error("User ID not found on cookies.")
      }

      const updatedUser = await prisma.user.update({
        data: {
          avatar_url: user.avatar_url,
          email: user.email,
          name: user.name,
        },
        where: { id: userIdOnCookies },
      })

      cookies().delete({
        name: "@ignitecall:userId",
        path: "/",
        value: "",
      })

      return {
        avatar_url: updatedUser.avatar_url!,
        email: updatedUser.email!,
        emailVerified: null,
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
      }
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: {
          session_token: sessionToken,
        },
      })
    },

    async getSessionAndUser(sessionToken) {
      const session = await prisma.session.findUnique({
        include: {
          user: true,
        },
        where: {
          session_token: sessionToken,
        },
      })

      if (!session) {
        return null
      }

      const { expires, session_token, user, user_id } = session

      return {
        session: {
          expires,
          sessionToken: session_token,
          userId: user_id,
        },
        user: {
          avatar_url: user.avatar_url!,
          email: user.email!,
          emailVerified: null,
          id: user.id,
          name: user.name,
          username: user.username,
        },
      }
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!user) {
        return null
      }

      return {
        avatar_url: user.avatar_url!,
        email: user.email!,
        emailVerified: null,
        id: user.id,
        name: user.name,
        username: user.username,
      }
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const account = await prisma.account.findUnique({
        include: {
          user: true,
        },
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
      })

      if (!account) {
        return null
      }

      const { user } = account

      return {
        avatar_url: user.avatar_url!,
        email: user.email!,
        emailVerified: null,
        id: user.id,
        name: user.name,
        username: user.username,
      }
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        return null
      }

      return {
        avatar_url: user.avatar_url!,
        email: user.email!,
        emailVerified: null,
        id: user.id,
        name: user.name,
        username: user.username,
      }
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          access_token: account.access_token,
          expires_at: account.expires_at,
          id_token: account.id_token,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          scope: account.scope,
          session_state: account.session_state,
          token_type: account.token_type,
          type: account.type,
          user_id: account.userId,
        },
      })
    },

    async updateSession({ expires, sessionToken, userId }) {
      const session = await prisma.session.update({
        data: {
          expires,
          user_id: userId,
        },
        where: {
          session_token: sessionToken,
        },
      })

      return {
        expires: session.expires,
        sessionToken: session.session_token,
        userId: session.user_id,
      }
    },

    async updateUser(user) {
      const updatedUser = await prisma.user.update({
        data: {
          avatar_url: user.avatar_url,
          email: user.email,
          name: user.name,
        },
        where: { id: user.id },
      })

      return {
        avatar_url: updatedUser.avatar_url!,
        email: updatedUser.email!,
        emailVerified: null,
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
      }
    },
  }
}
