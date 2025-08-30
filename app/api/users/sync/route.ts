import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createOrUpdateUser } from '@/lib/db/users'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, name } = body

    const result = await createOrUpdateUser(userId, email, name)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ user: result.user })
  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
