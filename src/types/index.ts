import prisma from '@/lib/prisma'
import { PrismaClient, Prisma } from '@/lib/generated/prisma/client'





export type Player = Prisma.PromiseReturnType<typeof prisma.sports_member.findUniqueOrThrow>;
export type CreatePlayer = Prisma.PromiseReturnType<typeof prisma.sports_member.create>;

export type Group = Prisma.PromiseReturnType<typeof prisma.group.findUniqueOrThrow>;
export type CreateGroup = Prisma.PromiseReturnType<typeof prisma.group.findUniqueOrThrow>;

export type User = Prisma.PromiseReturnType<typeof prisma.user.findUniqueOrThrow>;
export type Organization = Prisma.PromiseReturnType<typeof prisma.organization.findUniqueOrThrow>;


export type TrainingSession = Prisma.PromiseReturnType<typeof prisma.training_session.findUniqueOrThrow>;
export type CreateTrainingSession = Prisma.PromiseReturnType<typeof prisma.training_session.create>;

export type Attendance = Prisma.PromiseReturnType<typeof prisma.attendance.findUniqueOrThrow>;
export type CreateAttendance = Omit<Prisma.PromiseReturnType<typeof prisma.attendance.create>, "id">;

export type Member = Prisma.PromiseReturnType<typeof prisma.member.findUniqueOrThrow>;
export type CreateMember = Prisma.PromiseReturnType<typeof prisma.member.create>;