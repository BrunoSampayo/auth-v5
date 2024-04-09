import { NavBar } from './_components/navBar'

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to to-blue-800">
      <NavBar />
      {children}
    </div>
  )
}

export default ProtectedLayout
