import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api } from '@/lib/api'
import { resolveProfileImageUrl } from '@/lib/profileImage'
import type { SiteProfile } from '@/types/profile'

const ProfileContext = createContext<SiteProfile | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<SiteProfile | null>(null)

  useEffect(() => {
    api
      .getProfile()
      .then(setProfile)
      .catch(() => setProfile(null))
  }, [])

  const value = useMemo(() => profile, [profile])

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  )
}

export function useProfile() {
  const profile = useContext(ProfileContext)
  if (!profile) {
    throw new Error('Profile not loaded yet')
  }
  return profile
}

export function useProfileOptional() {
  return useContext(ProfileContext)
}

export function useProfileImage() {
  const profile = useContext(ProfileContext)
  return resolveProfileImageUrl(profile?.profileImage)
}
