import prisma from "@/lib/prisma";
import { OrganizationJSON } from "@clerk/nextjs/server";

export const createOrganization = async (data: OrganizationJSON) => {
  const orgData = {
    id: data.id,
    name: data.name || data.slug || "Unknown Organization",
    slug: data.slug,
    logo: (data as any).image_url || null,
    createdAt: new Date().toISOString(),
    metadata: JSON.stringify((data as any).public_metadata || {}),
  };

  await prisma.organization.upsert({
    where: { id: data.id },
    create: orgData,
    update: orgData,
  });
};

export const updateOrganization = async (data: OrganizationJSON) => {
  const updateData: any = {
    name: data.name || data.slug || "Unknown Organization",
    slug: data.slug,
    logo: (data as any).image_url || null,
  };
  const metadata = (data as any).public_metadata;
  if (metadata !== undefined) updateData.metadata = JSON.stringify(metadata);

  await prisma.organization.updateMany({
    where: { id: data.id },
    data: updateData,
  });
};

export const deleteOrganization = async (id: string) => {
  await prisma.organization.delete({
    where: { id },
  });
};