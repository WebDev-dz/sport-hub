// [org]/coaches/page.tsx
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
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

const CoachesPage: React.FC<Props> = async ({ params }) => {

  const { slug } = await params  
  
 
  const organization = await prisma.organization.findUnique({
    where: {
      slug
    }
  })

  if (!organization) {
    throw new Error("لم يتم العثور على منظمة")
  }

  const coachMembers = await prisma.member.findMany({
    where: {
      organizationId: organization.id,
      role: 'coach'
    },
    include: {
      user: {
        include: {
          groups: {
            where: {
              organizationId: organization.id
            },
            include: {
              groupMembers: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const coaches = coachMembers.map(m => ({ ...m.user, memberCreatedAt: m.createdAt, memberId: m.id }))

  const stats = {
    total: coaches.length,
    assigned: coaches.filter(c => c.groups.length > 0).length,
    categories: [...new Set(coaches.flatMap(c => c.groups.map(g => g.category)))].length,
    totalAthletes: coaches.reduce((sum, c) => sum + c.groups.reduce((s, g) => s + g.groupMembers.length, 0), 0)
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
          <h1 className="text-3xl font-bold tracking-tight">المدربين</h1>
          <p className="text-muted-foreground mt-1">
            إدارة مدربي منظمتك ومعلوماتهم
          </p>
        </div>
        <Link href={`/${organization.slug}/coaches/new`}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة مدرب
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المدربين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              المدربين المسجلين
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المدربين المعينين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assigned}</div>
            <p className="text-xs text-muted-foreground mt-1">
              مع مجموعات
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
              أنواع الرياضات المدربة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الرياضيين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAthletes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              تحت التدريب
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
                placeholder="البحث بالاسم أو البريد الإلكتروني..."
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

      {/* Coaches Table */}
      <Card>
        <CardHeader>
          <CardTitle>جميع المدربين ({coaches.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {coaches.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا يوجد مدربين بعد</h3>
              <p className="text-muted-foreground mb-4">
                ابدأ بإضافة مدربك الأول
              </p>
              <Link href={`/${organization.slug}/coaches/new`}>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة المدرب الأول
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المدرب</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>المجموعات</TableHead>
                    <TableHead>الرياضيون</TableHead>
                    <TableHead>انضم</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coaches.map((coach) => {
                    const totalAthletes = coach.groups.reduce((s, g) => s + g.groupMembers.length, 0)
                    const joinedDate = new Date(coach.memberCreatedAt).toLocaleDateString('ar-EG')

                    return (
                      <TableRow key={coach.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={coach.image || undefined} />
                              <AvatarFallback className="bg-blue-500">
                                {getInitials(coach.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {coach.name}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {coach.email}
                        </TableCell>
                        <TableCell>
                          {coach.groups.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {coach.groups.map((group) => (
                                <Badge key={group.id} variant="outline" className="gap-1">
                                  <span
                                    className={`h-2 w-2 rounded-full ${getCategoryColor(group.category)}`}
                                  />
                                  {group.name} ({group.category})
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">لا مجموعات</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{totalAthletes}</div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {joinedDate}
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
                                <Link href={`/${organization.slug}/coaches/${coach.id}`}>
                                  <Eye className="h-4 w-4 ml-2" />
                                  عرض التفاصيل
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/${organization.slug}/coaches/${coach.id}/edit`}>
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

export default CoachesPage