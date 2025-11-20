// [org]/sessions/page.tsx
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Filter,
  Download
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Props = {
    params: Promise<{
        slug: string
    }>,
    searchParams: Promise<{
        page: string
        limit: string
        search: string
    }>
}

const SessionsPage: React.FC<Props> = async ({ params, searchParams }) => {

  const { slug } = await params  
  const { page = '1', limit = '10', search = '' } = await searchParams
  
  

  const organization = await prisma.organization.findUnique({
    where: {
      slug
    }
  })

  if (!organization) {
    notFound()
  }

  // Parse pagination params
  const pageNum = Math.max(1, Number(page) || 1)
  const limitNum = Math.max(1, Math.min(100, Number(limit) || 10))
  const skip = (pageNum - 1) * limitNum

  // Build where clause
  const whereClause = {
    organizationId: organization.id,
    ...(search && {
      OR: [
        { description: { contains: search } },
        { location: { contains: search } },
      ]
    })
  }

  // Get total count and sessions in parallel
  const [totalSessions, trainingSessions] = await Promise.all([
    prisma.training_session.count({
      where: whereClause
    }),
    prisma.training_session.findMany({
      where: whereClause,
      take: limitNum,
      skip: skip,
      include: {
        sessionGroups: {
          include: {
            group: true
          }
        },
        attendances: true
      },
      orderBy: {
        date: 'desc'
      }
    })
  ])

  // Calculate stats based on ALL sessions
  const allSessionsForStats = await prisma.training_session.findMany({
    where: {
      organizationId: organization.id
    },
    include: {
      attendances: true
    }
  })

  const now = new Date()
  const stats = {
    total: totalSessions,
    upcoming: allSessionsForStats.filter(s => s.date > now).length,
    past: allSessionsForStats.filter(s => s.date < now).length,
    totalAttendances: allSessionsForStats.reduce((sum, s) => sum + s.attendances.length, 0)
  }

  const totalPages = Math.ceil(totalSessions / limitNum)

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'كرة القدم': 'bg-green-500',
      'كرة السلة': 'bg-orange-500',
      'ألعاب قوى': 'bg-blue-500',
      'سباحة': 'bg-cyan-500',
      'كرة طائرة': 'bg-purple-500',
    }
    return colors[category] || 'bg-gray-500'
  }

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
            <CardTitle className="text-sm font-medium">إجمالي الجلسات</CardTitle>
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
            <p className="text-xs text-muted-foreground mt-1">
              جلسات مستقبلية
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الماضية</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.past}</div>
            <p className="text-xs text-muted-foreground mt-1">
              جلسات منتهية
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الحضور</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttendances}</div>
            <p className="text-xs text-muted-foreground mt-1">
              سجلات الحضور
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
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            جميع الجلسات ({totalSessions})
            {search && ` - نتائج البحث: ${trainingSessions.length}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trainingSessions.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {search ? 'لم يتم العثور على نتائج' : 'لا يوجد جلسات بعد'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {search ? 'جرب البحث بكلمات مختلفة' : 'ابدأ بإضافة جلسة تدريب أولى'}
              </p>
              {!search && (
                <Link href={`/${organization.slug}/sessions/new`}>
                  <Button>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة الجلسة الأولى
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
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الوقت</TableHead>
                      <TableHead>المجموعات</TableHead>
                      <TableHead>الموقع</TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>الحضور</TableHead>
                      <TableHead className="text-left">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainingSessions.map((sess) => {
                      const attendanceCount = sess.attendances.length
                      const presentCount = sess.attendances.filter(a => a.status === 'present').length
                      const attendanceRate = attendanceCount > 0 ? Math.round((presentCount / attendanceCount) * 100) : 0
                      
                      // Parse ISO string date
                      const sessionDate = new Date(sess.date)
                      const dateStr = sessionDate.toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })

                      return (
                        <TableRow key={sess.id}>
                          <TableCell className="font-medium">
                            {dateStr}
                          </TableCell>
                          <TableCell>
                            {sess.startTime} - {sess.endTime}
                          </TableCell>
                          <TableCell>
                            {sess.sessionGroups.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {sess.sessionGroups.map((sg) => (
                                  <Badge key={sg.groupId} variant="outline" className="gap-1">
                                    <span
                                      className={`h-2 w-2 rounded-full ${getCategoryColor(sg.group.category)}`}
                                    />
                                    {sg.group.name}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">لا مجموعات</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {sess.location || 'غير محدد'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {sess.description || 'لا وصف'}
                          </TableCell>
                          <TableCell>
                            {attendanceCount > 0 ? (
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium">{attendanceRate}%</div>
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${attendanceRate}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">لا بيانات</span>
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
                                  <Link href={`/${organization.slug}/sessions/${sess.id}`}>
                                    <Eye className="h-4 w-4 ml-2" />
                                    عرض التفاصيل
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/${organization.slug}/sessions/${sess.id}/edit`}>
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
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    الصفحة {pageNum} من {totalPages} - عرض {skip + 1} إلى {Math.min(skip + limitNum, totalSessions)} من {totalSessions}
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      href={`/${organization.slug}/sessions?page=${pageNum - 1}&limit=${limitNum}${search ? `&search=${search}` : ''}`}
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
                      href={`/${organization.slug}/sessions?page=${pageNum + 1}&limit=${limitNum}${search ? `&search=${search}` : ''}`}
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
  )
}

export default SessionsPage