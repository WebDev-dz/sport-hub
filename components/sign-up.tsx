"use client";
import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";
import { getCallbackURL } from "@/lib/shared";
import { convertImageToBase64 } from "@/lib/utils";

export function SignUp() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const router = useRouter();
	const params = useSearchParams();
	const [loading, startTransition] = useTransition();

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			setImagePreview((preview) => {
				if (preview) {
					URL.revokeObjectURL(preview);
				}
				return URL.createObjectURL(file);
			});
		}
	};

	return (
		<Card className="z-50 rounded-md rounded-t-none max-w-md">
			<CardHeader>
				<CardTitle className="text-lg md:text-xl">إنشاء حساب</CardTitle>
				<CardDescription className="text-xs md:text-sm">
					أدخل معلوماتك لإنشاء حساب جديد
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="first-name">الاسم الأول</Label>
							<Input
								id="first-name"
								placeholder="محمد"
								required
								onChange={(e) => {
									setFirstName(e.target.value);
								}}
								value={firstName}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="last-name">اسم العائلة</Label>
							<Input
								id="last-name"
								placeholder="أحمد"
								required
								onChange={(e) => {
									setLastName(e.target.value);
								}}
								value={lastName}
							/>
						</div>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">البريد الإلكتروني</Label>
						<Input
							id="email"
							type="email"
							placeholder="example@domain.com"
							required
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							value={email}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">كلمة المرور</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="new-password"
							placeholder="أدخل كلمة المرور"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">تأكيد كلمة المرور</Label>
						<Input
							id="password_confirmation"
							type="password"
							value={passwordConfirmation}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							autoComplete="new-password"
							placeholder="أعد إدخال كلمة المرور"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="image">صورة الملف الشخصي (اختياري)</Label>
						<div className="flex items-end gap-4">
							{imagePreview && (
								<div className="relative w-16 h-16 rounded-sm overflow-hidden">
									<img
										src={imagePreview}
										alt="معاينة الصورة الشخصية"
										className="object-cover w-full h-full"
									/>
								</div>
							)}
							<div className="flex items-center gap-2 w-full">
								<Input
									id="image"
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="w-full"
								/>
								{imagePreview && (
									<X
										className="cursor-pointer"
										onClick={() => {
											setImage(null);
											setImagePreview(null);
										}}
									/>
								)}
							</div>
						</div>
					</div>
					<Button
						type="submit"
						className="w-full"
						disabled={loading}
						onClick={async () => {
							startTransition(async () => {
								await signUp.email({
									email,
									password,
									name: `${firstName} ${lastName}`,
									image: image ? await convertImageToBase64(image) : "",
									callbackURL: "/dashboard",
									fetchOptions: {
										onError: (ctx) => {
											toast.error(ctx.error.message);
										},
										onSuccess: async () => {
											toast.success("تم إنشاء الحساب بنجاح");
											router.push(getCallbackURL(params));
										},
									},
								});
							});
						}}
					>
						{loading ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							"إنشاء حساب"
						)}
					</Button>
				</div>
			</CardContent>
			<CardFooter>
				<div className="flex justify-center w-full border-t pt-4">
					<p className="text-center text-xs text-neutral-500">
						تم الإنشاء باستخدام{" "}
						<Link
							href="https://better-auth.com"
							className="underline"
							target="_blank"
						>
							<span className="dark:text-white/70 cursor-pointer">
								better-auth.
							</span>
						</Link>
					</p>
				</div>
			</CardFooter>
		</Card>
	);
}

