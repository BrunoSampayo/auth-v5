import { useSession } from 'next-auth/react'

export const useCurrentUser = () => {
  const session = useSession()
  const user = session.data?.user
  if (!user) return null
  return user
}
