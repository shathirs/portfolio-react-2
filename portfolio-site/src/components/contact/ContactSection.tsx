import { SectionHeading } from '@/components/ui/SectionHeading'
import { api } from '@/lib/api'
import { useProfile } from '@/context/ProfileContext'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { useState } from 'react'

export function ContactSection() {
  const profile = useProfile()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setFeedback('')
    try {
      await api.sendContact({
        senderName: name.trim(),
        senderEmail: email.trim(),
        subject: subject.trim() || `Portfolio message from ${name.trim()}`,
        body: message.trim(),
      })
      setStatus('success')
      setFeedback(
        'Thank you! Your message was sent successfully. I will get back to you soon.',
      )
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err) {
      setStatus('error')
      setFeedback(err instanceof Error ? err.message : 'Failed to send message')
    }
  }

  const contactItems = [
    { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    {
      icon: Phone,
      label: 'Phone',
      value: profile.phone,
      href: `tel:${profile.phone.replace(/\s/g, '')}`,
    },
    { icon: MapPin, label: 'Location', value: profile.location },
  ]

  return (
    <section id="contact" className="bg-navy py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeading
          dark
          title="Contact Me"
          subtitle="Have a project in mind or want to collaborate? Send a message — it goes straight to my inbox."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            {contactItems.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="mt-1 block font-medium text-white hover:text-primary"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1 font-medium text-white">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:p-8"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Subject <span className="text-slate-500">(optional)</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Project inquiry, collaboration…"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-y rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Tell me about your project…"
                />
              </div>
            </div>

            {feedback ? (
              <p
                className={`mt-4 text-sm ${status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}
                role="status"
              >
                {feedback}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60 sm:w-auto"
            >
              <Send className="h-4 w-4" />
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
