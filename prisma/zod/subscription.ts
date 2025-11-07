import * as z from "zod"

import { Completeorganization, RelatedorganizationModel } from "./index"

export const subscriptionModel = z.object({
  id: z.string(),
  plan: z.string(),
  referenceId: z.string(),
  stripeCustomerId: z.string().nullish(),
  stripeSubscriptionId: z.string().nullish(),
  status: z.string(),
  periodStart: z.date().nullish(),
  periodEnd: z.date().nullish(),
  trialStart: z.date().nullish(),
  trialEnd: z.date().nullish(),
  cancelAtPeriodEnd: z.boolean().nullish(),
  seats: z.number().int().nullish(),
  organizationId: z.string().nullish(),
})

export interface Completesubscription extends z.infer<typeof subscriptionModel> {
  organization?: Completeorganization | null
}

/**
 * RelatedsubscriptionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedsubscriptionModel: z.ZodSchema<Completesubscription> = z.lazy(() => subscriptionModel.extend({
  organization: RelatedorganizationModel.nullish(),
}))
