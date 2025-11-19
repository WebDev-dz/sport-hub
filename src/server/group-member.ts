import prisma from "@/lib/prisma"

// ============================================
// Type Definitions
// ============================================

export type FindManyGroupMemberParams = Parameters<typeof prisma.group_member.findMany>[0]
export type FindUniqueGroupMemberParams = Parameters<typeof prisma.group_member.findUnique>[0]
export type FindFirstGroupMemberParams = Parameters<typeof prisma.group_member.findFirst>[0]
export type CreateGroupMemberParams = Parameters<typeof prisma.group_member.create>[0]
export type CreateManyGroupMemberParams = Parameters<typeof prisma.group_member.createMany>[0]
export type UpdateGroupMemberParams = Parameters<typeof prisma.group_member.update>[0]
export type UpdateManyGroupMemberParams = Parameters<typeof prisma.group_member.updateMany>[0]
export type UpsertGroupMemberParams = Parameters<typeof prisma.group_member.upsert>[0]
export type DeleteGroupMemberParams = Parameters<typeof prisma.group_member.delete>[0]
export type DeleteManyGroupMemberParams = Parameters<typeof prisma.group_member.deleteMany>[0]
export type CountGroupMemberParams = Parameters<typeof prisma.group_member.count>[0]
export type AggregateGroupMemberParams = Parameters<typeof prisma.group_member.aggregate>[0]

// ============================================
// Find Operations
// ============================================

/**
 * Find multiple group_member records
 */
export async function findManyGroupMember(params?: FindManyGroupMemberParams) {
  const group_members = await prisma.group_member.findMany(params)
  return group_members
}

/**
 * Find a unique group_member record
 */
export async function findUniqueGroupMember(params: FindUniqueGroupMemberParams) {
  const group_member = await prisma.group_member.findUnique(params)
  return group_member
}

/**
 * Find first group_member record matching criteria
 */
export async function findFirstGroupMember(params?: FindFirstGroupMemberParams) {
  const group_member = await prisma.group_member.findFirst(params)
  return group_member
}

/**
 * Find a unique group_member record or throw error if not found
 */
export async function findUniqueGroupMemberOrThrow(params: FindUniqueGroupMemberParams) {
  const group_member = await prisma.group_member.findUniqueOrThrow(params)
  return group_member
}

/**
 * Find first group_member record or throw error if not found
 */
export async function findFirstGroupMemberOrThrow(params?: FindFirstGroupMemberParams) {
  const group_member = await prisma.group_member.findFirstOrThrow(params)
  return group_member
}

// ============================================
// Create Operations
// ============================================

/**
 * Create a single group_member record
 */
export async function createGroupMember(params: CreateGroupMemberParams) {
  const group_member = await prisma.group_member.create(params)
  return group_member
}

/**
 * Create multiple group_member records
 */
export async function createManyGroupMember(params: CreateManyGroupMemberParams) {
  const result = await prisma.group_member.createMany(params)
  return result
}

// ============================================
// Update Operations
// ============================================

/**
 * Update a single group_member record
 */
export async function updateGroupMember(params: UpdateGroupMemberParams) {
  const group_member = await prisma.group_member.update(params)
  return group_member
}

/**
 * Update multiple group_member records
 */
export async function updateManyGroupMember(params: UpdateManyGroupMemberParams) {
  const result = await prisma.group_member.updateMany(params)
  return result
}

/**
 * Update an group_member record or create it if it doesn't exist
 */
export async function upsertGroupMember(params: UpsertGroupMemberParams) {
  const group_member = await prisma.group_member.upsert(params)
  return group_member
}

// ============================================
// Delete Operations
// ============================================

/**
 * Delete a single group_member record
 */
export async function deleteGroupMember(params: DeleteGroupMemberParams) {
  const group_member = await prisma.group_member.delete(params)
  return group_member
}

/**
 * Delete multiple group_member records
 */
export async function deleteManyGroupMember(params?: DeleteManyGroupMemberParams) {
  const result = await prisma.group_member.deleteMany(params)
  return result
}

// ============================================
// Aggregation Operations
// ============================================

/**
 * Count group_member records
 */
export async function countGroupMember(params?: CountGroupMemberParams) {
  const count = await prisma.group_member.count(params)
  return count
}

/**
 * Aggregate group_member records
 */
export async function aggregateGroupMember(params: AggregateGroupMemberParams) {
  const result = await prisma.group_member.aggregate(params)
  return result
}

// ============================================
// Utility Functions
// ============================================

/**
 * Check if an group_member record exists
 */
export async function group_memberExists(params: FindUniqueGroupMemberParams) {
  const count = await prisma.group_member.count({
    where: params.where,
  })
  return count > 0
}
