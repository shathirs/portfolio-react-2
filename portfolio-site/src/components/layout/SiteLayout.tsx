import { PortfolioAiChat } from '@/components/chat/PortfolioAiChat'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { ProfileProvider, useProfileOptional } from '@/context/ProfileContext'
import { Outlet } from 'react-router-dom'

function LayoutContent() {
  const profile = useProfileOptional()

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy text-slate-400">
        Loading portfolio…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <PortfolioAiChat />
    </div>
  )
}

export function SiteLayout() {
  return (
    <ProfileProvider>
      <LayoutContent />
    </ProfileProvider>
  )
}
