import {
  getPdfDirectUrl,
  getPdfEmbedUrl,
  isDriveEmbedUrl,
  toAbsoluteUrl,
} from '@/lib/documentPreview'

interface PdfViewerProps {
  url: string
  title: string
  className?: string
}

/** In-page PDF preview with fallback link if the embed fails */
export function PdfViewer({ url, title, className = '' }: PdfViewerProps) {
  const directUrl = getPdfDirectUrl(url, 'pdf')
  const absoluteDirect = toAbsoluteUrl(directUrl)
  const embedUrl = isDriveEmbedUrl(directUrl)
    ? directUrl
    : getPdfEmbedUrl(url, 'pdf')

  return (
    <div className={['flex flex-col', className].filter(Boolean).join(' ')}>
      <iframe
        title={title}
        src={embedUrl}
        className="min-h-[280px] w-full flex-1 border-0 bg-slate-100"
        allowFullScreen
      />
      <p className="border-t border-slate-100 bg-white px-3 py-2 text-center text-xs text-slate-500">
        If the preview does not load,{' '}
        <a
          href={absoluteDirect}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary hover:underline"
        >
          open the PDF in your browser
        </a>
      </p>
    </div>
  )
}
