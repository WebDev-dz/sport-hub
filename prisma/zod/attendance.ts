import * as z from "zod"

import { Completetraining_session, Relatedtraining_sessionModel, Completesports_member, Relatedsports_memberModel } from "./index"

export const attendanceModel = z.object({
  id: z.string(),
  sessionId: z.string(),
  memberId: z.string(),
  status: z.string(),
  notes: z.string().nullish(),
  createdAt: z.date(),
})

export interface Completeattendance extends z.infer<typeof attendanceModel> {
  session: Completetraining_session
  member: Completesports_member
}

/**
 * RelatedattendanceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedattendanceModel: z.ZodSchema<Completeattendance> = z.lazy(() => attendanceModel.extend({
  session: Relatedtraining_sessionModel,
  member: Relatedsports_memberModel,
}))
