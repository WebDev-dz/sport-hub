import prisma from "@/lib/prisma"

// ============================================
// Type Definitions
// ============================================

export type FindManyGroupParams = Parameters<typeof prisma.group.findMany>[0]
export type FindUniqueGroupParams = Parameters<typeof prisma.group.findUnique>[0]
export type FindFirstGroupParams = Parameters<typeof prisma.group.findFirst>[0]
export type CreateGroupParams = Parameters<typeof prisma.group.create>[0]
export type CreateManyGroupParams = Parameters<typeof prisma.group.createMany>[0]
export type UpdateGroupParams = Parameters<typeof prisma.group.update>[0]
export type UpdateManyGroupParams = Parameters<typeof prisma.group.updateMany>[0]
export type UpsertGroupParams = Parameters<typeof prisma.group.upsert>[0]
export type DeleteGroupParams = Parameters<typeof prisma.group.delete>[0]
export type DeleteManyGroupParams = Parameters<typeof prisma.group.deleteMany>[0]
export type CountGroupParams = Parameters<typeof prisma.group.count>[0]
export type AggregateGroupParams = Parameters<typeof prisma.group.aggregate>[0]

// ============================================
// Find Operations
// ============================================

/**
 * Find multiple group records
 */
export async function findManyGroup(params?: FindManyGroupParams) {
  const attendances = await prisma.group.findMany(params)
  return attendances
}

/**
 * Find a unique group record
 */
export async function findUniqueGroup(params: FindUniqueGroupParams) {
  const group = await prisma.group.findUnique(params)
  return group
}

/**
 * Find first group record matching criteria
 */
export async function findFirstGroup(params?: FindFirstGroupParams) {
  const group = await prisma.group.findFirst(params)
  return group
}

/**
 * Find a unique group record or throw error if not found
 */
export async function findUniqueGroupOrThrow(params: FindUniqueGroupParams) {
  const group = await prisma.group.findUniqueOrThrow(params)
  return group
}

/**
 * Find first group record or throw error if not found
 */
export async function findFirstGroupOrThrow(params?: FindFirstGroupParams) {
  const group = await prisma.group.findFirstOrThrow(params)
  return group
}

// ============================================
// Create Operations
// ============================================

/**
 * Create a single group record
 */
export async function createGroup(params: CreateGroupParams) {
  const group = await prisma.group.create(params)
  return group
}

/**
 * Create multiple group records
 */
export async function createManyGroup(params: CreateManyGroupParams) {
  const result = await prisma.group.createMany(params)
  return result
}

// ============================================
// Update Operations
// ============================================

/**
 * Update a single group record
 */
export async function updateGroup(params: UpdateGroupParams) {
  const group = await prisma.group.update(params)
  return group
}

/**
 * Update multiple group records
 */
export async function updateManyGroup(params: UpdateManyGroupParams) {
  const result = await prisma.group.updateMany(params)
  return result
}

/**
 * Update an group record or create it if it doesn't exist
 */
export async function upsertGroup(params: UpsertGroupParams) {
  const group = await prisma.group.upsert(params)
  return group
}

// ============================================
// Delete Operations
// ============================================

/**
 * Delete a single group record
 */
export async function deleteGroup(params: DeleteGroupParams) {
  const group = await prisma.group.delete(params)
  return group
}

/**
 * Delete multiple group records
 */
export async function deleteManyGroup(params?: DeleteManyGroupParams) {
  const result = await prisma.group.deleteMany(params)
  return result
}

// ============================================
// Aggregation Operations
// ============================================

/**
 * Count group records
 */
export async function countGroup(params?: CountGroupParams) {
  const count = await prisma.group.count(params)
  return count
}

/**
 * Aggregate group records
 */
export async function aggregateGroup(params: AggregateGroupParams) {
  const result = await prisma.group.aggregate(params)
  return result
}

// ============================================
// Utility Functions
// ============================================

/**
 * Check if an group record exists
 */
export async function attendanceExists(params: FindUniqueGroupParams) {
  const count = await prisma.group.count({
    where: params.where,
  })
  return count > 0
}

/**
 * Get group record by ID
 */
export async function getGroupById(id: string) {
  const group = await prisma.group.findUnique({
    where: { id },
  })
  return group
}

/**
 * Delete group record by ID
 */
export async function deleteGroupById(id: string) {
  const group = await prisma.group.delete({
    where: { id },
  })
  return group
}