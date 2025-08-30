import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import ChatPageClient from './chat-client'

export default async function ChatPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div>
      <ChatPageClient />
    </div>
  )
}
