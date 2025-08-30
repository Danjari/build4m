import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getFormById, updateForm, deleteForm } from '@/lib/db/forms'
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

    const result = await getFormById(params.id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 })
    }

    return NextResponse.json({ form: result.form })
  } catch (error) {
    console.error('Error fetching form:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const result = await updateForm(params.id, userResult.user.id, body)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ form: result.form })
  } catch (error) {
    console.error('Error updating form:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
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

    const result = await deleteForm(params.id, userResult.user.id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ message: 'Form deleted successfully' })
  } catch (error) {
    console.error('Error deleting form:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
