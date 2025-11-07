// app/dashboard/page.tsx
import { auth } from '@/lib/auth'
import prisma from '@/lib/db/prisma'
import { headers } from 'next/headers'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return <div>يرجى تسجيل الدخول</div>
  }

  const userOrganizations = await prisma.member.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      organization: true
    }
  })

  const orgData = await Promise.all(
    userOrganizations.map(async (member) => {
      const org = member.organization
      const [membersCount, playersCount, sessionsCount] = await Promise.all([
        prisma.member.count({ where: { organizationId: org.id } }),
        prisma.sports_member.count({ where: { organizationId: org.id } }),
        prisma.training_session.count({
          where: {
            sessionGroups: {
              some: {
                group: {
                  organizationId: org.id
                }
              }
            }
          }
        })
      ])

      return {
        org,
        membersCount,
        playersCount,
        sessionsCount
      }
    })
  )

  return (
    <div className="container mx-auto py-8 px-4 space-y-8" dir="rtl">
      <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
      <p className="text-muted-foreground">منظماتك</p>
      <div className="grid gap-4 md:grid-cols-3">
        {orgData.map(({ org, membersCount, playersCount, sessionsCount }) => (
          <Card key={org.id}>
            <CardHeader>
              <CardTitle>{org.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>الأعضاء: {membersCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <span>اللاعبين: {playersCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>الحصص: {sessionsCount}</span>
                </div>
                <Link href={`/${org.slug}`}>
                  <Button variant="outline" className="w-full">
                    عرض التفاصيل
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {orgData.length === 0 && (
        <p className="text-center text-muted-foreground">لا توجد منظمات حالياً</p>
      )}
    </div>
  )
}

export default DashboardPage