import * as z from "zod"

import { Completesession_group, Relatedsession_groupModel, Completeattendance, RelatedattendanceModel } from "./index"

export const training_sessionModel = z.object({
  id: z.string(),
  date: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  description: z.string().nullish(),
  location: z.string().nullish(),
  createdAt: z.date(),
})

export interface Completetraining_session extends z.infer<typeof training_sessionModel> {
  sessionGroups: Completesession_group[]
  attendances: Completeattendance[]
}

/**
 * Relatedtraining_sessionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedtraining_sessionModel: z.ZodSchema<Completetraining_session> = z.lazy(() => training_sessionModel.extend({
  sessionGroups: Relatedsession_groupModel.array(),
  attendances: RelatedattendanceModel.array(),
}))
