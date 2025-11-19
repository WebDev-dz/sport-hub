// @/app/_actions/group.ts
"use server"

import { revalidatePath } from "next/cache"
import {
  createGroup,
  updateGroup,
  deleteGroup,
  findUniqueGroup,
  findManyGroup,
  findFirstGroup,
  countGroup,
  deleteManyGroup,
  createManyGroup,
} from "@/server/group"
import type {
  CreateGroupParams,
  UpdateGroupParams,
  DeleteGroupParams,
  FindUniqueGroupParams,
  FindManyGroupParams,
  CountGroupParams,
  DeleteManyGroupParams,
  CreateManyGroupParams,
  FindFirstGroupParams,
} from "@/server/group"
import prisma from "@/lib/prisma"
import { Group } from "@/types"

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
 * Create a new group (team)
 */
export async function createGroupAction(
  params: CreateGroupParams
): Promise<ActionResponse<Group>> {
  try {
    const group = await createGroup(params)
    revalidatePath("/groups")
    revalidatePath("/dashboard")
    revalidatePath("/members")
    return { success: true, data: group }
  } catch (error) {
    console.error("Failed to create group:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create group",
    }
  }
}

/**
 * Create multiple groups
 */
export async function createManyGroupsAction(
  params: CreateManyGroupParams
): Promise<ActionResponse> {
  try {
    const result = await createManyGroup(params)
    revalidatePath("/groups")
    revalidatePath("/dashboard")
    revalidatePath("/members")
    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to create groups:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create groups",
    }
  }
}

// ============================================
// Read Actions
// ============================================

/**
 * Get a group by unique identifier
 */
export async function getGroupAction(
  params: FindUniqueGroupParams
): Promise<ActionResponse> {
  try {
    const group = await findUniqueGroup(params)
    if (!group) {
      return { success: false, error: "Group not found" }
    }
    return { success: true, data: group }
  } catch (error) {
    console.error("Failed to get group:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get group",
    }
  }
}

/**
 * Get a group by ID
 */
export async function getGroupByIdAction(id: string): Promise<ActionResponse> {
  try {
    const group = await findUniqueGroup({
      where: { id },
    })
    if (!group) {
      return { success: false, error: "Group not found" }
    }
    return { success: true, data: group }
  } catch (error) {
    console.error("Failed to get group:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get group",
    }
  }
}

/**
 * Get all groups with optional filtering
 */
export async function getGroupsAction(
  params?: FindManyGroupParams
): Promise<ActionResponse> {
  try {
    const groups = await findManyGroup(params)
    return { success: true, data: groups }
  } catch (error) {
    console.error("Failed to get groups:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get groups",
    }
  }
}

/**
 * Get first group matching criteria
 */
export async function getFirstGroupAction(
  params?: FindFirstGroupParams
): Promise<ActionResponse> {
  try {
    const group = await findFirstGroup(params)
    if (!group) {
      return { success: false, error: "No group found matching criteria" }
    }
    return { success: true, data: group }
  } catch (error) {
    console.error("Failed to get group:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get group",
    }
  }
}

/**
 * Count groups with optional filtering
 */
export async function countGroupsAction(
  params?: CountGroupParams
): Promise<ActionResponse<number>> {
  try {
    const count = await countGroup(params)
    return { success: true, data: count }
  } catch (error) {
    console.error("Failed to count groups:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to count groups",
    }
  }
}

// ============================================
// Update Actions
// ============================================

/**
 * Update a group
 */
export async function updateGroupAction(
  params: UpdateGroupParams
): Promise<ActionResponse> {
  try {
    const group = await updateGroup(params)
    revalidatePath("/groups")
    revalidatePath("/dashboard")
    revalidatePath("/members")
    revalidatePath(`/groups/${group.id}`)
    return { success: true, data: group }
  } catch (error) {
    console.error("Failed to update group:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update group",
    }
  }
}

/**
 * Update a group by ID
 */
export async function updateGroupByIdAction(
  id: string,
  data: UpdateGroupParams["data"]
): Promise<ActionResponse> {
  try {
    const group = await updateGroup({
      where: { id },
      data,
    })
    revalidatePath("/groups")
    revalidatePath("/dashboard")
    revalidatePath("/members")
    revalidatePath(`/groups/${id}`)
    return { success: true, data: group }
  } catch (error) {
    console.error("Failed to update group:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update group",
    }
  }
}

// ============================================
// Delete Actions
// ============================================

/**
 * Delete a group
 */
export async function deleteGroupAction(
  params: DeleteGroupParams
): Promise<ActionResponse> {
  try {
    const group = await deleteGroup(params)
    revalidatePath("/groups")
    revalidatePath("/dashboard")
    revalidatePath("/members")
    revalidatePath("/training-sessions")
    return { success: true, data: group }
  } catch (error) {
    console.error("Failed to delete group:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete group",
    }
  }
}

/**
 * Delete a group by ID
 */
export async function deleteGroupByIdAction(id: string): Promise<ActionResponse> {
  try {
    const group = await deleteGroup({
      where: { id },
    })
    revalidatePath("/groups")
    revalidatePath("/dashboard")
    revalidatePath("/members")
    revalidatePath("/training-sessions")
    return { success: true, data: group }
  } catch (error) {
    console.error("Failed to delete group:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete group",
    }
  }
}

// ============================================
// Bulk Actions
// ============================================

/**
 * Delete multiple groups
 */
export async function deleteManyGroupsAction(
  params?: DeleteManyGroupParams
): Promise<ActionResponse<{ count: number }>> {
  try {
    const result = await deleteManyGroup(params)
    revalidatePath("/groups")
    revalidatePath("/dashboard")
    revalidatePath("/members")
    revalidatePath("/training-sessions")
    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to delete groups:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete groups",
    }
  }
}

// ============================================
// Advanced Actions
// ============================================

/**
 * Search groups by name or category
 */
export async function searchGroupsAction(
  searchTerm: string
): Promise<ActionResponse> {
  try {
    const groups = await findManyGroup({
      where: {
        OR: [
          { name: { contains: searchTerm } },
          { category: { contains: searchTerm } },
        ],
      },
      orderBy: { name: "asc" },
    })
    return { success: true, data: groups }
  } catch (error) {
    console.error("Failed to search groups:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to search groups",
    }
  }
}

/**
 * Get groups by coach
 */
export async function getGroupsByCoachAction(
  coachId: string
): Promise<ActionResponse> {
  try {
    const groups = await findManyGroup({
      where: { coachId },
      orderBy: { name: "asc" },
    })
    return { success: true, data: groups }
  } catch (error) {
    console.error("Failed to get groups by coach:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get groups by coach",
    }
  }
}

/**
 * Get groups by organization
 */
export async function getGroupsByOrganizationAction(
  organizationId: string
): Promise<ActionResponse> {
  try {
    const groups = await findManyGroup({
      where: { organizationId },
      orderBy: { name: "asc" },
    })
    return { success: true, data: groups }
  } catch (error) {
    console.error("Failed to get groups by organization:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get groups by organization",
    }
  }
}

/**
 * Get group with members and sessions
 */
export async function getGroupWithDetailsAction(
  groupId: string
): Promise<ActionResponse> {
  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        coach: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        groupMembers: {
          include: {
            member: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                category: true,
                isActive: true,
              },
            },
          },
        },
        sessionGroups: {
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
        },
      },
    })
    if (!group) {
      return { success: false, error: "Group not found" }
    }
    return { success: true, data: group }
  } catch (error) {
    console.error("Failed to get group with details:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get group with details",
    }
  }
}

/**
 * Get active groups (with current members)
 */
export async function getActiveGroupsAction(): Promise<ActionResponse> {
  try {
    const groups = await findManyGroup({
      where: {
        groupMembers: {
          some: {
            endDate: null,
          },
        },
      },
      orderBy: { name: "asc" },
    })
    return { success: true, data: groups }
  } catch (error) {
    console.error("Failed to get active groups:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get active groups",
    }
  }
}

/**
 * Get upcoming sessions for a group
 */
export async function getUpcomingSessionsForGroupAction(
  groupId: string
): Promise<ActionResponse> {
  try {
    const sessions = await prisma.training_session.findMany({
      where: {
        sessionGroups: {
          some: { groupId },
        },
        date: {
          gte: new Date(),
        },
      },
      orderBy: { date: "asc" },
    })
    return { success: true, data: sessions }
  } catch (error) {
    console.error("Failed to get upcoming sessions for group:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get upcoming sessions for group",
    }
  }
}