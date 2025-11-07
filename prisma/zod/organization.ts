import * as z from "zod"

import { Completemember, RelatedmemberModel, Completeinvitation, RelatedinvitationModel, CompletessoProvider, RelatedssoProviderModel, Completesubscription, RelatedsubscriptionModel, Completegroup, RelatedgroupModel, Completesports_member, Relatedsports_memberModel } from "./index"

export const organizationModel = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  logo: z.string().nullish(),
  createdAt: z.date(),
  metadata: z.string().nullish(),
})

export interface Completeorganization extends z.infer<typeof organizationModel> {
  members: Completemember[]
  invitations: Completeinvitation[]
  ssoProviders: CompletessoProvider[]
  subscriptions: Completesubscription[]
  groups: Completegroup[]
  sportsMembers: Completesports_member[]
}

/**
 * RelatedorganizationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedorganizationModel: z.ZodSchema<Completeorganization> = z.lazy(() => organizationModel.extend({
  members: RelatedmemberModel.array(),
  invitations: RelatedinvitationModel.array(),
  ssoProviders: RelatedssoProviderModel.array(),
  subscriptions: RelatedsubscriptionModel.array(),
  groups: RelatedgroupModel.array(),
  sportsMembers: Relatedsports_memberModel.array(),
}))
