"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import type { FormData, FormField, AIFormMetadata } from "../../../types/form"
import { FieldPalette } from "../../../components/form-builder/field-pallete"
import { FormCanvas } from "../../../components/form-builder/form-canvas"
import { FieldPropertiesPanel } from "../../../components/form-builder/field-propriety-panel"
import { FormPreviewModal } from "../../../components/form-builder/form-preview-modal"
import { AISuggestionsPanel } from "../../../components/form-builder/ai-suggestions-panel"

export default function FormBuilderPage() {
  const params = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState<FormData | null>(null)
  const [selectedField, setSelectedField] = useState<FormField | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [metadata, setMetadata] = useState<AIFormMetadata | null>(null)
  const [activePanel, setActivePanel] = useState<"properties" | "ai">("properties")

  useEffect(() => {
    // Load form data from localStorage (in production, this would be from API)
    const savedForm = localStorage.getItem("currentForm")
    const savedMetadata = localStorage.getItem("formMetadata")
    
    if (savedForm) {
      setFormData(JSON.parse(savedForm))
    } else {
      // Redirect back to home if no form data
      router.push("/")
    }

    if (savedMetadata) {
      setMetadata(JSON.parse(savedMetadata))
    }
  }, [params.id, router])

  const handleAddField = (fieldType: FormField["type"]) => {
    if (!formData) return

    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      type: fieldType,
      label: getDefaultLabel(fieldType),
      placeholder: getDefaultPlaceholder(fieldType),
      required: false,
      ...(needsOptions(fieldType) && { options: ["Option 1", "Option 2", "Option 3"] }),
    }

    setFormData({
      ...formData,
      fields: [...formData.fields, newField],
      updatedAt: new Date(),
    })
  }

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    if (!formData) return

    setFormData({
      ...formData,
      fields: formData.fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)),
      updatedAt: new Date(),
    })

    // Update selected field if it's the one being edited
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates })
    }
  }

  const handleDeleteField = (fieldId: string) => {
    if (!formData) return

    setFormData({
      ...formData,
      fields: formData.fields.filter((field) => field.id !== fieldId),
      updatedAt: new Date(),
    })

    if (selectedField?.id === fieldId) {
      setSelectedField(null)
    }
  }

  const handleReorderFields = (startIndex: number, endIndex: number) => {
    if (!formData) return

    const newFields = Array.from(formData.fields)
    const [reorderedField] = newFields.splice(startIndex, 1)
    newFields.splice(endIndex, 0, reorderedField)

    setFormData({
      ...formData,
      fields: newFields,
      updatedAt: new Date(),
    })
  }

  const handleSaveForm = async () => {
    if (!formData) return

    setIsSaving(true)

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Save to localStorage (in production, this would be API call)
    localStorage.setItem("currentForm", JSON.stringify(formData))
    localStorage.setItem(`form_${formData.id}`, JSON.stringify(formData))

    setIsSaving(false)
  }

  const handlePublishForm = async () => {
    if (!formData) return

    const publishedForm = {
      ...formData,
      published: true,
      updatedAt: new Date(),
    }

    setFormData(publishedForm)
    await handleSaveForm()

    // Navigate to form view
    router.push(`/form/${formData.id}`)
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form builder...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="text-gray-600 hover:text-gray-900 transition-colors">
              ← Back to Home
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{formData.title}</h1>
              <p className="text-sm text-gray-500">
                {formData.published ? "Published" : "Draft"} • {formData.fields.length} fields
                {metadata && ` • ${metadata.complexity} complexity`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Preview
            </button>
            <button
              onClick={handleSaveForm}
              disabled={isSaving}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handlePublishForm}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-300"
            >
              {formData.published ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Field Palette */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <FieldPalette onAddField={handleAddField} />
        </div>

        {/* Form Canvas */}
        <div className="flex-1 overflow-y-auto">
          <FormCanvas
            formData={formData}
            selectedField={selectedField}
            onSelectField={setSelectedField}
            onUpdateField={handleUpdateField}
            onDeleteField={handleDeleteField}
            onReorderFields={handleReorderFields}
          />
        </div>

        {/* Right Panel - Properties or AI Suggestions */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          {/* Panel Toggle */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActivePanel("properties")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activePanel === "properties"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => setActivePanel("ai")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activePanel === "ai"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              AI Assistant
            </button>
          </div>

          {/* Panel Content */}
          {activePanel === "properties" ? (
            <FieldPropertiesPanel
              selectedField={selectedField}
              onUpdateField={handleUpdateField}
              formData={formData}
              onUpdateForm={setFormData}
            />
          ) : (
            <AISuggestionsPanel
              formData={formData}
              onUpdateForm={setFormData}
              metadata={metadata}
            />
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && <FormPreviewModal formData={formData} onClose={() => setShowPreview(false)} />}
    </div>
  )
}

function getDefaultLabel(fieldType: FormField["type"]): string {
  const labels = {
    text: "Text Input",
    email: "Email Address",
    phone: "Phone Number",
    number: "Number",
    textarea: "Message",
    select: "Select Option",
    radio: "Choose One",
    checkbox: "Select All That Apply",
    date: "Date",
    file: "File Upload",
    rating: "Rating",
  }
  return labels[fieldType]
}

function getDefaultPlaceholder(fieldType: FormField["type"]): string {
  const placeholders = {
    text: "Enter text here",
    email: "Enter your email",
    phone: "Enter your phone number",
    number: "Enter a number",
    textarea: "Enter your message",
    select: "Choose an option",
    radio: "Select one option",
    checkbox: "Select options",
    date: "Select a date",
    file: "Choose file",
    rating: "Rate from 1 to 5",
  }
  return placeholders[fieldType]
}

function needsOptions(fieldType: FormField["type"]): boolean {
  return ["select", "radio", "checkbox"].includes(fieldType)
}
