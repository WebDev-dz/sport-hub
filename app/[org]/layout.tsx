// [org]/layout.tsx
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function PageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { org: string };
}) {
  const { org } = await params;
  console.log({ org });
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  console.log({session})
  if (!session) {
    redirect("/sign-in")
  }
  const [activeOrganization] = await Promise.all([
    auth.api.getFullOrganization({
      headers: await headers(),
      query: { organizationSlug: org },
    }),
    
  ]);

 
  if (!activeOrganization) {
    throw new Error("No organization found");
  }

  return (
    <SidebarProvider className="" dir="rtl">
      <AppSidebar side="right" activeOrganization={activeOrganization} session={session} />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
