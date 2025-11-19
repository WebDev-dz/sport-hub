import React from "react";
import { CalendarBody } from "@/components/calendar/calendar-body";
import { CalendarHandlers, CalendarProvider } from "@/components/calendar/calendar-context";
import { DndProvider } from "@/components/calendar/dnd-context";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { getEvents, getUsers } from "@/components/calendar/requests";
import { IEvent } from "./interfaces";
import { TCalendarView } from "./types";

async function getCalendarData() {
  return {
    events: await getEvents(),
    users: await getUsers(),
  };
}

type CalendarViewProps = {
  events: IEvent[];
  view: TCalendarView;
  onChangeView?: (view: TCalendarView) => Promise<void>;
} & CalendarHandlers;
export async function Calendar({
  events,
  view,
  onChangeView,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onChangeDate,
}: CalendarViewProps) {
  const { users } = await getCalendarData();
  console.log({ events });
  return (
    <CalendarProvider
      onChangeView={onChangeView}
      onAddEvent={onAddEvent}
      onUpdateEvent={onUpdateEvent}
      onDeleteEvent={onDeleteEvent}
      onChangeDate={onChangeDate}
      events={events}
      users={users}
      view={view}
    >
      <DndProvider showConfirmation={false}>
        <div className="w-full border rounded-xl">
          <CalendarHeader />
          <CalendarBody />
        </div>
      </DndProvider>
    </CalendarProvider>
  );
}
