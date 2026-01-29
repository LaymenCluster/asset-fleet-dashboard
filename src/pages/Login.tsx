import { useState } from "react"
import apiClient from "../api/apiClient"
import { setToken } from "../api/auth"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await apiClient.post("/auth/login", {
        email,
        password,
      })

      setToken(res.data.access_token)
      window.location.href = "/dashboard"
    } catch (err: any) {
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111827] text-[#f9fafb]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 rounded-lg shadow bg-[#1f2937]"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>

        {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded border bg-[#374151] border-[#4b5563] focus:outline-none focus:ring"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 rounded border bg-[#374151] border-[#4b5563] focus:outline-none focus:ring"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}
