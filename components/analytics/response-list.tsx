"use client"

import type { FormData } from "../../types/form"
import type { FormResponse } from "../../types/response"

interface ResponseListProps {
  responses: FormResponse[]
  formData: FormData
  onViewResponse: (response: FormResponse) => void
  onDeleteResponse: (responseId: string) => void
}

export function ResponseList({ responses, formData, onViewResponse, onDeleteResponse }: ResponseListProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getResponsePreview = (response: FormResponse) => {
    const firstField = formData.fields[0]
    if (!firstField) return "No data"

    const value = response.data[firstField.id]
    if (!value) return "No data"

    return String(value).length > 50 ? String(value).substring(0, 50) + "..." : String(value)
  }

  if (responses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
        <p className="text-gray-500 mb-6">Responses will appear here once people start submitting your form.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Responses ({responses.length})</h3>
      </div>

      <div className="divide-y divide-gray-200">
        {responses.map((response) => (
          <div key={response.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm font-medium text-gray-900">Response #{response.id.substring(0, 8)}</span>
                  <span className="text-sm text-gray-500">{formatDate(response.submittedAt)}</span>
                </div>
                <p className="text-gray-600 text-sm">{getResponsePreview(response)}</p>
                {response.ipAddress && <p className="text-xs text-gray-400 mt-1">IP: {response.ipAddress}</p>}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onViewResponse(response)}
                  className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => onDeleteResponse(response.id)}
                  className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
