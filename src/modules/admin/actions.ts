"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Prevent multiple instances in dev
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Middleware for Server Actions
 * Throws an error if the user is not an ADMIN.
 */
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }
  return session;
}

export async function getAdminStats() {
  await requireAdmin();

  const [totalUsers, totalListings, totalTransactions, pendingKYC] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count(),
    prisma.transaction.count(),
    prisma.user.count({ where: { isVerified: false, kycDocumentUrl: { not: null } } }),
  ]);

  const transactions = await prisma.transaction.findMany({
    select: { amount: true },
    where: { status: "COMPLETED" }
  });
  const totalVolume = transactions.reduce((acc, tx) => acc + tx.amount, 0);

  return {
    totalUsers,
    totalListings,
    totalTransactions,
    totalVolume,
    pendingKYC
  };
}

export async function getUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });
}

export async function getPendingKYCUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    where: { isVerified: false, kycDocumentUrl: { not: null } },
    orderBy: { createdAt: "asc" }
  });
}

export async function approveUserKYC(userId: string) {
  await requireAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { 
      isVerified: true,
      kycRejectionReason: null 
    }
  });
  revalidatePath("/dashboard/admin/users");
  return { success: true };
}

export async function rejectUserKYC(userId: string, reason: string) {
  await requireAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { 
      kycDocumentUrl: null, // Reset the document so they can upload again
      kycRejectionReason: reason 
    }
  });
  revalidatePath("/dashboard/admin/users");
  return { success: true };
}

export async function getAdminListings() {
  await requireAdmin();
  return prisma.listing.findMany({
    include: { seller: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" }
  });
}

export async function deleteListingByAdmin(listingId: string) {
  await requireAdmin();
  // Ensure related transactions are handled or cascade delete is configured.
  // We'll update the status instead of hard deleting to prevent relational errors.
  await prisma.listing.update({
    where: { id: listingId },
    data: { status: "REMOVED_BY_ADMIN" }
  });
  revalidatePath("/admin/listings");
  return { success: true };
}
