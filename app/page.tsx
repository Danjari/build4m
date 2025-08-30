import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import HomePageClient from './home-client'

export default async function HomePage() {
  const { userId } = await auth()

  if (userId) {
    redirect('/chat')
  }

  return (
  <div>
    <HomePageClient />
  </div>
  )
}
