import { Award, GraduationCap, Mail, MapPin, User } from 'lucide-react'
import { useProfile } from '@/context/ProfileContext'

export function About() {
  const profile = useProfile()
  const details = [
    { icon: User, label: 'Name', value: profile.name },
    { icon: Mail, label: 'Email', value: profile.email },
    { icon: MapPin, label: 'Location', value: profile.location },
    { icon: GraduationCap, label: 'Degree', value: profile.degree },
  ]
  return (
    <section id="about" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">About Me</h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary" />
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-base leading-relaxed text-slate-600">
              I&apos;m a Software Engineering student with hands-on experience in building
              real-world applications. My journey in tech is driven by curiosity and a
              desire to create meaningful solutions that solve real problems.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              I specialize in the MERN stack and enjoy working across the full development
              lifecycle — from designing responsive frontends to building secure REST APIs
              and managing databases. I&apos;m always eager to learn new technologies and
              collaborate in agile teams.
            </p>

            <ul className="mt-8 space-y-4">
              {details.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {label}
                    </p>
                    <p className="mt-0.5 font-medium text-slate-800">{value}</p>
                  </div>
                </li>
              ))}
              <li className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Award className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </p>
                  <p className="mt-0.5 font-medium text-emerald-600">{profile.status}</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-indigo-50/50 p-8 text-center shadow-lg shadow-slate-200/50">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Award className="h-10 w-10" strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900">Results Awaited</h3>
              <p className="mt-2 text-sm text-slate-500">
                BSc (Hons) Software Engineering — final year outcomes pending.
              </p>
              <p className="mt-4 text-xs font-medium text-primary">
                University of Bedfordshire · SLIIT City Uni
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
