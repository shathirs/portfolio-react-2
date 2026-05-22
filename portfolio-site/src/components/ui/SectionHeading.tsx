type SectionHeadingProps = {
  title: string
  subtitle?: string
  dark?: boolean
}

export function SectionHeading({ title, subtitle, dark }: SectionHeadingProps) {
  return (
    <div className="text-center">
      <h2
        className={`text-3xl font-bold sm:text-4xl ${dark ? 'text-white' : 'text-slate-900'}`}
      >
        {title}
      </h2>
      <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary" />
      {subtitle ? (
        <p
          className={`mx-auto mt-4 max-w-2xl text-base ${dark ? 'text-slate-400' : 'text-slate-500'}`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
