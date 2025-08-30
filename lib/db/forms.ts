import { prisma } from '../prisma'
import { FormData, FormField } from '@/types/form'

export async function createForm(userId: string, formData: Partial<FormData>) {
  try {
    const form = await prisma.form.create({
      data: {
        title: formData.title || 'Untitled Form',
        description: formData.description || '',
        theme: formData.theme || 'default',
        submitMessage: formData.submitMessage || 'Thank you for your submission!',
        redirectUrl: formData.redirectUrl,
        published: formData.published || false,
        userId,
        fields: {
          create: formData.fields?.map((field, index) => ({
            type: field.type,
            label: field.label,
            placeholder: field.placeholder,
            required: field.required,
            options: field.options,
            order: index,
          })) || [],
        },
      },
      include: {
        fields: {
          orderBy: { order: 'asc' },
        },
        user: {
          select: { name: true, email: true },
        },
      },
    })

    return { success: true, form }
  } catch (error) {
    console.error('Error creating form:', error)
    return { success: false, error: 'Failed to create form' }
  }
}

export async function getFormById(formId: string) {
  try {
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        fields: {
          orderBy: { order: 'asc' },
        },
        user: {
          select: { name: true, email: true },
        },
        _count: {
          select: { responses: true },
        },
      },
    })

    if (!form) {
      return { success: false, error: 'Form not found' }
    }

    return { success: true, form }
  } catch (error) {
    console.error('Error fetching form:', error)
    return { success: false, error: 'Failed to fetch form' }
  }
}

export async function getUserForms(userId: string) {
  try {
    const forms = await prisma.form.findMany({
      where: { userId },
      include: {
        fields: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { responses: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return { success: true, forms }
  } catch (error) {
    console.error('Error fetching user forms:', error)
    return { success: false, error: 'Failed to fetch forms' }
  }
}

export async function updateForm(formId: string, userId: string, formData: Partial<FormData>) {
  try {
    // First, verify the form belongs to the user
    const existingForm = await prisma.form.findFirst({
      where: { id: formId, userId },
    })

    if (!existingForm) {
      return { success: false, error: 'Form not found or access denied' }
    }

    // Update the form
    const form = await prisma.form.update({
      where: { id: formId },
      data: {
        title: formData.title,
        description: formData.description,
        theme: formData.theme,
        submitMessage: formData.submitMessage,
        redirectUrl: formData.redirectUrl,
        published: formData.published,
        updatedAt: new Date(),
      },
      include: {
        fields: {
          orderBy: { order: 'asc' },
        },
      },
    })

    // Update fields if provided
    if (formData.fields) {
      // Delete existing fields
      await prisma.formField.deleteMany({
        where: { formId },
      })

      // Create new fields
      await prisma.formField.createMany({
        data: formData.fields.map((field, index) => ({
          formId,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder,
          required: field.required,
          options: field.options,
          order: index,
        })),
      })

      // Fetch updated form with fields
      const updatedForm = await prisma.form.findUnique({
        where: { id: formId },
        include: {
          fields: {
            orderBy: { order: 'asc' },
          },
        },
      })

      return { success: true, form: updatedForm }
    }

    return { success: true, form }
  } catch (error) {
    console.error('Error updating form:', error)
    return { success: false, error: 'Failed to update form' }
  }
}

export async function deleteForm(formId: string, userId: string) {
  try {
    const form = await prisma.form.findFirst({
      where: { id: formId, userId },
    })

    if (!form) {
      return { success: false, error: 'Form not found or access denied' }
    }

    await prisma.form.delete({
      where: { id: formId },
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting form:', error)
    return { success: false, error: 'Failed to delete form' }
  }
}

export async function publishForm(formId: string, userId: string) {
  try {
    const form = await prisma.form.findFirst({
      where: { id: formId, userId },
    })

    if (!form) {
      return { success: false, error: 'Form not found or access denied' }
    }

    const updatedForm = await prisma.form.update({
      where: { id: formId },
      data: { published: true },
    })

    return { success: true, form: updatedForm }
  } catch (error) {
    console.error('Error publishing form:', error)
    return { success: false, error: 'Failed to publish form' }
  }
}

export async function unpublishForm(formId: string, userId: string) {
  try {
    const form = await prisma.form.findFirst({
      where: { id: formId, userId },
    })

    if (!form) {
      return { success: false, error: 'Form not found or access denied' }
    }

    const updatedForm = await prisma.form.update({
      where: { id: formId },
      data: { published: false },
    })

    return { success: true, form: updatedForm }
  } catch (error) {
    console.error('Error unpublishing form:', error)
    return { success: false, error: 'Failed to unpublish form' }
  }
}
