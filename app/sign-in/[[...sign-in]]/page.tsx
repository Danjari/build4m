import { SignIn } from '@clerk/nextjs'

export default function Page() {
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