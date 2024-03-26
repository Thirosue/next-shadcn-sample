import type { Metadata, Viewport } from "next"
import { env } from "@/env.js"

import "@/styles/globals.css"

import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth"
import { fontHeading, fontMono, fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { Providers } from "@/components/layout/providers"
import { TailwindIndicator } from "@/components/tailwind-indicator"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "nextjs",
    "react",
    "react server components",
    "sample",
    "skateboarding",
    "kickflip",
  ],
  authors: [
    {
      name: "Thirosue",
      url: "https://github.com/Thirosue",
    },
  ],
  creator: "Thirosue",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: "/icon.png",
  },
}

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default async function RootLayout({
  children,
}: React.PropsWithChildren) {
  const session = await getServerSession()
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
            fontMono.variable,
            fontHeading.variable
          )}
        >
          <Providers session={session}>
            {children}
            <TailwindIndicator />
            <Analytics />
          </Providers>
          <Toaster />
        </body>
      </html>
    </>
  )
}
