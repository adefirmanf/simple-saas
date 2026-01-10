import { auth } from "@/auth"

export default auth((req) => {
  // Auth is handled in auth.config.ts
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
