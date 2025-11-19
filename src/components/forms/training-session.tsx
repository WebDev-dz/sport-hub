"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Group } from "@/types"

// Zod schema in Arabic
const trainingSessionSchema = z.object({
  date: z.date({
    error: "تاريخ الجلسة مطلوب",
  }),
  startTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "تنسيق الوقت غير صالح (HH:MM)"),
  endTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "تنسيق الوقت غير صالح (HH:MM)"),
  description: z.string().optional(),
  location: z.string().optional(),
  organizationId: z.string(),
}).refine((data) => {
  const [startHour, startMin] = data.startTime.split(':').map(Number)
  const [endHour, endMin] = data.endTime.split(':').map(Number)
  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin
  return endMinutes > startMinutes
}, {
  message: "يجب أن يكون وقت الانتهاء بعد وقت البداية",
  path: ["endTime"],
})

type TrainingSessionFormValues = z.infer<typeof trainingSessionSchema>

interface TrainingSessionFormProps {
  defaultValues?: Partial<TrainingSessionFormValues>
  onSubmit: (values: TrainingSessionFormValues) => void | Promise<void>
  isLoading?: boolean
  data: {
    groups: Group[]
  }
}

export function TrainingSessionForm({ 
  defaultValues, 
  onSubmit,
  isLoading = false 
}: TrainingSessionFormProps) {
  const form = useForm<TrainingSessionFormValues>({
    resolver: zodResolver(trainingSessionSchema),
    defaultValues: {
      date: defaultValues?.date || new Date(),
      startTime: defaultValues?.startTime || "09:00",
      endTime: defaultValues?.endTime || "11:00",
      description: defaultValues?.description || "",
      location: defaultValues?.location || "",
      organizationId: defaultValues?.organizationId || "",
    },
  })

  const onInvalidSubmit = (errors: any) => {
    console.error({errors})
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
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>تاريخ الجلسة</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pr-3 text-right font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ar })
                      ) : (
                        <span>اختر التاريخ</span>
                      )}
                      <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    locale={ar}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                تاريخ إقامة جلسة التدريب
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>وقت البداية</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  وقت بدء الجلسة (بتنسيق 24 ساعة)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>وقت الانتهاء</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  وقت انتهاء الجلسة (بتنسيق 24 ساعة)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الموقع (اختياري)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="مثلاً: الملعب الرئيسي، ساحة التدريب أ" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                المكان الذي ستقام فيه الجلسة التدريبية
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الوصف (اختياري)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="صف أهداف الجلسة التدريبية، التمارين، وما إلى ذلك." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                تفاصيل إضافية حول الجلسة
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جاري إنشاء الجلسة..." : "إنشاء جلسة تدريبية"}
        </Button>
      </form>
    </Form>
  )
}
