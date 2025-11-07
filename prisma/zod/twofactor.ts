import * as z from "zod"

import { Completeuser, RelateduserModel } from "./index"

export const twoFactorModel = z.object({
  id: z.string(),
  secret: z.string(),
  backupCodes: z.string(),
  userId: z.string(),
})

export interface CompletetwoFactor extends z.infer<typeof twoFactorModel> {
  user: Completeuser
}

/**
 * RelatedtwoFactorModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedtwoFactorModel: z.ZodSchema<CompletetwoFactor> = z.lazy(() => twoFactorModel.extend({
  user: RelateduserModel,
}))
