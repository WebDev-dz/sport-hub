"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FieldErrors, useForm } from "react-hook-form"
import { z } from "zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Types
interface User {
  id: string
  name: string
  email?: string
}

// Zod schema in Arabic
const groupSchema = z.object({
  name: z.string().min(2, "يجب أن يحتوي اسم المجموعة على حرفين على الأقل"),
  category: z.string().min(1, "الفئة مطلوبة"),
  coachId: z.string("معرّف المدرب غير صالح"),
  organizationId: z.string("معرّف المؤسسة غير صالح"),
})

type GroupFormValues = z.infer<typeof groupSchema>

interface GroupFormProps {
  defaultValues?: Partial<GroupFormValues>
  onSubmit: (values: GroupFormValues) => void | Promise<void>
  isLoading?: boolean
  data: {
    coaches: User[]
  }
}

export function GroupForm({ 
  defaultValues, 
  onSubmit,
  isLoading = false,
  data
}: GroupFormProps) {
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      category: defaultValues?.category || "",
      coachId: defaultValues?.coachId || "",
      organizationId: defaultValues?.organizationId || "",
    },
  })

  const onInvalidSubmit = (values: FieldErrors<GroupFormValues>) => {
    console.error({errors: values})
    console.log({values: form.getValues()})
    
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit,onInvalidSubmit)} 
        className="space-y-6 text-right" 
        dir="rtl"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم المجموعة</FormLabel>
              <FormControl>
                <Input placeholder="مثلاً: فريق النخبة تحت 15 سنة" {...field} />
              </FormControl>
              <FormDescription>
                اسم وصفي لهذه المجموعة التدريبية
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الفئة</FormLabel>
              <FormControl>
                <Input placeholder="مثلاً: ناشئين، كبار، مبتدئين" {...field} />
              </FormControl>
              <FormDescription>
                الفئة العمرية أو مستوى المهارة
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coachId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>المدرب</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? data.coaches.find(
                            (coach) => coach.id === field.value
                          )?.name
                        : "اختر مدرباً"}
                      <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="ابحث عن مدرب..." />
                    <CommandList>
                      <CommandEmpty>لم يتم العثور على مدرب</CommandEmpty>
                      <CommandGroup>
                        {data.coaches.map((coach) => (
                          <CommandItem
                            value={coach.name}
                            key={coach.id}
                            onSelect={() => {
                              form.setValue("coachId", coach.id)
                            }}
                          >
                            <Check
                              className={cn(
                                "ml-2 h-4 w-4",
                                coach.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span>{coach.name}</span>
                              {coach.email && (
                                <span className="text-sm text-muted-foreground">
                                  {coach.email}
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                اختر المدرب المسؤول عن هذه المجموعة
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

       
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جاري إنشاء المجموعة..." : "إنشاء مجموعة"}
        </Button>
      </form>
    </Form>
  )
}