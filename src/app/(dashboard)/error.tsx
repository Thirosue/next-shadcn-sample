"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Shell } from "@/components/shell"

export default function Page() {
  const router = useRouter()

  return (
    <>
      <Shell variant="sidebar">
        <h2 className="font-heading my-2 flex justify-center text-2xl font-bold">
          Oops! Something went wrong.
        </h2>
        <p className="flex justify-center">
          Sorry, The page you are looking for has encountered an error.
        </p>
        <div className="mt-8 flex justify-center gap-2">
          <Button onClick={() => router.back()} variant="default" size="lg">
            Go back
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="ghost"
            size="lg"
          >
            Back to Home
          </Button>
        </div>
      </Shell>
    </>
  )
}
