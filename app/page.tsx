// page.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import prisma from "@/lib/db/prisma";
import { getStripePlans } from "@/lib/stripe";
import { ArrowLeft, Users, Calendar, CheckCircle, Globe } from "lucide-react";
import Link from "next/link";

const LandingPage: React.FC =  () => {
  //   const totalPlayers = await prisma.sports_member.count();
  //   const totalGroups = await prisma.group.count();
  //   const totalOrganizations = await prisma.organization.count();
  const developer = "Youcef Gagi";
  const facebook = "https://www.facebook.com/gagi.youcef/";
  const linkedin = "https://www.linkedin.com/in/youcef-gagi-ab58a2288/";
  //   const plans = await getStripePlans();
  return (
    <div
      className="min-h-screen"
      dir="rtl"
    >
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">نادي الرياضة</div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="outline">تسجيل الدخول</Button>
          </Link>
          <Link href="/signup">
            <Button>إنشاء حساب</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
        >
          <section className="container mx-auto py-20 px-4 text-center">
            <h1 className="text-5xl font-bold mb-6 text-gray-800">
              إدارة ناديك الرياضي بكفاءة عالية
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              نظام متكامل لإدارة الأعضاء، المدربين، اللاعبين، الجلسات التدريبية،
              والحضور. ابدأ في تنظيم أنشطتك الرياضية اليوم!
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  ابدأ الآن مجانًا
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline">
                  شاهد العرض التوضيحي
                </Button>
              </Link>
            </div>
          </section>
        </motion.div>
      </AuroraBackground>

      {/* Features Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          مميزات النظام
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto text-blue-500" />
              <CardTitle className="mt-4">إدارة الأعضاء</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                إدارة اللاعبين والمدربين بسهولة مع تفاصيل كاملة وبيانات شخصية.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 mx-auto text-blue-500" />
              <CardTitle className="mt-4">جدولة الجلسات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                إنشاء وإدارة جلسات التدريب مع تخصيص المجموعات والأوقات.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="h-12 w-12 mx-auto text-blue-500" />
              <CardTitle className="mt-4">تسجيل الحضور</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                تسجيل حضور اللاعبين بسرعة وإحصائيات مفصلة.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Globe className="h-12 w-12 mx-auto text-blue-500" />
              <CardTitle className="mt-4">دعم متعدد المنظمات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                إدارة متعددة النوادي والمنظمات في نظام واحد.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">جاهز لتحسين إدارة ناديك؟</h2>
          <p className="text-lg mb-8">
            انضم إلى آلاف النوادي التي تستخدم نظامنا للإدارة الفعالة.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="gap-2">
              إنشاء حساب مجاني
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto py-8 px-4 text-center text-gray-600">
        <p>&copy; 2023 نادي الرياضة. جميع الحقوق محفوظة.</p>
        <div className="mt-2">
          <Link href="/privacy" className="mx-2">
            سياسة الخصوصية
          </Link>
          <Link href="/terms" className="mx-2">
            شروط الخدمة
          </Link>
          <Link href="/contact" className="mx-2">
            اتصل بنا
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
