import { NextRequest, NextResponse } from "next/server"
import { submitFormResponse } from "@/lib/db/responses"

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    const result = await submitFormResponse(id, body)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ message: "Response submitted successfully" })
  } catch (error) {
    console.error("Error submitting response:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
