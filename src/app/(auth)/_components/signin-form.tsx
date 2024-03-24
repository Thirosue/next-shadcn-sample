"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { redirects, SignInErrors } from "@/lib/constants"
import { showErrorToast } from "@/lib/handle-error"
import { authSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { useConfirm } from "@/components/layout/confirm-provider"
import { PasswordInput } from "@/components/password-input"

type Inputs = z.infer<typeof authSchema>

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitNow, startSubmit] = React.useTransition()
  const confirm = useConfirm()

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: Inputs) {
    console.log("session status", status)
    const callbackUrl = searchParams.get("callbackUrl") || redirects.toDashboard
    startSubmit(async () => {
      try {
        const response = await signIn("credentials", {
          redirect: false,
          username: data.email,
          password: data.password,
          callbackUrl,
        })
        if (response?.error) {
          if (response.error === SignInErrors.UserNotFoundException.code) {
            confirm({
              title: SignInErrors.UserNotFoundException.code,
              description: SignInErrors.UserNotFoundException.message,
              alert: true,
            })
          } else {
            showErrorToast(response.error)
          }
        } else {
          console.log("response", response)
          console.log("callbackUrl", callbackUrl)
          router.push(callbackUrl)
          toast.success("You are now logged.")
        }
      } catch (err) {
        showErrorToast(err)
      }
    })
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="rodneymullen180@gmail.com"
                  autoComplete="username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitNow}>
          {isSubmitNow && (
            <Icons.spinner
              className="mr-2 size-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Sign in
          <span className="sr-only">Sign in</span>
        </Button>
      </form>
    </Form>
  )
}
