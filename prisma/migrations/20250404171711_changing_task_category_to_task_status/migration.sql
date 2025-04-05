/*
  Warnings:

  - The `category` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "category",
ADD COLUMN     "category" "TaskStatus" NOT NULL DEFAULT 'TODO';

-- DropEnum
DROP TYPE "TaskCategory";
