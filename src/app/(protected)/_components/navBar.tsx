'use client'
import { Button } from '@/components/ui/button'
import { UserButton } from '@/components/userButton'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const NavBar = () => {
  const pathname = usePathname()
  return (
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl container max-w-[800px] shadow-sm">
      <div className="flex justify-end w-full gap-2">
        <Button
          asChild
          variant={pathname === '/server' ? 'default' : 'outline'}
        >
          <Link href="/">Server</Link>
        </Button>
        <Button
          asChild
          variant={pathname === '/client' ? 'default' : 'outline'}
        >
          <Link href="/">Client</Link>
        </Button>
        <Button
          asChild
          variant={pathname === '/settings' ? 'default' : 'outline'}
        >
          <Link href="/">Settings</Link>
        </Button>
        <UserButton />
      </div>
    </nav>
  )
}
