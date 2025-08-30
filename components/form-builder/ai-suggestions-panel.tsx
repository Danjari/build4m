"use client"

import { useState } from "react"
import type { AIFormMetadata, AISuggestion, FormData } from "../../types/form"

interface AISuggestionsPanelProps {
  formData: FormData
  onUpdateForm: (form: FormData) => void
  metadata?: AIFormMetadata | null
}

export function AISuggestionsPanel({ formData, onUpdateForm, metadata }: AISuggestionsPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>(metadata?.suggestions || [])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleAnalyzeForm = async () => {
    setIsAnalyzing(true)
    try {
      // Call the server-side API instead of using AIFormGenerator directly
      const response = await fetch("/api/forms/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
      })

      if (response.ok) {
        const result = await response.json()
        setSuggestions(result.suggestions || [])
        setShowSuggestions(true)
      } else {
        console.error("Form analysis failed")
      }
    } catch (error) {
      console.error("Form analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSuggestionIcon = (type: AISuggestion["type"]) => {
    switch (type) {
      case "add_field":
        return "➕"
      case "modify_field":
        return "✏️"
      case "reorder_fields":
        return "🔄"
      case "improve_label":
        return "🏷️"
      case "add_validation":
        return "✅"
      default:
        return "💡"
    }
  }

  const getPriorityColor = (priority: AISuggestion["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="bg-white border-l border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
        <button
          onClick={handleAnalyzeForm}
          disabled={isAnalyzing}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isAnalyzing ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Analyzing...
            </div>
          ) : (
            "Analyze Form"
          )}
        </button>
      </div>

      {/* Form Stats */}
      {metadata && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Form Analysis</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated completion:</span>
              <span className="font-medium">{metadata.estimatedCompletionTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Complexity:</span>
              <span className="font-medium capitalize">{metadata.complexity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fields:</span>
              <span className="font-medium">{formData.fields.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Improvement Suggestions</h4>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`p-3 border rounded-lg ${getPriorityColor(suggestion.priority)}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">
                    {suggestion.type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                  <p className="text-sm">{suggestion.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      suggestion.priority === "high" ? "bg-red-100 text-red-700" :
                      suggestion.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {suggestion.priority} priority
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <button
            onClick={() => {
              // Add a common field like email if not present
              if (!formData.fields.some(f => f.type === "email")) {
                const newField = {
                  id: Math.random().toString(36).substr(2, 9),
                  type: "email" as const,
                  label: "Email Address",
                  placeholder: "Enter your email address",
                  required: true,
                  options: [],
                  order: formData.fields.length
                }
                onUpdateForm({
                  ...formData,
                  fields: [...formData.fields, newField]
                })
              }
            }}
            className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
          >
            ➕ Add Email Field
          </button>
          <button
            onClick={() => {
              // Add a submit message field if not present
              if (!formData.submitMessage || formData.submitMessage === "Thank you for your submission!") {
                onUpdateForm({
                  ...formData,
                  submitMessage: "Thank you! Your response has been recorded successfully."
                })
              }
            }}
            className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
          >
            ✏️ Improve Submit Message
          </button>
        </div>
      </div>

      {/* AI Tips */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">AI Tips</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <p>💡 Keep forms under 10 fields for better completion rates</p>
          <p>💡 Use clear, action-oriented labels</p>
          <p>💡 Group related fields together</p>
          <p>💡 Make only essential fields required</p>
        </div>
      </div>
    </div>
  )
}
