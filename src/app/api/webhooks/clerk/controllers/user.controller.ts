import prisma from "@/lib/prisma";
import { UserJSON } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export const createUser = async (data: UserJSON) => {
  const primaryEmail = data.email_addresses.find(
    (email: any) => email.id === data.primary_email_address_id
  );

  const userData = {
    id: data.id,
    name:
      `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
      data.username ||
      "Unknown User",
    email:
      primaryEmail?.email_address || data.email_addresses[0]?.email_address,
    emailVerified: primaryEmail?.verification?.status === "verified",
    image: data.image_url,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Defaults for other fields as per schema
    twoFactorEnabled: false,
    role: null,
    banned: false,
    banReason: null,
    banExpires: null,
    stripeCustomerId: null,
  };

  await prisma.user.upsert({
    where: { id: data.id },
    create: userData,
    update: userData,
  });

  console.log(`Created/Updated user ${data.id} in database`);
};


export const updateUser = async (data: UserJSON) => {
 const primaryEmail = data.email_addresses.find(
        (email: any) => email.id === data.primary_email_address_id
      )

      const updateData = {
        name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.username || 'Unknown User',
        email: primaryEmail?.email_address || data.email_addresses[0]?.email_address,
        emailVerified: primaryEmail?.verification?.status === 'verified',
        image: data.image_url,
        updatedAt: new Date().toISOString(),
        // Handle other updatable fields if needed (e.g., banned status, role if synced from Clerk metadata)
        // For example, if banned in Clerk:
        banned: data.banned || false,
        banReason: data.public_metadata?.banReason || null,
        banExpires: data.public_metadata?.banExpires ? new Date(data.public_metadata?.banExpires! as string).toISOString() : null,
      }

      await prisma.user.updateMany({
        where: { id: data.id },
        data: updateData,
      })

      console.log(`Updated user ${data.id} in database`)

    }


export const deleteUser = async (id: string) => {
  await prisma.user.delete({
    where: { id },
  });
  console.log(`Deleted user ${id} from database`);
};