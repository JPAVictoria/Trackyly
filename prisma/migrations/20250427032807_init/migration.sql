-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MERCHANDISER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Outlet" AS ENUM ('WALMART', 'TARGET', 'COSTCO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SOSForm" (
    "id" TEXT NOT NULL,
    "merchandiserId" TEXT NOT NULL,
    "outlet" "Outlet" NOT NULL,
    "wine" INTEGER NOT NULL,
    "beer" INTEGER NOT NULL,
    "juice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SOSForm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "SOSForm_outlet_createdAt_idx" ON "SOSForm"("outlet", "createdAt");

-- AddForeignKey
ALTER TABLE "SOSForm" ADD CONSTRAINT "SOSForm_merchandiserId_fkey" FOREIGN KEY ("merchandiserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
