import { MEDIA_LABELS, resolveMediaUrl, sortMedia } from '@/lib/projectMedia'
import { PdfViewer } from '@/components/projects/PdfViewer'
import {
  getDocumentDownloadUrl,
  getDocumentPreviewUrl,
  getPdfDirectUrl,
  isDriveEmbedUrl,
  isPdfMedia,
  isWordDocument,
  toAbsoluteUrl,
} from '@/lib/documentPreview'
import type { ProjectMediaItem } from '@/types'
import { Download, ExternalLink, FileText, Film } from 'lucide-react'

interface ProjectMediaGalleryProps {
  media?: ProjectMediaItem[]
  projectTitle: string
}

export function ProjectMediaGallery({ media = [], projectTitle }: ProjectMediaGalleryProps) {
  const items = sortMedia(media)
    .map((m) => {
      const previewSrc = getDocumentPreviewUrl(m.url, m.type)
      const viewSrc = resolveMediaUrl(m.url, m.type)
      return {
        ...m,
        previewSrc,
        viewSrc,
      }
    })
    .filter((m) => m.previewSrc || m.viewSrc)

  if (items.length === 0) return null

  const images = items.filter((m) => m.type === 'image')
  const videos = items.filter((m) => m.type === 'video')
  const documents = items.filter((m) => m.type === 'pdf' || m.type === 'document')

  return (
    <section className="mt-10 space-y-8">
      <h2 className="text-xl font-bold text-slate-900">Project media</h2>

      {images.length > 0 ? (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Images
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {images.map((item) => (
              <figure
                key={item.id ?? item.url}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <img
                  src={item.viewSrc}
                  alt={item.title || projectTitle}
                  className="aspect-video w-full object-cover"
                />
                {item.title ? (
                  <figcaption className="border-t border-slate-100 px-4 py-2 text-sm text-slate-600">
                    {item.title}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </div>
      ) : null}

      {videos.length > 0 ? (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <Film className="h-4 w-4" />
            Videos
          </h3>
          <div className="space-y-6">
            {videos.map((item) => (
              <div
                key={item.id ?? item.url}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm"
              >
                {isDriveEmbedUrl(item.previewSrc) ? (
                  <iframe
                    title={item.title || 'Video'}
                    src={item.previewSrc}
                    className="aspect-video w-full border-0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={item.viewSrc}
                    controls
                    className="aspect-video w-full"
                    preload="metadata"
                  >
                    Your browser does not support video playback.
                  </video>
                )}
                {item.title ? (
                  <p className="bg-white px-4 py-2 text-sm text-slate-600">{item.title}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {documents.length > 0 ? (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <FileText className="h-4 w-4" />
            Documents
          </h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {documents.map((item) => {
              const isPdf = isPdfMedia(item.url, item.type)
              const isWord = isWordDocument(item.url, item.type)
              const viewUrl = isPdf
                ? toAbsoluteUrl(getPdfDirectUrl(item.url, item.type))
                : item.previewSrc

              return (
                <div
                  key={item.id ?? item.url}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  {isPdf ? (
                    <PdfViewer
                      url={item.url}
                      title={item.title || 'Document preview'}
                      className="aspect-[4/3] w-full"
                    />
                  ) : isWord || isDriveEmbedUrl(item.previewSrc) ? (
                    <iframe
                      title={item.title || 'Document preview'}
                      src={item.previewSrc}
                      className="aspect-[4/3] w-full border-0 bg-slate-100"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-slate-50 p-6 text-center">
                      <FileText className="h-12 w-12 text-primary" strokeWidth={1.5} />
                      <p className="text-sm font-medium text-slate-700">
                        {item.title || item.fileName || 'Document'}
                      </p>
                      <p className="text-xs text-slate-500">Use View to open in your browser</p>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3">
                    <span className="text-sm font-medium text-slate-800">
                      {item.title || MEDIA_LABELS[item.type]}
                    </span>
                    <div className="flex gap-2">
                      <a
                        href={viewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15"
                      >
                        View
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <a
                        href={getDocumentDownloadUrl(item.viewSrc)}
                        download={item.fileName || undefined}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-primary hover:text-primary"
                      >
                        Download
                        <Download className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </section>
  )
}
