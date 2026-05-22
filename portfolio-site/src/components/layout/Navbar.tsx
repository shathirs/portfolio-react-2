import { LogoIcon } from '@/components/brand/LogoIcon'
import { navLinks } from '@/data/profile'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const homePath = pathname === '/' ? '' : '/'

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-navy/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          to={homePath || '/'}
          className="group flex items-center gap-2.5 text-xl font-bold text-white"
        >
          <LogoIcon
            size={38}
            className="shrink-0 shadow-lg shadow-primary/30 transition-transform group-hover:scale-105"
          />
          <span>
            Portfo<span className="text-primary">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              to={`${homePath}${href}`}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to={`${homePath}#contact`}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Hire Me
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-white/10 bg-navy px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                to={`${homePath}${href}`}
                className="text-sm font-medium text-slate-300 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              to={`${homePath}#contact`}
              className="mt-2 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Hire Me
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  )
}
