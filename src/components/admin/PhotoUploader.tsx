'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { Star, Trash2, Upload, Loader2 } from 'lucide-react'

interface Photo {
  id: string
  url: string
  isPrimary: boolean
  caption?: string | null
  sortOrder?: number | null
}

interface PhotoUploaderProps {
  propertyId: string
  initialPhotos?: Photo[]
}

export function PhotoUploader({ propertyId, initialPhotos = [] }: PhotoUploaderProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = useCallback(async (file: File) => {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, contentType: file.type, propertyId }),
    })
    if (!res.ok) throw new Error('Failed to get upload URL')
    const { uploadUrl, publicUrl } = await res.json()

    await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })

    const isPrimary = photos.length === 0
    const photoRes = await fetch(`/api/properties/${propertyId}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: publicUrl, isPrimary }),
    })
    if (!photoRes.ok) throw new Error('Failed to save photo')
    return photoRes.json() as Promise<Photo>
  }, [propertyId, photos.length])

  async function handleFiles(files: FileList | File[]) {
    setError('')
    setUploading(true)
    try {
      const uploaded: Photo[] = []
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue
        const photo = await uploadFile(file)
        uploaded.push(photo)
      }
      setPhotos((prev) => {
        const updated = [...prev, ...uploaded]
        if (prev.length === 0 && uploaded.length > 0) {
          return updated.map((p, i) => ({ ...p, isPrimary: i === 0 }))
        }
        return updated
      })
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  async function setPrimary(photoId: string) {
    await fetch(`/api/properties/${propertyId}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: photos.find((p) => p.id === photoId)!.url, isPrimary: true }),
    })
    setPhotos((prev) => prev.map((p) => ({ ...p, isPrimary: p.id === photoId })))
  }

  async function deletePhoto(photoId: string) {
    await fetch(`/api/properties/${propertyId}/photos`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoId }),
    })
    setPhotos((prev) => {
      const next = prev.filter((p) => p.id !== photoId)
      if (next.length > 0 && !next.some((p) => p.isPrimary)) {
        next[0].isPrimary = true
      }
      return next
    })
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm space-y-4">
      <h2 className="font-semibold text-stone-900">Photos</h2>

      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-stone-200 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
      >
        {uploading ? (
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        ) : (
          <Upload className="w-8 h-8 text-stone-400" />
        )}
        <p className="text-sm text-stone-500">
          {uploading ? 'Uploading…' : 'Drag photos here or click to browse'}
        </p>
        <p className="text-xs text-stone-400">JPEG, PNG, WebP — multiple files OK</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-stone-100">
              <Image src={photo.url} alt="" fill className="object-cover" sizes="200px" />
              {photo.isPrimary && (
                <span className="absolute top-2 left-2 bg-emerald-700 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  Primary
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!photo.isPrimary && (
                  <button
                    onClick={() => setPrimary(photo.id)}
                    title="Set as primary"
                    className="p-2 bg-white/90 rounded-full hover:bg-white text-emerald-700"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deletePhoto(photo.id)}
                  title="Delete photo"
                  className="p-2 bg-white/90 rounded-full hover:bg-white text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
