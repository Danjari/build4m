export interface FormResponse {
    id: string
    formId: string
    data: Record<string, any>
    submittedAt: Date
    ipAddress?: string
    userAgent?: string
  }
  
  export interface SubmissionResult {
    success: boolean
    responseId?: string
    error?: string
  }
  