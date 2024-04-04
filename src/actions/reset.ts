'use server'
import { ResetPasswordSchema } from './../schemas/index'
import z from 'zod'
import { getUserByEmail } from '@/data/user'
import { generatePasswordResetToken } from '@/lib/tokens'
import { sendPasswordResetEmail } from '@/lib/mail'
export const reset = async (values: z.infer<typeof ResetPasswordSchema>) => {
  const validatedFields = ResetPasswordSchema.safeParse(values)

  if (!validatedFields.success) return { error: 'Invalid Email' }

  const { email } = validatedFields.data
  const existingUser = await getUserByEmail(email)

  if (!existingUser) return { error: 'Email not found' }

  const resetToken = await generatePasswordResetToken(email)
  await sendPasswordResetEmail(resetToken.email, resetToken.token)

  return { sucess: 'Reset email sent!' }
}
