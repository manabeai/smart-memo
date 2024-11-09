'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { Button } from "./ui/button"
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  // FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { TagSelector } from "@/components/tag-selector"

// import { ToggleItem } from "@/components/toggle-item"
	
const FormSchema = z.object({
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not exceed 160 characters.",
    }),
})

export function MemoMaker() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: unknown) {
    toast({
      title: "Bio: ",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{ JSON.stringify(data, null, 2) }</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[60vw] h-auto flex flex-col gap-y-2">
        <FormField
          control={form.control}
          name="memo"
          render={({ field }) => (
            <FormItem>
              <FormControl>
								<div className="w-[100%] h-[100%] min-h-[25vh] flex flex-col items-start gap-y-5">
									<Textarea
										placeholder="Please input your memo here."
										className="resize-none"
										{...field}
									/>
								</div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <TagSelector />

        <Button type="submit" className="w-[75px]">Submit</Button>
      </form>
    </Form>
  )
}