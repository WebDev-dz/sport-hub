import prisma from "@/lib/prisma"

// ============================================
// Type Definitions
// ============================================

export type FindManyTrainingSessionParams = Parameters<typeof prisma.training_session.findMany>[0]
export type FindUniqueTrainingSessionParams = Parameters<typeof prisma.training_session.findUnique>[0]
export type FindFirstTrainingSessionParams = Parameters<typeof prisma.training_session.findFirst>[0]
export type CreateTrainingSessionParams = Parameters<typeof prisma.training_session.create>[0]
export type CreateManyTrainingSessionParams = Parameters<typeof prisma.training_session.createMany>[0]
export type UpdateTrainingSessionParams = Parameters<typeof prisma.training_session.update>[0]
export type UpdateManyTrainingSessionParams = Parameters<typeof prisma.training_session.updateMany>[0]
export type UpsertTrainingSessionParams = Parameters<typeof prisma.training_session.upsert>[0]
export type DeleteTrainingSessionParams = Parameters<typeof prisma.training_session.delete>[0]
export type DeleteManyTrainingSessionParams = Parameters<typeof prisma.training_session.deleteMany>[0]
export type CountTrainingSessionParams = Parameters<typeof prisma.training_session.count>[0]
export type AggregateTrainingSessionParams = Parameters<typeof prisma.training_session.aggregate>[0]

// ============================================
// Find Operations
// ============================================

/**
 * Find multiple training_session records
 */
export async function findManyTrainingSession(params?: FindManyTrainingSessionParams) {
  const attendances = await prisma.training_session.findMany(params)
  return attendances
}

/**
 * Find a unique training_session record
 */
export async function findUniqueTrainingSession(params: FindUniqueTrainingSessionParams) {
  const training_session = await prisma.training_session.findUnique(params)
  return training_session
}

/**
 * Find first training_session record matching criteria
 */
export async function findFirstTrainingSession(params?: FindFirstTrainingSessionParams) {
  const training_session = await prisma.training_session.findFirst(params)
  return training_session
}

/**
 * Find a unique training_session record or throw error if not found
 */
export async function findUniqueTrainingSessionOrThrow(params: FindUniqueTrainingSessionParams) {
  const training_session = await prisma.training_session.findUniqueOrThrow(params)
  return training_session
}

/**
 * Find first training_session record or throw error if not found
 */
export async function findFirstTrainingSessionOrThrow(params?: FindFirstTrainingSessionParams) {
  const training_session = await prisma.training_session.findFirstOrThrow(params)
  return training_session
}

// ============================================
// Create Operations
// ============================================

/**
 * Create a single training_session record
 */
export async function createTrainingSession(params: CreateTrainingSessionParams) {
  const training_session = await prisma.training_session.create(params)
  return training_session
}

/**
 * Create multiple training_session records
 */
export async function createManyTrainingSession(params: CreateManyTrainingSessionParams) {
  const result = await prisma.training_session.createMany(params)
  return result
}

// ============================================
// Update Operations
// ============================================

/**
 * Update a single training_session record
 */
export async function updateTrainingSession(params: UpdateTrainingSessionParams) {
  const training_session = await prisma.training_session.update(params)
  return training_session
}

/**
 * Update multiple training_session records
 */
export async function updateManyTrainingSession(params: UpdateManyTrainingSessionParams) {
  const result = await prisma.training_session.updateMany(params)
  return result
}

/**
 * Update an training_session record or create it if it doesn't exist
 */
export async function upsertTrainingSession(params: UpsertTrainingSessionParams) {
  const training_session = await prisma.training_session.upsert(params)
  return training_session
}

// ============================================
// Delete Operations
// ============================================

/**
 * Delete a single training_session record
 */
export async function deleteTrainingSession(params: DeleteTrainingSessionParams) {
  const training_session = await prisma.training_session.delete(params)
  return training_session
}

/**
 * Delete multiple training_session records
 */
export async function deleteManyTrainingSession(params?: DeleteManyTrainingSessionParams) {
  const result = await prisma.training_session.deleteMany(params)
  return result
}

// ============================================
// Aggregation Operations
// ============================================

/**
 * Count training_session records
 */
export async function countTrainingSession(params?: CountTrainingSessionParams) {
  const count = await prisma.training_session.count(params)
  return count
}

/**
 * Aggregate training_session records
 */
export async function aggregateTrainingSession(params: AggregateTrainingSessionParams) {
  const result = await prisma.training_session.aggregate(params)
  return result
}

// ============================================
// Utility Functions
// ============================================

/**
 * Check if an training_session record exists
 */
export async function attendanceExists(params: FindUniqueTrainingSessionParams) {
  const count = await prisma.training_session.count({
    where: params.where,
  })
  return count > 0
}

/**
 * Get training_session record by ID
 */
export async function getTrainingSessionById(id: string) {
  const training_session = await prisma.training_session.findUnique({
    where: { id },
  })
  return training_session
}

/**
 * Delete training_session record by ID
 */
export async function deleteTrainingSessionById(id: string) {
  const training_session = await prisma.training_session.delete({
    where: { id },
  })
  return training_session
}