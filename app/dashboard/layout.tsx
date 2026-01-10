import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { DashboardNav } from "./nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav user={session.user} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
