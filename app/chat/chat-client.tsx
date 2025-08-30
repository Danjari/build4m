"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { AIFormGenerator } from "../../services/aiFormgenerator"
import type { FormData } from "../../types/form"

export default function ChatPageClient() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useUser()
  const [userName, setUserName] = useState("")

  useEffect(() => {
    if (user) {
      setUserName(user.firstName || user.username || "there")
    }
  }, [user])

  const handleGenerateForm = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const result = await AIFormGenerator.generateForm(prompt.trim())

      if (result.success && result.form) {
        // Store the generated form in localStorage for now
        // In production, this would be saved to a database
        const formData: FormData = result.form as FormData
        localStorage.setItem("currentForm", JSON.stringify(formData))

        // Navigate to form builder
        router.push(`/builder/${formData.id}`)
      } else {
        setError(result.error || "Failed to generate form")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleGenerateForm()
    }
  }

  const examplePrompts = [
    "Create a contact form with name, email, phone, and message fields",
    "Build a job application form with personal details, experience, and file upload",
    "Make a customer feedback form with rating and comments",
    "Design an event registration form with attendee information and preferences",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Form Builder</h1>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Hey, {userName}! What type of form are we building today?
          </h2>
          <p className="text-lg text-gray-600">
            Describe your form in natural language and watch AI build it instantly.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                  AI
                </div>
                <div className="flex-1">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your form... e.g., 'Create a contact form with name, email, phone, and message fields'"
                    className="w-full h-24 bg-transparent border-none outline-none resize-none text-gray-800 placeholder-gray-500 text-lg"
                    disabled={isGenerating}
                  />

                  {/* Error Display */}
                  {error && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500">
                      {isGenerating ? (
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                          Generating your form...
                        </span>
                      ) : (
                        "Press Enter or click Generate"
                      )}
                    </div>
                    <button
                      onClick={handleGenerateForm}
                      disabled={!prompt.trim() || isGenerating}
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Generating...
                        </div>
                      ) : (
                        "Generate Form"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-500 mb-4 text-center">Try these examples:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  disabled={isGenerating}
                  className="p-3 text-left text-sm bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &quot;{example}&quot;
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
