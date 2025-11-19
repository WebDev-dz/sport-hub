"use client";

import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { Calendar, Clock, Text, User } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCalendar } from "@/components/calendar/calendar-context";
import { AddEditEventDialog } from "@/components/calendar/add-edit-event-dialog";
import { formatTime } from "@/components/calendar/helpers";
import type { IEvent } from "@/components/calendar/interfaces";

interface IProps {
	event: IEvent;
	children: ReactNode;
}

export function EventDetailsDialog({ event, children }: IProps) {
	const startDate = event.start;
	const endDate = event.end;
	const { use24HourFormat, removeEvent } = useCalendar();

	const deleteEvent = (eventId: string) => {
		try {
			removeEvent(eventId);
			toast.success("تم حذف الحدث بنجاح.");
		} catch {
			toast.error("خطأ في حذف الحدث.");
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{event.title}</DialogTitle>
				</DialogHeader>

				<ScrollArea className="max-h-[80vh]">
					<div className="space-y-4 p-4">
						<div className="flex items-start gap-2 flex-row-reverse">
							<User className="mt-1 size-4 shrink-0 text-muted-foreground" />
							<div className="text-right flex-1">
								<p className="text-sm font-medium">المسؤول</p>
								<p className="text-sm text-muted-foreground">
									{event.user?.name || "غير متوفر"}
								</p>
							</div>
						</div>

						<div className="flex items-start gap-2 flex-row-reverse">
							<Calendar className="mt-1 size-4 shrink-0 text-muted-foreground" />
							<div className="text-right flex-1">
								<p className="text-sm font-medium">تاريخ البداية</p>
								<p className="text-sm text-muted-foreground">
									{format(startDate, "EEEE dd MMMM", { locale: ar })}
									<span className="mx-1">على الساعة: </span>
									{formatTime(event.start, use24HourFormat)}
								</p>
							</div>
						</div>

						<div className="flex items-start gap-2 flex-row-reverse">
							<Clock className="mt-1 size-4 shrink-0 text-muted-foreground" />
							<div className="text-right flex-1">
								<p className="text-sm font-medium">تاريخ النهاية</p>
								<p className="text-sm text-muted-foreground">
									{format(endDate, "EEEE dd MMMM", { locale: ar })}
									<span className="mx-1">على الساعة: </span>
									{formatTime(event.end, use24HourFormat)}
								</p>
							</div>
						</div>

						<div className="flex items-start gap-2 flex-row-reverse">
							<Text className="mt-1 size-4 shrink-0 text-muted-foreground" />
							<div className="text-right flex-1">
								<p className="text-sm font-medium">الوصف</p>
								<p className="text-sm text-muted-foreground">
									{event.description}
								</p>
							</div>
						</div>
					</div>
				</ScrollArea>
				<div className="flex justify-start gap-2">
					<AddEditEventDialog event={event}>
						<Button variant="outline">تعديل</Button>
					</AddEditEventDialog>
					<Button
						variant="destructive"
						onClick={() => {
							deleteEvent(event.id);
						}}
					>
						حذف
					</Button>
				</div>
				<DialogClose />
			</DialogContent>
		</Dialog>
	);
}