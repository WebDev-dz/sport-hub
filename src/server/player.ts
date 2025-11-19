import prisma from "@/lib/prisma"

// ============================================
// Type Definitions
// ============================================

export type FindManyPlayerParams = Parameters<typeof prisma.sports_member.findMany>[0]
export type FindUniquePlayerParams = Parameters<typeof prisma.sports_member.findUnique>[0]
export type FindFirstPlayerParams = Parameters<typeof prisma.sports_member.findFirst>[0]
export type CreatePlayerParams = Parameters<typeof prisma.sports_member.create>[0]
export type CreateManyPlayerParams = Parameters<typeof prisma.sports_member.createMany>[0]
export type UpdatePlayerParams = Parameters<typeof prisma.sports_member.update>[0]
export type UpdateManyPlayerParams = Parameters<typeof prisma.sports_member.updateMany>[0]
export type UpsertPlayerParams = Parameters<typeof prisma.sports_member.upsert>[0]
export type DeletePlayerParams = Parameters<typeof prisma.sports_member.delete>[0]
export type DeleteManyPlayerParams = Parameters<typeof prisma.sports_member.deleteMany>[0]
export type CountPlayerParams = Parameters<typeof prisma.sports_member.count>[0]
export type AggregatePlayerParams = Parameters<typeof prisma.sports_member.aggregate>[0]

// ============================================
// Find Operations
// ============================================

/**
 * Find multiple sports_member records
 */
export async function findManyPlayer(params?: FindManyPlayerParams) {
  const sports_members = await prisma.sports_member.findMany(params)
  return sports_members
}

/**
 * Find a unique sports_member record
 */
export async function findUniquePlayer(params: FindUniquePlayerParams) {
  const sports_member = await prisma.sports_member.findUnique(params)
  return sports_member
}

/**
 * Find first sports_member record matching criteria
 */
export async function findFirstPlayer(params?: FindFirstPlayerParams) {
  const sports_member = await prisma.sports_member.findFirst(params)
  return sports_member
}

/**
 * Find a unique sports_member record or throw error if not found
 */
export async function findUniquePlayerOrThrow(params: FindUniquePlayerParams) {
  const sports_member = await prisma.sports_member.findUniqueOrThrow(params)
  return sports_member
}

/**
 * Find first sports_member record or throw error if not found
 */
export async function findFirstPlayerOrThrow(params?: FindFirstPlayerParams) {
  const sports_member = await prisma.sports_member.findFirstOrThrow(params)
  return sports_member
}

// ============================================
// Create Operations
// ============================================

/**
 * Create a single sports_member record
 */
export async function createPlayer(params: CreatePlayerParams) {
  const sports_member = await prisma.sports_member.create(params)
  return sports_member
}

/**
 * Create multiple sports_member records
 */
export async function createManyPlayer(params: CreateManyPlayerParams) {
  const result = await prisma.sports_member.createMany(params)
  return result
}

// ============================================
// Update Operations
// ============================================

/**
 * Update a single sports_member record
 */
export async function updatePlayer(params: UpdatePlayerParams) {
  const sports_member = await prisma.sports_member.update(params)
  return sports_member
}

/**
 * Update multiple sports_member records
 */
export async function updateManyPlayer(params: UpdateManyPlayerParams) {
  const result = await prisma.sports_member.updateMany(params)
  return result
}

/**
 * Update an sports_member record or create it if it doesn't exist
 */
export async function upsertPlayer(params: UpsertPlayerParams) {
  const sports_member = await prisma.sports_member.upsert(params)
  return sports_member
}

// ============================================
// Delete Operations
// ============================================

/**
 * Delete a single sports_member record
 */
export async function deletePlayer(params: DeletePlayerParams) {
  const sports_member = await prisma.sports_member.delete(params)
  return sports_member
}

/**
 * Delete multiple sports_member records
 */
export async function deleteManyPlayer(params?: DeleteManyPlayerParams) {
  const result = await prisma.sports_member.deleteMany(params)
  return result
}

// ============================================
// Aggregation Operations
// ============================================

/**
 * Count sports_member records
 */
export async function countPlayer(params?: CountPlayerParams) {
  const count = await prisma.sports_member.count(params)
  return count
}

/**
 * Aggregate sports_member records
 */
export async function aggregatePlayer(params: AggregatePlayerParams) {
  const result = await prisma.sports_member.aggregate(params)
  return result
}

// ============================================
// Utility Functions
// ============================================

/**
 * Check if an sports_member record exists
 */
export async function sports_memberExists(params: FindUniquePlayerParams) {
  const count = await prisma.sports_member.count({
    where: params.where,
  })
  return count > 0
}

/**
 * Get sports_member record by ID
 */
export async function getPlayerById(id: string) {
  const sports_member = await prisma.sports_member.findUnique({
    where: { id },
  })
  return sports_member
}

/**
 * Delete sports_member record by ID
 */
export async function deletePlayerById(id: string) {
  const sports_member = await prisma.sports_member.delete({
    where: { id },
  })
  return sports_member
}