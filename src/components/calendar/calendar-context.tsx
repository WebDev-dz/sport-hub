"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "@/components/calendar/hooks";
import type { IEvent, IUser } from "@/components/calendar/interfaces";
import type {
	TCalendarView,
	TEventColor,
} from "@/components/calendar/types";

interface ICalendarContext {
	selectedDate: Date;
	view: TCalendarView;
	setView: (view: TCalendarView) => void;
	agendaModeGroupBy: "date" | "color";
	setAgendaModeGroupBy: (groupBy: "date" | "color") => void;
	use24HourFormat: boolean;
	toggleTimeFormat: () => void;
	setSelectedDate: (date: Date | undefined) => void;
	selectedUserId: IUser["id"] | "all";
	setSelectedUserId: (userId: IUser["id"] | "all") => void;
	badgeVariant: "dot" | "colored";
	setBadgeVariant: (variant: "dot" | "colored") => void;
	selectedColors: TEventColor[];
	filterEventsBySelectedColors: (colors: TEventColor) => void;
	filterEventsBySelectedUser: (userId: IUser["id"] | "all") => void;
	users: IUser[];
	events: IEvent[];
	addEvent: (event: IEvent) => void;
	updateEvent: (event: IEvent) => void;
	removeEvent: (eventId: string) => void;
	clearFilter: () => void;
	isLoading: boolean;
}

interface CalendarSettings {
	badgeVariant: "dot" | "colored";
	view: TCalendarView;
	use24HourFormat: boolean;
	agendaModeGroupBy: "date" | "color";
}

export interface CalendarHandlers {
	onAddEvent?: (event: IEvent) => Promise<IEvent | void>;
	onUpdateEvent?: (event: IEvent) => Promise<IEvent | void>;
	onDeleteEvent?: (eventId: string) => Promise<void>;
	onChangeView?: (view: TCalendarView) => Promise<void>;
	onChangeDate?: (date: Date) => Promise<void>;
}

const DEFAULT_SETTINGS: CalendarSettings = {
	badgeVariant: "colored",
	view: "day",
	use24HourFormat: true,
	agendaModeGroupBy: "date",
};

const CalendarContext = createContext({} as ICalendarContext);

export function CalendarProvider({
	children,
	users,
	events,
	badge = "colored",
	view = "day",
	onAddEvent,
	onUpdateEvent,
	onDeleteEvent,
	onChangeView,
	onChangeDate,
}: {
	children: React.ReactNode;
	users: IUser[];
	events: IEvent[];
	view?: TCalendarView;
	badge?: "dot" | "colored";
} & CalendarHandlers) {
	const [settings, setSettings] = useLocalStorage<CalendarSettings>(
		"calendar-settings",
		{
			...DEFAULT_SETTINGS,
			badgeVariant: badge,
			view: view,
		},
	);

	const [badgeVariant, setBadgeVariantState] = useState<"dot" | "colored">(
		settings.badgeVariant,
	);
	const [currentView, setCurrentViewState] = useState<TCalendarView>(
		settings.view,
	);
	const [use24HourFormat, setUse24HourFormatState] = useState<boolean>(
		settings.use24HourFormat,
	);
	const [agendaModeGroupBy, setAgendaModeGroupByState] = useState<
		"date" | "color"
	>(settings.agendaModeGroupBy);

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedUserId, setSelectedUserId] = useState<IUser["id"] | "all">(
		"all",
	);
	const [selectedColors, setSelectedColors] = useState<TEventColor[]>([]);

	const [allEvents, setAllEvents] = useState<IEvent[]>(events || []);
	const [filteredEvents, setFilteredEvents] = useState<IEvent[]>(events || []);
	const [isLoading, setIsLoading] = useState(false);

	const updateSettings = (newPartialSettings: Partial<CalendarSettings>) => {
		setSettings({
			...settings,
			...newPartialSettings,
		});
	};

	const setBadgeVariant = (variant: "dot" | "colored") => {
		setBadgeVariantState(variant);
		updateSettings({ badgeVariant: variant });
	};

	const setView = async (newView: TCalendarView) => {
		try {
			setIsLoading(true);
			await onChangeView?.(newView);
			setCurrentViewState(newView);
			updateSettings({ view: newView });
		} catch (error) {
			console.error("Failed to change view:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const toggleTimeFormat = () => {
		const newValue = !use24HourFormat;
		setUse24HourFormatState(newValue);
		updateSettings({ use24HourFormat: newValue });
	};

	const setAgendaModeGroupBy = (groupBy: "date" | "color") => {
		setAgendaModeGroupByState(groupBy);
		updateSettings({ agendaModeGroupBy: groupBy });
	};

	const filterEventsBySelectedColors = (color: TEventColor) => {
		const isColorSelected = selectedColors.includes(color);
		const newColors = isColorSelected
			? selectedColors.filter((c) => c !== color)
			: [...selectedColors, color];

		if (newColors.length > 0) {
			const filtered = allEvents.filter((event) => {
				const eventColor = event.color || "blue";
				return newColors.includes(eventColor);
			});
			setFilteredEvents(filtered);
		} else {
			setFilteredEvents(allEvents);
		}

		setSelectedColors(newColors);
	};

	const filterEventsBySelectedUser = (userId: IUser["id"] | "all") => {
		setSelectedUserId(userId);
		if (userId === "all") {
			setFilteredEvents(allEvents);
		} else {
			const filtered = allEvents.filter((event) => event.user?.id === userId);
			setFilteredEvents(filtered);
		}
	};

	const handleSelectDate = async (date: Date | undefined) => {
		if (!date) return;
		
		try {
			setIsLoading(true);
			await onChangeDate?.(date);
			setSelectedDate(date);
		} catch (error) {
			console.error("Failed to change date:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const addEvent = async (event: IEvent) => {
		try {
			setIsLoading(true);
			
			// Call the handler and get the result
			const result = await onAddEvent?.(event);
			
			// Use the returned event if provided, otherwise use the original
			const eventToAdd = result || event;
			
			// Update local state
			setAllEvents((prev) => [...prev, eventToAdd]);
			
			// Update filtered events if it should be visible
			const shouldAddToFiltered = 
				selectedUserId === "all" || eventToAdd.user?.id === selectedUserId;
			
			if (shouldAddToFiltered) {
				if (selectedColors.length === 0 || 
					selectedColors.includes(eventToAdd.color || "blue")) {
					setFilteredEvents((prev) => [...prev, eventToAdd]);
				}
			}
		} catch (error) {
			console.error("Failed to add event:", error);
			throw error; // Re-throw to allow UI to handle error
		} finally {
			setIsLoading(false);
		}
	};

	const updateEvent = async (event: IEvent) => {
		try {
			setIsLoading(true);
			
			// Normalize dates
			const updated = {
				...event,
				startDate: new Date(event.start).toISOString(),
				endDate: new Date(event.end).toISOString(),
			};

			// Call the handler
			const result = await onUpdateEvent?.(updated);
			
			// Use the returned event if provided, otherwise use the updated one
			const eventToUpdate = result || updated;

			// Update local state
			setAllEvents((prev) => 
				prev.map((e) => (e.id === event.id ? eventToUpdate : e))
			);
			setFilteredEvents((prev) =>
				prev.map((e) => (e.id === event.id ? eventToUpdate : e))
			);
		} catch (error) {
			console.error("Failed to update event:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const removeEvent = async (eventId: string) => {
		try {
			setIsLoading(true);
			
			// Call the handler
			await onDeleteEvent?.(eventId);
			
			// Update local state
			setAllEvents((prev) => prev.filter((e) => e.id !== eventId));
			setFilteredEvents((prev) => prev.filter((e) => e.id !== eventId));
		} catch (error) {
			console.error("Failed to remove event:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const clearFilter = () => {
		setFilteredEvents(allEvents);
		setSelectedColors([]);
		setSelectedUserId("all");
	};

	const value = {
		selectedDate,
		setSelectedDate: handleSelectDate,
		selectedUserId,
		setSelectedUserId,
		badgeVariant,
		setBadgeVariant,
		users,
		selectedColors,
		filterEventsBySelectedColors,
		filterEventsBySelectedUser,
		events: filteredEvents,
		view: currentView,
		use24HourFormat,
		toggleTimeFormat,
		setView,
		agendaModeGroupBy,
		setAgendaModeGroupBy,
		addEvent,
		updateEvent,
		removeEvent,
		clearFilter,
		isLoading,
	};

	return (
		<CalendarContext.Provider value={value}>
			{children}
		</CalendarContext.Provider>
	);
}

export function useCalendar(): ICalendarContext {
	const context = useContext(CalendarContext);
	if (!context)
		throw new Error("useCalendar must be used within a CalendarProvider.");
	return context;
}