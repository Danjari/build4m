"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { FormData } from "../../types/form"
import { DashboardStats } from "../../components/dashboard/dashboard-stats"
import { FormGrid } from "../../components/dashboard/form-grid"
import { SearchBar } from "../../components/search-bar"

export default function DashboardPage() {
  const router = useRouter()
  const [forms, setForms] = useState<FormData[]>([])
  const [filteredForms, setFilteredForms] = useState<FormData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadForms()
  }, [])

  useEffect(() => {
    filterForms()
  }, [forms, searchQuery, filterStatus])

  const loadForms = () => {
    setIsLoading(true)

    // Load forms from localStorage (in production, this would be from API)
    const savedForms: FormData[] = []

    // Get all forms from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("form_")) {
        try {
          const formData = JSON.parse(localStorage.getItem(key) || "{}")
          if (formData.id) {
            savedForms.push({
              ...formData,
              createdAt: new Date(formData.createdAt),
              updatedAt: new Date(formData.updatedAt),
            })
          }
        } catch (error) {
          console.error("Error parsing form data:", error)
        }
      }
    }

    // Add some mock forms if none exist
    if (savedForms.length === 0) {
      const mockForms = generateMockForms()
      mockForms.forEach((form) => {
        localStorage.setItem(`form_${form.id}`, JSON.stringify(form))
      })
      savedForms.push(...mockForms)
    }

    setForms(savedForms.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()))
    setIsLoading(false)
  }

  const filterForms = () => {
    let filtered = forms

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (form) =>
          form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          form.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((form) => (filterStatus === "published" ? form.published : !form.published))
    }

    setFilteredForms(filtered)
  }

  const handleDeleteForm = (formId: string) => {
    if (confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
      localStorage.removeItem(`form_${formId}`)
      setForms(forms.filter((form) => form.id !== formId))
    }
  }

  const handleDuplicateForm = (form: FormData) => {
    const duplicatedForm: FormData = {
      ...form,
      id: Math.random().toString(36).substr(2, 9),
      title: `${form.title} (Copy)`,
      published: false,
      responses: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    localStorage.setItem(`form_${duplicatedForm.id}`, JSON.stringify(duplicatedForm))
    setForms([duplicatedForm, ...forms])
  }

  const stats = {
    totalForms: forms.length,
    publishedForms: forms.filter((f) => f.published).length,
    totalResponses: forms.reduce((sum, f) => sum + f.responses, 0),
    draftForms: forms.filter((f) => !f.published).length,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Manage your forms and track responses</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Create New Form
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Build4m Home
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Statistics */}
        <DashboardStats stats={stats} />

        {/* Search and Filters */}
        <div className="mb-12">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
          />
        </div>

        {/* Forms Grid */}
        <FormGrid
          forms={filteredForms}
          onEdit={(formId) => router.push(`/builder/${formId}`)}
          onView={(formId) => router.push(`/form/${formId}`)}
          onAnalytics={(formId) => router.push(`/analytics/${formId}`)}
          onDelete={handleDeleteForm}
          onDuplicate={handleDuplicateForm}
        />
      </div>
    </div>
  )
}

function generateMockForms(): FormData[] {
  return [
    {
      id: "mock-1",
      title: "Contact Form",
      description: "Get in touch with us",
      fields: [
        { id: "1", type: "text", label: "Name", placeholder: "Your name", required: true },
        { id: "2", type: "email", label: "Email", placeholder: "Your email", required: true },
        { id: "3", type: "textarea", label: "Message", placeholder: "Your message", required: true },
      ],
      theme: "default",
      submitMessage: "Thank you for contacting us!",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      published: true,
      responses: 23,
    },
    {
      id: "mock-2",
      title: "Customer Feedback Survey",
      description: "Help us improve our service",
      fields: [
        { id: "1", type: "rating", label: "Overall Satisfaction", required: true },
        {
          id: "2",
          type: "select",
          label: "How did you hear about us?",
          options: ["Google", "Social Media", "Friend", "Other"],
          required: true,
        },
        {
          id: "3",
          type: "textarea",
          label: "Additional Comments",
          placeholder: "Any other feedback?",
          required: false,
        },
      ],
      theme: "modern",
      submitMessage: "Thank you for your feedback!",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      published: true,
      responses: 47,
    },
    {
      id: "mock-3",
      title: "Job Application Form",
      description: "Apply for open positions",
      fields: [
        { id: "1", type: "text", label: "Full Name", placeholder: "Your full name", required: true },
        { id: "2", type: "email", label: "Email Address", placeholder: "Your email", required: true },
        { id: "3", type: "phone", label: "Phone Number", placeholder: "Your phone", required: true },
        { id: "4", type: "file", label: "Resume", required: true },
        { id: "5", type: "textarea", label: "Cover Letter", placeholder: "Tell us about yourself", required: false },
      ],
      theme: "minimal",
      submitMessage: "Your application has been submitted!",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      published: false,
      responses: 0,
    },
  ]
}
