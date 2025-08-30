import { SignIn } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Page() {
  const { userId } = await auth()
  
  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn 
      appearance={{
        elements: {
          formButtonPrimary: "bg-orange-600 hover:bg-orange-700",
        },
      }}
       />
    </div>
  )
}