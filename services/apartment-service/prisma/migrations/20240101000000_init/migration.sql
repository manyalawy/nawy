-- CreateEnum
CREATE TYPE "ApartmentStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD');

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "developer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apartments" (
    "id" TEXT NOT NULL,
    "unitName" TEXT NOT NULL,
    "unitNumber" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "area" DECIMAL(10,2) NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "floor" INTEGER,
    "description" TEXT,
    "features" TEXT[],
    "images" TEXT[],
    "status" "ApartmentStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apartments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_name_key" ON "projects"("name");

-- AddForeignKey
ALTER TABLE "apartments" ADD CONSTRAINT "apartments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
