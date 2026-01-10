import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export default async function RedirectPage({
  params,
}: {
  params: { shortCode: string }
}) {
  const { shortCode } = params

  const url = await prisma.url.findUnique({
    where: { shortCode },
  })

  if (!url) {
    redirect("/")
  }

  // Track the click
  const headersList = headers()
  const userAgent = headersList.get("user-agent") || undefined
  const referer = headersList.get("referer") || undefined

  await prisma.click.create({
    data: {
      urlId: url.id,
      userAgent,
      referer,
    },
  })

  redirect(url.longUrl)
}
