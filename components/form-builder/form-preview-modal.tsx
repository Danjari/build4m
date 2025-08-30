"use client"

import type { FormData, FormField } from "../../types/form"

interface FormPreviewModalProps {
  formData: FormData
  onClose: () => void
}

export function FormPreviewModal({ formData, onClose }: FormPreviewModalProps) {
  const renderField = (field: FormField) => {
    const baseClasses =
      "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "number":
        return (
          <input
            type={field.type === "phone" ? "tel" : field.type}
            placeholder={field.placeholder}
            className={baseClasses}
            required={field.required}
          />
        )

      case "textarea":
        return <textarea placeholder={field.placeholder} rows={4} className={baseClasses} required={field.required} />

      case "select":
        return (
          <select className={baseClasses} required={field.required}>
            <option value="">{field.placeholder}</option>
            {field.options?.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option: string, index: number) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  className="text-orange-500"
                  required={field.required && index === 0}
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option: string, index: number) => (
              <label key={index} className="flex items-center gap-2">
                <input type="checkbox" value={option} className="text-orange-500" />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case "date":
        return <input type="date" className={baseClasses} required={field.required} />

      case "file":
        return <input type="file" className={baseClasses} required={field.required} />

      case "rating":
        return (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" className="text-2xl text-gray-300 hover:text-yellow-400">
                ★
              </button>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Form Preview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.title}</h2>
              <p className="text-gray-600">{formData.description}</p>
            </div>

            <div className="space-y-6">
              {formData.fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="w-full py-3 bg-orange-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                Submit Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
