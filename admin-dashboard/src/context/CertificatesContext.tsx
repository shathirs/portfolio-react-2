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
import {
  emptyCertificateFormState,
  formStateToPayload,
  type CertificateInput,
} from '@/lib/certificateForm'
import type { Certificate, CertificateStats } from '@/types'

export type { CertificateInput }

interface CertificatesContextValue {
  certificates: Certificate[]
  stats: CertificateStats | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  getCertificate: (id: string) => Certificate | undefined
  addCertificate: (input: CertificateInput) => Promise<Certificate>
  updateCertificate: (id: string, input: CertificateInput) => Promise<void>
  deleteCertificate: (id: string) => Promise<void>
}

const CertificatesContext = createContext<CertificatesContextValue | null>(null)

export function CertificatesProvider({ children }: { children: ReactNode }) {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [stats, setStats] = useState<CertificateStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setLoading(true)
    }
    setError(null)
    try {
      const [certs, statsData] = await Promise.all([
        api.getCertificates(),
        api.getCertificateStats(),
      ])
      setCertificates(certs)
      setStats(statsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load certificates')
    } finally {
      if (!options?.silent) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const getCertificate = useCallback(
    (id: string) => certificates.find((c) => c.id === id),
    [certificates],
  )

  const addCertificate = useCallback(async (input: CertificateInput) => {
    const created = await api.createCertificate(input as Record<string, unknown>)
    setCertificates((prev) => [...prev, created])
    const statsData = await api.getCertificateStats()
    setStats(statsData)
    return created
  }, [])

  const updateCertificate = useCallback(
    async (id: string, input: CertificateInput) => {
      const updated = await api.updateCertificate(
        id,
        input as Record<string, unknown>,
      )
      setCertificates((prev) =>
        prev.map((c) => (c.id === id ? updated : c)),
      )
      const statsData = await api.getCertificateStats()
      setStats(statsData)
    },
    [],
  )

  const deleteCertificate = useCallback(
    async (id: string) => {
      await api.deleteCertificate(id)
      setCertificates((prev) => prev.filter((c) => c.id !== id))
      const statsData = await api.getCertificateStats()
      setStats(statsData)
    },
    [],
  )

  const value = useMemo(
    () => ({
      certificates,
      stats,
      loading,
      error,
      refresh,
      getCertificate,
      addCertificate,
      updateCertificate,
      deleteCertificate,
    }),
    [
      certificates,
      stats,
      loading,
      error,
      refresh,
      getCertificate,
      addCertificate,
      updateCertificate,
      deleteCertificate,
    ],
  )

  return (
    <CertificatesContext.Provider value={value}>
      {children}
    </CertificatesContext.Provider>
  )
}

export function useCertificates() {
  const ctx = useContext(CertificatesContext)
  if (!ctx) throw new Error('useCertificates must be used within CertificatesProvider')
  return ctx
}

export function emptyCertificateInput(): CertificateInput {
  return formStateToPayload(emptyCertificateFormState())
}

