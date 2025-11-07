import * as z from "zod"

import { Completeorganization, RelatedorganizationModel, Completeuser, RelateduserModel } from "./index"

export const invitationModel = z.object({
  id: z.string(),
  organizationId: z.string(),
  email: z.string(),
  role: z.string().nullish(),
  status: z.string(),
  expiresAt: z.date(),
  inviterId: z.string(),
})

export interface Completeinvitation extends z.infer<typeof invitationModel> {
  organization: Completeorganization
  inviter: Completeuser
}

/**
 * RelatedinvitationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedinvitationModel: z.ZodSchema<Completeinvitation> = z.lazy(() => invitationModel.extend({
  organization: RelatedorganizationModel,
  inviter: RelateduserModel,
}))
