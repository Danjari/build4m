"use client"

import type React from "react"

import { useState } from "react"
import type { FormData, FormField } from "../../types/form"

interface FormCanvasProps {
  formData: FormData
  selectedField: FormField | null
  onSelectField: (field: FormField | null) => void
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void
  onDeleteField: (fieldId: string) => void
  onReorderFields: (startIndex: number, endIndex: number) => void
}

export function FormCanvas({
  formData,
  selectedField,
  onSelectField,
  onUpdateField,
  onDeleteField,
  onReorderFields,
}: FormCanvasProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorderFields(draggedIndex, dropIndex)
    }
    setDraggedIndex(null)
  }

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
            disabled
          />
        )

      case "textarea":
        return <textarea placeholder={field.placeholder} rows={4} className={baseClasses} disabled />

      case "select":
        return (
          <select className={baseClasses} disabled>
            <option>{field.placeholder}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input type="radio" name={field.id} disabled className="text-orange-500" />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input type="checkbox" disabled className="text-orange-500" />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case "date":
        return <input type="date" className={baseClasses} disabled />

      case "file":
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="text-gray-500">Click to upload or drag and drop</div>
          </div>
        )

      case "rating":
        return (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} className="text-2xl text-gray-300 hover:text-yellow-400" disabled>
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
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {/* Form Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.title}</h2>
          <p className="text-gray-600">{formData.description}</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {formData.fields.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No fields added yet</p>
              <p>Add fields from the palette on the left to get started</p>
            </div>
          ) : (
            formData.fields.map((field, index) => (
              <div
                key={field.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onClick={() => onSelectField(field)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedField?.id === field.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteField(field.id)
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                    <div className="text-gray-400 cursor-move">⋮⋮</div>
                  </div>
                </div>
                {renderField(field)}
              </div>
            ))
          )}
        </div>

        {/* Submit Button Preview */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 transition-all duration-300 text-white rounded-lg font-medium"
            disabled
          >
            Submit Form
          </button>
        </div>
      </div>
    </div>
  )
}
