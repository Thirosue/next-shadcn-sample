"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { roleEnum } from "@/db/schema"
import { ActionResult, User } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { deleteUserWithAuth, upsertUserWithAuth } from "@/lib/actions/users"
import { showErrorToast } from "@/lib/handle-error"
import { userUpsertSchema } from "@/lib/validations/user"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useConfirm } from "@/components/layout/confirm-provider"
import { PasswordInput } from "@/components/password-input"

type FormValues = z.infer<typeof userUpsertSchema>

interface UserFormProps {
  initialData: User & {
    version?: number
  }
  _csrf: string
}

export const UserForm: React.FC<UserFormProps> = ({ initialData, _csrf }) => {
  const [isSubmitNow, startSubmit] = useTransition()
  const router = useRouter()
  const confirm = useConfirm()

  const title = initialData ? "Edit user" : "Create user"
  const description = initialData ? "Edit a user." : "Add a new user"
  const toastMessage = initialData ? "User updated." : "User created."
  const action = initialData ? "Save changes" : "Create"

  const defaultValues = initialData
    ? initialData
    : {
        name: "",
        email: "",
        role: roleEnum.enumValues[1],
      }

  const form = useForm<FormValues>({
    resolver: zodResolver(userUpsertSchema),
    defaultValues: {
      ...defaultValues,
      token: _csrf,
    },
  })

  const onSubmit = async (data: FormValues) => {
    startSubmit(async () => {
      try {
        confirm({
          title: "Check Updates",
          description: "Are you sure you want to update this user?",
        }).then(async () => {
          const result = (await upsertUserWithAuth(data)) as ActionResult
          if (result.status === 200) {
            router.push("/dashboard/user")
            toast.success(toastMessage)
          } else if (result.status === 409) {
            toast.error(result.message, {
              action: {
                label: "Go back",
                onClick: () => {
                  router.push("/dashboard/user")
                },
              },
            })
          } else {
            toast.error(result.message)
            router.push("/error")
          }
        })
      } catch (err) {
        showErrorToast(err)
        router.push("/error")
      }
    })
  }

  const onDelete = async () => {
    startSubmit(async () => {
      try {
        confirm({
          title: "Check Delete",
          description: "Are you sure you want to delete this user?",
        }).then(async () => {
          await deleteUserWithAuth({
            id: initialData.id,
            token: _csrf,
          })
          router.push("/dashboard/user")
          toast.success(toastMessage)
        })
      } catch (err) {
        showErrorToast(err)
      }
    })
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isSubmitNow}
            variant="destructive"
            size="sm"
            onClick={onDelete}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitNow}
                      placeholder="User name"
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitNow}
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    disabled={isSubmitNow}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a role"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roleEnum.enumValues.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Hidden System Control field _csrf and version */}
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem hidden>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem hidden>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isSubmitNow} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
