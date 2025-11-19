// [org]/sessions/page.tsx
import prisma from "@/lib/prisma";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Plus,
  Search,
  Calendar,
  Filter,
  Download,
  CalendarDays,
  CalendarRange,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import SessionsScheduleView from "./view";
import { TCalendarView } from "@/components/calendar/types";
import { auth } from "@clerk/nextjs/server";

type Props = {
  params: Promise<{
    org: string;
  }>;
  searchParams: {
    search?: string;
    view?: TCalendarView;
    date?: string; // Current date being viewed (YYYY-MM-DD)
    month?: string; // For month view (YYYY-MM)
    week?: string; // For week view (YYYY-Www) ISO week format
  };
};

const SessionsPage: React.FC<Props> = async ({ params, searchParams }) => {
  const { org } = await params;
  const { 
    search = "", 
    view = "month",
    date,
    month,
    week 
  } = await searchParams;

  const session = await auth()

  const organization = await prisma.organization.findUnique({
    where: {
      slug: org,
    },
  });

  if (!organization) {
    notFound();
  }

  // Calculate date range based on view and search params
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  if (view === "day") {
    // Day view: show selected day or today
    const targetDate = date ? new Date(date) : now;
    startDate = new Date(targetDate.setHours(0, 0, 0, 0));
    endDate = new Date(targetDate.setHours(23, 59, 59, 999));
  } else if (view === "week") {
    // Week view: show selected week or current week
    if (week) {
      // Parse ISO week format (YYYY-Www)
      const [year, weekNum] = week.split("-W");
      startDate = getStartOfWeek(parseInt(year), parseInt(weekNum));
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
    } else {
      // Current week
      startDate = getStartOfWeek(now.getFullYear(), getWeekNumber(now));
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
    }
  } else {
    // Month view: show selected month or current month
    if (month) {
      const [year, monthNum] = month.split("-");
      startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }
  }

  // Build where clause
  const whereClause = {
    organizationId: organization.id,
    date: {
      gte: startDate.toISOString(),
      lte: endDate.toISOString(),
    },
    ...(search && {
      OR: [
        { description: { contains: search } },
        { location: { contains: search } },
      ],
    }),
  };

  // Get total count and sessions in parallel
  const [totalSessions, trainingSessions] = await Promise.all([
    prisma.training_session.count({
      where: whereClause,
    }),
    prisma.training_session.findMany({
      where: whereClause,
      include: {
        sessionGroups: {
          include: {
            group: true,
          },
        },
        attendances: true,
      },
      orderBy: {
        date: "asc",
      },
    }),
  ]);

  // Calculate stats based on ALL sessions
  const allSessionsForStats = await prisma.training_session.findMany({
    where: {
      organizationId: organization.id,
    },
    include: {
      attendances: true,
    },
  });

  const nowIso = new Date();
  const stats = {
    total: totalSessions,
    upcoming: allSessionsForStats.filter((s) => s.date > nowIso).length,
    past: allSessionsForStats.filter((s) => s.date < nowIso).length,
    totalAttendances: allSessionsForStats.reduce(
      (sum, s) => sum + s.attendances.length,
      0
    ),
  };

  // Helper function to build view toggle URL
  const getViewUrl = (newView: TCalendarView) => {
    const params = new URLSearchParams();
    params.set("view", newView);
    if (search) params.set("search", search);
    
    // Preserve date context when switching views
    if (newView === "day") {
      params.set("date", date || now.toISOString().split("T")[0]);
    } else if (newView === "week") {
      params.set("week", week || `${now.getFullYear()}-W${String(getWeekNumber(now)).padStart(2, "0")}`);
    } else if (newView === "month") {
      params.set("month", month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
    }
    
    return `/${organization.slug}/sessions?${params.toString()}`;
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">جلسات التدريب</h1>
          <p className="text-muted-foreground mt-1">
            إدارة جلسات التدريب في منظمتك
          </p>
        </div>
        <Link href={`/${organization.slug}/sessions/new`}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة جلسة
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الجلسات
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              الجلسات المسجلة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">القادمة</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming}</div>
            <p className="text-xs text-muted-foreground mt-1">جلسات مستقبلية</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الماضية</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.past}</div>
            <p className="text-xs text-muted-foreground mt-1">جلسات منتهية</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الحضور</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttendances}</div>
            <p className="text-xs text-muted-foreground mt-1">سجلات الحضور</p>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* View Toggle Buttons */}
            <div className="flex gap-2">
              <Link href={getViewUrl("day")}>
                <Button
                  variant={view === "day" ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                >
                  <CalendarDays className="h-4 w-4" />
                  يوم
                </Button>
              </Link>
              <Link href={getViewUrl("week")}>
                <Button
                  variant={view === "week" ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                >
                  <CalendarRange className="h-4 w-4" />
                  أسبوع
                </Button>
              </Link>
              <Link href={getViewUrl("month")}>
                <Button
                  variant={view === "month" ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  شهر
                </Button>
              </Link>
            </div>

            {/* Search Form */}
            <form method="GET" className="flex flex-col sm:flex-row gap-4">
              <input type="hidden" name="view" value={view} />
              {date && <input type="hidden" name="date" value={date} />}
              {week && <input type="hidden" name="week" value={week} />}
              {month && <input type="hidden" name="month" value={month} />}
              
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  defaultValue={search}
                  placeholder="البحث بالوصف أو الموقع..."
                  className="pr-10"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="outline" className="gap-2">
                  <Search className="h-4 w-4" />
                  بحث
                </Button>
                <Button type="button" variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  تصفية
                </Button>
                <Button type="button" variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  تصدير
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Calendar */}
      <Card id="sessions-calendar">
        <SessionsScheduleView
          view={view}
          sessions={trainingSessions}
          organization={organization}
          currentDate={date ? new Date(date) : undefined}
          currentWeek={week}
          currentMonth={month}
        />
      </Card>
    </div>
  );
};

// Helper functions
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getStartOfWeek(year: number, week: number): Date {
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7;
  const weekStart = new Date(jan4);
  weekStart.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7);
  return weekStart;
}

export default SessionsPage;