import { TEventColor } from "./types"

export interface IEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  allDay?: boolean
  resource?: any
  color: TEventColor
  type: 'training' | 'match' | 'event' | 'meeting'
  location?: string
  user?: {
    id: string
    name: string
    picturePath: string | null
  }
  group?: string
}

export interface ICalendarProps {
  events: IEvent[]
  onEventClick?: (event: IEvent) => void
  onEventDrop?: (event: IEvent, newStart: Date, newEnd: Date) => void
  onEventResize?: (event: IEvent, newStart: Date, newEnd: Date) => void
  onSlotSelect?: (start: Date, end: Date) => void
  defaultView?: TCalendarView
  defaultDate?: Date
  minTime?: string
  maxTime?: string
  height?: number | string
  className?: string
}

export interface IUser {
  id: string
	name: string
	picturePath: null | string
}

export type TCalendarView = 'month' | 'week' | 'day' | 'agenda'
