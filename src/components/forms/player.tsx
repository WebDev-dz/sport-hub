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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useState } from "react"
import { convertImageToBase64 } from "@/lib/utils"

// Zod schema in Arabic
const sportsMemberSchema = z.object({
  id: z.uuid().optional(),
  firstName: z.string().min(2, "يجب أن يحتوي الاسم الأول على حرفين على الأقل"),
  lastName: z.string().min(2, "يجب أن يحتوي اسم العائلة على حرفين على الأقل"),
  fatherName: z.string().min(2, "اسم الأب مطلوب"),
  motherFullName: z.string().min(2, "الاسم الكامل للأم مطلوب"),
  bloodType: z.enum({"A+" : "A+", "A-": "A-", "B+": "B+", "B-": "B-", "AB+": "AB+", "AB-": "AB-", "O+": "O+", "O-": "O-"}, {
    error: "فصيلة الدم مطلوبة",
  }),
  educationLevel: z.string().min(1, "المستوى الدراسي مطلوب"),
  schoolName: z.string().min(2, "اسم المدرسة مطلوب"),
  fatherPhone: z.string().regex(/^\+?[\d\s-()]+$/, "تنسيق رقم الهاتف غير صالح"),
  category: z.string().min(1, "الفئة مطلوبة"),
  nationalId: z.string().min(1, "الرقم الوطني مطلوب"),
  idCardNumber: z.string().min(1, "رقم البطاقة مطلوب"),
  address: z.string().min(5, "العنوان يجب أن يحتوي على 5 أحرف على الأقل"),
  photoUrl: z.url("رابط الصورة غير صالح").optional().or(z.literal("")),
  role: z.enum({"player": "player", "coach": "coach", "staff": "staff"}, {
    error: "الدور مطلوب",
  }),
  organizationId: z.uuid().optional().readonly(),
})

type SportsMemberFormValues = z.infer<typeof sportsMemberSchema>

interface SportsMemberFormProps {
  defaultValues?: Partial<SportsMemberFormValues>
  onSubmit: (values: SportsMemberFormValues) => any | Promise<any>
  isLoading?: boolean
}

export function PlayerForm({ 
  defaultValues, 
  onSubmit,
  isLoading = false 
}: SportsMemberFormProps) {

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<SportsMemberFormValues>({
    resolver: zodResolver(sportsMemberSchema),
    defaultValues: {
      firstName: defaultValues?.firstName || "",
      lastName: defaultValues?.lastName || "",
      fatherName: defaultValues?.fatherName || "",
      motherFullName: defaultValues?.motherFullName || "",
      bloodType: defaultValues?.bloodType || undefined,
      educationLevel: defaultValues?.educationLevel || "",
      schoolName: defaultValues?.schoolName || "",
      fatherPhone: defaultValues?.fatherPhone || "",
      category: defaultValues?.category || "",
      nationalId: defaultValues?.nationalId || "",
      idCardNumber: defaultValues?.idCardNumber || "",
      address: defaultValues?.address || "",
      photoUrl: defaultValues?.photoUrl || imagePreview || "",
      role: defaultValues?.role || undefined,
      organizationId: defaultValues?.organizationId || "",
    },
  })
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      form.setValue("photoUrl", await convertImageToBase64(file));
    }
  }
  

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }



  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6 text-right" 
        dir="rtl"
      >
        <FormField
            control={form.control}
            name="photoUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center">
                <Avatar 
                  onClick={() => document.getElementById('image')?.click()}
                  className="w-30 h-30 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <AvatarImage src={field.value} />
                  <AvatarFallback className="">
                    {getInitials(form.getValues("firstName"), form.getValues("lastName"))}
                  </AvatarFallback>
                </Avatar>
                
                <Input
                  id="image"
                  type="file"
                  aria-label="صورة الملف الشخصي"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
              </FormItem>
            )}
          />
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">المعلومات الشخصية</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الأول</FormLabel>
                  <FormControl>
                    <Input placeholder="مثلاً: أحمد" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم العائلة</FormLabel>
                  <FormControl>
                    <Input placeholder="مثلاً: الخطيب" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nationalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الرقم الوطني</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idCardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم البطاقة الشخصية</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="bloodType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>فصيلة الدم</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر فصيلة الدم" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Family Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">معلومات العائلة</h3>
          
          <FormField
            control={form.control}
            name="fatherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم الأب</FormLabel>
                <FormControl>
                  <Input placeholder="الاسم الكامل للأب" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="motherFullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم الكامل للأم</FormLabel>
                <FormControl>
                  <Input placeholder="الاسم الكامل للأم" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fatherPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم هاتف الأب</FormLabel>
                <FormControl>
                  <Input placeholder="+966500000000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Education Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">المعلومات الدراسية</h3>
          
          <FormField
            control={form.control}
            name="educationLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المستوى الدراسي</FormLabel>
                <FormControl>
                  <Input placeholder="مثلاً: ثانوي، جامعي" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schoolName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المدرسة / المؤسسة</FormLabel>
                <FormControl>
                  <Input placeholder="اسم المدرسة أو الجهة التعليمية" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Sports Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">المعلومات الرياضية</h3>
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الدور</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الدور" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="player">لاعب</SelectItem>
                    <SelectItem value="coach">مدرب</SelectItem>
                    <SelectItem value="staff">إداري</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Input placeholder="مثلاً: تحت 15 سنة، فئة الكبار" {...field} />
                </FormControl>
                <FormDescription>
                  الفئة العمرية أو مستوى المهارة
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Additional Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">معلومات إضافية</h3>
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العنوان</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="العنوان الكامل لمكان السكن" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جارٍ الإرسال..." : "إرسال"}
        </Button>
      </form>
    </Form>
  )
}
