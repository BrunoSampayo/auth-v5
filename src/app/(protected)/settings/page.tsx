import { Button } from '@/components/ui/button'
import { auth, signOut } from '@/services/auth'

const SettingPage = async () => {
  const session = await auth()
  return (
    <div>
      {JSON.stringify(session)}
      <form
        action={async () => {
          'use server'
          await signOut()
        }}
      >
        <Button type="submit">Sign Out</Button>
      </form>
    </div>
  )
}

export default SettingPage
