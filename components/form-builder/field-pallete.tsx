"use client"

interface FieldPaletteProps {
  onAddField: (fieldType: FormField["type"]) => void
}

import type { FormField } from "../../types/form"

export function FieldPalette({ onAddField }: FieldPaletteProps) {
  const fieldTypes: Array<{
    type: FormField["type"]
    label: string
    description: string
  }> = [
    { type: "text", label: "Text Input", description: "Single line text field" },
    { type: "email", label: "Email", description: "Email address with validation" },
    { type: "phone", label: "Phone", description: "Phone number input" },
    { type: "number", label: "Number", description: "Numeric input field" },
    { type: "textarea", label: "Textarea", description: "Multi-line text input" },
    { type: "select", label: "Select Dropdown", description: "Dropdown selection" },
    { type: "radio", label: "Radio Buttons", description: "Single choice selection" },
    { type: "checkbox", label: "Checkboxes", description: "Multiple choice selection" },
    { type: "date", label: "Date Picker", description: "Date selection field" },
    { type: "file", label: "File Upload", description: "File attachment field" },
    { type: "rating", label: "Rating", description: "Star rating input" },
  ]

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Fields</h3>
      <div className="space-y-2">
        {fieldTypes.map((fieldType) => (
          <button
            key={fieldType.type}
            onClick={() => onAddField(fieldType.type)}
            className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors group"
          >
            <div className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
              {fieldType.label}
            </div>
            <div className="text-sm text-gray-500 mt-1">{fieldType.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
