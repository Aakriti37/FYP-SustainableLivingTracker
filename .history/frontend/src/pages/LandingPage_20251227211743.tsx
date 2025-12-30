import Header from "../components/header"

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Sustainable Living Tracker
        </h1>

        <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
          Track your sustainable habits, reduce your environmental impact,
          and contribute to a greener future.
        </p>

        <div className="mt-8 space-x-4">
          <a
            href="/login"
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-6 py-3 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition"
          >
            Register
          </a>
        </div>
      </main>
    </div>
  )
}

export default LandingPage