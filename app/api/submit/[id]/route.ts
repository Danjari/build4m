import { NextRequest, NextResponse } from 'next/server'
import { submitFormResponse } from '@/lib/db/responses'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const result = await submitFormResponse(
      params.id,
      body.data,
      ipAddress,
      userAgent
    )

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      responseId: result.responseId 
    }, { status: 201 })
  } catch (error) {
    console.error('Error submitting form response:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
