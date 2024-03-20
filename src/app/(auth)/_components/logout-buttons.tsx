"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { is } from "drizzle-orm"
import { signOut } from "next-auth/react"
import { toast } from "sonner"

import { redirects } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useMounted } from "@/hooks/use-mounted"
import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

export function LogOutButtons() {
  const router = useRouter()
  const mounted = useMounted()
  const [loading, setLoading] = React.useState(false)

  async function onSubmit() {
    try {
      setLoading(true)
      await signOut({ redirect: false })
      router.push(redirects.toLogin)
      toast.success("You are now logged out.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full items-center space-x-2">
      {mounted ? (
        <Button
          aria-label="Log out"
          size="sm"
          className="w-full"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
          Log out
        </Button>
      ) : (
        <Skeleton
          className={cn(
            buttonVariants({ size: "sm" }),
            "w-full bg-muted text-muted-foreground"
          )}
        >
          Log out
        </Skeleton>
      )}
      <Button
        aria-label="Go back to the previous page"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => router.back()}
        disabled={loading}
      >
        Go back
      </Button>
    </div>
  )
}
