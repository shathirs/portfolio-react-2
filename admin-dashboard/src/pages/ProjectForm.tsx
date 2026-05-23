import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { RichTextarea } from '@/components/ui/RichTextarea'
import { Select } from '@/components/ui/Select'
import { TagInput } from '@/components/ui/TagInput'
import { Textarea } from '@/components/ui/Textarea'
import {
  coerceProjectCategory,
  commonTechnologies,
  projectCategories,
  projectStatuses,
  type ProjectCategory,
} from '@/config/projectCategories'
import {
  emptyProjectInput,
  useProjects,
  type ProjectInput,
} from '@/context/ProjectsContext'
import { ProjectMediaManager } from '@/components/projects/ProjectMediaManager'
import { api, ApiError } from '@/lib/api'
import { sortMedia } from '@/lib/projectMedia'
import { normalizeExternalMediaUrl } from '@/lib/googleDriveUrl'
import { resolveMediaUrl } from '@/lib/mediaUrl'
import type { ProjectStatus } from '@/types'

export function ProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const { getProject, addProject, updateProject } = useProjects()

  const [form, setForm] = useState<ProjectInput>(emptyProjectInput())
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectInput, string>>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit && id) {
      const project = getProject(id)
      if (project) {
        const { id: _id, createdAt: _created, ...rest } = project
        setForm({
          ...rest,
          category: coerceProjectCategory(rest.category),
          keyFeatures: rest.keyFeatures ?? [],
          media: rest.media ?? [],
        })
        setImagePreview(resolveMediaUrl(rest.imageUrl))
      } else {
        navigate('/projects', { replace: true })
      }
    }
  }, [id, isEdit, getProject, navigate])

  function updateField<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  async function handleImageChange(file: File | undefined) {
    if (!file) return
    setImageUploading(true)
    setImageError(null)
    try {
      const { url } = await api.uploadProjectImage(file)
      setImagePreview(resolveMediaUrl(url))
      updateField('imageUrl', url)
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Image upload failed')
    } finally {
      setImageUploading(false)
    }
  }

  function validate() {
    const next: Partial<Record<keyof ProjectInput, string>> = {}
    if (!form.title.trim()) next.title = 'Project title is required'
    if (!form.category) next.category = 'Category is required'
    if (!form.shortDescription.trim()) next.shortDescription = 'Short description is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    const payload: ProjectInput = {
      ...form,
      category: coerceProjectCategory(form.category),
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      liveDemoUrl: form.liveDemoUrl.trim(),
      sourceCodeUrl: form.sourceCodeUrl.trim(),
      imageUrl:
        normalizeExternalMediaUrl(form.imageUrl.trim(), 'image') ||
        resolveMediaUrl(form.imageUrl) ||
        form.imageUrl.trim(),
      keyFeatures: (form.keyFeatures ?? []).map((f) => f.trim()).filter(Boolean),
      media: sortMedia(form.media ?? []).map((m, i) => ({
        ...m,
        order: i,
        url: normalizeExternalMediaUrl(m.url.trim(), m.type) || m.url.trim(),
      })),
    }

    try {
      if (isEdit && id) {
        await updateProject(id, payload)
      } else {
        await addProject(payload)
      }
      navigate('/projects')
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to save project.'
      setErrors({ title: message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm space-y-5">
          <Input
            label="Project Title"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="E-Commerce Platform"
            error={errors.title}
          />

          <Select
            label="Category"
            value={form.category}
            onChange={(e) =>
              updateField('category', e.target.value as ProjectCategory)
            }
            options={projectCategories.map((c) => ({ value: c, label: c }))}
            error={errors.category}
          />

          <Textarea
            label="Short Description"
            value={form.shortDescription}
            onChange={(e) => updateField('shortDescription', e.target.value)}
            placeholder="Brief summary for project cards"
            rows={3}
            error={errors.shortDescription}
          />

          <TagInput
            label="Key Features"
            tags={form.keyFeatures ?? []}
            onChange={(tags) => updateField('keyFeatures', tags)}
            placeholder="Type a feature and press Enter"
          />
          <p className="-mt-3 text-xs text-muted">
            Each feature appears as a bullet on the portfolio project page sidebar.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Live Demo Link"
              type="url"
              value={form.liveDemoUrl}
              onChange={(e) => updateField('liveDemoUrl', e.target.value)}
              placeholder="https://..."
            />
            <Input
              label="Source Code Link"
              type="url"
              value={form.sourceCodeUrl}
              onChange={(e) => updateField('sourceCodeUrl', e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>

          <RichTextarea
            label="Detailed Description"
            value={form.detailedDescription}
            onChange={(v) => updateField('detailedDescription', v)}
            placeholder="Project overview, context, and outcomes (prose)..."
          />

          <ProjectMediaManager
            media={form.media ?? []}
            coverUrl={form.imageUrl}
            onChange={(media) => updateField('media', media)}
            onCoverChange={(url) => {
              updateField('imageUrl', url)
              setImagePreview(resolveMediaUrl(url))
            }}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Cover image (project card)
            </label>
            <div className="flex flex-wrap items-start gap-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt=""
                  className="h-28 w-40 rounded-lg object-cover ring-1 ring-border"
                />
              ) : (
                <div className="flex h-28 w-40 items-center justify-center rounded-lg border border-dashed border-border bg-slate-50 text-xs text-muted">
                  No image
                </div>
              )}
              <div className="min-w-0 flex-1 space-y-3">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  disabled={imageUploading}
                  onChange={(e) => {
                    void handleImageChange(e.target.files?.[0])
                    e.target.value = ''
                  }}
                  className="block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary-hover disabled:opacity-60"
                />
                <Input
                  label="Or paste image URL"
                  type="url"
                  value={
                    form.imageUrl.startsWith('blob:') ? '' : form.imageUrl
                  }
                  onChange={(e) => {
                    const url = e.target.value.trim()
                    updateField('imageUrl', url)
                    setImagePreview(resolveMediaUrl(url, 'image'))
                    setImageError(null)
                  }}
                  onBlur={(e) => {
                    const raw = e.target.value.trim()
                    if (!raw || raw.startsWith('/uploads/')) return
                    const normalized = normalizeExternalMediaUrl(raw, 'image')
                    updateField('imageUrl', normalized)
                    setImagePreview(resolveMediaUrl(normalized, 'image'))
                  }}
                  placeholder="Google Drive link or https://…"
                />
                <p className="text-xs text-muted">
                  {imageUploading
                    ? 'Uploading…'
                    : 'Upload to server (may not persist on Render) or paste a Google Drive / image URL.'}
                </p>
                {imageError ? (
                  <p className="text-xs text-red-500">{imageError}</p>
                ) : null}
              </div>
            </div>
          </div>

          <TagInput
            label="Technologies Used"
            tags={form.technologies}
            onChange={(tags) => updateField('technologies', tags)}
            suggestions={commonTechnologies}
          />

          <Select
            label="Status"
            value={form.status}
            onChange={(e) => updateField('status', e.target.value as ProjectStatus)}
            options={projectStatuses.map((s) => ({
              value: s.value,
              label: s.label,
            }))}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link to="/projects">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save Project' : 'Save Project'}
          </Button>
        </div>
      </form>
    </div>
  )
}
