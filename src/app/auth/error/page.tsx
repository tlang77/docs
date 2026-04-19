import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Authentication error</h1>
        <p className="text-stone-500 mb-6">Something went wrong signing you in.</p>
        <Link href="/auth/login" className="text-emerald-700 font-medium hover:underline">
          Try again
        </Link>
      </div>
    </div>
  )
}
