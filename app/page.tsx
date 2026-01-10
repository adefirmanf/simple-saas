import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            LinkShort
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/login"
              className="rounded-md px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight">
            Shorten Your URLs,
            <br />
            Track Your Growth
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Create short, memorable links and track their performance with detailed analytics.
            Perfect for marketers, businesses, and content creators.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent"
            >
              Sign In
            </Link>
          </div>
        </section>

        <section className="border-t bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Features</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <h3 className="mb-2 text-xl font-semibold">Easy URL Shortening</h3>
                <p className="text-muted-foreground">
                  Create short, branded links in seconds with our simple interface.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <h3 className="mb-2 text-xl font-semibold">Click Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor every click with detailed analytics and insights.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <h3 className="mb-2 text-xl font-semibold">Dashboard</h3>
                <p className="text-muted-foreground">
                  Manage all your links from one powerful, intuitive dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LinkShort. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
