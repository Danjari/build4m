import { prisma } from '../prisma'

export async function createOrUpdateUser(clerkId: string, email: string, name?: string) {
  try {
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {
        email,
        name,
        updatedAt: new Date(),
      },
      create: {
        clerkId,
        email,
        name,
      },
    })

    return { success: true, user }
  } catch (error) {
    console.error('Error creating/updating user:', error)
    return { success: false, error: 'Failed to create/update user' }
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        _count: {
          select: { forms: true },
        },
      },
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    return { success: true, user }
  } catch (error) {
    console.error('Error fetching user:', error)
    return { success: false, error: 'Failed to fetch user' }
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        forms: {
          include: {
            _count: {
              select: { responses: true },
            },
          },
          orderBy: { updatedAt: 'desc' },
        },
        _count: {
          select: { forms: true },
        },
      },
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    return { success: true, user }
  } catch (error) {
    console.error('Error fetching user:', error)
    return { success: false, error: 'Failed to fetch user' }
  }
}

export async function deleteUser(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    await prisma.user.delete({
      where: { clerkId },
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: 'Failed to delete user' }
  }
}
