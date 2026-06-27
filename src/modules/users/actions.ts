"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitKYC(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const ktpUrl = formData.get("ktpUrl") as string;
  if (!ktpUrl) {
    throw new Error("KTP URL is required");
  }

  // Cek apakah user sudah verified
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (user?.isVerified) {
    throw new Error("Already verified");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { kycDocumentUrl: ktpUrl }
  });

  revalidatePath("/dashboard/kyc");

  return { success: true, message: "KTP berhasil diunggah. Menunggu verifikasi Admin." };
}

export async function getUserDashboardStats() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      totalPenjualan: 0,
      totalPembelian: 0,
      aktifListings: 0,
    };
  }

  // Count active listings
  const aktifListings = await prisma.listing.count({
    where: { 
      sellerId: session.user.id,
      status: "AVAILABLE",
      // Pastikan tidak ada transaksi yang PENDING/PAID/COMPLETED yang aktif (tapi status SOLD sudah handle PAID/COMPLETED)
      transactions: {
        none: {
          status: { in: ["PENDING", "PAID", "COMPLETED"] }
        }
      }
    }
  });

  const penjualanAggregation = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { sellerId: session.user.id, status: "COMPLETED" }
  });

  const pembelianAggregation = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { buyerId: session.user.id, status: "COMPLETED" }
  });

  return {
    totalPenjualan: penjualanAggregation._sum.amount || 0,
    totalPembelian: pembelianAggregation._sum.amount || 0,
    aktifListings,
  };
}
