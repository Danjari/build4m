import type { FormData, FormField } from "../types/form"
import type { FormResponse, SubmissionResult } from "../types/response"

export class FormSubmissionService {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  static async submitForm(formData: FormData, responseData: Record<string, string | number | boolean | string[]>): Promise<SubmissionResult> {
    try {
      // Simulate submission delay
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

      // Simulate occasional failures
      if (Math.random() < 0.05) {
        throw new Error("Submission failed. Please try again.")
      }

      // Create response record
      const response: FormResponse = {
        id: this.generateId(),
        formId: formData.id,
        data: responseData,
        submittedAt: new Date(),
        ipAddress: "192.168.1.1", // Mock IP
        userAgent: navigator.userAgent,
      }

      // Save response to localStorage (in production, this would be API call)
      const existingResponses = this.getFormResponses(formData.id)
      existingResponses.push(response)
      localStorage.setItem(`responses_${formData.id}`, JSON.stringify(existingResponses))

      // Update form response count
      const updatedForm = {
        ...formData,
        responses: formData.responses + 1,
        updatedAt: new Date(),
      }
      localStorage.setItem(`form_${formData.id}`, JSON.stringify(updatedForm))

      // Mock Google Sheets integration
      await this.syncToGoogleSheets(formData, response)

      return {
        success: true,
        responseId: response.id,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Submission failed",
      }
    }
  }

  static getFormResponses(formId: string): FormResponse[] {
    try {
      const responses = localStorage.getItem(`responses_${formId}`)
      if (!responses) return []

      return JSON.parse(responses).map((r: FormResponse) => ({
        ...r,
        submittedAt: new Date(r.submittedAt),
      }))
    } catch {
      return []
    }
  }

  private static async syncToGoogleSheets(formData: FormData, response: FormResponse): Promise<void> {
    // Mock Google Sheets integration
    console.log("Syncing to Google Sheets:", {
      formTitle: formData.title,
      responseId: response.id,
      data: response.data,
    })

    // In production, this would make actual API calls to Google Sheets
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  static validateField(field: FormField, value: string | number | boolean | string[] | undefined): string | null {
    // Required field validation
    if (field.required && (!value || (typeof value === "string" && !value.trim()))) {
      return `${field.label} is required`
    }

    // Type-specific validation
    switch (field.type) {
      case "email":
        if (typeof value === "string" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address"
        }
        break

      case "phone":
        if (typeof value === "string" && value && !/^[+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-$$$$]/g, ""))) {
          return "Please enter a valid phone number"
        }
        break

      case "number":
        if (value && isNaN(Number(value))) {
          return "Please enter a valid number"
        }
        break

      case "date":
        if (typeof value === "string" && value && isNaN(Date.parse(value))) {
          return "Please enter a valid date"
        }
        break

      case "rating":
        if (value && (isNaN(Number(value)) || Number(value) < 1 || Number(value) > 5)) {
          return "Please select a rating between 1 and 5"
        }
        break
    }

    return null
  }
}
