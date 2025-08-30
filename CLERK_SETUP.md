# Clerk Authentication Setup

This project has been configured with Clerk authentication. Follow these steps to complete the setup:

## 1. Get Your Clerk API Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or select an existing one
3. Navigate to the [API Keys page](https://dashboard.clerk.com/last-active?path=api-keys)
4. Copy your **Publishable Key** and **Secret Key**

## 2. Set Up Environment Variables

Create a `.env.local` file in your project root and add your Clerk keys:

```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY
```

Replace `YOUR_PUBLISHABLE_KEY` and `YOUR_SECRET_KEY` with your actual Clerk API keys.

## 3. Configure Clerk Settings (Optional)

In your Clerk Dashboard, you can customize:

- **Sign-in/Sign-up URLs**: Set custom routes for authentication pages
- **Redirect URLs**: Configure where users are redirected after authentication
- **Appearance**: Customize the look and feel of Clerk components

## 4. Test the Integration

1. Start your development server: `npm run dev`
2. Visit your application
3. You should see Sign In and Sign Up buttons in the header
4. Try signing up or signing in to test the authentication flow

## 5. Protected Routes

The dashboard (`/dashboard`) is now protected and requires authentication. Users will be redirected to the home page if they're not signed in.

## 6. Available Components

The following Clerk components are available throughout your app:

- `<SignInButton>` - Opens the sign-in modal
- `<SignUpButton>` - Opens the sign-up modal  
- `<UserButton>` - Shows user profile and sign-out options
- `<SignedIn>` - Renders content only for authenticated users
- `<SignedOut>` - Renders content only for unauthenticated users

## 7. Server-Side Authentication

For server-side authentication checks, use the `auth()` function:

```typescript
import { auth } from "@clerk/nextjs/server";

export default async function ProtectedPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }
  
  return <div>Protected content</div>;
}
```

## Security Notes

- Never commit your `.env.local` file to version control
- The `.gitignore` file is already configured to exclude `.env*` files
- Always use environment variables for sensitive keys
- Test authentication flows thoroughly before deployment
