// @/app/_actions/trainingSession.ts
"use server"

import { revalidatePath } from "next/cache"
import {
  createTrainingSession,
  updateTrainingSession,
  deleteTrainingSession,
  findUniqueTrainingSession,
  findManyTrainingSession,
  findFirstTrainingSession,
  countTrainingSession,
  deleteManyTrainingSession,
} from "@/server/training-session"
import type {
  CreateTrainingSessionParams,
  UpdateTrainingSessionParams,
  DeleteTrainingSessionParams,
  FindUniqueTrainingSessionParams,
  FindManyTrainingSessionParams,
  CountTrainingSessionParams,
  DeleteManyTrainingSessionParams,
  FindFirstTrainingSessionParams,
} from "@/server/training-session"
import prisma from "@/lib/prisma"
import { TrainingSession } from "@/types"

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
 * Create a new training session
 */
export async function createTrainingSessionAction(
  params: CreateTrainingSessionParams
): Promise<ActionResponse<TrainingSession>> {
  try {
    const trainingSession = await createTrainingSession(params)
    revalidatePath("/training-sessions")
    revalidatePath("/dashboard")
    return { success: true, data: trainingSession }
  } catch (error) {
    console.error("Failed to create training session:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create training session",
    }
  }
}

// ============================================
// Read Actions
// ============================================

/**
 * Get a training session by unique identifier
 */
export async function getTrainingSessionAction(
  params: FindUniqueTrainingSessionParams
): Promise<ActionResponse> {
  try {
    const trainingSession = await findUniqueTrainingSession(params)
    if (!trainingSession) {
      return { success: false, error: "Training session not found" }
    }
    return { success: true, data: trainingSession }
  } catch (error) {
    console.error("Failed to get training session:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get training session",
    }
  }
}

/**
 * Get a training session by ID
 */
export async function getTrainingSessionByIdAction(id: string): Promise<ActionResponse> {
  try {
    const trainingSession = await findUniqueTrainingSession({
      where: { id },
    })
    if (!trainingSession) {
      return { success: false, error: "Training session not found" }
    }
    return { success: true, data: trainingSession }
  } catch (error) {
    console.error("Failed to get training session:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get training session",
    }
  }
}

/**
 * Get all training sessions with optional filtering
 */
export async function getTrainingSessionsAction(
  params?: FindManyTrainingSessionParams
): Promise<ActionResponse> {
  try {
    const trainingSessions = await findManyTrainingSession(params)
    return { success: true, data: trainingSessions }
  } catch (error) {
    console.error("Failed to get training sessions:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get training sessions",
    }
  }
}

/**
 * Get first training session matching criteria
 */
export async function getFirstTrainingSessionAction(
  params?: FindFirstTrainingSessionParams
): Promise<ActionResponse> {
  try {
    const trainingSession = await findFirstTrainingSession(params)
    if (!trainingSession) {
      return { success: false, error: "No training session found matching criteria" }
    }
    return { success: true, data: trainingSession }
  } catch (error) {
    console.error("Failed to get training session:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get training session",
    }
  }
}

/**
 * Count training sessions with optional filtering
 */
export async function countTrainingSessionsAction(
  params?: CountTrainingSessionParams
): Promise<ActionResponse<number>> {
  try {
    const count = await countTrainingSession(params)
    return { success: true, data: count }
  } catch (error) {
    console.error("Failed to count training sessions:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to count training sessions",
    }
  }
}

// ============================================
// Update Actions
// ============================================

/**
 * Update a training session
 */
export async function updateTrainingSessionAction(
  params: UpdateTrainingSessionParams
): Promise<ActionResponse> {
  try {
    const trainingSession = await updateTrainingSession(params)
    revalidatePath("/training-sessions")
    revalidatePath("/dashboard")
    revalidatePath(`/training-sessions/${trainingSession.id}`)
    return { success: true, data: trainingSession }
  } catch (error) {
    console.error("Failed to update training session:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update training session",
    }
  }
}

/**
 * Update a training session by ID
 */
export async function updateTrainingSessionByIdAction(
  id: string,
  data: UpdateTrainingSessionParams["data"]
): Promise<ActionResponse> {
  try {
    const trainingSession = await updateTrainingSession({
      where: { id },
      data,
    })
    revalidatePath("/training-sessions")
    revalidatePath("/dashboard")
    revalidatePath(`/training-sessions/${id}`)
    return { success: true, data: trainingSession }
  } catch (error) {
    console.error("Failed to update training session:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update training session",
    }
  }
}

// ============================================
// Delete Actions
// ============================================

/**
 * Delete a training session
 */
export async function deleteTrainingSessionAction(
  params: DeleteTrainingSessionParams
): Promise<ActionResponse> {
  try {
    const trainingSession = await deleteTrainingSession(params)
    revalidatePath("/training-sessions")
    revalidatePath("/dashboard")
    return { success: true, data: trainingSession }
  } catch (error) {
    console.error("Failed to delete training session:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete training session",
    }
  }
}

/**
 * Delete a training session by ID
 */
export async function deleteTrainingSessionByIdAction(id: string): Promise<ActionResponse> {
  try {
    const trainingSession = await deleteTrainingSession({
      where: { id },
    })
    revalidatePath("/training-sessions")
    revalidatePath("/dashboard")
    return { success: true, data: trainingSession }
  } catch (error) {
    console.error("Failed to delete training session:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete training session",
    }
  }
}

// ============================================
// Bulk Actions
// ============================================

/**
 * Delete multiple training sessions
 */
export async function deleteManyTrainingSessionsAction(
  params?: DeleteManyTrainingSessionParams
): Promise<ActionResponse<{ count: number }>> {
  try {
    const result = await deleteManyTrainingSession(params)
    revalidatePath("/training-sessions")
    revalidatePath("/dashboard")
    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to delete training sessions:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete training sessions",
    }
  }
}

// ============================================
// Advanced Actions
// ============================================

/**
 * Search training sessions by description or location
 */
export async function searchTrainingSessionsAction(
  searchTerm: string
): Promise<ActionResponse> {
  try {
    const trainingSessions = await findManyTrainingSession({
      where: {
        OR: [
          { description: { contains: searchTerm } },
          { location: { contains: searchTerm } },
        ],
      },
      orderBy: { date: "asc" },
    })
    return { success: true, data: trainingSessions }
  } catch (error) {
    console.error("Failed to search training sessions:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to search training sessions",
    }
  }
}

/**
 * Get training sessions by group (team)
 */
export async function getTrainingSessionsByGroupAction(
  groupId: string
): Promise<ActionResponse> {
  try {
    const trainingSessions = await findManyTrainingSession({
      where: { 
        sessionGroups: { 
          some: { 
            groupId 
          } 
        } 
      },
      orderBy: { date: "asc" },
    })
    return { success: true, data: trainingSessions }
  } catch (error) {
    console.error("Failed to get training sessions by group:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get training sessions",
    }
  }
}

/**
 * Get upcoming training sessions
 */
export async function getUpcomingTrainingSessionsAction(): Promise<ActionResponse> {
  try {
    const trainingSessions = await findManyTrainingSession({
      where: {
        date: {
          gte: new Date(),
        },
      },
      orderBy: { date: "asc" },
    })
    return { success: true, data: trainingSessions }
  } catch (error) {
    console.error("Failed to get upcoming training sessions:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get training sessions",
    }
  }
}

/**
 * Get training sessions with attendance summary
 */
export async function getTrainingSessionsWithAttendanceAction(): Promise<ActionResponse> {
  try {
    const trainingSessions = await prisma.training_session.findMany({
      include: {
        attendances: {
          include: {
            member: true
          }
        },
        sessionGroups: {
          include: {
            group: true
          }
        }
      },
      orderBy: { date: "asc" },
    })
    return { success: true, data: trainingSessions }
  } catch (error) {
    console.error("Failed to get training sessions with attendance:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get training sessions with attendance",
    }
  }
}