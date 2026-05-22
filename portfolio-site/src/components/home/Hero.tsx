import { Download, Mail } from 'lucide-react'
import { techOrbit } from '@/data/profile'
import { useProfile, useProfileImage } from '@/context/ProfileContext'

export function Hero() {
  const profile = useProfile()
  const profileImage = useProfileImage()

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-navy pb-20 pt-12 lg:pb-28 lg:pt-16"
    >
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="order-2 lg:order-1">
          <p className="mb-3 text-sm font-medium tracking-wide text-primary">
            Hello, I&apos;m
          </p>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
              {profile.name}
            </span>
          </h1>
          <h2 className="mt-3 text-2xl font-semibold text-slate-200 sm:text-3xl">
            {profile.title}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400">
            {profile.bio}
          </p>

          <div className="mt-8 flex items-center gap-4">
            {profile.linkedin ? (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-primary hover:text-primary"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            ) : null}
            {profile.github ? (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-primary hover:text-primary"
                aria-label="GitHub"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
            ) : null}
            <a
              href={`mailto:${profile.email}`}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-primary hover:text-primary"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={profile.cvUrl}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <Download className="h-4 w-4" />
              Download CV
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Contact Me
            </a>
          </div>
        </div>

        <div className="order-1 flex justify-center lg:order-2">
          <div className="relative h-[320px] w-[320px] sm:h-[380px] sm:w-[380px]">
            <div className="hero-glow absolute inset-8 rounded-full" />

            <div className="orbit-ring absolute inset-0 rounded-full border border-primary/30" />
            <div className="orbit-ring absolute inset-6 rounded-full border border-dashed border-primary/20" />

            {techOrbit.map((tech, i) => {
              const angle = (i / techOrbit.length) * 2 * Math.PI - Math.PI / 2
              const radiusPct = 44
              const left = 50 + radiusPct * Math.cos(angle)
              const top = 50 + radiusPct * Math.sin(angle)
              return (
                <div
                  key={tech.name}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-xs font-bold shadow-lg sm:h-12 sm:w-12 sm:text-sm"
                    style={{
                      backgroundColor: `${tech.color}18`,
                      color: tech.color,
                      boxShadow: `0 0 20px ${tech.color}33`,
                    }}
                    title={tech.name}
                  >
                    {tech.abbr}
                  </div>
                </div>
              )
            })}

            <div
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ animation: 'float 4s ease-in-out infinite' }}
            >
              <div className="rounded-full bg-gradient-to-br from-primary to-violet-600 p-1.5 shadow-2xl shadow-primary/40">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={profile.name}
                    className="h-44 w-44 rounded-full object-cover sm:h-52 sm:w-52"
                  />
                ) : (
                  <div className="flex h-44 w-44 items-center justify-center rounded-full bg-navy-light text-5xl font-bold text-white sm:h-52 sm:w-52">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
