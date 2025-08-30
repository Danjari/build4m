import { auth } from '@clerk/nextjs/server'
import { createOrUpdateUser } from './db/users'

export async function getCurrentUser() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  // Get user from Clerk
  const userResult = await createOrUpdateUser(userId, '', '')
  
  if (!userResult.success) {
    console.error('Failed to get user from database:', userResult.error)
    return null
  }

  return userResult.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}
