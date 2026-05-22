import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ExternalLink, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { PageError, PageLoader } from '@/components/ui/PageLoader'
import { useProfile } from '@/context/ProfileContext'
import { ApiError, api } from '@/lib/api'
import { resolveProfileImageUrl } from '@/lib/profileImage'
import type { SiteProfile } from '@/types'

export function Profile() {
  const { profile, loading, error, refresh, updateProfile, uploadPhoto } =
    useProfile()
  const [form, setForm] = useState<SiteProfile | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
    form?: string
  }>({})
  const [passwordFeedback, setPasswordFeedback] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (profile) setForm(profile)
  }, [profile])

  if (loading) return <PageLoader label="Loading profile…" />
  if (error) return <PageError message={error} onRetry={refresh} />
  if (!form) return null

  const previewUrl = resolveProfileImageUrl(form.profileImage)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    setFeedback('')
    try {
      await updateProfile(form)
      setFeedback('Profile saved. Admin header and public portfolio will use this photo.')
    } catch {
      setFeedback('Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  function validatePasswordForm() {
    const next: typeof passwordErrors = {}

    if (!currentPassword) {
      next.currentPassword = 'Current password is required'
    }
    if (!newPassword) {
      next.newPassword = 'New password is required'
    } else if (newPassword.length < 6) {
      next.newPassword = 'Password must be at least 6 characters'
    }
    if (!confirmPassword) {
      next.confirmPassword = 'Please confirm your new password'
    } else if (newPassword && newPassword !== confirmPassword) {
      next.confirmPassword = 'Passwords do not match'
    }

    setPasswordErrors(next)
    return Object.keys(next).length === 0
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validatePasswordForm()) return

    setChangingPassword(true)
    setPasswordErrors({})
    setPasswordFeedback('')

    try {
      const result = await api.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordFeedback(result.message)
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Failed to update password.'
      setPasswordErrors({ form: message })
    } finally {
      setChangingPassword(false)
    }
  }

  async function handleUpload(file: File) {
    setUploading(true)
    setFeedback('')
    try {
      const updated = await uploadPhoto(file)
      setForm(updated)
      setFeedback('Photo uploaded successfully.')
    } catch {
      setFeedback('Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Profile & photo</h2>
        <p className="mt-1 text-sm text-muted">
          One profile for the admin dashboard and your public portfolio. Use the same
          photo as LinkedIn — paste the image URL or upload a file.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-white p-6 sm:flex-row sm:items-start">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={form.name}
            className="h-28 w-28 rounded-full object-cover ring-4 ring-indigo-50"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-50 text-3xl font-bold text-primary">
            {form.name.charAt(0)}
          </div>
        )}
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <p className="text-sm text-slate-600">
            <strong>LinkedIn:</strong> Open your profile → click your photo →{' '}
            <em>right-click → Copy image address</em> → paste below.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file)
            }}
          />
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              className="gap-2"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading…' : 'Upload photo'}
            </Button>
            {form.linkedin ? (
              <a
                href={form.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Open LinkedIn
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-border bg-white p-6 shadow-sm"
      >
        <Input
          label="Profile image URL (LinkedIn or other)"
          value={form.profileImage}
          onChange={(e) => setForm((f) => f && { ...f, profileImage: e.target.value })}
          placeholder="https://media.licdn.com/dms/image/…"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Full name"
            value={form.name}
            onChange={(e) => setForm((f) => f && { ...f, name: e.target.value })}
            required
          />
          <Input
            label="Job title"
            value={form.title}
            onChange={(e) => setForm((f) => f && { ...f, title: e.target.value })}
          />
        </div>

        <Input
          label="Bio"
          value={form.bio}
          onChange={(e) => setForm((f) => f && { ...f, bio: e.target.value })}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => f && { ...f, email: e.target.value })}
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((f) => f && { ...f, phone: e.target.value })}
          />
        </div>

        <Input
          label="Location"
          value={form.location}
          onChange={(e) => setForm((f) => f && { ...f, location: e.target.value })}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="LinkedIn profile URL"
            value={form.linkedin}
            onChange={(e) => setForm((f) => f && { ...f, linkedin: e.target.value })}
            placeholder="https://www.linkedin.com/in/…"
          />
          <Input
            label="GitHub URL"
            value={form.github}
            onChange={(e) => setForm((f) => f && { ...f, github: e.target.value })}
          />
        </div>

        {feedback ? (
          <p className="text-sm text-emerald-600">{feedback}</p>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save profile'}
          </Button>
        </div>
      </form>

      <div className="space-y-5 rounded-xl border border-border bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Reset password</h2>
          <p className="mt-1 text-sm text-muted">
            Updates your admin login password in MongoDB (stored hashed). You will
            need the new password on your next sign-in.
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-5" noValidate>
          {passwordErrors.form ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {passwordErrors.form}
            </p>
          ) : null}

          <PasswordInput
            id="current-password"
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            autoComplete="current-password"
            error={passwordErrors.currentPassword}
          />

          <PasswordInput
            id="new-password"
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            error={passwordErrors.newPassword}
          />

          <PasswordInput
            id="confirm-password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            error={passwordErrors.confirmPassword}
          />

          {passwordFeedback ? (
            <p className="text-sm text-emerald-600">{passwordFeedback}</p>
          ) : null}

          <div className="flex justify-end">
            <Button type="submit" variant="secondary" disabled={changingPassword}>
              {changingPassword ? 'Updating…' : 'Update password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
