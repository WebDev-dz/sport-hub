// @/app/_actions/attendance.ts
"use server"

import { revalidatePath } from "next/cache"

import type {
  CreateAttendanceParams,
  UpdateAttendanceParams,
  DeleteAttendanceParams,
  FindUniqueAttendanceParams,
  FindManyAttendanceParams,
  CountAttendanceParams,
  DeleteManyAttendanceParams,
} from "@/server/attendance"
import prisma from "@/lib/prisma"
import { FindFirstAttendanceParams } from "@/server/attendance"
import { CreateManyAttendanceParams } from "@/server/attendance"
import { createManyAttendance } from "@/server/attendance"
import { createAttendance, findUniqueAttendance, findManyAttendance, findFirstAttendance, countAttendance, updateAttendance, deleteAttendance, deleteManyAttendance } from "@/server/attendance"
import { Attendance } from "@/types"

// ============================================
// Action Response Types
// ============================================

export type ActionResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

// ============================================
// Create Actions
// ============================================

/**
 * Create a new attendance record
 */
export async function createAttendanceAction(
  params: CreateAttendanceParams
): Promise<ActionResponse<Attendance>> {
  try {
    const attendance = await createAttendance(params)
    revalidatePath("/attendances")
    revalidatePath("/training-sessions")
    revalidatePath("/members")
    revalidatePath("/dashboard")
    return { success: true, data: attendance }
  } catch (error) {
    console.error("Failed to create attendance:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create attendance",
    }
  }
}

/**
 * Create multiple attendance records
 */
export async function createManyAttendancesAction(
  params: CreateManyAttendanceParams
): Promise<ActionResponse> {
  try {
    const result = await createManyAttendance(params)
    revalidatePath("/attendances")
    revalidatePath("/training-sessions")
    revalidatePath("/members")
    revalidatePath("/dashboard")
    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to create attendances:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create attendances",
    }
  }
}

// ============================================
// Read Actions
// ============================================

/**
 * Get an attendance by unique identifier
 */
export async function getAttendanceAction(
  params: FindUniqueAttendanceParams
): Promise<ActionResponse> {
  try {
    const attendance = await findUniqueAttendance(params)
    if (!attendance) {
      return { success: false, error: "Attendance not found" }
    }
    return { success: true, data: attendance }
  } catch (error) {
    console.error("Failed to get attendance:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get attendance",
    }
  }
}

/**
 * Get an attendance by ID
 */
export async function getAttendanceByIdAction(id: string): Promise<ActionResponse> {
  try {
    const attendance = await findUniqueAttendance({
      where: { id },
    })
    if (!attendance) {
      return { success: false, error: "Attendance not found" }
    }
    return { success: true, data: attendance }
  } catch (error) {
    console.error("Failed to get attendance:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get attendance",
    }
  }
}

/**
 * Get all attendances with optional filtering
 */
export async function getAttendancesAction(
  params?: FindManyAttendanceParams
): Promise<ActionResponse> {
  try {
    const attendances = await findManyAttendance(params)
    return { success: true, data: attendances }
  } catch (error) {
    console.error("Failed to get attendances:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get attendances",
    }
  }
}

/**
 * Get first attendance matching criteria
 */
export async function getFirstAttendanceAction(
  params?: FindFirstAttendanceParams
): Promise<ActionResponse> {
  try {
    const attendance = await findFirstAttendance(params)
    if (!attendance) {
      return { success: false, error: "No attendance found matching criteria" }
    }
    return { success: true, data: attendance }
  } catch (error) {
    console.error("Failed to get attendance:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get attendance",
    }
  }
}

/**
 * Count attendances with optional filtering
 */
export async function countAttendancesAction(
  params?: CountAttendanceParams
): Promise<ActionResponse<number>> {
  try {
    const count = await countAttendance(params)
    return { success: true, data: count }
  } catch (error) {
    console.error("Failed to count attendances:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to count attendances",
    }
  }
}

// ============================================
// Update Actions
// ============================================

/**
 * Update an attendance record
 */
export async function updateAttendanceAction(
  params: UpdateAttendanceParams
): Promise<ActionResponse> {
  try {
    const attendance = await updateAttendance(params)
    revalidatePath("/attendances")
    revalidatePath("/training-sessions")
    revalidatePath("/members")
    revalidatePath("/dashboard")
    return { success: true, data: attendance }
  } catch (error) {
    console.error("Failed to update attendance:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update attendance",
    }
  }
}

/**
 * Update an attendance by ID
 */
export async function updateAttendanceByIdAction(
  id: string,
  data: UpdateAttendanceParams["data"]
): Promise<ActionResponse> {
  try {
    const attendance = await updateAttendance({
      where: { id },
      data,
    })
    revalidatePath("/attendances")
    revalidatePath("/training-sessions")
    revalidatePath("/members")
    revalidatePath("/dashboard")
    return { success: true, data: attendance }
  } catch (error) {
    console.error("Failed to update attendance:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update attendance",
    }
  }
}

// ============================================
// Delete Actions
// ============================================

/**
 * Delete an attendance record
 */
export async function deleteAttendanceAction(
  params: DeleteAttendanceParams
): Promise<ActionResponse> {
  try {
    const attendance = await deleteAttendance(params)
    revalidatePath("/attendances")
    revalidatePath("/training-sessions")
    revalidatePath("/members")
    revalidatePath("/dashboard")
    return { success: true, data: attendance }
  } catch (error) {
    console.error("Failed to delete attendance:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete attendance",
    }
  }
}

/**
 * Delete an attendance by ID
 */
export async function deleteAttendanceByIdAction(id: string): Promise<ActionResponse> {
  try {
    const attendance = await deleteAttendance({
      where: { id },
    })
    revalidatePath("/attendances")
    revalidatePath("/training-sessions")
    revalidatePath("/members")
    revalidatePath("/dashboard")
    return { success: true, data: attendance }
  } catch (error) {
    console.error("Failed to delete attendance:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete attendance",
    }
  }
}

// ============================================
// Bulk Actions
// ============================================

/**
 * Delete multiple attendances
 */
export async function deleteManyAttendancesAction(
  params?: DeleteManyAttendanceParams
): Promise<ActionResponse<{ count: number }>> {
  try {
    const result = await deleteManyAttendance(params)
    revalidatePath("/attendances")
    revalidatePath("/training-sessions")
    revalidatePath("/members")
    revalidatePath("/dashboard")
    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to delete attendances:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete attendances",
    }
  }
}

// ============================================
// Advanced Actions
// ============================================

/**
 * Get attendances for a specific training session
 */
export async function getAttendancesBySessionAction(
  sessionId: string
): Promise<ActionResponse> {
  try {
    const attendances = await findManyAttendance({
      where: { sessionId },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: attendances }
  } catch (error) {
    console.error("Failed to get attendances by session:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get attendances by session",
    }
  }
}

/**
 * Get attendances for a specific member
 */
export async function getAttendancesByMemberAction(
  memberId: string
): Promise<ActionResponse> {
  try {
    const attendances = await findManyAttendance({
      where: { memberId },
      include: {
        session: {
          select: {
            id: true,
            date: true,
            startTime: true,
            endTime: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: attendances }
  } catch (error) {
    console.error("Failed to get attendances by member:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get attendances by member",
    }
  }
}

/**
 * Mark attendance for a session-member pair (create or update)
 */
export async function markAttendanceAction(
  sessionId: string,
  memberId: string,
  status: string,
  notes?: string
): Promise<ActionResponse> {
  try {
    const existingAttendance = await findUniqueAttendance({
      // @ts-ignore
      where: { sessionId: sessionId, memberId: memberId },
    })

    let attendance
    if (existingAttendance) {
      attendance = await updateAttendance({
        where: { id: existingAttendance.id },
        data: { status, notes },
      })
    } else {
      attendance = await createAttendance({
        data: { sessionId, memberId, status, notes },
      })
    }

    revalidatePath("/attendances")
    revalidatePath("/training-sessions")
    revalidatePath("/members")
    revalidatePath("/dashboard")
    
    return { success: true, data: attendance }
  } catch (error) {
    console.error("Failed to mark attendance:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to mark attendance",
    }
  }
}

/**
 * Bulk mark attendance for a session (all members in a group)
 */
// export async function bulkMarkAttendanceForSessionAction(
//   sessionId: string,
//   groupId: string,
//   status: string,
//   notes?: string
// ): Promise<ActionResponse<{ count: number }>> {
//   try {
//     // Get members in the group
//     const groupMembers = await prisma.group_member.findMany({
//       where: { groupId },
//       select: { memberId: true },
//     })

//     const memberIds = groupMembers.map(gm => gm.memberId)
//     const data = memberIds.map(memberId => ({
//       sessionId,
//       memberId,
//       status,
//       notes,
//     }))

//     // Upsert to avoid duplicates
//     const promises = data.map(att => 
//       prisma.attendance.upsert({
//         where: { sessionId_memberId: { sessionId, memberId: att.memberId } },
//         update: { status: att.status, notes: att.notes },
//         create: att,
//       })
//     )

//     await Promise.all(promises)

//     revalidatePath("/attendances")
//     revalidatePath("/training-sessions")
//     revalidatePath("/members")
//     revalidatePath("/dashboard")
    
//     return { success: true, data: { count: data.length } }
//   } catch (error) {
//     console.error("Failed to bulk mark attendance:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to bulk mark attendance",
//     }
//   }
// }

/**
 * Get attendance summary for a session (counts by status)
 */
export async function getAttendanceSummaryBySessionAction(
  sessionId: string
): Promise<ActionResponse> {
  try {
    const summary = await prisma.attendance.groupBy({
      by: ['status'],
      where: { sessionId },
      _count: { status: true },
    })
    return { success: true, data: summary }
  } catch (error) {
    console.error("Failed to get attendance summary:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get attendance summary",
    }
  }
}

/**
 * Get overall attendance rate for a member (percentage)
 */
export async function getMemberAttendanceRateAction(
  memberId: string
): Promise<ActionResponse<number>> {
  try {
    const totalSessions = await prisma.training_session.count({
      where: {
        sessionGroups: {
          some: {
            group: {
              groupMembers: {
                some: { memberId },
              },
            },
          },
        },
      },
    })

    const attendedSessions = await prisma.attendance.count({
      where: {
        memberId,
        status: 'present', // Assuming 'present' is the positive status
      },
    })

    const rate = totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0
    return { success: true, data: rate }
  } catch (error) {
    console.error("Failed to get member attendance rate:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get member attendance rate",
    }
  }
}