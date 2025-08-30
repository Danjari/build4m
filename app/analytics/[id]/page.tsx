"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import type { FormData } from "../../../types/form"
import type { FormResponse } from "../../../types/response"
import { FormSubmissionService } from "../../../services/form-submision"
import { AnalyticsStats } from "../../../components/analytics/stats"
import { ResponseList } from "../../../components/analytics/response-list"
import { ResponseDetailModal } from "../../../components/analytics/response-details"
import { ExportService } from "../../../services/export-services"

export default function AnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState<FormData | null>(null)
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [filteredResponses, setFilteredResponses] = useState<FormResponse[]>([])
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    loadData()
  }, [params.id])

  useEffect(() => {
    filterResponses()
  }, [responses, searchQuery, dateFilter])

  const loadData = () => {
    try {
      // Load form data
      const savedForm = localStorage.getItem(`form_${params.id}`)
      if (savedForm) {
        const form = JSON.parse(savedForm)
        setFormData({
          ...form,
          createdAt: new Date(form.createdAt),
          updatedAt: new Date(form.updatedAt),
        })

        // Load responses
        const formResponses = FormSubmissionService.getFormResponses(params.id as string)
        setResponses(formResponses)
      }
    } catch (error) {
      console.error("Error loading analytics data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterResponses = () => {
    let filtered = responses

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((response) => {
        const searchLower = searchQuery.toLowerCase()
        return Object.values(response.data).some((value) => String(value).toLowerCase().includes(searchLower))
      })
    }

    // Filter by date
    const now = new Date()
    switch (dateFilter) {
      case "today":
        filtered = filtered.filter((response) => {
          const responseDate = new Date(response.submittedAt)
          return responseDate.toDateString() === now.toDateString()
        })
        break
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter((response) => new Date(response.submittedAt) >= weekAgo)
        break
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter((response) => new Date(response.submittedAt) >= monthAgo)
        break
    }

    setFilteredResponses(filtered.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()))
  }

  const handleExportCSV = async () => {
    if (!formData || responses.length === 0) return

    setIsExporting(true)
    try {
      await ExportService.exportToCSV(formData, filteredResponses)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteResponse = (responseId: string) => {
    if (confirm("Are you sure you want to delete this response?")) {
      const updatedResponses = responses.filter((r) => r.id !== responseId)
      setResponses(updatedResponses)
      localStorage.setItem(`responses_${params.id}`, JSON.stringify(updatedResponses))

      // Update form response count
      if (formData) {
        const updatedForm = {
          ...formData,
          responses: Math.max(0, formData.responses - 1),
          updatedAt: new Date(),
        }
        setFormData(updatedForm)
        localStorage.setItem(`form_${formData.id}`, JSON.stringify(updatedForm))
      }
    }
  }

  const getAnalyticsStats = () => {
    const now = new Date()
    const today = responses.filter((r) => new Date(r.submittedAt).toDateString() === now.toDateString())
    const thisWeek = responses.filter(
      (r) => new Date(r.submittedAt) >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    )

    return {
      total: responses.length,
      today: today.length,
      thisWeek: thisWeek.length,
      completionRate: formData ? Math.round((responses.length / Math.max(formData.responses || 1, 1)) * 100) : 0,
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Form Not Found</h2>
          <p className="text-gray-600 mb-4">The form you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Dashboard
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{formData.title} - Analytics</h1>
                <p className="text-gray-600 mt-1">Track responses and analyze form performance</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/form/${formData.id}`)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                View Form
              </button>
              <button
                onClick={() => router.push(`/builder/${formData.id}`)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Edit Form
              </button>
              <button
                onClick={handleExportCSV}
                disabled={isExporting || responses.length === 0}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? "Exporting..." : "Export CSV"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Analytics Stats */}
        <AnalyticsStats stats={getAnalyticsStats()} />

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search responses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Response List */}
        <ResponseList
          responses={filteredResponses}
          formData={formData}
          onViewResponse={setSelectedResponse}
          onDeleteResponse={handleDeleteResponse}
        />
      </div>

      {/* Response Detail Modal */}
      {selectedResponse && (
        <ResponseDetailModal
          response={selectedResponse}
          formData={formData}
          onClose={() => setSelectedResponse(null)}
          onDelete={() => {
            handleDeleteResponse(selectedResponse.id)
            setSelectedResponse(null)
          }}
        />
      )}
    </div>
  )
}
