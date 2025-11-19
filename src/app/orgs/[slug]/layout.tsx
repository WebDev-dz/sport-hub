// [org]/layout.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import prisma from "@/lib/prisma";

export default async function PageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ org: string }>;
}) {
  const { org } = await params;
  const clerkAuth = await auth()
  const userId = clerkAuth.userId
  if (!userId) {
    redirect("/sign-in")
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

 
  // For now, we'll create a simple organization structure
  // You can expand this based on your needs
  


  return (
    <SidebarProvider className="" dir="rtl">
      {/* <AppSidebar side="right" activeOrganization={activeOrganization} session={session} /> */}
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
