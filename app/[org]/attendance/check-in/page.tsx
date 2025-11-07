// [org]/attendance/check-in/page.tsx
import { auth } from "@/lib/auth";

import prisma from "@/lib/db/prisma";
import { headers } from "next/headers";
import AttendanceCheckInView from "./view";

type Props = {
  params: {
    org: string;
  };
};

const AttendanceCheckInPage: React.FC<Props> = async ({ params }) => {
  const { org } = await params;
  const [session] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
  ]);

  const organization = await prisma.organization.findUnique({
    where: {
      slug: org,
    },
  });

  if (!organization) {
    throw new Error("لم يتم العثور على منظمة");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaySessions = await prisma.training_session.findMany({
    where: {
      date: {
        gte: today.toISOString(),
        lt: tomorrow.toISOString(),
      },
      sessionGroups: {
        some: {
          group: {
            organizationId: organization.id,
          },
        },
      },
    },
    include: {
      sessionGroups: {
        include: {
          group: {
            include: {
              coach: true,
            },
          },
        },
      },
      attendances: {
        include: {
          member: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });

  // For each session, get all unique members from groups
  const sessionsWithMembers = await Promise.all(
    todaySessions.map(async (sess) => {
      const groupIds = sess.sessionGroups.map((sg) => sg.groupId);
      const members = await prisma.sports_member.findMany({
        where: {
          groupMembers: {
            some: {
              groupId: {
                in: groupIds,
              },
            },
          },
        },
        include: {
          groupMembers: {
            where: {
              groupId: {
                in: groupIds,
              },
            },
            include: {
              group: true,
            },
          },
        },
        orderBy: {
          firstName: "asc",
        },
      });

      // Get existing attendances for this session
      const existingAttendances = sess.attendances.reduce(
        (acc, att) => {
          acc[att.memberId] = att.status;
          return acc;
        },
        {} as Record<string, string>
      );

      return {
        ...sess,
        members: members.map((member) => ({
          ...member,
          attendanceStatus: existingAttendances[member.id] || "pending",
        })),
      };
    })
  );

  return (
    <AttendanceCheckInView
      sessionsWithMembers={sessionsWithMembers}
      organization={organization}
    />
  );
};

export default AttendanceCheckInPage;
