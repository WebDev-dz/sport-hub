import * as z from "zod"

import { Completeuser, RelateduserModel, Completeorganization, RelatedorganizationModel } from "./index"

export const ssoProviderModel = z.object({
  id: z.string(),
  issuer: z.string(),
  oidcConfig: z.string().nullish(),
  samlConfig: z.string().nullish(),
  userId: z.string(),
  providerId: z.string(),
  organizationId: z.string().nullish(),
  domain: z.string(),
})

export interface CompletessoProvider extends z.infer<typeof ssoProviderModel> {
  user: Completeuser
  organization?: Completeorganization | null
}

/**
 * RelatedssoProviderModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedssoProviderModel: z.ZodSchema<CompletessoProvider> = z.lazy(() => ssoProviderModel.extend({
  user: RelateduserModel,
  organization: RelatedorganizationModel.nullish(),
}))
