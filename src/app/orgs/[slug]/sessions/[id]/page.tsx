// [org]/sessions/[id]/page.tsx
import prisma from '@/lib/prisma'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Calendar,
  MapPin,
  Notebook,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{
    org: string
    id: string
  }>
}

const SessionDetailsPage: React.FC<Props> = async ({ params }) => {

  const { org, id } = await params  
  

  const organization = await prisma.organization.findUnique({
    where: {
      slug: org
    }
  })

  if (!organization) {
    notFound()
  }

  const trainingSession = await prisma.training_session.findUnique({
    where: {
      id
    },
    include: {
      sessionGroups: {
        include: {
          group: {
            include: {
              coach: true
            }
          }
        }
      },
      attendances: {
        include: {
          member: {
            include: {
              groupMembers: true,
          }
        }
      }
    }
  }})

  if (!trainingSession || trainingSession.sessionGroups.every(sg => sg.group.organizationId !== organization.id)) {
    notFound()
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

  const attendanceStats = {
    total: trainingSession.attendances.length,
    present: trainingSession.attendances.filter(a => a.status === 'present').length,
    absent: trainingSession.attendances.filter(a => a.status === 'absent').length
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">تفاصيل الجلسة</h1>
          <p className="text-muted-foreground mt-1">
            {new Date(trainingSession.date).toLocaleDateString('ar-EG')} - {trainingSession.startTime} إلى {trainingSession.endTime}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/${org}/sessions/${id}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              تعديل
            </Button>
          </Link>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            حذف
          </Button>
        </div>
      </div>

      {/* Session Info */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات الجلسة</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span>{new Date(trainingSession.date).toLocaleDateString('ar-EG')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span>{trainingSession.startTime} - {trainingSession.endTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span>{trainingSession.location || 'غير محدد'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Notebook className="h-5 w-5 text-muted-foreground" />
            <span>{trainingSession.description || 'لا وصف'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Groups */}
      <Card>
        <CardHeader>
          <CardTitle>المجموعات المشاركة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trainingSession.sessionGroups.map((sg) => (
              <Badge key={sg.groupId} variant="outline" className="gap-1">
                <span className={`h-2 w-2 rounded-full ${getCategoryColor(sg.group.category)}`} />
                {sg.group.name} ({sg.group.category})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Stats */}
      <Card>
        <CardHeader>
          <CardTitle>إحصائيات الحضور</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold">{attendanceStats.total}</div>
            <p className="text-muted-foreground">إجمالي</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
            <p className="text-muted-foreground">حاضرون</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
            <p className="text-muted-foreground">غائبون</p>
          </div>
        </CardContent>
      </Card>

      {/* Attendances Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>سجل الحضور</CardTitle>
          <Link href={`/${org}/attendance/check-in?sessionId=${id}`}>
            <Button className="gap-2">
              <CheckCircle className="h-4 w-4" />
              تسجيل حضور
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اللاعب</TableHead>
                <TableHead>المجموعة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الملاحظات</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainingSession.attendances.map((att, index) => {
                
                
                const group_member = att.member.groupMembers.find(gm => gm.memberId === att.memberId)
                const group = trainingSession.sessionGroups.find(sg => sg.groupId === group_member?.groupId)
                
                
                return(
                <TableRow key={att.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={att.member.photoUrl || undefined} />
                        <AvatarFallback className={getCategoryColor(att.member.category)}>
                          {getInitials(att.member.firstName, att.member.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{att.member.firstName} {att.member.lastName}</div>
                        <div className="text-sm text-muted-foreground">{att.member.category}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {trainingSession.sessionGroups[index]?.group.name || 'غير معين'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(att.status)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {att.notes || 'لا ملاحظات'}
                  </TableCell>
                  <TableCell className="text-left">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
          {trainingSession.attendances.length === 0 && (
            <p className="text-center text-muted-foreground py-8">لا سجلات حضور بعد</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SessionDetailsPage