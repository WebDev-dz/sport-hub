import * as z from "zod"

import { Completeuser, RelateduserModel } from "./index"

export const passkeyModel = z.object({
  id: z.string(),
  name: z.string().nullish(),
  publicKey: z.string(),
  userId: z.string(),
  credentialID: z.string(),
  counter: z.number().int(),
  deviceType: z.string(),
  backedUp: z.boolean(),
  transports: z.string().nullish(),
  createdAt: z.date().nullish(),
  aaguid: z.string().nullish(),
})

export interface Completepasskey extends z.infer<typeof passkeyModel> {
  user: Completeuser
}

/**
 * RelatedpasskeyModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedpasskeyModel: z.ZodSchema<Completepasskey> = z.lazy(() => passkeyModel.extend({
  user: RelateduserModel,
}))
