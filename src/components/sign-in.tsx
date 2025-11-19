"use client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useSignIn } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z
    .string()
    .email("عنوان البريد الإلكتروني غير صالح")
    .min(1, "البريد الإلكتروني مطلوب"),
  password: z.string().min(6, "كلمة المرور مطلوبة"),
  rememberMe: z.boolean().default(false).nonoptional(),
});

type FormData = z.infer<typeof formSchema>;

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  const { isLoaded, signIn, setActive } = useSignIn();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: FormData) => {
    if (!isLoaded) return;

    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("تم تسجيل الدخول بنجاح");
        router.push("/dashboard");
      } else {
        // Handle other statuses if needed (e.g., needs factor two)
        toast.error("يتطلب التحقق الإضافي");
      }
    } catch (error: any) {
      console.error({ error });
      toast.error(error.errors?.[0]?.message || "حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md rounded-none">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">تسجيل الدخول</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          أدخل بريدك الإلكتروني لتسجيل الدخول إلى حسابك
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@domain.com"
                      required
                      disabled={loading}
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
                  <div className="flex items-center">
                    <FormLabel htmlFor="password">كلمة المرور</FormLabel>
                    <Link
                      href="/sign-in/forgot-password"
                      className="ml-auto inline-block text-sm underline"
                    >
                      هل نسيت كلمة المرور؟
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="كلمة المرور"
                      autoComplete="password"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      id="remember"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormLabel htmlFor="remember" className="font-normal">
                    تذكرني
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full flex items-center justify-center"
              disabled={loading || !isLoaded}
            >
              <div className="flex items-center justify-center w-full relative">
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "تسجيل الدخول"
                )}
              </div>
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="flex justify-center w-full border-t pt-4">
          <p className="text-center text-xs text-neutral-500">
            تم الإنشاء باستخدام{" "}
            <Link
              href="https://clerk.com"
              className="underline"
              target="_blank"
            >
              <span className="dark:text-white/70 cursor-pointer">Clerk.</span>
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
