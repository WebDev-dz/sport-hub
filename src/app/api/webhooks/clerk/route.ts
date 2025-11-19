// api/webhooks/clerk/route.ts
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)
    const { id } = evt.data
    const eventType = evt.type

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)

    if (eventType === 'user.created') {
      // Sync user creation
      const clerkUser = evt.data
      const primaryEmail = clerkUser.email_addresses.find(
        (email: any) => email.id === clerkUser.primary_email_address_id
      )

      const userData = {
        id: clerkUser.id,
        name: `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim() || clerkUser.username || 'Unknown User',
        email: primaryEmail?.email_address || clerkUser.email_addresses[0]?.email_address,
        emailVerified: primaryEmail?.verification?.status === 'verified',
        image: clerkUser.image_url,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Defaults for other fields as per schema
        twoFactorEnabled: false,
        role: null,
        banned: false,
        banReason: null,
        banExpires: null,
        stripeCustomerId: null,
      }

      await prisma.user.upsert({
        where: { id: clerkUser.id },
        create: userData,
        update: userData,
      })

      console.log(`Created/Updated user ${clerkUser.id} in database`)
    } else if (eventType === 'user.updated') {
      // Sync user update
      const clerkUser = evt.data
      const primaryEmail = clerkUser.email_addresses.find(
        (email: any) => email.id === clerkUser.primary_email_address_id
      )

      const updateData = {
        name: `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim() || clerkUser.username || 'Unknown User',
        email: primaryEmail?.email_address || clerkUser.email_addresses[0]?.email_address,
        emailVerified: primaryEmail?.verification?.status === 'verified',
        image: clerkUser.image_url,
        updatedAt: new Date().toISOString(),
        // Handle other updatable fields if needed (e.g., banned status, role if synced from Clerk metadata)
        // For example, if banned in Clerk:
        // banned: clerkUser.banned || false,
        // banReason: clerkUser.publicMetadata?.banReason || null,
        // banExpires: clerkUser.publicMetadata?.banExpires ? new Date(clerkUser.publicMetadata.banExpires).toISOString() : null,
      }

      await prisma.user.updateMany({
        where: { id: clerkUser.id },
        data: updateData,
      })

      console.log(`Updated user ${clerkUser.id} in database`)
    } else if (eventType === 'user.deleted') {
      // Sync user deletion
      await prisma.user.deleteMany({
        where: { id: evt.data.id },
      })

      // Optionally, cascade deletes related records like sessions, accounts, etc., but Prisma handles onDelete: Cascade
      // If you want to soft-delete or handle related entities (e.g., members, groups), add custom logic here

      console.log(`Deleted user ${evt.data.id} from database`)
    }

    // Ignore other event types for now (e.g., session.created, organization.created)
    // You can extend this to sync organizations, sessions, etc., if needed

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Error verifying or processing webhook:', err)
    return NextResponse.json({ error: 'Error processing webhook' }, { status: 400 })
  }
}