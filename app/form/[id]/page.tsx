"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import type { FormData, FormField } from "../../../types/form"
import { FormSubmissionService } from "@/services/form-submision"
import Link from "next/link"

export default function FormViewPage() {
  const params = useParams()
  const [formData, setFormData] = useState<FormData | null>(null)
  const [responseData, setResponseData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadForm()
  }, [params.id])

  const loadForm = () => {
    try {
      const savedForm = localStorage.getItem(`form_${params.id}`)
      if (savedForm) {
        const form = JSON.parse(savedForm)
        if (form.published) {
          setFormData({
            ...form,
            createdAt: new Date(form.createdAt),
            updatedAt: new Date(form.updatedAt),
          })
        } else {
          setSubmitError("This form is not published yet.")
        }
      } else {
        setSubmitError("Form not found.")
      }
    } catch (error) {
      setSubmitError("Error loading form.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    setResponseData((prev) => ({ ...prev, [fieldId]: value }))

    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }))
    }
  }

  const validateForm = (): boolean => {
    if (!formData) return false

    const newErrors: Record<string, string> = {}
    let isValid = true

    formData.fields.forEach((field) => {
      const error = FormSubmissionService.validateField(field, responseData[field.id])
      if (error) {
        newErrors[field.id] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData || isSubmitting) return

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const result = await FormSubmissionService.submitForm(formData, responseData)

      if (result.success) {
        setIsSubmitted(true)
        // Redirect if URL is provided
        if (formData.redirectUrl) {
          setTimeout(() => {
            window.location.href = formData.redirectUrl!
          }, 2000)
        }
      } else {
        setSubmitError(result.error || "Submission failed")
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const baseClasses = `w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
      errors[field.id] ? "border-red-500 bg-red-50" : "border-gray-300"
    }`

    const value = responseData[field.id] || ""

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "number":
        return (
          <input
            type={field.type === "phone" ? "tel" : field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={baseClasses}
            required={field.required}
          />
        )

      case "textarea":
        return (
          <textarea
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            rows={4}
            className={baseClasses}
            required={field.required}
          />
        )

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={baseClasses}
            required={field.required}
          >
            <option value="">{field.placeholder || "Choose an option"}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case "radio":
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="text-orange-500 focus:ring-orange-500"
                  required={field.required}
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case "checkbox":
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(value) ? value.includes(option) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : []
                    if (e.target.checked) {
                      handleFieldChange(field.id, [...currentValues, option])
                    } else {
                      handleFieldChange(
                        field.id,
                        currentValues.filter((v) => v !== option),
                      )
                    }
                  }}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={baseClasses}
            required={field.required}
          />
        )

      case "file":
        return (
          <div className="relative">
            <input
              type="file"
              onChange={(e) => handleFieldChange(field.id, e.target.files?.[0])}
              className="hidden"
              id={`file-${field.id}`}
              required={field.required}
            />
            <label
              htmlFor={`file-${field.id}`}
              className={`block w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                errors[field.id] ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="text-gray-600">
                {value ? (
                  <span className="text-green-600">File selected: {value.name}</span>
                ) : (
                  <span>Click to upload or drag and drop</span>
                )}
              </div>
            </label>
          </div>
        )

      case "rating":
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleFieldChange(field.id, star)}
                className={`text-3xl transition-colors ${
                  value >= star ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"
                }`}
              >
                ★
              </button>
            ))}
            {value && <span className="ml-2 text-gray-600">({value}/5)</span>}
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  if (submitError && !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-full"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Form Not Available</h2>
          <p className="text-gray-600">{submitError}</p>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 text-green-600 text-2xl">✓</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">{formData?.submitMessage}</p>
          {formData?.redirectUrl && <p className="text-sm text-gray-500">Redirecting you shortly...</p>}
        </div>
      </div>
    )
  }

  if (!formData) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-balance">{formData.title}</h1>
            <p className="text-gray-600 text-lg">{formData.description}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {formData.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
                {errors[field.id] && <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>}
              </div>
            ))}

            {/* Submit Error */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{submitError}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  "Submit Form"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Powered by{" "}
            <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium">
              Build4m
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
