import { LogoIcon } from '@/components/brand/LogoIcon'
import { NavLink } from 'react-router-dom'
import { mainNavItems } from '@/config/navigation'
import { useMessages } from '@/context/MessagesContext'

function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-sidebar-active text-white'
      : 'text-slate-300 hover:bg-sidebar-hover hover:text-white',
  ].join(' ')
}

export function Sidebar() {
  const { messages } = useMessages()
  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-sidebar text-white">
      <div className="border-b border-white/10 px-6 py-5">
        <NavLink
          to="/dashboard"
          className="group flex items-center gap-2.5 text-xl font-bold tracking-tight"
        >
          <LogoIcon
            size={36}
            className="shrink-0 shadow-md shadow-primary/25 transition-transform group-hover:scale-105"
          />
          <span>
            Portfo<span className="text-primary">.</span>
          </span>
        </NavLink>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
        {mainNavItems.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={navLinkClass}
          >
            <Icon className="h-5 w-5 shrink-0 opacity-90" strokeWidth={1.75} />
            <span className="flex-1">{label}</span>
            {path === '/messages' && unreadCount > 0 ? (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                {unreadCount}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
