'use server'

import bcrypt from 'bcrypt'
import * as z from 'zod'
import prisma from '@/lib/prisma'
import { RegisterSchema } from '@/schemas'
import { getUserByEmail } from '@/data/user'
import { generateVerificationToken } from '@/lib/tokens'
import { sendEmailVerificationToken } from '@/lib/mail'
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }
  const { email, password, name } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)
  const existingUser = await getUserByEmail(email)
  if (existingUser) return { error: 'Email already in use!' }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  const verificationToken = await generateVerificationToken(email)
  await sendEmailVerificationToken(
    verificationToken.email,
    verificationToken.token,
  )
  // TODO: send verification token email
  return { sucess: 'Confirmation email sent!' }
}
