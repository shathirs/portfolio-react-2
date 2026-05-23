import { ImagePlus, Link2, Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { api, ApiError } from '@/lib/api'
import {
  GOOGLE_DRIVE_FILE_HINT,
  isGoogleDriveFolderUrl,
  normalizeExternalMediaUrl,
} from '@/lib/googleDriveUrl'
import { canPreviewThumbnail } from '@/lib/thumbnailUrl'
import { CertificateThumbnail } from '@/components/certificates/CertificateThumbnail'

interface CertificateImagePickerProps {
  thumbnail: string
  onThumbnailChange: (url: string) => void
  title: string
  error?: string
}

export function CertificateImagePicker({
  thumbnail,
  onThumbnailChange,
  title,
  error,
}: CertificateImagePickerProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  async function handleFileChange(file: File | undefined) {
    if (!file) return
    setUploadError(null)
    setLocalPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const { url } = await api.uploadCertificateImage(file)
      onThumbnailChange(url)
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : 'Upload failed')
      setLocalPreview(null)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const previewSrc = localPreview || thumbnail

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        Certificate image
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          Upload from PC
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0])}
        />
        <span className="flex items-center text-xs text-muted">or paste a link below (Google Drive OK)</span>
      </div>

      <div className="relative">
        <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="url"
          value={thumbnail}
          onChange={(e) => {
            setUploadError(null)
            setLocalPreview(null)
            onThumbnailChange(e.target.value)
          }}
          onBlur={() => {
            const raw = thumbnail.trim()
            if (!raw) return
            if (isGoogleDriveFolderUrl(raw)) {
              setUploadError('Use a link to a single file, not a folder.')
              return
            }
            onThumbnailChange(normalizeExternalMediaUrl(raw, 'image'))
          }}
          placeholder="https://drive.google.com/file/d/…/view or image URL"
          className={[
            'w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors',
            'focus:border-primary focus:ring-2 focus:ring-primary/20',
            error ? 'border-red-400' : '',
          ].join(' ')}
        />
      </div>

      <p className="text-xs text-muted">
        Upload from PC, paste a Google Drive file link, or use a direct image URL.{' '}
        {GOOGLE_DRIVE_FILE_HINT} Credential verify pages go in Credential URL below.
      </p>

      {(uploadError || error) && (
        <p className="text-xs text-red-600">{uploadError || error}</p>
      )}

      {previewSrc ? (
        <div className="flex items-center gap-4 rounded-lg border border-border bg-slate-50 p-4">
          {localPreview ? (
            <img
              src={localPreview}
              alt="Upload preview"
              className="h-20 w-28 rounded-md object-cover"
            />
          ) : (
            <CertificateThumbnail
              thumbnail={thumbnail}
              title={title || 'Preview'}
              className="h-20 w-28 rounded-md object-cover"
            />
          )}
          <div className="min-w-0 flex-1 text-xs text-muted">
            {uploading ? (
              <span>Uploading…</span>
            ) : canPreviewThumbnail(previewSrc) || localPreview ? (
              <span>Image preview</span>
            ) : (
              <span>This URL is not a direct image — try upload or another link.</span>
            )}
            {thumbnail.startsWith('/uploads/') ? (
              <p className="mt-1 truncate text-emerald-700">Saved on server</p>
            ) : null}
          </div>
          {thumbnail ? (
            <button
              type="button"
              onClick={() => {
                setLocalPreview(null)
                onThumbnailChange('')
              }}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Remove
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
