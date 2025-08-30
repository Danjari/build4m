import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai"
import type { FormField, AIGenerationResponse, FormData } from "../types/form"

// Gemini Flash 2.0 AI service
export class AIFormGenerator {
  private static genAI: GoogleGenerativeAI
  private static model: GenerativeModel

  private static initializeAI() {
    if (!this.genAI) {
      const apiKey = process.env.GOOGLE_AI_API_KEY
      if (!apiKey) {
        console.log('apiKey', process.env.GOOGLE_AI_API_KEY)
        throw new Error("GOOGLE_AI_API_KEY environment variable is required")
      }
      this.genAI = new GoogleGenerativeAI(apiKey)
      this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    }
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  static async generateForm(prompt: string): Promise<AIGenerationResponse> {
    try {
      this.initializeAI()

      const aiPrompt = `
You are an expert form designer. Create a professional, user-friendly form based on this description:

"${prompt}"

Generate a JSON response with this exact structure:
{
  "title": "Form Title",
  "description": "Form description",
  "fields": [
    {
      "type": "text|email|phone|number|textarea|select|radio|checkbox|date|file|rating",
      "label": "Field Label",
      "placeholder": "Placeholder text",
      "required": true/false,
      "options": ["option1", "option2"] // only for select, radio, checkbox
    }
  ],
  "submitMessage": "Thank you message",
  "theme": "default|modern|minimal",
  "estimatedCompletionTime": "2-5 minutes",
  "complexity": "simple|moderate|complex",
  "suggestions": [
    {
      "type": "add_field|modify_field|reorder_fields|improve_label|add_validation",
      "description": "Suggestion description",
      "priority": "high|medium|low"
    }
  ]
}

Consider these best practices:
- Start with essential fields (name, email if relevant)
- Use appropriate field types for the data being collected
- Include helpful placeholder text
- Make important fields required
- Keep the form concise and focused
- Use clear, professional labels
- Consider the user experience and flow

Return only valid JSON, no other text.
`

      const result = await this.model.generateContent(aiPrompt)
      const response = await result.response
      const text = response.text()
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("AI response is not valid JSON")
      }

      const aiData = JSON.parse(jsonMatch[0]) as {
        title: string
        description: string
        fields: Array<{
          type: string
          label: string
          placeholder?: string
          required?: boolean
          options?: string[]
        }>
        submitMessage?: string
        theme?: string
        estimatedCompletionTime?: string
        complexity?: string
        suggestions?: Array<{
          type: string
          description: string
          priority: string
        }>
      }

      // Convert to our FormData structure
      const form: FormData = {
        id: this.generateId(),
        title: aiData.title,
        description: aiData.description,
        fields: aiData.fields.map((field, index) => ({
          id: this.generateId(),
          type: field.type as FormField["type"],
          label: field.label,
          placeholder: field.placeholder,
          required: field.required || false,
          options: field.options || [],
          order: index
        })),
        theme: (aiData.theme as FormData["theme"]) || "default",
        submitMessage: aiData.submitMessage || "Thank you for your submission!",
        createdAt: new Date(),
        updatedAt: new Date(),
        published: false,
        responses: 0
      }

      return {
        success: true,
        form,
        metadata: {
          estimatedCompletionTime: aiData.estimatedCompletionTime || "2-5 minutes",
          complexity: (aiData.complexity as "simple" | "moderate" | "complex") || "moderate",
          suggestions: (aiData.suggestions || []).map(s => ({
            type: s.type as "add_field" | "modify_field" | "reorder_fields" | "improve_label" | "add_validation",
            description: s.description,
            priority: s.priority as "high" | "medium" | "low"
          }))
        }
      }

    } catch (error) {
      console.error("AI Form Generation Error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate form with AI"
      }
    }
  }

  // Enhanced field type detection with AI
  static async suggestFieldType(fieldDescription: string): Promise<string> {
    try {
      this.initializeAI()

      const prompt = `
Based on this field description, suggest the most appropriate form field type:

"${fieldDescription}"

Available types: text, email, phone, number, textarea, select, radio, checkbox, date, file, rating

Consider:
- The type of data being collected
- User experience best practices
- Validation requirements
- Mobile-friendliness

Return only the field type name.
`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const fieldType = response.text().trim().toLowerCase()

      // Validate the response
      const validTypes = ["text", "email", "phone", "number", "textarea", "select", "radio", "checkbox", "date", "file", "rating"]
      return validTypes.includes(fieldType) ? fieldType : "text"
    } catch (error) {
      console.error("Field type suggestion error:", error)
      return "text" // fallback
    }
  }

  // AI-powered form optimization
  static async optimizeForm(formData: FormData): Promise<{ suggestions: Array<{
    type: string
    fieldId?: string
    description: string
    priority: string
  }>, optimizedForm: FormData }> {
    try {
      this.initializeAI()

      const prompt = `
Analyze this form and provide optimization suggestions in JSON format:

${JSON.stringify(formData, null, 2)}

Return a JSON object with this structure:
{
  "suggestions": [
    {
      "type": "add_field|modify_field|reorder_fields|improve_label|add_validation",
      "description": "Suggestion description",
      "priority": "high|medium|low"
    }
  ]
}

Consider:
- Field order and logical flow
- Missing essential fields
- Field type appropriateness
- Label clarity and user experience
- Required field selection
- Form length and completion rate
- Mobile responsiveness considerations

Return only valid JSON, no other text.
`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const aiData = JSON.parse(jsonMatch[0]) as {
          suggestions: Array<{
            type: string
            description: string
            priority: string
          }>
        }
        return {
          suggestions: aiData.suggestions || [],
          optimizedForm: formData
        }
      }

      return {
        suggestions: [],
        optimizedForm: formData
      }
    } catch (error) {
      console.error("Form optimization error:", error)
      return {
        suggestions: [],
        optimizedForm: formData
      }
    }
  }
}
