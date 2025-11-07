import * as z from "zod"

import { Completeuser, RelateduserModel, Completeorganization, RelatedorganizationModel, Completegroup_member, Relatedgroup_memberModel, Completesession_group, Relatedsession_groupModel } from "./index"

export const groupModel = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  coachId: z.string(),
  organizationId: z.string(),
  createdAt: z.date(),
})

export interface Completegroup extends z.infer<typeof groupModel> {
  coach: Completeuser
  organization: Completeorganization
  groupMembers: Completegroup_member[]
  sessionGroups: Completesession_group[]
}

/**
 * RelatedgroupModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedgroupModel: z.ZodSchema<Completegroup> = z.lazy(() => groupModel.extend({
  coach: RelateduserModel,
  organization: RelatedorganizationModel,
  groupMembers: Relatedgroup_memberModel.array(),
  sessionGroups: Relatedsession_groupModel.array(),
}))
