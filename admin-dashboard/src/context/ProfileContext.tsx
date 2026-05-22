import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api } from '@/lib/api'
import { resolveProfileImageUrl } from '@/lib/profileImage'
import type { SiteProfile } from '@/types'
import { useAuth } from '@/context/AuthContext'

interface ProfileContextValue {
  profile: SiteProfile | null
  avatarUrl: string
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  updateProfile: (input: Partial<SiteProfile>) => Promise<SiteProfile>
  uploadPhoto: (file: File) => Promise<SiteProfile>
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<SiteProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setProfile(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await api.getProfile()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refresh()
  }, [refresh])

  const updateProfile = useCallback(async (input: Partial<SiteProfile>) => {
    const updated = await api.updateProfile(input)
    setProfile(updated)
    return updated
  }, [])

  const uploadPhoto = useCallback(async (file: File) => {
    const updated = await api.uploadProfileImage(file)
    setProfile(updated)
    return updated
  }, [])

  const avatarUrl = resolveProfileImageUrl(profile?.profileImage)

  const value = useMemo(
    () => ({
      profile,
      avatarUrl,
      loading,
      error,
      refresh,
      updateProfile,
      uploadPhoto,
    }),
    [profile, avatarUrl, loading, error, refresh, updateProfile, uploadPhoto],
  )

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
