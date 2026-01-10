import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Link as LinkIcon, MousePointerClick } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }
  
  const userId = session.user.id as string

  const urls = await prisma.url.findMany({
    where: { userId },
    include: {
      _count: {
        select: { clicks: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  const totalUrls = await prisma.url.count({ where: { userId } })
  const totalClicks = await prisma.click.count({
    where: {
      url: {
        userId,
      },
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name || session.user.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground">
              Total URLs
            </h3>
          </div>
          <p className="mt-2 text-3xl font-bold">{totalUrls}</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center gap-2">
            <MousePointerClick className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Clicks
            </h3>
          </div>
          <p className="mt-2 text-3xl font-bold">{totalClicks}</p>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent URLs</h2>
          <Link
            href="/dashboard/urls"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {urls.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <LinkIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No URLs yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first short URL to get started
            </p>
            <Link
              href="/dashboard/urls"
              className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Create URL
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border">
            <div className="divide-y">
              {urls.map((url) => (
                <div
                  key={url.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex-1">
                    <p className="font-medium">{url.shortCode}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {url.longUrl}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {url._count.clicks} clicks
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
