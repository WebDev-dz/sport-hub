// [org]/attendance/page.tsx
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Filter,
  Download,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'

type Props = {
    params: Promise<{
        org: string
    }>
}

const AttendancePage: React.FC<Props> = async ({ params }) => {

  const { org } = await params
  const session = await auth()
  if (!session) {
    return redirect('/sign-in')
  }

  const organization = await prisma.organization.findUnique({
    where: {
      slug: org
    }
  })

  if (!organization) {
    throw new Error("لم يتم العثور على منظمة")
  }
  const member = await prisma.member.findFirst({
    where: {
      userId: session.userId!,
      organizationId: organization.id,
    },
    include: {
      user: true,
    },
  })
  if (!member) {
    throw new Error("غير مسجل في هذه المنظمة")
  }

  const attendances = await prisma.attendance.findMany({
    where: {
      session: {
        sessionGroups: {
          some: {
            group: {
              organizationId: organization.id
            }
          }
        }
      }
    },
    include: {
      member: {
        include: {
          groupMembers: {
            include: {
              group: true
            }
          }
        }
      },
      session: {
        include: {
          sessionGroups: {
            include: {
              group: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const stats = {
    total: attendances.length,
    present: attendances.filter(a => a.status === 'present').length,
    absent: attendances.filter(a => a.status === 'absent').length,
    sessions: [...new Set(attendances.map(a => a.sessionId))].length
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

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

  const getStatusBadge = (status: string) => {
    if (status === 'present') {
      return (
        <Badge variant="default" className="gap-1 bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3" />
          حاضر
        </Badge>
      )
    } else if (status === 'absent') {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          غائب
        </Badge>
      )
    }
    return <Badge variant="secondary">{status}</Badge>
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">الحضور</h1>
          <p className="text-muted-foreground mt-1">
            إدارة سجلات الحضور للجلسات واللاعبين
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي السجلات</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              سجلات الحضور
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الحاضرون</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.present}</div>
            <p className="text-xs text-muted-foreground mt-1">
              اللاعبون الحاضرون
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الغائبون</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.absent}</div>
            <p className="text-xs text-muted-foreground mt-1">
              اللاعبون الغائبون
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الجلسات</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sessions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              الجلسات المشمولة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث باللاعب أو الجلسة أو التاريخ..."
                className="pr-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                تصفية
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                تصدير
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>جميع سجلات الحضور ({attendances.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {attendances.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا يوجد سجلات حضور بعد</h3>
              <p className="text-muted-foreground mb-4">
                ابدأ بإضافة جلسات وتسجيل الحضور
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اللاعب</TableHead>
                    <TableHead>الجلسة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الملاحظات</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendances.map((attendance) => {
                    const member = attendance.member
                    const session = attendance.session
                    const sessionDate = new Date(session.date).toLocaleDateString('ar-EG')
                    const createdAt = new Date(attendance.createdAt).toLocaleDateString('ar-EG')

                    return (
                      <TableRow key={attendance.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={member.photoUrl || undefined} />
                              <AvatarFallback className={getCategoryColor(member.category)}>
                                {getInitials(member.firstName, member.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {member.firstName} {member.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {member.category}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{sessionDate}</div>
                            <div className="text-muted-foreground">
                              {session.startTime} - {session.endTime}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(attendance.status)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs">
                          {attendance.notes || 'لا ملاحظات'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {createdAt}
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
                                <Link href={`/${organization.slug}/attendance/${attendance.id}`}>
                                  <Eye className="h-4 w-4 ml-2" />
                                  عرض التفاصيل
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/${organization.slug}/attendance/${attendance.id}/edit`}>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AttendancePage