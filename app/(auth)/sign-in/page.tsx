"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import SignIn from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { Tabs } from "@/components/ui/tabs2";
import { client } from "@/lib/auth-client";
import { getCallbackURL } from "@/lib/shared";

export default function Page() {
	const router = useRouter();
	const params = useSearchParams();
	useEffect(() => {
		client.oneTap({
			fetchOptions: {
				onError: ({ error }) => {
					toast.error(error.message || "حدث خطأ ما");
				},
				onSuccess: () => {
					toast.success("تم تسجيل الدخول بنجاح");
					router.push(getCallbackURL(params));
				},
			},
		});
	}, []);

	return (
		<div className="w-full">
			<div className="flex items-center flex-col justify-center w-full md:py-10">
				<div className="md:w-[400px]">
					<Tabs
						tabs={[
							{
								title: "تسجيل الدخول",
								value: "sign-in",
								content: <SignIn />,
							},
							{
								title: "إنشاء حساب",
								value: "sign-up",
								content: <SignUp />,
							},
						]}
					/>
				</div>
			</div>
		</div>
	);
}
