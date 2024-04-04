'use server'

import prisma from '@/lib/prisma'
import { getUserByEmail } from '@/data/user'
import { getResetPasswordTokenByToken } from '@/data/password-reset-token'
import { z } from 'zod'
import { NewPasswordSchema } from '@/schemas'
import bcrypt from 'bcryptjs'
export const newPassword = async (
  token: string,
  values: z.infer<typeof NewPasswordSchema>,
) => {
  const valideteData = NewPasswordSchema.safeParse(values)
  if (!valideteData.success) return { error: 'Invalid fields' }

  const existToken = await getResetPasswordTokenByToken(token)
  if (!existToken) return { error: 'Token does not exist!' }

  const hasExpired = new Date(existToken.expires) < new Date()
  if (hasExpired) return { error: 'Token has expired' }

  const existUser = await getUserByEmail(existToken.email)
  if (!existUser) return { error: 'Email does not exist!' }

  const hashPassword = await bcrypt.hash(valideteData.data.password, 10)
  await prisma.user.update({
    where: {
      id: existUser.id,
    },
    data: {
      password: hashPassword,
    },
  })
  await prisma.passwordResetToken.delete({
    where: { id: existToken.id },
  })
  return { success: 'Password updated!' }
}
