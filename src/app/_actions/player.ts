// @/app/_actions/player.ts
"use server"

import { revalidatePath } from "next/cache"
import {
  createPlayer,
  updatePlayer,
  deletePlayer,
  findUniquePlayer,
  findManyPlayer,
  findFirstPlayer,
  countPlayer,
  deleteManyPlayer,
} from "@/server/player"
import type {
  CreatePlayerParams,
  UpdatePlayerParams,
  DeletePlayerParams,
  FindUniquePlayerParams,
  FindManyPlayerParams,
  CountPlayerParams,
  DeleteManyPlayerParams,
} from "@/server/player"
import { Player } from "@/types"

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
 * Create a new player
 */
export async function createPlayerAction(
  params: CreatePlayerParams
): Promise<ActionResponse<Player>> {
  try {
    const player = await createPlayer(params)
    revalidatePath("/players")
    revalidatePath("/dashboard")
    return { success: true, data: player }
  } catch (error) {
    console.error("Failed to create player:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create player",
    }
  }
}

// ============================================
// Read Actions
// ============================================

/**
 * Get a player by unique identifier
 */
export async function getPlayerAction(
  params: FindUniquePlayerParams
): Promise<ActionResponse> {
  try {
    const player = await findUniquePlayer(params)
    if (!player) {
      return { success: false, error: "Player not found" }
    }
    return { success: true, data: player }
  } catch (error) {
    console.error("Failed to get player:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get player",
    }
  }
}

/**
 * Get a player by ID
 */
export async function getPlayerByIdAction(id: string): Promise<ActionResponse> {
  try {
    const player = await findUniquePlayer({
      where: { id },
    })
    if (!player) {
      return { success: false, error: "Player not found" }
    }
    return { success: true, data: player }
  } catch (error) {
    console.error("Failed to get player:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get player",
    }
  }
}

/**
 * Get all players with optional filtering
 */
export async function getPlayersAction(
  params?: FindManyPlayerParams
): Promise<ActionResponse> {
  try {
    const players = await findManyPlayer(params)
    return { success: true, data: players }
  } catch (error) {
    console.error("Failed to get players:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get players",
    }
  }
}

/**
 * Get first player matching criteria
 */
export async function getFirstPlayerAction(
  params?: FindManyPlayerParams
): Promise<ActionResponse> {
  try {
    const player = await findFirstPlayer(params)
    if (!player) {
      return { success: false, error: "No player found matching criteria" }
    }
    return { success: true, data: player }
  } catch (error) {
    console.error("Failed to get player:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get player",
    }
  }
}

/**
 * Count players with optional filtering
 */
export async function countPlayersAction(
  params?: CountPlayerParams
): Promise<ActionResponse<number>> {
  try {
    const count = await countPlayer(params)
    return { success: true, data: count }
  } catch (error) {
    console.error("Failed to count players:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to count players",
    }
  }
}



// ============================================
// Update Actions
// ============================================

/**
 * Update a player
 */
export async function updatePlayerAction(
  params: UpdatePlayerParams
): Promise<ActionResponse> {
  try {
    const player = await updatePlayer(params)
    revalidatePath("/players")
    revalidatePath("/dashboard")
    revalidatePath(`/players/${player.id}`)
    return { success: true, data: player }
  } catch (error) {
    console.error("Failed to update player:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update player",
    }
  }
}

/**
 * Update a player by ID
 */
export async function updatePlayerByIdAction(
  id: string,
  data: UpdatePlayerParams["data"]
): Promise<ActionResponse> {
  try {
    const player = await updatePlayer({
      where: { id },
      data,
    })
    revalidatePath("/players")
    revalidatePath("/dashboard")
    revalidatePath(`/players/${id}`)
    return { success: true, data: player }
  } catch (error) {
    console.error("Failed to update player:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update player",
    }
  }
}

// ============================================
// Delete Actions
// ============================================

/**
 * Delete a player
 */
export async function deletePlayerAction(
  params: DeletePlayerParams
): Promise<ActionResponse> {
  try {
    const player = await deletePlayer(params)
    revalidatePath("/players")
    revalidatePath("/dashboard")
    return { success: true, data: player }
  } catch (error) {
    console.error("Failed to delete player:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete player",
    }
  }
}

/**
 * Delete a player by ID
 */
export async function deletePlayerByIdAction(id: string): Promise<ActionResponse> {
  try {
    const player = await deletePlayer({
      where: { id },
    })
    revalidatePath("/players")
    revalidatePath("/dashboard")
    return { success: true, data: player }
  } catch (error) {
    console.error("Failed to delete player:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete player",
    }
  }
}

// ============================================
// Bulk Actions
// ============================================

/**
 * Delete multiple players
 */
export async function deleteManyPlayersAction(
  params?: DeleteManyPlayerParams
): Promise<ActionResponse<{ count: number }>> {
  try {
    const result = await deleteManyPlayer(params)
    revalidatePath("/players")
    revalidatePath("/dashboard")
    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to delete players:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete players",
    }
  }
}

// ============================================
// Advanced Actions
// ============================================

/**
 * Search players by name
 */
export async function searchPlayersByNameAction(
  searchTerm: string
): Promise<ActionResponse> {
  try {
    const players = await findManyPlayer({
      where: {
        OR: [
          { firstName: { contains: searchTerm } },
          { lastName: { contains: searchTerm } },
        ],
      },
      orderBy: { firstName: "asc" },
    })
    return { success: true, data: players }
  } catch (error) {
    console.error("Failed to search players:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to search players",
    }
  }
}

/**
 * Get players by team
 */
export async function getPlayersByTeamAction(
  teamId: string
): Promise<ActionResponse> {
  try {
    const players = await findManyPlayer({
      where: { groupMembers: { "every": { groupId: teamId } } },
      orderBy: { firstName: "asc" },
    })
    return { success: true, data: players }
  } catch (error) {
    console.error("Failed to get players by team:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get players",
    }
  }
}

/**
 * Get active players
 */
export async function getActivePlayersAction(): Promise<ActionResponse> {
  try {
    const players = await findManyPlayer({
      where: { isActive: true },
      orderBy: { firstName: "asc" },
    })
    return { success: true, data: players }
  } catch (error) {
    console.error("Failed to get active players:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get players",
    }
  }
}

/**
 * Toggle player active status
 */
export async function togglePlayerActiveAction(
  id: string
): Promise<ActionResponse> {
  try {
    const player = await findUniquePlayer({ where: { id } })
    if (!player) {
      return { success: false, error: "Player not found" }
    }

    const updatedPlayer = await updatePlayer({
      where: { id },
      data: { isActive: !player.isActive },
    })

    revalidatePath("/players")
    revalidatePath("/dashboard")
    revalidatePath(`/players/${id}`)
    
    return { success: true, data: updatedPlayer }
  } catch (error) {
    console.error("Failed to toggle player status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update player",
    }
  }
}