"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { nanoid } from "nanoid"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const urlSchema = z.object({
  longUrl: z.string().url("Please enter a valid URL"),
})

export async function createUrlAction(formData: FormData) {
  const session = await auth()

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = urlSchema.safeParse({
    longUrl: formData.get("longUrl"),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  const { longUrl } = validatedFields.data
  const shortCode = nanoid(8)

  try {
    await prisma.url.create({
      data: {
        shortCode,
        longUrl,
        userId: session.user.id as string,
      },
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/urls")

    return { success: true, shortCode }
  } catch {
    return { error: "Failed to create URL" }
  }
}

export async function deleteUrlAction(urlId: string) {
  const session = await auth()

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  const url = await prisma.url.findUnique({
    where: { id: urlId },
  })

  if (!url || url.userId !== session.user.id) {
    return { error: "Unauthorized" }
  }

  try {
    await prisma.url.delete({
      where: { id: urlId },
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/urls")

    return { success: true }
  } catch {
    return { error: "Failed to delete URL" }
  }
}
