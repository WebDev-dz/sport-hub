// [org]/players/page.tsx
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect,  } from "next/navigation";
import { MemberCardPDF } from "@/components/member-card-pdf";

// removed headers usage with Better Auth
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
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
  Filter,
  Download,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page: string;
    limit: string;
    search: string;
  }>;
};

const PlayersPage: React.FC<Props> = async ({ params, searchParams }) => {
  const { slug } = await params;
  const { page = "1", limit = "10", search = "" } = await searchParams;



  const session = await auth();
  if (!session) {
    return redirect("/sign-in");
  }


  const organization = await prisma.organization.findUnique({
    where: {
      slug: slug,
    },
  });

  console.log({organization})

  if (!organization) {
    notFound();
  }
  
  const member = await prisma.member.findFirst({
    where: {
      userId: session.userId!,
      organizationId: organization.id,
    },
    include: { user: true },
  });

  if (!member) {
    throw new Error("غير مسجل في هذه المنظمة");
  }

  // Parse pagination params
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.max(1, Math.min(100, Number(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  // Build where clause
  const whereClause = {
    organizationId: organization.id,
    role: "player",
    ...(search && {
      OR: [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { nationalId: { contains: search } },
        { fatherPhone: { contains: search } },
      ],
    }),
  };

  // Get total count and players in parallel
  const [totalPlayers, players] = await Promise.all([
    prisma.sports_member.count({
      where: whereClause,
    }),
    prisma.sports_member.findMany({
      where: whereClause,
      take: limitNum,
      skip: skip,
      include: {
        groupMembers: {
          include: {
            group: true,
          },
        },
        attendances: {
          take: 5,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  // Calculate stats based on ALL players, not just current page
  const allPlayersForStats = await prisma.sports_member.findMany({
    where: {
      organizationId: organization.id,
      role: "player",
    },
    include: {
      groupMembers: true,
      attendances: true,
    },
  });

  const stats = {
    total: totalPlayers,
    categories: [...new Set(allPlayersForStats.map((m) => m.category))].length,
    active: allPlayersForStats.filter((m) => m.groupMembers.length > 0).length,
    totalAttendances: allPlayersForStats.reduce(
      (sum, p) => sum + p.attendances.length,
      0
    ),
  };

  const totalPages = Math.ceil(totalPlayers / limitNum);

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

  return (
    <div className="container mx-auto py-8 px-4 space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">اللاعبين</h1>
          <p className="text-muted-foreground mt-1">
            إدارة الرياضيين في منظمتك ومعلوماتهم
          </p>
        </div>
        <Link href={`/${organization.slug}/players/new`}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة لاعب
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي اللاعبين
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              الرياضيين المسجلين
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الفئات</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
            <p className="text-xs text-muted-foreground mt-1">أنواع الرياضات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">النشيطين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">
              المعينين في مجموعات
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الحضور</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttendances}</div>
            <p className="text-xs text-muted-foreground mt-1">
              سجلات الحضور الأخيرة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <form method="GET" className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                defaultValue={search}
                placeholder="البحث بالاسم أو الهوية أو الهاتف..."
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
        </CardContent>
      </Card>

      {/* Players Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            جميع اللاعبين ({totalPlayers})
            {search && ` - نتائج البحث: ${players.length}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {players.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {search ? "لم يتم العثور على نتائج" : "لا يوجد لاعبين بعد"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {search ? "جرب البحث بكلمات مختلفة" : "ابدأ بإضافة لاعبك الأول"}
              </p>
              {!search && (
                <Link href={`/${organization.slug}/players/new`}>
                  <Button>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة اللاعب الأول
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اللاعب</TableHead>
                      <TableHead>الفئة</TableHead>
                      <TableHead>الاتصال</TableHead>
                      <TableHead>الهوية الوطنية</TableHead>
                      <TableHead>المجموعات</TableHead>
                      <TableHead>فصيلة الدم</TableHead>
                      <TableHead>الحضور</TableHead>
                      <TableHead className="text-left">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players.map((player) => {
                      const attendanceRate =
                        player.attendances.length > 0
                          ? Math.round(
                              (player.attendances.filter(
                                (a) => a.status === "present"
                              ).length /
                                player.attendances.length) *
                                100
                            )
                          : 0;

                      return (
                        <TableRow key={player.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={player.photoUrl || undefined}
                                />
                                <AvatarFallback
                                  className={getCategoryColor(player.category)}
                                >
                                  {getInitials(
                                    player.firstName,
                                    player.lastName
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {player.firstName} {player.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {player.educationLevel} • {player.schoolName}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="gap-1">
                              <span
                                className={`h-2 w-2 rounded-full ${getCategoryColor(player.category)}`}
                              />
                              {player.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">
                                {player.fatherName}
                              </div>
                              <div className="text-muted-foreground">
                                {player.fatherPhone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {player.nationalId}
                          </TableCell>
                          <TableCell>
                            {player.groupMembers.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {player.groupMembers.map((gm) => (
                                  <Badge
                                    key={gm.groupId}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {gm.group.name}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                لا مجموعة
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{player.bloodType}</Badge>
                          </TableCell>
                          <TableCell>
                            {player.attendances.length > 0 ? (
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium">
                                  {attendanceRate}%
                                </div>
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${attendanceRate}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                لا بيانات
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-left">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/${organization.slug}/players/${player.id}`}
                                  >
                                    <Eye className="h-4 w-4 ml-2" />
                                    عرض التفاصيل
                                  </Link>
                                </DropdownMenuItem>
                                {/* Add PDF Card Option */}
                                <DropdownMenuItem asChild>
                                  <div className="w-full">
                                    <MemberCardPDF
                                      member={{
                                        id: player.id,
                                        firstName: player.firstName,
                                        lastName: player.lastName,
                                        nationalId: player.nationalId,
                                        category: player.category,
                                        photoUrl: player.photoUrl,
                                        bloodType: player.bloodType,
                                        educationLevel: player.educationLevel,
                                        schoolName: player.schoolName,
                                        fatherName: player.fatherName,
                                        fatherPhone: player.fatherPhone,
                                      }}
                                      organizationName={organization.name}
                                      organizationSlug={organization.slug}
                                    />
                                  </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/${organization.slug}/players/${player.id}/edit`}
                                  >
                                    <Edit className="h-4 w-4 ml-2" />
                                    تعديل
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 ml-2" />
                                  حذف
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    الصفحة {pageNum} من {totalPages} - عرض {skip + 1} إلى{" "}
                    {Math.min(skip + limitNum, totalPlayers)} من {totalPlayers}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/${organization.slug}/players?page=${pageNum - 1}&limit=${limitNum}${search ? `&search=${search}` : ""}`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pageNum <= 1}
                      >
                        السابق
                      </Button>
                    </Link>
                    <Link
                      href={`/${organization.slug}/players?page=${pageNum + 1}&limit=${limitNum}${search ? `&search=${search}` : ""}`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pageNum >= totalPages}
                      >
                        التالي
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayersPage;
