import * as z from "zod"

import { Completeuser, RelateduserModel } from "./index"

export const deviceCodeModel = z.object({
  id: z.string(),
  deviceCode: z.string(),
  userCode: z.string(),
  userId: z.string().nullish(),
  expiresAt: z.date(),
  status: z.string(),
  lastPolledAt: z.date().nullish(),
  pollingInterval: z.number().int().nullish(),
  clientId: z.string().nullish(),
  scope: z.string().nullish(),
})

export interface CompletedeviceCode extends z.infer<typeof deviceCodeModel> {
  user?: Completeuser | null
}

/**
 * RelateddeviceCodeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelateddeviceCodeModel: z.ZodSchema<CompletedeviceCode> = z.lazy(() => deviceCodeModel.extend({
  user: RelateduserModel.nullish(),
}))
