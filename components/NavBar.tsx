import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function NavBar() {
  return (
    <header className="p-4 border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-orange-600">
          Build4m
        </Link>
        <div className="flex items-center gap-4">
          <SignedOut>
            <Link 
              href="/sign-in"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link 
              href="/sign-up"
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Get Started
            </Link>
          </SignedOut>
          <SignedIn>
            <Link 
              href="/dashboard" 
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
            <UserButton showName={true} />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}