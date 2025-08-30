import type { FormField, AIGenerationResponse } from "../types/form"

// Mock AI service - in production this would call Google Gemini AI
export class AIFormGenerator {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  private static parsePromptToFields(prompt: string): FormField[] {
    const fields: FormField[] = []
    const lowercasePrompt = prompt.toLowerCase()

    // Basic field detection patterns
    const fieldPatterns = [
      { keywords: ["name", "full name", "first name", "last name"], type: "text" as const, label: "Name" },
      { keywords: ["email", "email address", "e-mail"], type: "email" as const, label: "Email Address" },
      { keywords: ["phone", "telephone", "mobile", "contact number"], type: "phone" as const, label: "Phone Number" },
      { keywords: ["age", "number", "quantity", "amount"], type: "number" as const, label: "Number" },
      {
        keywords: ["message", "comment", "description", "details", "feedback"],
        type: "textarea" as const,
        label: "Message",
      },
      { keywords: ["date", "birthday", "appointment"], type: "date" as const, label: "Date" },
      { keywords: ["file", "upload", "attachment", "document"], type: "file" as const, label: "File Upload" },
      { keywords: ["rating", "rate", "stars", "review"], type: "rating" as const, label: "Rating" },
    ]

    // Detect fields based on keywords
    fieldPatterns.forEach((pattern) => {
      if (pattern.keywords.some((keyword) => lowercasePrompt.includes(keyword))) {
        fields.push({
          id: this.generateId(),
          type: pattern.type,
          label: pattern.label,
          placeholder: `Enter your ${pattern.label.toLowerCase()}`,
          required: true,
        })
      }
    })

    // Add select/radio fields for choice-based prompts
    if (
      lowercasePrompt.includes("select") ||
      lowercasePrompt.includes("choose") ||
      lowercasePrompt.includes("option")
    ) {
      fields.push({
        id: this.generateId(),
        type: "select",
        label: "Please Select",
        required: true,
        options: ["Option 1", "Option 2", "Option 3"],
      })
    }

    // Add checkbox for multiple choice
    if (
      lowercasePrompt.includes("multiple") ||
      lowercasePrompt.includes("checkbox") ||
      lowercasePrompt.includes("all that apply")
    ) {
      fields.push({
        id: this.generateId(),
        type: "checkbox",
        label: "Select All That Apply",
        required: false,
        options: ["Choice 1", "Choice 2", "Choice 3"],
      })
    }

    // Default fields if none detected
    if (fields.length === 0) {
      fields.push(
        {
          id: this.generateId(),
          type: "text",
          label: "Name",
          placeholder: "Enter your name",
          required: true,
        },
        {
          id: this.generateId(),
          type: "email",
          label: "Email Address",
          placeholder: "Enter your email",
          required: true,
        },
      )
    }

    return fields
  }

  static async generateForm(prompt: string): Promise<AIGenerationResponse> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

      // Simulate occasional failures
      if (Math.random() < 0.1) {
        throw new Error("AI service temporarily unavailable")
      }

      const fields = this.parsePromptToFields(prompt)

      // Generate form title from prompt
      const title =
        prompt.length > 50 ? prompt.substring(0, 47) + "..." : prompt.charAt(0).toUpperCase() + prompt.slice(1)

      const form = {
        id: this.generateId(),
        title: title || "Generated Form",
        description: "This form was generated using AI based on your description.",
        fields,
        theme: "default" as const,
        submitMessage: "Thank you for your submission!",
        createdAt: new Date(),
        updatedAt: new Date(),
        published: false,
        responses: 0,
      }

      return {
        success: true,
        form,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate form",
      }
    }
  }
}
