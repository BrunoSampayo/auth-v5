import prisma from '@/lib/prisma'

export const getResetPasswordTokenByToken = async (token: string) => {
  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })
    return resetToken
  } catch {
    return null
  }
}

export const getResetPasswordTokenByEmail = async (email: string) => {
  try {
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { email },
    })
    return resetToken
  } catch {
    return null
  }
}
