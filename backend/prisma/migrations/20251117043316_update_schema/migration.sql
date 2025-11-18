-- AlterEnum
ALTER TYPE "RequestStatus" ADD VALUE 'CANCELLED';

-- AlterEnum
ALTER TYPE "UserType" ADD VALUE 'ADMIN';

-- DropForeignKey
ALTER TABLE "service_requests" DROP CONSTRAINT "service_requests_driverId_fkey";

-- AlterTable
ALTER TABLE "service_requests" ALTER COLUMN "driverId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "isGoogleUser" BOOLEAN,
ALTER COLUMN "password" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
