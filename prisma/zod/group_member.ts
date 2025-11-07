import * as z from "zod"

import { Completegroup, RelatedgroupModel, Completesports_member, Relatedsports_memberModel } from "./index"

export const group_memberModel = z.object({
  groupId: z.string(),
  memberId: z.string(),
  startDate: z.date(),
  endDate: z.date().nullish(),
})

export interface Completegroup_member extends z.infer<typeof group_memberModel> {
  group: Completegroup
  member: Completesports_member
}

/**
 * Relatedgroup_memberModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedgroup_memberModel: z.ZodSchema<Completegroup_member> = z.lazy(() => group_memberModel.extend({
  group: RelatedgroupModel,
  member: Relatedsports_memberModel,
}))
