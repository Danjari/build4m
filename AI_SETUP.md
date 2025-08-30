# AI Setup Guide

This project now uses **Google Gemini Flash 2.0** for intelligent form generation with function calling.

## Prerequisites

1. **Google AI API Key**: You need a Google AI API key
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

2. **Node.js**: Make sure you have Node.js installed

## Setup Steps

### 1. Environment Configuration

Add your Google AI API key to your `.env` file:

```env
# Google AI (Gemini Flash 2.0)
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Database (you already have this configured)
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/build4m?retryWrites=true&w=majority"

# Clerk (you already have this configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 2. Install Dependencies

The Google AI dependency is already installed:
- `@google/generative-ai`: Google's Generative AI SDK

### 3. AI Features

The enhanced AI system includes:

#### Form Generation
- **Natural Language Processing**: Users describe forms in plain English
- **Function Calling**: Structured form generation with consistent output
- **Field Type Detection**: AI determines appropriate field types
- **Validation Rules**: Automatic validation based on field types

#### Form Optimization
- **AI Analysis**: Analyzes forms for improvements
- **Suggestions**: Provides actionable suggestions with priority levels
- **Completion Time Estimation**: Estimates how long forms take to complete
- **Complexity Assessment**: Evaluates form complexity

#### Smart Features
- **Field Type Suggestions**: AI suggests appropriate field types
- **Form Structure Validation**: Ensures logical field ordering
- **User Experience Optimization**: Improves form flow and completion rates

## API Endpoints

### Form Generation
- `POST /api/forms/generate` - Generate a form using AI
  - Body: `{ "prompt": "Create a contact form with name, email, and message" }`
  - Returns: Form data with AI metadata and suggestions

## AI Service Methods

### AIFormGenerator Class

```typescript
// Generate a complete form from description
const result = await AIFormGenerator.generateForm(prompt)

// Get field type suggestions
const fieldType = await AIFormGenerator.suggestFieldType("user's age")

// Optimize existing form
const optimization = await AIFormGenerator.optimizeForm(formData)
```

## Function Calling Schemas

The AI uses structured function calling for consistent output:

### Form Generation Schema
- **title**: Form title (max 60 characters)
- **description**: Form purpose description
- **fields**: Array of form fields with types, labels, placeholders
- **submitMessage**: Success message
- **theme**: Visual theme (default, modern, minimal)

### Validation Schema
- **suggestions**: Array of improvement suggestions
- **estimatedCompletionTime**: Time estimate for form completion
- **complexity**: Form complexity level (simple, moderate, complex)

## Development Workflow

1. **Set API Key**: Add `GOOGLE_AI_API_KEY` to `.env`
2. **Test Generation**: Try generating forms with natural language
3. **Review Suggestions**: Check AI suggestions in the form builder
4. **Optimize Forms**: Use AI analysis to improve form structure

## Production Deployment

1. Set up your Google AI API key in production environment
2. Ensure the API key has proper permissions
3. Monitor API usage and costs
4. Test form generation thoroughly

## Troubleshooting

### Common Issues

1. **API Key Error**: Check your `GOOGLE_AI_API_KEY` in `.env`
2. **Function Call Errors**: Ensure proper schema formatting
3. **Rate Limiting**: Monitor API usage limits
4. **Response Parsing**: Check function call response structure

### Useful Commands

```bash
# Test AI generation (in development)
curl -X POST http://localhost:3000/api/forms/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a contact form"}'

# Check API key validity
node -e "
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
console.log('API Key configured successfully');
"
```

## Security Considerations

1. **API Key Protection**: Never commit API keys to version control
2. **Rate Limiting**: Implement proper rate limiting for API calls
3. **Input Validation**: Validate all user prompts before sending to AI
4. **Error Handling**: Handle AI service failures gracefully

## Cost Optimization

1. **Prompt Optimization**: Keep prompts concise and specific
2. **Caching**: Cache common form patterns
3. **Batch Processing**: Group similar requests when possible
4. **Usage Monitoring**: Track API usage and costs

## AI Capabilities

### Supported Field Types
- **text**: Single line text input
- **email**: Email address with validation
- **phone**: Phone number input
- **number**: Numeric input
- **textarea**: Multi-line text input
- **select**: Dropdown selection
- **radio**: Single choice selection
- **checkbox**: Multiple choice selection
- **date**: Date picker
- **file**: File upload
- **rating**: Star rating system

### AI Suggestions Types
- **add_field**: Suggest adding missing fields
- **modify_field**: Improve existing fields
- **reorder_fields**: Optimize field order
- **improve_label**: Enhance field labels
- **add_validation**: Add validation rules

### Priority Levels
- **high**: Critical improvements
- **medium**: Important optimizations
- **low**: Nice-to-have enhancements
