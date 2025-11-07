"use client";

import {
  createTrainingSessionAction,
  deleteTrainingSessionAction,
  updateTrainingSessionAction,
} from "@/app/_actions/training-session";
import { Calendar } from "@/components/calendar/calendar";
import { IEvent } from "@/components/calendar/interfaces";
import { TCalendarView } from "@/components/calendar/types";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { arDZ } from "date-fns/locale";

type Props = {
  sessions: ({
    sessionGroups: ({
      group: {
        id: string;
        createdAt: string;
        name: string;
        organizationId: string;
        category: string;
        coachId: string;
      };
    } & {
      sessionId: string;
      groupId: string;
    })[];
    attendances: {
      id: string;
      createdAt: string;
      memberId: string;
      status: string;
      sessionId: string;
      notes: string | null;
    }[];
  } & {
    id: string;
    createdAt: string;
    date: string;
    organizationId: string;
    location: string | null;
    description: string | null;
    startTime: string;
    endTime: string;
  })[];
  organization: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    createdAt: string;
    metadata: string | null;
  };
  view: TCalendarView;
  currentDate?: Date;
  currentWeek?: string;
  currentMonth?: string;
};

export default function SessionsScheduleView({
  sessions,
  organization,
  view = "month",
}: Props) {
  const router = useRouter();
  const onChangeView = async (view: TCalendarView) => {
    await router.push(`/${organization.slug}/sessions/schedule#sessions-calendar?view=${view}`);
  };
  const onAddEvent = async (event: IEvent) => {
    await createTrainingSessionAction({
      data: {
        date: event.startDate,
        startTime: format(event.startDate, "HH:mm"),
        endTime: format(event.endDate, "HH:mm"),
        description: event.description,
        organizationId: organization.id,
      },
    });
    console.log({ event });
    return event;
  };
  const onUpdateEvent = async (event: IEvent) => {
    await updateTrainingSessionAction({
      data: {
        id: event.id,
        date: event.startDate,
        startTime: format(event.startDate, "HH:mm"),
        endTime: format(event.endDate, "HH:mm"),
        description: event.description,
        organizationId: organization.id,
      },
      where: {
        id: event.id,
      },
    });
    return event;
  };
  const onDeleteEvent = async (eventId: string) => {
    await deleteTrainingSessionAction({
      where: {
        id: eventId,
      },
    });
  };
  const onChangeDate = async (date: Date) => {
    console.log(date);
  };
  return (
    <Calendar
      onChangeView={onChangeView}
      onAddEvent={onAddEvent}
      onUpdateEvent={onUpdateEvent}
      onDeleteEvent={onDeleteEvent}
      onChangeDate={onChangeDate}
      view={view}
      events={sessions.map((session, index) => {
        const startDate = new Date(session.date);
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 1);

        return {
          id: session.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          title: "حصة تدريبية",
          color: "blue",
          description: session.description || "",
          user: {
            id: session.organizationId,
            name: organization.name,
            picturePath: organization.logo || "",
          },
        };
      })}
    />
  );
}
