import { FileText, ImagePlus, Link2, Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { Select } from '@/components/ui/Select'
import { api, ApiError } from '@/lib/api'
import {
  CERTIFICATE_FILE_ACCEPT,
  inferCertificateMediaType,
  isCertificatePdf,
  normalizeCertificateThumbnail,
  type CertificateMediaType,
} from '@/lib/certificateMedia'
import {
  GOOGLE_DRIVE_FILE_HINT,
  isGoogleDriveFolderUrl,
} from '@/lib/googleDriveUrl'
import { resolveThumbnailUrl } from '@/lib/thumbnailUrl'
import { CertificateThumbnail } from '@/components/certificates/CertificateThumbnail'

interface CertificateImagePickerProps {
  thumbnail: string
  thumbnailType: CertificateMediaType
  onThumbnailChange: (url: string, thumbnailType?: CertificateMediaType) => void
  title: string
  error?: string
}

export function CertificateImagePicker({
  thumbnail,
  thumbnailType,
  onThumbnailChange,
  title,
  error,
}: CertificateImagePickerProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [localPreviewType, setLocalPreviewType] = useState<CertificateMediaType>('image')
  const [linkMediaType, setLinkMediaType] = useState<CertificateMediaType>(thumbnailType)

  async function handleFileChange(file: File | undefined) {
    if (!file) return
    setUploadError(null)
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    setLocalPreviewType(isPdf ? 'pdf' : 'image')
    setLocalPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const { url, thumbnailType: type } = await api.uploadCertificateFile(file)
      onThumbnailChange(url, type)
      setLinkMediaType(type)
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : 'Upload failed')
      setLocalPreview(null)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function applyLink(raw: string) {
    if (!raw.trim()) return
    if (isGoogleDriveFolderUrl(raw)) {
      setUploadError('Use a link to a single file, not a folder.')
      return
    }
    const normalized = normalizeCertificateThumbnail(raw, linkMediaType)
    onThumbnailChange(normalized.thumbnail, normalized.thumbnailType)
    setUploadError(null)
    setLocalPreview(null)
  }

  const effectiveType = localPreview
    ? localPreviewType
    : inferCertificateMediaType(thumbnail, thumbnailType)
  const previewSrc = localPreview || resolveThumbnailUrl(thumbnail, effectiveType)
  const isPdf = isCertificatePdf(thumbnail, effectiveType) || localPreviewType === 'pdf'

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        Certificate file (image or PDF)
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
          Upload image or PDF
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={CERTIFICATE_FILE_ACCEPT}
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0])}
        />
        <span className="flex items-center text-xs text-muted">or paste a link below</span>
      </div>

      <Select
        label="Link file type"
        value={linkMediaType}
        onChange={(e) => setLinkMediaType(e.target.value as CertificateMediaType)}
        options={[
          { value: 'image', label: 'Image (JPG, PNG, …)' },
          { value: 'pdf', label: 'PDF document' },
        ]}
      />

      <div className="relative">
        <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="url"
          value={thumbnail}
          onChange={(e) => {
            setUploadError(null)
            setLocalPreview(null)
            onThumbnailChange(e.target.value, linkMediaType)
          }}
          onBlur={() => applyLink(thumbnail)}
          placeholder="Google Drive link or direct image/PDF URL"
          className={[
            'w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors',
            'focus:border-primary focus:ring-2 focus:ring-primary/20',
            error ? 'border-red-400' : '',
          ].join(' ')}
        />
      </div>

      <p className="text-xs text-muted">
        Upload JPG, PNG, WebP, GIF (≤15MB) or PDF (≤15MB). {GOOGLE_DRIVE_FILE_HINT}{' '}
        Credential verify pages go in Credential URL below.
      </p>

      {(uploadError || error) && (
        <p className="text-xs text-red-600">{uploadError || error}</p>
      )}

      {previewSrc ? (
        <div className="flex items-start gap-4 rounded-lg border border-border bg-slate-50 p-4">
          {localPreview && isPdf ? (
            <iframe
              title="PDF preview"
              src={localPreview}
              className="h-28 w-40 shrink-0 rounded-md border border-border bg-white"
            />
          ) : localPreview && !isPdf ? (
            <img
              src={localPreview}
              alt="Upload preview"
              className="h-28 w-40 shrink-0 rounded-md object-cover"
            />
          ) : (
            <CertificateThumbnail
              thumbnail={thumbnail}
              thumbnailType={effectiveType}
              title={title || 'Preview'}
              className="h-28 w-40 shrink-0 rounded-md object-cover"
            />
          )}
          <div className="min-w-0 flex-1 text-xs text-muted">
            {uploading ? (
              <span>Uploading…</span>
            ) : isPdf ? (
              <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                <FileText className="h-3.5 w-3.5" />
                PDF certificate
              </span>
            ) : previewSrc ? (
              <span>Image preview</span>
            ) : (
              <span>Could not preview — check the link or file type.</span>
            )}
            {thumbnail.startsWith('https://res.cloudinary.com/') ? (
              <p className="mt-1 truncate text-emerald-700">Saved on Cloudinary</p>
            ) : thumbnail.startsWith('/uploads/') ? (
              <p className="mt-1 truncate text-amber-700">Saved locally (use Cloudinary in production)</p>
            ) : null}
          </div>
          {thumbnail ? (
            <button
              type="button"
              onClick={() => {
                setLocalPreview(null)
                onThumbnailChange('', 'image')
                setLinkMediaType('image')
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
