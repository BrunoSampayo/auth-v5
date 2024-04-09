import NextAuth from 'next-auth'
import authConfig from './auth.config'
import { UserRole } from '@prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/prisma'
import { getUserById } from '@/data/user'
import 'next-auth/jwt'
import { getAccountByUserId } from '@/data/account'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image: string
      role: UserRole
      isOAuth: boolean
    }
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    image?: string | null
    isOAuth: boolean
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: { emailVerified: new Date() },
      })
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true
      const existingUser = await getUserById(user.id!)

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false

      return true
    },
    async session({ token, session }) {
      if (token.sub && session.user) session.user.id = token.sub
      if (token.role && session.user) session.user.role = token.role
      if (token.image && session.user) session.user.image = token.image
      if (token.email && session.user) session.user.email = token.email
      if (token.name && session.user) session.user.name = token.name
      if (session.user) session.user.isOAuth = token.isOAuth
      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token
      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)

      token.isOAuth = !!existingAccount
      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role
      token.image = existingUser.image
      return token
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },

  ...authConfig,
})
