import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { AIFormGenerator } from "@/services/aiFormgenerator"
import { createForm } from "@/lib/db/forms"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      // Return a redirect response to sign in
      return NextResponse.json(
        { 
          error: "Authentication required",
          redirectTo: "/sign-in"
        }, 
        { status: 401 }
      )
    }

    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Generate form using AI
    const result = await AIFormGenerator.generateForm(prompt)

    if (!result.success || !result.form) {
      return NextResponse.json(
        { error: result.error || "Failed to generate form" },
        { status: 500 }
      )
    }

    // Save the generated form to database
    const saveResult = await createForm(userId, result.form)
    
    if (!saveResult.success || !saveResult.form) {
      return NextResponse.json(
        { error: saveResult.error || "Failed to save form" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      form: saveResult.form,
      metadata: result.metadata
    })

  } catch (error) {
    console.error("Form generation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
