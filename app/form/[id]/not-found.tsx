import Link from "next/link";

export default function NotFound() {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Form Not Found</h2>
          <p className="text-gray-600 mb-6">The form you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Go to Build4m
          </Link>
        </div>
      </div>
    )
  }
  