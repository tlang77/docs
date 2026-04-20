import { NextResponse } from 'next/server'
import { auth, isAgent } from '@/lib/auth'
import { getPresignedUploadUrl } from '@/lib/r2'
import { z } from 'zod'

const schema = z.object({
  filename: z.string().min(1),
  contentType: z.string().regex(/^image\//),
  propertyId: z.string().min(1),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session || !isAgent(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const ext = parsed.data.filename.split('.').pop()
  const key = `properties/${parsed.data.propertyId}/${Date.now()}.${ext}`

  const { uploadUrl, publicUrl } = await getPresignedUploadUrl(key, parsed.data.contentType)
  return NextResponse.json({ uploadUrl, publicUrl })
}
