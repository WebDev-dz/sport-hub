import * as z from "zod"

import { Completeorganization, RelatedorganizationModel, Completeuser, RelateduserModel } from "./index"

export const memberModel = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  role: z.string(),
  createdAt: z.date(),
})

export interface Completemember extends z.infer<typeof memberModel> {
  organization: Completeorganization
  user: Completeuser
}

/**
 * RelatedmemberModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedmemberModel: z.ZodSchema<Completemember> = z.lazy(() => memberModel.extend({
  organization: RelatedorganizationModel,
  user: RelateduserModel,
}))
