// [org]/page.tsx
import prisma from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, CheckCircle, UserCheck, Eye } from 'lucide-react'
import Link from 'next/link'

type Props = {
    params: {
        org: string
    }
}

export const runtime = 'edge' // Force edge runtime

const HomePage: React.FC<Props> = async ({ params }) => {
    const { org } = await params;

    const organization = await prisma.organization.findUnique({
      where: {
        slug: org
      }
    })
    if (!organization) {
      notFound()
    }

    const [groups, sessions, attendances, members] = await Promise.all([
        prisma.group.count({where: {organizationId: organization.id}}),
        prisma.training_session.count({where: {sessionGroups: { some: { group: { organizationId: organization.id } } }}}),
        prisma.attendance.count({where: {session: {sessionGroups: { some: { group: { organizationId: organization.id } } }}}}),
        prisma.sports_member.count({where: {organizationId: organization.id}}),
    ])

    const recentSessions = await prisma.training_session.findMany({
      where: {
        sessionGroups: {
          some: {
            group: {
              organizationId: organization.id
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: 5,
      include: {
        sessionGroups: {
          include: {
            group: true
          }
        }
      }
    })

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
          <h1 className="text-3xl font-bold tracking-tight">مرحبا بك في {organization.name}</h1>
          <p className="text-muted-foreground mt-1">
            لوحة التحكم الرئيسية لإدارة أنشطتك الرياضية
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/${org}/sessions/new`}>
            <Button className="gap-2">
              <Calendar className="h-4 w-4" />
              إضافة جلسة
            </Button>
          </Link>
          <Link href={`/${org}/players/new`}>
            <Button className="gap-2">
              <Users className="h-4 w-4" />
              إضافة لاعب
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي اللاعبين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members}</div>
            <p className="text-xs text-muted-foreground mt-1">
              الرياضيين المسجلين
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المجموعات</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groups}</div>
            <p className="text-xs text-muted-foreground mt-1">
              المجموعات النشطة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الجلسات</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              الجلسات التدريبية
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الحضور</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendances}</div>
            <p className="text-xs text-muted-foreground mt-1">
              سجلات الحضور
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>الجلسات الأخيرة</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSessions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد جلسات أخيرة</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">
                      {new Date(session.date).toLocaleDateString('ar-EG')} - {session.startTime} إلى {session.endTime}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {session.description || 'لا وصف'}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {session.sessionGroups.map((sg) => (
                        <Badge key={sg.groupId} variant="outline" className="gap-1">
                          <span className={`h-2 w-2 rounded-full ${getCategoryColor(sg.group.category)}`} />
                          {sg.group.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Link href={`/${org}/sessions/${session.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 ml-2" />
                      عرض
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default HomePage