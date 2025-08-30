import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignUp 
      appearance={{
        elements: {
          formButtonPrimary: "bg-orange-600 hover:bg-orange-700",
        },
      }}
       />
    </div>
  )
}