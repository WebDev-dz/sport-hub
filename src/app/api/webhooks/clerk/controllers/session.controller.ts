import prisma from "@/lib/prisma";
import { SessionJSON } from "@clerk/nextjs/server";

const toIso = (v: any) => {
  if (!v) return undefined;
  if (typeof v === "number") return new Date(v * 1000).toISOString();
  if (typeof v === "string") return v;
  try {
    return new Date(v).toISOString();
  } catch {
    return undefined;
  }
};

export const createSession = async (data: SessionJSON) => {
  const expires = toIso((data as any).expire_at) || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
  const sessionData = {
    id: data.id,
    expiresAt: expires,
    token: data.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ipAddress: (data as any).ip_address || null,
    userAgent: (data as any).user_agent || null,
    userId: data.user_id,
    activeOrganizationId: (data as any).active_organization_id || null,
    impersonatedBy: (data as any).actor?.user_id || null,
  };

  await prisma.session.upsert({
    where: { id: data.id },
    create: sessionData,
    update: sessionData,
  });
};

export const updateSession = async (data: SessionJSON) => {
  const updateData: any = {
    updatedAt: new Date().toISOString(),
    ipAddress: (data as any).ip_address || null,
    userAgent: (data as any).user_agent || null,
    userId: data.user_id,
    activeOrganizationId: (data as any).active_organization_id || null,
    impersonatedBy: (data as any).actor?.user_id || null,
  };
  const expires = toIso((data as any).expire_at);
  if (expires) updateData.expiresAt = expires;

  await prisma.session.updateMany({
    where: { id: data.id },
    data: updateData,
  });
};

export const deleteSession = async (id: string) => {
  await prisma.session.delete({
    where: { id },
  });
};