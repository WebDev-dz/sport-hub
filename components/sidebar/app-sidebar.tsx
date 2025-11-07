"use client";

import * as React from "react";
import { ActiveOrganization, Session } from "@/lib/auth-types";

import {
  Users,
  UserCheck,
  CreditCard,
  Calendar,
  ClipboardCheck,
  FolderOpen,
  Settings2,
  Trophy,
  Dumbbell,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/organization-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { is } from "date-fns/locale";

// بيانات النادي الرياضي

const generateData = (
  org: string,
  user: { name: string; email: string; avatar: string }
) => {
  console.log({ "side bar org": org });
  const data = {
    user,
    teams: [
      {
        name: "النادي الرياضي",
        logo: Trophy,
        plan: "Premium",
      },
      {
        name: "أكاديمية الرياضة",
        logo: Dumbbell,
        plan: "Standard",
      },
    ],
    navMain: [
      {
        title: "اللاعبين",
        url: `/${org}`,
        icon: Users,
        isActive: true,
        items: [
          {
            title: "قائمة اللاعبين",
            url: `/${org}/players`,
            isActive: true,
          },
          {
            title: "إضافة لاعب جديد",
            url: `/${org}/players/new`,
          },
          {
            title: "اللاعبين النشطين",
            url: `/${org}/players/active`,
          },
          {
            title: "اللاعبين المعلقين",
            url: `/${org}/players/suspended`,
          },
        ],
      },
      {
        title: "المدربين",
        url: `/${org}/coaches`,
        icon: UserCheck,
        items: [
          {
            title: "قائمة المدربين",
            url: `/${org}/coaches`,
          },
          {
            title: "إضافة مدرب",
            url: `/${org}/coaches/new`,
          },
          {
            title: "جدول المدربين",
            url: `/${org}/coaches/schedule`,
          },
          {
            title: "تقييم الأداء",
            url: `/${org}/coaches/performance`,
          },
        ],
      },
      {
        title: "المجموعات",
        url: `/`,
        icon: Users,
        items: [
          {
            title: "قائمة المجموعات",
            url: `/${org}/groups`,
          },
          {
            title: "إضافة مجموعة جديدة",
            url: `/${org}/groups/new`,
          },
          {
            title: "المجموعات النشطة",
            url: `/${org}/groups/active`,
          },
        ],
      },
      {
        title: "بطاقات العضوية",
        url: `/${org}/memberships`,
        icon: CreditCard,
        items: [
          {
            title: "العضويات الحالية",
            url: `/${org}/memberships/active`,
          },
          {
            title: "عضوية جديدة",
            url: `/${org}/memberships/new`,
          },
          {
            title: "التجديدات",
            url: `/${org}/memberships/renewals`,
          },
          {
            title: "العضويات المنتهية",
            url: `/${org}/memberships/expired`,
          },
        ],
      },
      {
        title: "الحصص التدريبية",
        url: `/${org}/sessions`,
        icon: Calendar,
        items: [
          {
            title: "جدول الحصص",
            url:  `/${org}/sessions`,
          },
          {
            title: "إضافة حصة",
            url:  `/${org}/sessions/new`,
          },
          {
            title: "الحصص القادمة",
            url:  `/${org}/sessions/upcoming`,
          },
          {
            title: "تاريخ الحصص",
            url:  `/${org}/sessions/history`,
          },
        ],
      },
      {
        title: "الحضور والغيابات",
        url:  `/${org}/attendance`,
        icon: ClipboardCheck,
        items: [
          {
            title: "تسجيل الحضور",
            url: `/${org}/attendance/check-in`,
          },
          {
            title: "سجل الحضور",
            url: `/${org}/attendance/records`,
          },
          {
            title: "تقارير الحضور",
            url: `/${org}/attendance/reports`,
          },
          {
            title: "الغيابات المتكررة",
            url: `/${org}/attendance/absences`,
          },
        ],
      },
      {
        title: "ملفات اللاعبين",
        url: org + "/player-files",
        icon: FolderOpen,
        // items: [
        //   {
        //     title: "الملفات الطبية",
        //     url: org + "/player-files/medical",
        //   },
        //   {
        //     title: "الوثائق",
        //     url: org + "/player-files/documents",
        //   },
        //   {
        //     title: "التقييمات",
        //     url: org + "/player-files/evaluations",
        //   },
        //   {
        //     title: "الإنجازات",
        //     url: org + "/player-files/achievements",
        //   },
        // ],
      },
      {
        title: "الإعدادات",
        url: org + "/settings",
        icon: Settings2,
        items: [
          {
            title: "إعدادات عامة",
            url: org + "/settings/general",
          },
          {
            title: "إدارة الفريق",
            url: org + "/settings/team",
          },
          {
            title: "الفواتير",
            url: org + "/settings/billing",
          },
          {
            title: "الصلاحيات",
            url: org + "/settings/permissions",
          },
        ],
      },
    ],
    projects: [
      {
        name: "فريق الناشئين",
        url: `/${org}/teams/youth`,
        icon: Users,
      },
      {
        name: "الفريق الأول",
        url: "/teams/first",
        icon: Trophy,
      },
      {
        name: "أكاديمية التدريب",
        url: "/teams/academy",
        icon: Dumbbell,
      },
    ],
  };
  return data;
};

type Props = React.ComponentProps<typeof Sidebar> & {
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
  } | null;
  activeOrganization: ActiveOrganization | null;
};

export function AppSidebar({ ...props }: Props) {
  const session = props.session;
  const activeOrganization = props.activeOrganization;
  console.log({ "In AppSidebar": activeOrganization });
  const user = {
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    avatar: session?.user?.image || "",
  };
  const data = generateData(activeOrganization?.slug!, user);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          session={session}
          activeOrganization={activeOrganization}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
