import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import HomePageClient from './home-client'
import NavBar from '@/components/NavBar'

export default async function HomePage() {
  const { userId } = await auth()

  if (userId) {
    redirect('/dashboard')
  }

  return (
  <div>
    <NavBar />
    <HomePageClient />
  </div>
  )
}
