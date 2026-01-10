"use client"

import { useState } from "react"
import { createUrlAction } from "./actions"
import { useRouter } from "next/navigation"

export function CreateUrlForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(event.currentTarget)

    try {
      const result = await createUrlAction(formData)

      if (result.error) {
        setError(result.error)
      } else {
        event.currentTarget.reset()
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
        router.refresh()
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <h2 className="mb-4 text-xl font-bold">Create New Short URL</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
            URL created successfully!
          </div>
        )}
        <div>
          <label htmlFor="longUrl" className="block text-sm font-medium">
            Long URL
          </label>
          <input
            id="longUrl"
            name="longUrl"
            type="url"
            required
            placeholder="https://example.com/very-long-url"
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating..." : "Create Short URL"}
        </button>
      </form>
    </div>
  )
}
