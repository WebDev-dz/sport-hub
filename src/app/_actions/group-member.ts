// @/app/_actions/groupMember.ts
"use server"

import { revalidatePath } from "next/cache"
import {
  createGroupMember,
  updateGroupMember,
  deleteGroupMember,
  findUniqueGroupMember,
  findManyGroupMember,
  findFirstGroupMember,
  countGroupMember,
  deleteManyGroupMember,
  createManyGroupMember,
} from "@/server/group-member"
import type {
  CreateGroupMemberParams,
  UpdateGroupMemberParams,
  DeleteGroupMemberParams,
  FindUniqueGroupMemberParams,
  FindManyGroupMemberParams,
  CountGroupMemberParams,
  DeleteManyGroupMemberParams,
  CreateManyGroupMemberParams,
  FindFirstGroupMemberParams,
} from "@/server/group-member"

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
 * Create a new group member association
 */
export async function createGroupMemberAction(
  params: CreateGroupMemberParams
): Promise<ActionResponse> {
  try {
    const groupMember = await createGroupMember(params)
    revalidatePath("/groups")
    revalidatePath("/members")
    revalidatePath("/dashboard")
    return { success: true, data: groupMember }
  } catch (error) {
    console.error("Failed to create group member:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create group member",
    }
  }
}

/**
 * Create multiple group member associations
 */
export async function createManyGroupMembersAction(
  params: CreateManyGroupMemberParams
): Promise<ActionResponse> {
  try {
    const result = await createManyGroupMember(params)
    revalidatePath("/groups")
    revalidatePath("/members")
    revalidatePath("/dashboard")
    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to create group members:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create group members",
    }
  }
}

// ============================================
// Read Actions
// ============================================

/**
 * Get a group member by unique identifier (composite key)
 */
export async function getGroupMemberAction(
  params: FindUniqueGroupMemberParams
): Promise<ActionResponse> {
  try {
    const groupMember = await findUniqueGroupMember(params)
    if (!groupMember) {
      return { success: false, error: "Group member not found" }
    }
    return { success: true, data: groupMember }
  } catch (error) {
    console.error("Failed to get group member:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get group member",
    }
  }
}

/**
 * Get a group member by group ID and member ID
 */
export async function getGroupMemberByCompositeAction(
  groupId: string,
  memberId: string
): Promise<ActionResponse> {
  try {
    const groupMember = await findUniqueGroupMember({
      where: { groupId_memberId: { groupId, memberId } },
    })
    if (!groupMember) {
      return { success: false, error: "Group member not found" }
    }
    return { success: true, data: groupMember }
  } catch (error) {
    console.error("Failed to get group member:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get group member",
    }
  }
}

/**
 * Get all group members with optional filtering
 */
export async function getGroupMembersAction(
  params?: FindManyGroupMemberParams
): Promise<ActionResponse> {
  try {
    const groupMembers = await findManyGroupMember(params)
    return { success: true, data: groupMembers }
  } catch (error) {
    console.error("Failed to get group members:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get group members",
    }
  }
}

/**
 * Get first group member matching criteria
 */
export async function getFirstGroupMemberAction(
  params?: FindFirstGroupMemberParams
): Promise<ActionResponse> {
  try {
    const groupMember = await findFirstGroupMember(params)
    if (!groupMember) {
      return { success: false, error: "No group member found matching criteria" }
    }
    return { success: true, data: groupMember }
  } catch (error) {
    console.error("Failed to get group member:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get group member",
    }
  }
}

/**
 * Count group members with optional filtering
 */
export async function countGroupMembersAction(
  params?: CountGroupMemberParams
): Promise<ActionResponse<number>> {
  try {
    const count = await countGroupMember(params)
    return { success: true, data: count }
  } catch (error) {
    console.error("Failed to count group members:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to count group members",
    }
  }
}

// ============================================
// Update Actions
// ============================================

/**
 * Update a group member association
 */
export async function updateGroupMemberAction(
  params: UpdateGroupMemberParams
): Promise<ActionResponse> {
  try {
    const groupMember = await updateGroupMember(params)
    revalidatePath("/groups")
    revalidatePath("/members")
    revalidatePath("/dashboard")
    return { success: true, data: groupMember }
  } catch (error) {
    console.error("Failed to update group member:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update group member",
    }
  }
}

/**
 * Update a group member by group ID and member ID
 */
export async function updateGroupMemberByCompositeAction(
  groupId: string,
  memberId: string,
  data: UpdateGroupMemberParams["data"]
): Promise<ActionResponse> {
  try {
    const groupMember = await updateGroupMember({
      where: { groupId_memberId: { groupId, memberId } },
      data,
    })
    revalidatePath("/groups")
    revalidatePath("/members")
    revalidatePath("/dashboard")
    return { success: true, data: groupMember }
  } catch (error) {
    console.error("Failed to update group member:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update group member",
    }
  }
}

// ============================================
// Delete Actions
// ============================================

/**
 * Delete a group member association
 */
export async function deleteGroupMemberAction(
  params: DeleteGroupMemberParams
): Promise<ActionResponse> {
  try {
    const groupMember = await deleteGroupMember(params)
    revalidatePath("/groups")
    revalidatePath("/members")
    revalidatePath("/dashboard")
    return { success: true, data: groupMember }
  } catch (error) {
    console.error("Failed to delete group member:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete group member",
    }
  }
}

/**
 * Delete a group member by group ID and member ID
 */
export async function deleteGroupMemberByCompositeAction(
  groupId: string,
  memberId: string
): Promise<ActionResponse> {
  try {
    const groupMember = await deleteGroupMember({
      where: { groupId_memberId: { groupId, memberId } },
    })
    revalidatePath("/groups")
    revalidatePath("/members")
    revalidatePath("/dashboard")
    return { success: true, data: groupMember }
  } catch (error) {
    console.error("Failed to delete group member:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete group member",
    }
  }
}

// ============================================
// Bulk Actions
// ============================================

/**
 * Delete multiple group members
 */
export async function deleteManyGroupMembersAction(
  params?: DeleteManyGroupMemberParams
): Promise<ActionResponse<{ count: number }>> {
  try {
    const result = await deleteManyGroupMember(params)
    revalidatePath("/groups")
    revalidatePath("/members")
    revalidatePath("/dashboard")
    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to delete group members:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete group members",
    }
  }
}

// ============================================
// Advanced Actions
// ============================================

/**
 * Get members in a specific group
 */
export async function getMembersByGroupAction(
  groupId: string
): Promise<ActionResponse> {
  try {
    const groupMembers = await findManyGroupMember({
      where: { groupId },
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
      orderBy: { startDate: "desc" },
    })
    return { success: true, data: groupMembers }
  } catch (error) {
    console.error("Failed to get members by group:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get members by group",
    }
  }
}

/**
 * Get groups for a specific member
 */
export async function getGroupsByMemberAction(
  memberId: string
): Promise<ActionResponse> {
  try {
    const groupMembers = await findManyGroupMember({
      where: { memberId },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
      orderBy: { startDate: "desc" },
    })
    return { success: true, data: groupMembers }
  } catch (error) {
    console.error("Failed to get groups by member:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get groups by member",
    }
  }
}

/**
 * Check if a member is in a group
 */
export async function isMemberInGroupAction(
  groupId: string,
  memberId: string
): Promise<ActionResponse<boolean>> {
  try {
    const groupMember = await findUniqueGroupMember({
      where: { groupId_memberId: { groupId, memberId } },
    })
    return { success: true, data: !!groupMember }
  } catch (error) {
    console.error("Failed to check membership:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to check membership",
    }
  }
}

/**
 * Add multiple members to a group
 */
export async function addMembersToGroupAction(
  groupId: string,
  memberIds: string[]
): Promise<ActionResponse> {
  try {
    const data = memberIds.map(memberId => ({
      groupId,
      memberId,
    }))
    const result = await createManyGroupMember({ data })
    revalidatePath("/groups")
    revalidatePath("/members")
    revalidatePath("/dashboard")
    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to add members to group:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add members to group",
    }
  }
}

/**
 * Remove multiple members from a group
 */
export async function removeMembersFromGroupAction(
  groupId: string,
  memberIds: string[]
): Promise<ActionResponse<{ count: number }>> {
  try {
    const result = await deleteManyGroupMember({
      where: {
        groupId,
        memberId: { in: memberIds },
      },
    })
    revalidatePath("/groups")
    revalidatePath("/members")
    revalidatePath("/dashboard")
    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to remove members from group:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove members from group",
    }
  }
}

/**
 * End membership (set endDate) for a group member
 */
export async function endGroupMembershipAction(
  groupId: string,
  memberId: string
): Promise<ActionResponse> {
  try {
    const groupMember = await findUniqueGroupMember({
      where: { groupId_memberId: { groupId, memberId } },
    })
    if (!groupMember) {
      return { success: false, error: "Group member not found" }
    }

    const updatedGroupMember = await updateGroupMember({
      where: { groupId_memberId: { groupId, memberId } },
      data: { endDate: new Date().toISOString() },
    })

    revalidatePath("/groups")
    revalidatePath("/members")
    revalidatePath("/dashboard")
    
    return { success: true, data: updatedGroupMember }
  } catch (error) {
    console.error("Failed to end group membership:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to end group membership",
    }
  }
}