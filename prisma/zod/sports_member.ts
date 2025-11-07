import * as z from "zod"

import { Completeorganization, RelatedorganizationModel, Completegroup_member, Relatedgroup_memberModel, Completeattendance, RelatedattendanceModel } from "./index"

export const sports_memberModel = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  fatherName: z.string(),
  motherFullName: z.string(),
  bloodType: z.string(),
  educationLevel: z.string(),
  schoolName: z.string(),
  fatherPhone: z.string(),
  category: z.string(),
  nationalId: z.string(),
  idCardNumber: z.string(),
  address: z.string(),
  photoUrl: z.string().nullish(),
  role: z.string(),
  organizationId: z.string().nullish(),
  createdAt: z.date(),
})

export interface Completesports_member extends z.infer<typeof sports_memberModel> {
  organization?: Completeorganization | null
  groupMembers: Completegroup_member[]
  attendances: Completeattendance[]
}

/**
 * Relatedsports_memberModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedsports_memberModel: z.ZodSchema<Completesports_member> = z.lazy(() => sports_memberModel.extend({
  organization: RelatedorganizationModel.nullish(),
  groupMembers: Relatedgroup_memberModel.array(),
  attendances: RelatedattendanceModel.array(),
}))
