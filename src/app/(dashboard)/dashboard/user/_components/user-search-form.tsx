import { useRouter } from "next/navigation"
import { roleEnum } from "@/db/schema"
import { UserSearchFormValues } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const userSearchFormSchema = z.object({
  role: z.enum(roleEnum.enumValues).optional(),
  name: z.string().optional(),
  email: z.string().optional(),
})

type FormValues = z.infer<typeof userSearchFormSchema>

export function UserSearchForm({
  searchParams,
}: {
  searchParams: UserSearchFormValues
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(userSearchFormSchema),
    defaultValues: {
      role: roleEnum.enumValues[0],
      name: "",
      email: "",
      ...searchParams,
    },
  })

  const router = useRouter()

  const onSubmit = (data: FormValues) => {
    router.push(
      `/dashboard/user?role=${data.role}&name=${data.name}&email=${data.email}`
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin user search</CardTitle>
        <CardDescription>
          Please enter the information of the administrative user you want to
          search.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
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
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Please enter the name you want to search for"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Please enter the email you want to search for"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end space-x-2">
            <Button className="w-full md:w-auto">Search</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
