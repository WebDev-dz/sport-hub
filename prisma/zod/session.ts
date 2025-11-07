import * as z from "zod"

import { Completeuser, RelateduserModel } from "./index"

export const sessionModel = z.object({
  id: z.string(),
  expiresAt: z.date(),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  ipAddress: z.string().nullish(),
  userAgent: z.string().nullish(),
  userId: z.string(),
  activeOrganizationId: z.string().nullish(),
  impersonatedBy: z.string().nullish(),
})

export interface Completesession extends z.infer<typeof sessionModel> {
  user: Completeuser
}

/**
 * RelatedsessionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedsessionModel: z.ZodSchema<Completesession> = z.lazy(() => sessionModel.extend({
  user: RelateduserModel,
}))
