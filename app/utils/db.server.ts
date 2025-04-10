import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
let prisma: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient();
}

prisma = global.__db;

export { prisma as db };
