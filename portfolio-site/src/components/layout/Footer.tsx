import { useProfile } from '@/context/ProfileContext'

export function Footer() {
  const profile = useProfile()
  return (
    <footer className="border-t border-white/10 bg-navy py-8 text-center text-sm text-slate-400">
      <p>
        © {new Date().getFullYear()} {profile.name}. Built with React & MERN Stack.
      </p>
    </footer>
  )
}
