"use client"

import type { FormData } from "../../types/form"

interface FormGridProps {
  forms: FormData[]
  onEdit: (formId: string) => void
  onView: (formId: string) => void
  onAnalytics: (formId: string) => void
  onDelete: (formId: string) => void
  onDuplicate: (form: FormData) => void
}

export function FormGrid({ forms, onEdit, onView, onAnalytics, onDelete, onDuplicate }: FormGridProps) {
  if (forms.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
        <div className="text-gray-400 mb-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
        <p className="text-gray-500 mb-8">Create your first form to get started with collecting responses.</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Create Your First Form
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {forms.map((form) => (
        <FormCard
          key={form.id}
          form={form}
          onEdit={() => onEdit(form.id)}
          onView={() => onView(form.id)}
          onAnalytics={() => onAnalytics(form.id)}
          onDelete={() => onDelete(form.id)}
          onDuplicate={() => onDuplicate(form)}
        />
      ))}
    </div>
  )
}

interface FormCardProps {
  form: FormData
  onEdit: () => void
  onView: () => void
  onAnalytics: () => void
  onDelete: () => void
  onDuplicate: () => void
}

function FormCard({ form, onEdit, onView, onAnalytics, onDelete, onDuplicate }: FormCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{form.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{form.description}</p>
          </div>
          <div className="ml-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                form.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              {form.published ? "Published" : "Draft"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <span>{form.fields.length} fields</span>
          <span>{form.responses} responses</span>
        </div>

        <div className="text-xs text-gray-400 mb-6">Updated {formatDate(form.updatedAt)}</div>

        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          >
            Edit
          </button>
          {form.published && (
            <button
              onClick={onView}
              className="flex-1 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
            >
              View
            </button>
          )}
          {form.published && (
            <button
              onClick={onAnalytics}
              className="flex-1 px-3 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
            >
              Analytics
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={onDuplicate}
            className="flex-1 px-3 py-2 text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 rounded transition-colors"
          >
            Duplicate
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
