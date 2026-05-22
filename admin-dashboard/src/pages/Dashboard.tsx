import { Award, FolderKanban, Mail, Sparkles } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { RecentMessages } from '@/components/dashboard/RecentMessages'
import { RecentProjects } from '@/components/dashboard/RecentProjects'
import { StatCard } from '@/components/dashboard/StatCard'
import { PageError, PageLoader } from '@/components/ui/PageLoader'
import { api } from '@/lib/api'
import { subscribeMessageRealtime } from '@/lib/messageStream'
import type { DashboardStats, Message, Project } from '@/types'

const statConfig = [
  {
    key: 'totalProjects' as const,
    label: 'Total Projects',
    icon: FolderKanban,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-primary',
  },
  {
    key: 'totalSkills' as const,
    label: 'Total Skills',
    icon: Sparkles,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    key: 'totalCertificates' as const,
    label: 'Certificates',
    icon: Award,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    key: 'totalMessages' as const,
    label: 'Messages',
    icon: Mail,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
]

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [recentMessages, setRecentMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsData, recentData] = await Promise.all([
        api.getDashboardStats(),
        api.getDashboardRecent(),
      ])
      setStats(statsData)
      setRecentProjects(recentData.projects)
      setRecentMessages(recentData.messages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    return subscribeMessageRealtime((event) => {
      if (event.type === 'created') {
        setStats((prev) =>
          prev
            ? {
                ...prev,
                totalMessages: prev.totalMessages + 1,
                unreadMessages: (prev.unreadMessages ?? 0) + 1,
              }
            : prev,
        )
        setRecentMessages((prev) => {
          if (prev.some((m) => m.id === event.message.id)) return prev
          return [event.message, ...prev].slice(0, 5)
        })
      }
      if (event.type === 'updated') {
        setRecentMessages((prev) =>
          prev.map((m) => (m.id === event.message.id ? event.message : m)),
        )
        if (event.message.read) {
          setStats((prev) =>
            prev?.unreadMessages
              ? { ...prev, unreadMessages: Math.max(0, prev.unreadMessages - 1) }
              : prev,
          )
        }
      }
      if (event.type === 'deleted') {
        setRecentMessages((prev) => {
          const removed = prev.find((m) => m.id === event.id)
          setStats((s) => {
            if (!s) return s
            return {
              ...s,
              totalMessages: Math.max(0, s.totalMessages - 1),
              unreadMessages:
                removed && !removed.read
                  ? Math.max(0, (s.unreadMessages ?? 0) - 1)
                  : s.unreadMessages,
            }
          })
          return prev.filter((m) => m.id !== event.id)
        })
      }
    })
  }, [])

  if (loading) return <PageLoader label="Loading dashboard…" />
  if (error || !stats) return <PageError message={error ?? 'Unknown error'} onRetry={load} />

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statConfig.map(({ key, label, icon, iconBg, iconColor }) => (
          <StatCard
            key={key}
            label={label}
            value={stats[key]}
            subtitle={
              key === 'totalMessages' && stats.unreadMessages
                ? `${stats.unreadMessages} unread`
                : undefined
            }
            icon={icon}
            iconBg={iconBg}
            iconColor={iconColor}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentProjects projects={recentProjects} />
        <RecentMessages messages={recentMessages} />
      </div>
    </div>
  )
}
