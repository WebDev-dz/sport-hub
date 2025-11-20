import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest, NextResponse } from 'next/server'
import { createUser, deleteUser, updateUser } from './controllers/user.controller'
import { createOrganization, deleteOrganization, updateOrganization } from './controllers/organization.controller'
import { createSession, deleteSession, updateSession } from './controllers/session.controller'

export async function POST(req: NextRequest) {
  try {
    console.log('Received webhook request')
    const evt = await verifyWebhook(req)
    const { id } = evt.data
    const eventType = evt.type

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)

    if (eventType === 'user.created') {
      const clerkUser = evt.data
      await createUser(clerkUser)
    } else if (eventType === 'user.updated') {
      const clerkUser = evt.data
      await updateUser(clerkUser)
    } else if (eventType === 'user.deleted') {
      const clerkUser = evt.data
      await deleteUser(clerkUser.id!)
    } else if (eventType === 'organization.created') {
      const org = evt.data
      await createOrganization(org)
    } else if (eventType === 'organization.updated') {
      const org = evt.data
      await updateOrganization(org)
    } else if (eventType === 'organization.deleted') {
      const org = evt.data
      await deleteOrganization(org.id!)
    } else if (eventType === 'session.created') {
      const session = evt.data
      await createSession(session)
    } else if (eventType === 'session.ended') {
      const session = evt.data
      await deleteSession(session.id!)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Error verifying or processing webhook:', err)
    return NextResponse.json({ error: 'Error processing webhook' }, { status: 400 })
  }
}