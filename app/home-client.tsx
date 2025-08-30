"use client"

import type React from "react"
import Image from "next/image"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AIFormGenerator } from "../services/aiFormgenerator"
import type { FormData } from "../types/form"

export default function HomePageClient() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

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
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/bg.png" 
            alt="Background" 
            width={1920}
            height={1080}
            className="object-cover opacity-10"
            priority
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Never build forms <span className="text-orange-600">ever again</span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto text-pretty">
            Describe your form in natural language and watch AI build it instantly. Beautiful, responsive forms with
            Google Sheets integration.
          </p>

          <div className="max-w-2xl mx-auto mb-16">
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
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to collect data</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From AI generation to analytics, Build4m handles every aspect of form creation and management.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: AI Form Builder */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-600 rounded-lg mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Form Builder</h3>
              <p className="text-gray-600 mb-6">
                Describe your form in plain English and watch our AI create it instantly. No technical knowledge
                required.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Natural language processing</li>
                <li>• 11 different field types</li>
                <li>• Smart validation rules</li>
                <li>• Instant form generation</li>
              </ul>
            </div>

            {/* Feature 2: Live Analytics */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Analytics</h3>
              <p className="text-gray-600 mb-6">
                Track responses in real-time with detailed analytics and insights. Export data to Google Sheets
                automatically.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Real-time response tracking</li>
                <li>• Google Sheets integration</li>
                <li>• Completion rate analysis</li>
                <li>• CSV export options</li>
              </ul>
            </div>

            {/* Feature 3: Easy Sharing */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-600 rounded-lg mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Easy Sharing</h3>
              <p className="text-gray-600 mb-6">
                Share your forms instantly with shareable links. Mobile-responsive design works everywhere.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• One-click publishing</li>
                <li>• Shareable links</li>
                <li>• Mobile-responsive design</li>
                <li>• Custom success messages</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-20">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Ready to build your first form?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have simplified their form creation process with AI.
          </p>
          <button className="px-8 py-4 bg-orange-600 text-white text-lg font-semibold rounded-xl hover:bg-orange-700 transition-colors">
            Start Building Forms
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold text-orange-400 mb-4 md:mb-0">Build4m</div>
            <div className="flex gap-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Build4m. Never build forms ever again.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
