import {
  ChevronDown,
  ChevronUp,
  FileText,
  Film,
  ImageIcon,
  Link2,
  Star,
  Trash2,
  Upload,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { api } from '@/lib/api'
import {
  GOOGLE_DRIVE_FILE_HINT,
  isGoogleDriveFolderUrl,
  normalizeExternalMediaUrl,
} from '@/lib/googleDriveUrl'
import {
  MEDIA_TYPE_LABELS,
  newMediaItem,
  PROJECT_MEDIA_ACCEPT,
  resolveMediaUrl,
  sortMedia,
} from '@/lib/projectMedia'
import type { ProjectMediaItem, ProjectMediaType } from '@/types'

interface ProjectMediaManagerProps {
  media: ProjectMediaItem[]
  coverUrl: string
  onChange: (media: ProjectMediaItem[]) => void
  onCoverChange: (url: string) => void
}

function MediaIcon({ type }: { type: ProjectMediaItem['type'] }) {
  const cls = 'h-5 w-5'
  if (type === 'video') return <Film className={cls} />
  if (type === 'image') return <ImageIcon className={cls} />
  return <FileText className={cls} />
}

export function ProjectMediaManager({
  media,
  coverUrl,
  onChange,
  onCoverChange,
}: ProjectMediaManagerProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [driveUrl, setDriveUrl] = useState('')
  const [driveTitle, setDriveTitle] = useState('')
  const [driveType, setDriveType] = useState<ProjectMediaType>('image')

  const sorted = sortMedia(media)

  function addDriveLink() {
    const raw = driveUrl.trim()
    if (!raw) {
      setError('Paste a Google Drive file link.')
      return
    }
    if (isGoogleDriveFolderUrl(raw)) {
      setError('Folder links are not supported. Use a link to a single file.')
      return
    }
    const url = normalizeExternalMediaUrl(raw, driveType)
    const next = [
      ...media,
      newMediaItem(
        {
          title: driveTitle.trim() || 'Google Drive file',
          type: driveType,
          url,
          fileName: raw,
        },
        media.length,
      ),
    ]
    onChange(next.map((m, i) => ({ ...m, order: i })))
    if (driveType === 'image' && !coverUrl) onCoverChange(url)
    setDriveUrl('')
    setDriveTitle('')
    setError(null)
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return
    setUploading(true)
    setError(null)
    const next = [...media]
    try {
      for (const file of Array.from(fileList)) {
        const uploaded = await api.uploadProjectMedia(file)
        next.push(
          newMediaItem(
            {
              title: uploaded.title || file.name.replace(/\.[^.]+$/, ''),
              type: uploaded.type,
              url: uploaded.url,
              mimeType: uploaded.mimeType,
              fileName: uploaded.fileName || file.name,
            },
            next.length,
          ),
        )
      }
      onChange(next.map((m, i) => ({ ...m, order: i })))
      const firstImage = next.find((m) => m.type === 'image')
      if (firstImage && !coverUrl) onCoverChange(firstImage.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function removeAt(index: number) {
    const item = sorted[index]
    const next = sorted.filter((_, i) => i !== index).map((m, i) => ({ ...m, order: i }))
    onChange(next)
    if (item && resolveMediaUrl(item.url) === resolveMediaUrl(coverUrl)) {
      const firstImage = next.find((m) => m.type === 'image')
      onCoverChange(firstImage?.url ?? '')
    }
  }

  function move(index: number, dir: 'up' | 'down') {
    const swap = dir === 'up' ? index - 1 : index + 1
    if (swap < 0 || swap >= sorted.length) return
    const next = [...sorted]
    ;[next[index], next[swap]] = [next[swap], next[index]]
    onChange(next.map((m, i) => ({ ...m, order: i })))
  }

  function updateTitle(index: number, title: string) {
    onChange(
      sorted.map((m, i) => (i === index ? { ...m, title } : m)),
    )
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-slate-50/50 p-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Project gallery & files
        </label>
        <p className="text-xs text-muted">
          Add images, videos (MP4/WebM), PDFs, and Word documents. Shown on the project detail
          page.
        </p>
      </div>

      <label
        className={[
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-white px-4 py-8 transition-colors',
          uploading ? 'pointer-events-none opacity-60' : 'hover:border-primary/40 hover:bg-indigo-50/30',
        ].join(' ')}
      >
        <Upload className="h-8 w-8 text-primary" strokeWidth={1.5} />
        <span className="text-sm font-medium text-slate-700">
          {uploading ? 'Uploading…' : 'Click to upload or drop files'}
        </span>
        <span className="text-center text-xs text-muted">
          Images ≤5MB · PDF/Word ≤15MB · Video ≤50MB
        </span>
        <input
          type="file"
          multiple
          accept={PROJECT_MEDIA_ACCEPT}
          disabled={uploading}
          className="sr-only"
          onChange={(e) => {
            void handleFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </label>

      <div className="rounded-xl border border-border bg-white p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Link2 className="h-4 w-4 text-primary" />
          Add from Google Drive
        </div>
        <p className="text-xs text-muted">{GOOGLE_DRIVE_FILE_HINT}</p>
        <Input
          label="Google Drive file link"
          type="url"
          value={driveUrl}
          onChange={(e) => setDriveUrl(e.target.value)}
          placeholder="https://drive.google.com/file/d/…/view?usp=sharing"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Display name (optional)"
            value={driveTitle}
            onChange={(e) => setDriveTitle(e.target.value)}
            placeholder="Architecture diagram"
          />
          <Select
            label="File type"
            value={driveType}
            onChange={(e) => setDriveType(e.target.value as ProjectMediaType)}
            options={(
              ['image', 'video', 'pdf', 'document'] as ProjectMediaType[]
            ).map((t) => ({ value: t, label: MEDIA_TYPE_LABELS[t] }))}
          />
        </div>
        <Button type="button" variant="secondary" onClick={addDriveLink}>
          Add Drive link
        </Button>
      </div>

      {error ? <p className="text-xs text-red-500">{error}</p> : null}

      {sorted.length === 0 ? (
        <p className="text-center text-sm text-muted py-4">No files added yet.</p>
      ) : (
        <ul className="space-y-3">
          {sorted.map((item, index) => {
            const src = resolveMediaUrl(item.url, item.type)
            const isCover = src && resolveMediaUrl(coverUrl) === src
            return (
              <li
                key={item.id ?? `${item.url}-${index}`}
                className="flex gap-3 rounded-xl border border-border bg-white p-3 shadow-sm"
              >
                <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-muted">
                  {item.type === 'image' && src ? (
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <MediaIcon type={item.type} />
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-primary">
                      {MEDIA_TYPE_LABELS[item.type]}
                    </span>
                    {isCover ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                        <Star className="h-3 w-3 fill-current" />
                        Cover
                      </span>
                    ) : null}
                  </div>
                  <Input
                    label="Display name"
                    value={item.title}
                    onChange={(e) => updateTitle(index, e.target.value)}
                  />
                  <p className="truncate text-xs text-muted">{item.fileName || item.url}</p>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  {item.type === 'image' && src ? (
                    <button
                      type="button"
                      title="Set as cover image"
                      onClick={() => onCoverChange(item.url)}
                      className="rounded-lg p-2 text-muted hover:bg-amber-50 hover:text-amber-600"
                    >
                      <Star className={`h-4 w-4 ${isCover ? 'fill-current' : ''}`} />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => move(index, 'up')}
                    className="rounded-lg p-2 text-muted hover:bg-slate-100 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === sorted.length - 1}
                    onClick={() => move(index, 'down')}
                    className="rounded-lg p-2 text-muted hover:bg-slate-100 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
