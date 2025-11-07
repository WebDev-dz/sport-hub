"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import {
	organization,
	useListOrganizations,
	useSession,
} from "@/lib/auth-client";
import { ActiveOrganization, Session } from "@/lib/auth-types";
import { Avatar , AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export function TeamSwitcher(props: {
  session: {
    user: {
        dd: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
    };
    session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
    };
} | null
  activeOrganization: ActiveOrganization | null;
}) {
  const { isMobile } = useSidebar();
  const organizations = useListOrganizations();
  const router = useRouter();
  const [optimisticOrg, setOptimisticOrg] = useState<ActiveOrganization | null>(
    props.activeOrganization
  );
  const [activeTeam, setActiveTeam] = React.useState(organizations?.data?.[0]);
  const [isRevoking, setIsRevoking] = useState<string[]>([]);
  const inviteVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
  };

  const session =  props.session;

  console.log({ optimisticOrg });

  const currentMember = optimisticOrg?.members?.find(
    (member) => member.userId === session?.user.id
  );

  useEffect(() => {
    console.log({props})
    if (props.activeOrganization) {
      setOptimisticOrg(props.activeOrganization);
      setActiveTeam(props.activeOrganization);
    }
    
  }, [props]);



  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex items-center gap-2">
                <Avatar className="rounded-none">
                  <AvatarImage
                    className="object-cover w-full h-full rounded-none"
                    src={optimisticOrg?.logo || undefined}
                  />
                  <AvatarFallback className="rounded-none">
                    {optimisticOrg?.name?.charAt(0) || "P"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p>{optimisticOrg?.name || "Personal"}</p>
                  <p className="text-xs text-muted-foreground">
                    {optimisticOrg?.members?.length || 1} members
                  </p>
                </div>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {organizations.data?.map((org) => (
								<DropdownMenuItem
									className="gap-2 p-2"
									key={org.id}
									onClick={async () => {
										if (org.id === optimisticOrg?.id) {
											return;
										}
										router.push(`/${org.slug}/sports-members`);
									}}
								>
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <Avatar className="rounded-lg">
                      <AvatarImage
                        className="object-cover w-full h-full rounded-none"
                        src={org.logo || undefined}
                      />
                      <AvatarFallback className="rounded-none">
                        {org.name?.charAt(0) || "P"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
									<p className="text-sm sm">{org.name}</p>
								</DropdownMenuItem>
							))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
