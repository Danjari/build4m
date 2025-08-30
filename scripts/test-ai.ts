#!/usr/bin/env tsx

import { AIFormGenerator } from "../services/aiFormgenerator"

async function testAIIntegration() {
  console.log("🧪 Testing AI Form Generation...\n")

  try {
    // Test 1: Basic form generation
    console.log("📝 Test 1: Generating a contact form...")
    const result1 = await AIFormGenerator.generateForm(
      "Create a contact form with name, email, phone, and message fields"
    )
    
    if (result1.success && result1.form) {
      console.log("✅ Contact form generated successfully!")
      console.log(`   Title: ${result1.form.title}`)
      console.log(`   Fields: ${result1.form.fields?.length || 0}`)
      console.log(`   Estimated completion: ${result1.metadata?.estimatedCompletionTime}`)
      console.log(`   Complexity: ${result1.metadata?.complexity}`)
      console.log(`   Suggestions: ${result1.metadata?.suggestions.length || 0}`)
    } else {
      console.log("❌ Contact form generation failed:", result1.error)
    }

    console.log("\n" + "=".repeat(50) + "\n")

    // Test 2: Job application form
    console.log("📝 Test 2: Generating a job application form...")
    const result2 = await AIFormGenerator.generateForm(
      "Build a job application form with personal details, work experience, education, and file upload for resume"
    )
    
    if (result2.success && result2.form) {
      console.log("✅ Job application form generated successfully!")
      console.log(`   Title: ${result2.form.title}`)
      console.log(`   Fields: ${result2.form.fields?.length || 0}`)
      console.log(`   Estimated completion: ${result2.metadata?.estimatedCompletionTime}`)
      console.log(`   Complexity: ${result2.metadata?.complexity}`)
      console.log(`   Suggestions: ${result2.metadata?.suggestions.length || 0}`)
    } else {
      console.log("❌ Job application form generation failed:", result2.error)
    }

    console.log("\n" + "=".repeat(50) + "\n")

    // Test 3: Field type suggestion
    console.log("📝 Test 3: Testing field type suggestion...")
    const fieldType = await AIFormGenerator.suggestFieldType("user's age")
    console.log(`✅ Suggested field type for "user's age": ${fieldType}`)

    console.log("\n" + "=".repeat(50) + "\n")

    // Test 4: Form optimization
    if (result1.success && result1.form) {
      console.log("📝 Test 4: Testing form optimization...")
      
      // Ensure the form has all required properties
      const completeForm = {
        id: result1.form.id || "test-form-id",
        title: result1.form.title || "Test Form",
        description: result1.form.description || "",
        fields: result1.form.fields || [],
        submitMessage: result1.form.submitMessage || "Thank you for your submission!",
        theme: result1.form.theme || "default",
        published: result1.form.published || false,
        createdAt: result1.form.createdAt || new Date(),
        updatedAt: result1.form.updatedAt || new Date(),
        responses: result1.form.responses || 0
      }
      
      const optimization = await AIFormGenerator.optimizeForm(completeForm)
      console.log(`✅ Form optimization completed!`)
      console.log(`   Suggestions: ${optimization.suggestions.length}`)
      
      if (optimization.suggestions.length > 0) {
        console.log("   Top suggestions:")
        optimization.suggestions.slice(0, 3).forEach((suggestion, index) => {
          console.log(`     ${index + 1}. ${suggestion.description} (${suggestion.priority} priority)`)
        })
      }
    }

    console.log("\n🎉 All tests completed successfully!")

  } catch (error) {
    console.error("❌ Test failed:", error)
    process.exit(1)
  }
}

// Check if GOOGLE_AI_API_KEY is set
if (!process.env.GOOGLE_AI_API_KEY) {
  console.error("❌ GOOGLE_AI_API_KEY environment variable is not set!")
  console.log("Please add your Google AI API key to your .env file:")
  console.log("GOOGLE_AI_API_KEY=your_api_key_here")
  process.exit(1)
}

// Run the tests
testAIIntegration()
