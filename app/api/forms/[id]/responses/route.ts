import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getFormResponses, submitFormResponse } from '@/lib/db/responses'
import { createOrUpdateUser } from '@/lib/db/users'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure user exists in our database
    const userResult = await createOrUpdateUser(userId, '', '')
    if (!userResult.success) {
      return NextResponse.json({ error: 'Failed to get user' }, { status: 500 })
    }

    const result = await getFormResponses(params.id, userResult.user.id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ responses: result.responses })
  } catch (error) {
    console.error('Error fetching form responses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
