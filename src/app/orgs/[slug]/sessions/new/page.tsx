// [org]/sessions/new/page.tsx
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
// import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import NewTrainingSessionView from "./view";

type Props = {
  params: {
    org: string;
  };
};

const NewSessionPage: React.FC<Props> = async ({ params }) => {
  const { org } = await params;
  

  const organization = await prisma.organization.findUnique({
    where: {
      slug: org,
    },
  });

  if (!organization) {
    throw new Error("لم يتم العثور على منظمة");
  }

  const groups = await prisma.group.findMany({
    where: {
      organizationId: organization.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Note: In a real implementation, the form would submit to a server action
  // that creates the training session and associates groups

  return (
    <div className="container mx-auto py-8 px-4 space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            إضافة جلسة تدريب جديدة
          </h1>
          <p className="text-muted-foreground mt-1">
            إنشاء جلسة تدريب جديدة لمجموعاتك
          </p>
        </div>
        <Link href={`/${organization.slug}/sessions`}>
          <Button variant="outline" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            العودة إلى قائمة الجلسات
          </Button>
        </Link>
      </div>

      {/* Session Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>تفاصيل الجلسة</CardTitle>
        </CardHeader>
        <CardContent>
          <NewTrainingSessionView org={organization} groups={groups} />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewSessionPage;
