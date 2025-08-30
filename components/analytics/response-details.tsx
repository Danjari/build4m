"use client"

import type { FormData } from "../../types/form"
import type { FormResponse } from "@/types/response"

interface ResponseDetailModalProps {
  response: FormResponse
  formData: FormData
  onClose: () => void
  onDelete: () => void
}

export function ResponseDetailModal({ response, formData, onClose, onDelete }: ResponseDetailModalProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  const formatValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.join(", ")
    }
    if (typeof value === "object" && value?.name) {
      return `File: ${value.name}`
    }
    return String(value || "No response")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Response #{response.id.substring(0, 8)}</h3>
            <p className="text-sm text-gray-500">{formatDate(response.submittedAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDelete}
              className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
            >
              Delete
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Response Data */}
          <div className="space-y-6 mb-8">
            <h4 className="text-md font-semibold text-gray-900">Form Responses</h4>
            {formData.fields.map((field) => (
              <div key={field.id} className="border-b border-gray-100 pb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="text-gray-900">
                  {response.data[field.id] ? (
                    <span className="bg-gray-50 px-3 py-2 rounded border">{formatValue(response.data[field.id])}</span>
                  ) : (
                    <span className="text-gray-400 italic">No response</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Metadata */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">Submission Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Response ID:</span>
                <span className="ml-2 text-gray-600">{response.id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Submitted:</span>
                <span className="ml-2 text-gray-600">{formatDate(response.submittedAt)}</span>
              </div>
              {response.ipAddress && (
                <div>
                  <span className="font-medium text-gray-700">IP Address:</span>
                  <span className="ml-2 text-gray-600">{response.ipAddress}</span>
                </div>
              )}
              {response.userAgent && (
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">User Agent:</span>
                  <span className="ml-2 text-gray-600 text-xs break-all">{response.userAgent}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
