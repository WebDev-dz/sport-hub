// [org]/coaches/new/page.tsx
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

type Props = {
    params: Promise<{
        org: string
    }>
}

const NewCoachPage: React.FC<Props> = async ({ params }) => {

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

  // Note: In a real implementation, the form would submit to a server action
  // that creates an invitation with role 'coach'

  return (
    <div className="container mx-auto py-8 px-4 space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">إضافة مدرب جديد</h1>
          <p className="text-muted-foreground mt-1">
            أرسل دعوة لمدرب جديد للانضمام إلى منظمتك كمدرب
          </p>
        </div>
        <Link href={`/${organization.slug}/coaches`}>
          <Button variant="outline" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            العودة إلى قائمة المدربين
          </Button>
        </Link>
      </div>

      {/* Invitation Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>دعوة مدرب</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل (اختياري)</Label>
              <Input 
                id="name" 
                placeholder="أدخل الاسم الكامل للمدرب"
              />
              <p className="text-sm text-muted-foreground">
                سيتم استخدام هذا الاسم في الدعوة، لكن المستخدم يمكنه تغييره عند التسجيل.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="أدخل بريد المدرب الإلكتروني"
                required 
              />
            </div>

            {/* Hidden role */}
            <input type="hidden" name="role" value="coach" />

            <Button type="submit" className="w-full">
              إرسال الدعوة
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewCoachPage