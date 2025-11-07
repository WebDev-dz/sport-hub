import * as z from "zod"

import { Completesession, RelatedsessionModel, Completeaccount, RelatedaccountModel, Completemember, RelatedmemberModel, Completeinvitation, RelatedinvitationModel, CompletetwoFactor, RelatedtwoFactorModel, Completepasskey, RelatedpasskeyModel, CompletessoProvider, RelatedssoProviderModel, CompletedeviceCode, RelateddeviceCodeModel, Completegroup, RelatedgroupModel } from "./index"

export const userModel = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  twoFactorEnabled: z.boolean().nullish(),
  role: z.string().nullish(),
  banned: z.boolean().nullish(),
  banReason: z.string().nullish(),
  banExpires: z.date().nullish(),
  stripeCustomerId: z.string().nullish(),
})

export interface Completeuser extends z.infer<typeof userModel> {
  sessions: Completesession[]
  accounts: Completeaccount[]
  members: Completemember[]
  invitations: Completeinvitation[]
  twoFactors: CompletetwoFactor[]
  passkeys: Completepasskey[]
  ssoProviders: CompletessoProvider[]
  deviceCodes: CompletedeviceCode[]
  groups: Completegroup[]
}

/**
 * RelateduserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelateduserModel: z.ZodSchema<Completeuser> = z.lazy(() => userModel.extend({
  sessions: RelatedsessionModel.array(),
  accounts: RelatedaccountModel.array(),
  members: RelatedmemberModel.array(),
  invitations: RelatedinvitationModel.array(),
  twoFactors: RelatedtwoFactorModel.array(),
  passkeys: RelatedpasskeyModel.array(),
  ssoProviders: RelatedssoProviderModel.array(),
  deviceCodes: RelateddeviceCodeModel.array(),
  groups: RelatedgroupModel.array(),
}))
