import Link from "next/link"
import { GraduationCap, BookOpen } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-blue-50 opacity-50" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                ExamPlatform
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your gateway to comprehensive examination experiences. Choose your role and begin your journey today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Examiner Card */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-100 to-emerald-50 transform transition-transform group-hover:scale-[1.02] duration-300" />
              <div className="relative bg-white rounded-2xl shadow-lg p-8 border border-emerald-100 flex flex-col items-center transition-all duration-300 group-hover:shadow-xl">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-8 transform transition-transform group-hover:scale-110 duration-300">
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Examiner Portal</h2>
                <p className="text-gray-600 text-center text-lg mb-8">
                  Create comprehensive exams, manage examinees, and track their performance in one unified platform.
                </p>
                <div className="mt-auto space-y-4 w-full max-w-sm">
                  <Link
                    href="/authentication/login?role=teachers"
                    className="flex justify-center w-full px-6 py-4 text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Sign in as Examiner
                  </Link>
                  <Link
                    href="/authentication/register?role=teachers"
                    className="flex justify-center w-full px-6 py-4 text-emerald-700 bg-emerald-50 rounded-xl font-semibold hover:bg-emerald-100 transition-all duration-300"
                  >
                    Create Examiner Account
                  </Link>
                </div>
              </div>
            </div>

            {/* Examinee Card */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-100 to-blue-50 transform transition-transform group-hover:scale-[1.02] duration-300" />
              <div className="relative bg-white rounded-2xl shadow-lg p-8 border border-blue-100 flex flex-col items-center transition-all duration-300 group-hover:shadow-xl">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-8 transform transition-transform group-hover:scale-110 duration-300">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Examinee Portal</h2>
                <p className="text-gray-600 text-center text-lg mb-8">
                  Access interactive exams, track your performance progress, and connect with expert examiners.
                </p>
                <div className="mt-auto space-y-4 w-full max-w-sm">
                  <Link
                    href="/authentication/login?role=students"
                    className="flex justify-center w-full px-6 py-4 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Sign in as Examinee
                  </Link>
                  <Link
                    href="/authentication/register?role=students"
                    className="flex justify-center w-full px-6 py-4 text-blue-700 bg-blue-50 rounded-xl font-semibold hover:bg-blue-100 transition-all duration-300"
                  >
                    Create Examinee Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

