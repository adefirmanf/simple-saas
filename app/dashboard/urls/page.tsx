import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { CreateUrlForm } from "./create-url-form"
import { UrlList } from "./url-list"

export default async function UrlsPage() {
  const session = await auth()
  const userId = session!.user!.id as string

  const urls = await prisma.url.findMany({
    where: { userId },
    include: {
      _count: {
        select: { clicks: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My URLs</h1>
        <p className="text-muted-foreground">
          Create and manage your shortened URLs
        </p>
      </div>

      <CreateUrlForm />

      <UrlList urls={urls} />
    </div>
  )
}
