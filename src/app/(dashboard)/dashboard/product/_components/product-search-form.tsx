import { useRouter, useSearchParams } from "next/navigation"
import { ProductSearchFormValues, ProductStatuses } from "@/types"
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

const productSearchFormSchema = z.object({
  name: z.string().optional(),
  tags: z.array(z.enum(ProductStatuses)).optional(),
  price_from: z.number().optional(),
  price_to: z.number().optional(),
})

type FormValues = z.infer<typeof productSearchFormSchema>

export function ProductSearchForm({
  searchParams,
}: {
  searchParams: ProductSearchFormValues
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(productSearchFormSchema),
    defaultValues: {
      name: "",
      tags: [],
      price_from: 0,
      price_to: 0,
      ...searchParams,
    },
  })

  const router = useRouter()

  const onSubmit = (data: FormValues) => {
    router.push(
      `/dashboard/product?name=${data.name}&page=1&limit=${searchParams.limit}`
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product search</CardTitle>
        <CardDescription>
          Please enter the information of the product you want to search.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-6">
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
