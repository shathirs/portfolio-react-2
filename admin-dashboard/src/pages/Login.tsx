import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { LogoIcon } from '@/components/brand/LogoIcon'
import { ApiError, useAuth } from '@/context/AuthContext'

const REMEMBER_KEY = 'portfo_admin_username'

export function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated, isLoading } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{
    username?: string
    password?: string
    form?: string
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY)
    if (saved) {
      setUsername(saved)
      setRememberMe(true)
    }
  }, [])

  function validate() {
    const next: { username?: string; password?: string } = {}

    if (!username.trim()) {
      next.username = 'Username is required'
    }

    if (!password) {
      next.password = 'Password is required'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setErrors({})

    if (rememberMe) {
      localStorage.setItem(REMEMBER_KEY, username.trim())
    } else {
      localStorage.removeItem(REMEMBER_KEY)
    }

    try {
      await login(username.trim(), password)
      navigate('/dashboard')
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Unable to connect to server. Is the API running?'
      setErrors({ form: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-sm text-muted">Loading…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center gap-3">
            <LogoIcon size={48} className="shadow-lg shadow-primary/25" />
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Portfo<span className="text-primary">.</span>
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Admin
            </span>
          </div>

          <div className="rounded-2xl border border-border bg-white px-8 py-10 shadow-sm">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold text-slate-900">Admin Login</h1>
              <p className="mt-2 text-sm text-muted">
                Sign in to your admin account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {errors.form ? (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {errors.form}
                </p>
              ) : null}

              <Input
                label="Username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                error={errors.username}
              />

              <PasswordInput
                value={password}
                onChange={setPassword}
                error={errors.password}
              />

              <div className="flex items-center justify-between gap-4">
                <Checkbox
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <button
                  type="button"
                  className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
                  onClick={() =>
                    alert('Password reset will be available in a future update.')
                  }
                >
                  Forgot Password?
                </button>
              </div>

              <Button type="submit" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'Signing in…' : 'Login'}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Default username: admin (password set in server .env, stored hashed in MongoDB)
          </p>
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Portfo. All rights reserved.
      </footer>
    </div>
  )
}
