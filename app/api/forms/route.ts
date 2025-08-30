import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createForm, getUserForms } from '@/lib/db/forms'
import { createOrUpdateUser } from '@/lib/db/users'

export async function GET() {
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

    const result = await getUserForms(userResult.user!.id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ forms: result.forms })
  } catch (error) {
    console.error('Error fetching forms:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Ensure user exists in our database
    const userResult = await createOrUpdateUser(userId, '', '')
    if (!userResult.success) {
      return NextResponse.json({ error: 'Failed to get user' }, { status: 500 })
    }

    const result = await createForm(userResult.user!.id, body)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ form: result.form }, { status: 201 })
  } catch (error) {
    console.error('Error creating form:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
