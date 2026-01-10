"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteUrlAction } from "./actions"
import { Copy, Trash2, ExternalLink } from "lucide-react"

type Url = {
  id: string
  shortCode: string
  longUrl: string
  createdAt: Date
  _count: {
    clicks: number
  }
}

export function UrlList({ urls }: { urls: Url[] }) {
  const router = useRouter()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = async (shortCode: string, id: string) => {
    const url = `${window.location.origin}/${shortCode}`
    await navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this URL?")) {
      await deleteUrlAction(id)
      router.refresh()
    }
  }

  if (urls.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No URLs created yet</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <div className="divide-y">
        {urls.map((url) => (
          <div key={url.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <code className="rounded bg-muted px-2 py-1 text-sm font-mono font-medium">
                    {window.location.origin}/{url.shortCode}
                  </code>
                  <button
                    onClick={() => copyToClipboard(url.shortCode, url.id)}
                    className="rounded p-1 hover:bg-accent"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  {copiedId === url.id && (
                    <span className="text-xs text-green-600">Copied!</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ExternalLink className="h-3 w-3" />
                  <a
                    href={url.longUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate hover:underline"
                  >
                    {url.longUrl}
                  </a>
                </div>
                <div className="text-xs text-muted-foreground">
                  {url._count.clicks} clicks • Created{" "}
                  {new Date(url.createdAt).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => handleDelete(url.id)}
                className="rounded p-2 text-destructive hover:bg-destructive/10"
                title="Delete URL"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
