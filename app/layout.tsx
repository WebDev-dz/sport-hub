import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Cairo, Tajawal, Amiri } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { WrapperWithQuery } from "@/components/wrapper";
import { createMetadata } from "@/lib/metadata";

// Arabic fonts
const cairo = Cairo({
	subsets: ["latin", "arabic"],
	variable: "--font-cairo",
	weight: ["300", "400", "500", "600", "700"],
	display: "swap",
});

const tajawal = Tajawal({
	subsets: ["latin", "arabic"],
	variable: "--font-tajawal",
	weight: ["300", "400", "500", "700"],
	display: "swap",
});

// Optional: For more traditional/elegant Arabic text
const amiri = Amiri({
	subsets: ["latin", "arabic"],
	variable: "--font-amiri",
	weight: ["400", "700"],
	display: "swap",
});

export const metadata = createMetadata({
	title: {
		template: "%s | إدارة النادي الرياضي",
		default: "إدارة النادي الرياضي",
	},
	description: "نظام إدارة شامل للنوادي الرياضية يتضمن إدارة اللاعبين، المدربين، الجلسات التدريبية، والحضور",
	metadataBase: new URL("https://sports-management.app"),
});

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Test all Prisma models to ensure no errors
	
	return (
		<html lang="ar" suppressHydrationWarning dir="rtl">
			<head>
				<link rel="icon" href="/favicon/favicon.ico" sizes="any" />
			</head>
			<body 
				className={`${GeistSans.variable} ${GeistMono.variable} ${cairo.variable} ${tajawal.variable} ${amiri.variable} font-sans`}
			>
				<ThemeProvider attribute="class" defaultTheme="dark">
					{/* <Wrapper> */}
						<WrapperWithQuery>{children}</WrapperWithQuery>
					{/* </Wrapper> */}
					<Toaster richColors closeButton />
				</ThemeProvider>
			</body>
		</html>
	);
}