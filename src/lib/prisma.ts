import { PrismaClient } from "./generated/prisma";


const PRISMA_DATABASE_URL = process.env.PRISMA_DATABASE_URL;

if (!PRISMA_DATABASE_URL) {
    throw new Error(
        "PRISMA_DATABASE_URL must be specified, but was left blank"
    );
}

console.log(PRISMA_DATABASE_URL)
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    datasources: {
        "db": {
            "url": PRISMA_DATABASE_URL
        }
    },
    log: ['query', 'info', 'warn', 'error']
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;