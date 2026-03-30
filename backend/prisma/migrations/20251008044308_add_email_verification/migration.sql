-- Add columns to User table for email verification
ALTER TABLE "User" ADD COLUMN "is_verified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "verification_token" TEXT;
ALTER TABLE "User" ADD COLUMN "verification_token_expires" TIMESTAMP(3);
