import { NextRequest, NextResponse } from 'next/server'
import { getFormById } from '@/lib/db/forms'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await getFormById(params.id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 })
    }

    // Only return published forms
    if (!result.form.published) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    return NextResponse.json({ form: result.form })
  } catch (error) {
    console.error('Error fetching public form:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
