import { PrismaClient } from "./generated/prisma/client"; //Creating a Prisma Client -> Prisma Client Is a translator between our application and DB, They can't talk together directly

import { PrismaPg } from "@prisma/adapter-pg"; //Creating a PostgreSQL adapter --> PostgreSQL requires a specific database driver for communication but Prisma Client speaks one language, The Adapter matches these 2 layers 

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! }); //It tells the PostgreSQL driver to where is our database adn how to connect it 

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }; //globalThis is an object that survives hot reloads, so we store the client on it

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter }); //It means, check whether a Prisma Client already exists on globalThis then if exists reuse it, if not create a new one 

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; //In development, save the client on globalThis so the next hot reload reuses it. Production has no hot reloads, so it's skipped
