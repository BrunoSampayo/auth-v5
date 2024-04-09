'use server'

import { signOut } from '@/services/auth'

export const logout = async () => {
  await signOut()
}
