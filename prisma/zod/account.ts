import * as z from "zod"
import { Completeuser, RelateduserModel } from "./index"

export const accountModel = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().nullish(),
  refreshToken: z.string().nullish(),
  idToken: z.string().nullish(),
  accessTokenExpiresAt: z.date().nullish(),
  refreshTokenExpiresAt: z.date().nullish(),
  scope: z.string().nullish(),
  password: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface Completeaccount extends z.infer<typeof accountModel> {
  user: Completeuser
}

/**
 * RelatedaccountModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedaccountModel: z.ZodSchema<Completeaccount> = z.lazy(() => accountModel.extend({
  user: RelateduserModel,
}))
