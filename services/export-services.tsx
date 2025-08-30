import type { FormData } from "../types/form"
import type { FormResponse } from "../types/response"

export class ExportService {
  static async exportToCSV(formData: FormData, responses: FormResponse[]): Promise<void> {
    // Create CSV headers
    const headers = ["Response ID", "Submitted At", "IP Address", ...formData.fields.map((field) => field.label)]

    // Create CSV rows
    const rows = responses.map((response) => [
      response.id,
      response.submittedAt.toISOString(),
      response.ipAddress || "",
      ...formData.fields.map((field) => {
        const value = response.data[field.id]
        if (Array.isArray(value)) {
          return value.join("; ")
        }
        if (typeof value === "object" && value?.name) {
          return value.name
        }
        return String(value || "")
      }),
    ])

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `${formData.title.replace(/[^a-z0-9]/gi, "_")}_responses.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  static async exportToGoogleSheets(formData: FormData, responses: FormResponse[]): Promise<void> {
    // Mock Google Sheets export
    console.log("Exporting to Google Sheets:", {
      formTitle: formData.title,
      responseCount: responses.length,
    })

    // In production, this would integrate with Google Sheets API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    alert("Export to Google Sheets completed! (This is a mock implementation)")
  }
}
