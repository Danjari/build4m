export interface FormField {
    id: string
    type:
      | "text"
      | "email"
      | "phone"
      | "number"
      | "textarea"
      | "select"
      | "radio"
      | "checkbox"
      | "date"
      | "file"
      | "rating"
    label: string
    placeholder?: string
    required: boolean
    options?: string[]
  }
  
  export interface FormData {
    id: string
    title: string
    description: string
    fields: FormField[]
    theme: "default" | "modern" | "minimal"
    submitMessage: string
    redirectUrl?: string
    createdAt: Date
    updatedAt: Date
    published: boolean
    responses: number
  }
  
  export interface AIGenerationResponse {
    success: boolean
    form?: Partial<FormData>
    error?: string
  }
  