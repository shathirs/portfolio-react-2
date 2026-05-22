const URL_RE = /(https?:\/\/[^\s]+)/g

function isUrl(part: string) {
  return /^https?:\/\//i.test(part)
}

function linkifyText(text: string, keyPrefix: string) {
  const parts = text.split(URL_RE)
  return parts.map((part, i) => {
    if (isUrl(part)) {
      return (
        <a
          key={`${keyPrefix}-link-${i}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:text-primary-hover"
        >
          {part}
        </a>
      )
    }
    return <span key={`${keyPrefix}-t-${i}`}>{part}</span>
  })
}

function BulletLine({ text, keyPrefix }: { text: string; keyPrefix: string }) {
  const body = text.replace(/^[\s•\-*]+/, '').trim()
  const labelMatch = body.match(/^([A-Za-z][A-Za-z\s]+):\s*(.+)$/)
  if (labelMatch) {
    return (
      <div className="leading-relaxed">
        <span className="font-medium text-slate-200">{labelMatch[1]}:</span>{' '}
        <span className="text-slate-300">{linkifyText(labelMatch[2], keyPrefix)}</span>
      </div>
    )
  }
  return (
    <div className="leading-relaxed text-slate-300">{linkifyText(body, keyPrefix)}</div>
  )
}

function isBulletLine(line: string) {
  return /^[\s]*[•\-*]\s+/.test(line) || /^[\s]*\d+\.\s+/.test(line)
}

function isSubLine(line: string) {
  return /^\s{2,}/.test(line) && !isBulletLine(line)
}

export function ChatMessageContent({ content }: { content: string }) {
  const lines = content.split('\n').filter((line, i, arr) => line.trim() || i < arr.length - 1)

  const blocks: { type: 'p' | 'ul'; lines: string[] }[] = []
  let currentBullets: string[] = []
  let currentParagraph: string[] = []

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      blocks.push({ type: 'p', lines: [...currentParagraph] })
      currentParagraph = []
    }
  }

  function flushBullets() {
    if (currentBullets.length > 0) {
      blocks.push({ type: 'ul', lines: [...currentBullets] })
      currentBullets = []
    }
  }

  for (const line of lines) {
    if (isBulletLine(line)) {
      flushParagraph()
      currentBullets.push(line)
    } else if (isSubLine(line) && currentBullets.length > 0) {
      const last = currentBullets.length - 1
      currentBullets[last] = `${currentBullets[last]}\n${line.trim()}`
    } else if (line.trim()) {
      flushBullets()
      currentParagraph.push(line.trim())
    }
  }
  flushBullets()
  flushParagraph()

  if (blocks.length === 0) {
    return <p className="text-sm leading-relaxed text-slate-300">{content}</p>
  }

  return (
    <div className="space-y-2.5 text-sm">
      {blocks.map((block, bi) =>
        block.type === 'ul' ? (
          <ul
            key={`ul-${bi}`}
            className="ml-0 list-none space-y-2 border-l-2 border-primary/40 pl-3"
          >
            {block.lines.map((line, li) => {
              const subParts = line.split('\n').map((s) => s.trim()).filter(Boolean)
              const main = subParts[0] ?? line
              const subs = subParts.slice(1)
              return (
                <li key={`b-${bi}-${li}`} className="space-y-1">
                  <div className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <div className="min-w-0 flex-1">
                      <BulletLine text={main} keyPrefix={`b-${bi}-${li}`} />
                      {subs.length > 0 ? (
                        <ul className="mt-1.5 space-y-1 pl-1 text-xs text-slate-400">
                          {subs.map((sub, si) => (
                            <li key={`sub-${bi}-${li}-${si}`}>
                              {linkifyText(sub.replace(/^[\s•\-]+/, ''), `sub-${bi}-${li}-${si}`)}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <p key={`p-${bi}`} className="leading-relaxed text-slate-300">
            {block.lines.map((l, li) => (
              <span key={`p-${bi}-${li}`}>
                {li > 0 ? <br /> : null}
                {linkifyText(l, `p-${bi}-${li}`)}
              </span>
            ))}
          </p>
        ),
      )}
    </div>
  )
}
