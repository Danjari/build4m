import { prisma } from '../prisma'
import { FormResponse } from '@/types/response'

export async function submitFormResponse(
  formId: string,
  data: Record<string, string | number | boolean | string[]>,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    // Check if form exists and is published
    const form = await prisma.form.findUnique({
      where: { id: formId },
    })

    if (!form) {
      return { success: false, error: 'Form not found' }
    }

    if (!form.published) {
      return { success: false, error: 'Form is not published' }
    }

    // Create the response
    const response = await prisma.formResponse.create({
      data: {
        formId,
        data,
        ipAddress,
        userAgent,
      },
    })

    // Increment the response count
    await prisma.form.update({
      where: { id: formId },
      data: {
        responseCount: {
          increment: 1,
        },
      },
    })

    return { success: true, responseId: response.id }
  } catch (error) {
    console.error('Error submitting form response:', error)
    return { success: false, error: 'Failed to submit response' }
  }
}

export async function getFormResponses(formId: string, userId: string) {
  try {
    // Verify the form belongs to the user
    const form = await prisma.form.findFirst({
      where: { id: formId, userId },
    })

    if (!form) {
      return { success: false, error: 'Form not found or access denied' }
    }

    const responses = await prisma.formResponse.findMany({
      where: { formId },
      orderBy: { submittedAt: 'desc' },
    })

    return { success: true, responses }
  } catch (error) {
    console.error('Error fetching form responses:', error)
    return { success: false, error: 'Failed to fetch responses' }
  }
}

export async function getFormResponseById(responseId: string, userId: string) {
  try {
    const response = await prisma.formResponse.findUnique({
      where: { id: responseId },
      include: {
        form: {
          include: {
            fields: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })

    if (!response) {
      return { success: false, error: 'Response not found' }
    }

    // Verify the form belongs to the user
    if (response.form.userId !== userId) {
      return { success: false, error: 'Access denied' }
    }

    return { success: true, response }
  } catch (error) {
    console.error('Error fetching form response:', error)
    return { success: false, error: 'Failed to fetch response' }
  }
}

export async function deleteFormResponse(responseId: string, userId: string) {
  try {
    const response = await prisma.formResponse.findUnique({
      where: { id: responseId },
      include: {
        form: true,
      },
    })

    if (!response) {
      return { success: false, error: 'Response not found' }
    }

    // Verify the form belongs to the user
    if (response.form.userId !== userId) {
      return { success: false, error: 'Access denied' }
    }

    await prisma.formResponse.delete({
      where: { id: responseId },
    })

    // Decrement the response count
    await prisma.form.update({
      where: { id: response.formId },
      data: {
        responseCount: {
          decrement: 1,
        },
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting form response:', error)
    return { success: false, error: 'Failed to delete response' }
  }
}

export async function getFormAnalytics(formId: string, userId: string) {
  try {
    // Verify the form belongs to the user
    const form = await prisma.form.findFirst({
      where: { id: formId, userId },
    })

    if (!form) {
      return { success: false, error: 'Form not found or access denied' }
    }

    // Get total responses
    const totalResponses = await prisma.formResponse.count({
      where: { formId },
    })

    // Get responses by date (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentResponses = await prisma.formResponse.count({
      where: {
        formId,
        submittedAt: {
          gte: thirtyDaysAgo,
        },
      },
    })

    // Get responses by day for the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const dailyResponses = await prisma.formResponse.groupBy({
      by: ['submittedAt'],
      where: {
        formId,
        submittedAt: {
          gte: sevenDaysAgo,
        },
      },
      _count: {
        id: true,
      },
    })

    return {
      success: true,
      analytics: {
        totalResponses,
        recentResponses,
        dailyResponses: dailyResponses.map((day) => ({
          date: day.submittedAt.toISOString().split('T')[0],
          count: day._count.id,
        })),
      },
    }
  } catch (error) {
    console.error('Error fetching form analytics:', error)
    return { success: false, error: 'Failed to fetch analytics' }
  }
}
