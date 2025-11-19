import prisma from "@/lib/prisma"

// ============================================
// Type Definitions
// ============================================


export type FindManyAttendanceParams = Parameters<typeof prisma.attendance.findMany>[0]
export type FindUniqueAttendanceParams = Parameters<typeof prisma.attendance.findUnique>[0]
export type FindFirstAttendanceParams = Parameters<typeof prisma.attendance.findFirst>[0]
export type CreateAttendanceParams = Parameters<typeof prisma.attendance.create>[0]
export type CreateManyAttendanceParams = Parameters<typeof prisma.attendance.createMany>[0]
export type UpdateAttendanceParams = Parameters<typeof prisma.attendance.update>[0]
export type UpdateManyAttendanceParams = Parameters<typeof prisma.attendance.updateMany>[0]
export type UpsertAttendanceParams = Parameters<typeof prisma.attendance.upsert>[0]
export type DeleteAttendanceParams = Parameters<typeof prisma.attendance.delete>[0]
export type DeleteManyAttendanceParams = Parameters<typeof prisma.attendance.deleteMany>[0]
export type CountAttendanceParams = Parameters<typeof prisma.attendance.count>[0]
export type AggregateAttendanceParams = Parameters<typeof prisma.attendance.aggregate>[0]

// ============================================
// Find Operations
// ============================================

/**
 * Find multiple attendance records
 */
export async function findManyAttendance(params?: FindManyAttendanceParams) {
  const attendances = await prisma.attendance.findMany(params)
  return attendances
}

/**
 * Find a unique attendance record
 */
export async function findUniqueAttendance(params: FindUniqueAttendanceParams) {
  const attendance = await prisma.attendance.findUnique(params)
  return attendance
}

/**
 * Find first attendance record matching criteria
 */
export async function findFirstAttendance(params?: FindFirstAttendanceParams) {
  const attendance = await prisma.attendance.findFirst(params)
  return attendance
}

/**
 * Find a unique attendance record or throw error if not found
 */
export async function findUniqueAttendanceOrThrow(params: FindUniqueAttendanceParams) {
  const attendance = await prisma.attendance.findUniqueOrThrow(params)
  return attendance
}

/**
 * Find first attendance record or throw error if not found
 */
export async function findFirstAttendanceOrThrow(params?: FindFirstAttendanceParams) {
  const attendance = await prisma.attendance.findFirstOrThrow(params)
  return attendance
}

// ============================================
// Create Operations
// ============================================

/**
 * Create a single attendance record
 */
export async function createAttendance(params: CreateAttendanceParams) {
  const attendance = await prisma.attendance.create(params)
  return attendance
}

/**
 * Create multiple attendance records
 */
export async function createManyAttendance(params: CreateManyAttendanceParams) {
  const result = await prisma.attendance.createMany(params)
  return result
}

// ============================================
// Update Operations
// ============================================

/**
 * Update a single attendance record
 */
export async function updateAttendance(params: UpdateAttendanceParams) {
  const attendance = await prisma.attendance.update(params)
  return attendance
}

/**
 * Update multiple attendance records
 */
export async function updateManyAttendance(params: UpdateManyAttendanceParams) {
  const result = await prisma.attendance.updateMany(params)
  return result
}

/**
 * Update an attendance record or create it if it doesn't exist
 */
export async function upsertAttendance(params: UpsertAttendanceParams) {
  const attendance = await prisma.attendance.upsert(params)
  return attendance
}

// ============================================
// Delete Operations
// ============================================

/**
 * Delete a single attendance record
 */
export async function deleteAttendance(params: DeleteAttendanceParams) {
  const attendance = await prisma.attendance.delete(params)
  return attendance
}

/**
 * Delete multiple attendance records
 */
export async function deleteManyAttendance(params?: DeleteManyAttendanceParams) {
  const result = await prisma.attendance.deleteMany(params)
  return result
}

// ============================================
// Aggregation Operations
// ============================================

/**
 * Count attendance records
 */
export async function countAttendance(params?: CountAttendanceParams) {
  const count = await prisma.attendance.count(params)
  return count
}

/**
 * Aggregate attendance records
 */
export async function aggregateAttendance(params: AggregateAttendanceParams) {
  const result = await prisma.attendance.aggregate(params)
  return result
}

// ============================================
// Utility Functions
// ============================================

/**
 * Check if an attendance record exists
 */
export async function attendanceExists(params: FindUniqueAttendanceParams) {
  const count = await prisma.attendance.count({
    where: params.where,
  })
  return count > 0
}

/**
 * Get attendance record by ID
 */
export async function getAttendanceById(id: string) {
  const attendance = await prisma.attendance.findUnique({
    where: { id },
  })
  return attendance
}

/**
 * Delete attendance record by ID
 */
export async function deleteAttendanceById(id: string) {
  const attendance = await prisma.attendance.delete({
    where: { id },
  })
  return attendance
}