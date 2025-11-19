// [org]/attendance/check-in/page.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  Users,
  Filter,
  Download,
  Calendar,
  Clock,
  Plus,
} from "lucide-react";
import Link from "next/link";
import useAttendance from "@/hooks/use-attendance";
import { uuidv4 } from "zod/v4";
import { Group, Player, TrainingSession, User } from "@/types";

type Props = {
  sessionsWithMembers: (TrainingSession & {
    members: ({ attendanceStatus: string , groupMembers: {group: Group}[] } & Player)[];
    sessionGroups: { group: Group & { coach : User} ; groupId: string; sessionId: string }[];
  })[];
  organization: any;
};

const AttendanceCheckInView: React.FC<Props> = async ({
  sessionsWithMembers,
  organization,
}) => {

  // hooks

  const { createAttendanceState } = useAttendance();













  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  console.log({sessionsWithMembers})

  const stats = {
    sessions: sessionsWithMembers.length,
    totalMembers: sessionsWithMembers.reduce(
      (sum, s) => sum + s.members.length,
      0
    ),
    checkedIn: sessionsWithMembers.reduce(
      (sum, s) =>
        sum + s.members.filter((m) => m.attendanceStatus === "present").length,
      0
    ),
    pending: sessionsWithMembers.reduce(
      (sum, s) =>
        sum + s.members.filter((m) => m.attendanceStatus === "pending").length,
      0
    ),
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "كرة القدم": "bg-green-500",
      "كرة السلة": "bg-orange-500",
      "ألعاب قوى": "bg-blue-500",
      سباحة: "bg-cyan-500",
      "كرة طائرة": "bg-purple-500",
    };
    return colors[category] || "bg-gray-500";
  };

  const getStatusBadge = (status: string) => {
    if (status === "present") {
      return (
        <Badge
          variant="default"
          className="gap-1 bg-green-100 text-green-800 border-green-200"
        >
          <CheckCircle className="h-3 w-3" />
          حاضر
        </Badge>
      );
    
    } else if (status === "late") {
      return (
        <Badge variant="warning" className="gap-1">
          <XCircle className="h-3 w-3" />
          متأخر
        </Badge>
      );
    }
    else if (status === "absent") {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          غائب
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="h-3 w-3" />
        قيد الانتظار
      </Badge>
    );
  };

  // Note: In a real app, buttons would trigger server actions to update attendance
  const handleCheckIn = (
    sessionId: string,
    memberId: string,
    status: string
  ) => {
    // Placeholder for server action
    console.log("Check-in:", { sessionId, memberId, status });
    createAttendanceState.mutateAsync({
      
      sessionId,
      memberId,
      status,
      notes: "",
      createdAt: new Date,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            تسجيل الحضور اليوم
          </h1>
          <p className="text-muted-foreground mt-1">
            سجل حضور اللاعبين لجلسات اليوم بسرعة
          </p>
        </div>
        <Link href={`/${organization.slug}/sessions/new`}>
          <Button variant="outline">إضافة جلسة اليوم</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">جلسات اليوم</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sessions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              الجلسات المتاحة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي اللاعبين
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              اللاعبون المتوقعون
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مسجلين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checkedIn}</div>
            <p className="text-xs text-muted-foreground mt-1">الحاضرون</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد الانتظار</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">غير مسجلين بعد</p>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Check-in */}
      <div className="space-y-6">
        {sessionsWithMembers.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                لا توجد جلسات اليوم
              </h3>
              <p className="text-muted-foreground mb-4">
                أنشئ جلسة تدريب لليوم للبدء في تسجيل الحضور
              </p>
              <Link href={`/${organization.slug}/sessions/new`}>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />{" "}
                  {/* Wait, Plus not imported, but assume */}
                  إضافة جلسة اليوم
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          sessionsWithMembers.map((sess) => (
            <Card key={sess.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">
                    {new Date(sess.date).toLocaleString("en-US")} -{" "}
                    {sess.startTime} - {sess.endTime}
                  </CardTitle>
                </div>
                {sess.sessionGroups.length > 0 && (
                  <div className="flex gap-1">
                    {sess.sessionGroups.map((sg) => (
                      <Badge key={sg.groupId} variant="outline">
                        {sg.group.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">اللاعب</TableHead>
                        <TableHead className="text-center">الفئة</TableHead>
                        <TableHead className="text-center">المجموعة</TableHead>
                        <TableHead className="text-center">الحالة</TableHead>
                        <TableHead className="text-center">إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sess.members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={member.photoUrl || undefined}
                                />
                                <AvatarFallback
                                  className={getCategoryColor(member.category)}
                                >
                                  {getInitials(
                                    member.firstName,
                                    member.lastName
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {member.firstName} {member.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {member.fatherPhone}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{member.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {member.groupMembers[0]?.group.name || "غير معين"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(member.attendanceStatus)}
                          </TableCell>
                          <TableCell className="text-left">
                            {member.attendanceStatus === "pending" ? (
                              <div className="flex gap-2">
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() =>
                                    handleCheckIn(sess.id, member.id, "present")
                                  }
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  حاضر
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleCheckIn(sess.id, member.id, "absent")
                                  }
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  غائب
                                </Button>
                              </div>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  <DropdownMenuItem>
                                    تعديل الحالة
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    حذف السجل
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AttendanceCheckInView;
