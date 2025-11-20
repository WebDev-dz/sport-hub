// [org]/groups/page.tsx
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
// import React from 'react'
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
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Filter,
  Download
} from 'lucide-react'
import Link from 'next/link'

type Props = {
    params: Promise<{ 
        slug: string
    }>
}

const GroupsPage: React.FC<Props> = async ({ params }) => {
  const orgSlug = (await params).org

  const session = await auth()
  if (!session) {
    return redirect('/sign-in')
  }

  const organization = await prisma.organization.findUnique({
    where: { slugSlug },
  })

  if (!organization) {
    throw new Error('لم يتم العثور على منظمة')
  }

  const member = await prisma.member.findFirst({
    where: {
      userId: session.userId!,
      organizationId: organization.id,
    },
    include: { user: true },
  })

  if (!member) {
    throw new Error('غير مسجل في هذه المنظمة')
  }

  const groups = await prisma.group.findMany({
    where: {
      organizationId: organization.id,
    },
    include: {
      coach: true,
      groupMembers: true,
      sessionGroups: {
        take: 5,
        orderBy: {
          session: {
            date: 'desc'
          }
        },
        include: {
          session: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const stats = {
    total: groups.length,
    categories: [...new Set(groups.map(g => g.category))].length,
    totalMembers: groups.reduce((sum, g) => sum + g.groupMembers.length, 0),
    active: groups.filter(g => g.sessionGroups.length > 0).length
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()
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

  return (
    <div className="container mx-auto py-8 px-4 space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">المجموعات</h1>
          <p className="text-muted-foreground mt-1">
            إدارة مجموعات الرياضيين في منظمتك
          </p>
        </div>
        <Link href={`/${orgSlug}/groups/new`}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة مجموعة
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المجموعات</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              المجموعات المسجلة
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
            <p className="text-xs text-muted-foreground mt-1">
              أنواع الرياضات
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأعضاء</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              الرياضيين في المجموعات
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المجموعات النشطة</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">
              مع جلسات حديثة
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
                placeholder="البحث بالاسم أو الفئة..."
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

      {/* Groups Table */}
      <Card>
        <CardHeader>
          <CardTitle>جميع المجموعات ({groups.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {groups.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا يوجد مجموعات بعد</h3>
              <p className="text-muted-foreground mb-4">
                ابدأ بإضافة مجموعتك الأولى
              </p>
              <Link href={`/${orgSlug}/groups/new`}>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة المجموعة الأولى
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المجموعة</TableHead>
                    <TableHead>الفئة</TableHead>
                    <TableHead>المدرب</TableHead>
                    <TableHead>الأعضاء</TableHead>
                    <TableHead>الجلسات الأخيرة</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group) => {
                    const memberCount = group.groupMembers.length
                    const recentSessions = group.sessionGroups.length

                    return (
                      <TableRow key={group.id}>
                        <TableCell>
                          <div className="font-medium">
                            {group.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="gap-1">
                            <span
                              className={`h-2 w-2 rounded-full ${getCategoryColor(group.category)}`}
                            />
                            {group.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={group.coach?.image || undefined} />
                              <AvatarFallback className="bg-blue-500">
                                {getInitials(group.coach?.name || '')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm font-medium">
                              {group.coach?.name || '—'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{memberCount}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{recentSessions} جلسات</div>
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
                                <Link href={`/${orgSlug}/groups/${group.id}`}>
                                  <Eye className="h-4 w-4 ml-2" />
                                  عرض التفاصيل
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/${orgSlug}/groups/${group.id}/edit`}>
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

export default GroupsPage