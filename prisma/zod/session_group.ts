import * as z from "zod"

import { Completetraining_session, Relatedtraining_sessionModel, Completegroup, RelatedgroupModel } from "./index"

export const session_groupModel = z.object({
  sessionId: z.string(),
  groupId: z.string(),
})

export interface Completesession_group extends z.infer<typeof session_groupModel> {
  session: Completetraining_session
  group: Completegroup
}

/**
 * Relatedsession_groupModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedsession_groupModel: z.ZodSchema<Completesession_group> = z.lazy(() => session_groupModel.extend({
  session: Relatedtraining_sessionModel,
  group: RelatedgroupModel,
}))
