"use client"

import { useState } from "react"
import type { FormData, FormField } from "../../types/form"

interface FieldPropertiesPanelProps {
  selectedField: FormField | null
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void
  formData: FormData
  onUpdateForm: (formData: FormData) => void
}

export function FieldPropertiesPanel({
  selectedField,
  onUpdateField,
  formData,
  onUpdateForm,
}: FieldPropertiesPanelProps) {
  const [newOption, setNewOption] = useState("")

  const handleAddOption = () => {
    if (!selectedField || !newOption.trim()) return

    const currentOptions = selectedField.options || []
    onUpdateField(selectedField.id, {
      options: [...currentOptions, newOption.trim()],
    })
    setNewOption("")
  }

  const handleRemoveOption = (index: number) => {
    if (!selectedField?.options) return

    const newOptions = selectedField.options.filter((_, i) => i !== index)
    onUpdateField(selectedField.id, { options: newOptions })
  }

  const handleUpdateOption = (index: number, value: string) => {
    if (!selectedField?.options) return

    const newOptions = [...selectedField.options]
    newOptions[index] = value
    onUpdateField(selectedField.id, { options: newOptions })
  }

  if (!selectedField) {
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Settings</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Form Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onUpdateForm({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Form Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => onUpdateForm({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Success Message</label>
            <textarea
              value={formData.submitMessage}
              onChange={(e) => onUpdateForm({ ...formData, submitMessage: e.target.value })}
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={formData.theme}
              onChange={(e) => onUpdateForm({ ...formData, theme: e.target.value as FormData["theme"] })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            >
              <option value="default">Default</option>
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Select a field from the canvas to edit its properties, or use the form settings above to customize your
            form.
          </p>
        </div>
      </div>
    )
  }

  const needsOptions = ["select", "radio", "checkbox"].includes(selectedField.type)

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Properties</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Field Label</label>
          <input
            type="text"
            value={selectedField.label}
            onChange={(e) => onUpdateField(selectedField.id, { label: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder Text</label>
          <input
            type="text"
            value={selectedField.placeholder || ""}
            onChange={(e) => onUpdateField(selectedField.id, { placeholder: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="required"
            checked={selectedField.required}
            onChange={(e) => onUpdateField(selectedField.id, { required: e.target.checked })}
            className="text-orange-500"
          />
          <label htmlFor="required" className="text-sm font-medium text-gray-700">
            Required field
          </label>
        </div>

        {needsOptions && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
            <div className="space-y-2">
              {selectedField.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleUpdateOption(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                  <button
                    onClick={() => handleRemoveOption(index)}
                    className="px-3 py-2 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add new option"
                  className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  onKeyPress={(e) => e.key === "Enter" && handleAddOption()}
                />
                <button
                  onClick={handleAddOption}
                  className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
