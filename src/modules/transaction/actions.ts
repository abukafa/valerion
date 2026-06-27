"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { snap } from "@/lib/midtrans";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function createTransaction(listingId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Anda harus login untuk melakukan pembelian." };
    }

    const buyerId = session.user.id;

    // Fetch listing
    const listing = await prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!listing) return { error: "Produk tidak ditemukan." };
    if (listing.status === "SOLD") return { error: "Produk sudah terjual." };
    if (listing.sellerId === buyerId) return { error: "Anda tidak bisa membeli produk Anda sendiri." };

    const amount = listing.price + 5000; // Adding Escrow Service Fee

    // Create transaction in PENDING state
    const transaction = await prisma.transaction.create({
      data: {
        listingId,
        buyerId,
        sellerId: listing.sellerId,
        amount: amount,
        status: "PENDING"
      }
    });

    // Create Midtrans Snap Transaction
    const parameter = {
      transaction_details: {
        order_id: transaction.id,
        gross_amount: amount
      },
      customer_details: {
        first_name: session.user.name || "Customer",
        email: session.user.email || ""
      },
      item_details: [
        {
          id: listing.id,
          price: listing.price,
          quantity: 1,
          name: listing.title
        },
        {
          id: "ESCROW_FEE",
          price: 5000,
          quantity: 1,
          name: "Biaya Layanan (Escrow)"
        }
      ]
    };

    const midtransTransaction = await snap.createTransaction(parameter);

    // Save snapToken to transaction
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { paymentUrl: midtransTransaction.token }
    });

    return { 
      success: true, 
      transactionId: transaction.id,
      snapToken: midtransTransaction.token
    };
  } catch (error: any) {
    console.error("Create transaction error:", error);
    return { error: "Terjadi kesalahan sistem saat menghubungi payment gateway." };
  }
}

export async function getMyOrders() {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.transaction.findMany({
      where: { buyerId: session.user.id },
      include: {
        listing: true,
        seller: {
          select: { name: true, email: true, image: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Error fetching my orders:", error);
    return [];
  }
}

export async function hasPendingTransactions() {
  try {
    const session = await auth();
    if (!session?.user?.id) return false;

    const pendingCount = await prisma.transaction.count({
      where: { 
        buyerId: session.user.id,
        status: "PENDING"
      }
    });

    return pendingCount > 0;
  } catch (error) {
    console.error("Error checking pending transactions:", error);
    return false;
  }
}

export async function getMySales() {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.transaction.findMany({
      where: { sellerId: session.user.id },
      include: {
        listing: true,
        buyer: {
          select: { name: true, email: true, image: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Error fetching my sales:", error);
    return [];
  }
}

export async function completeOrder(transactionId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction) return { error: "Transaksi tidak ditemukan" };
    if (transaction.buyerId !== session.user.id) return { error: "Hanya pembeli yang dapat menyelesaikan pesanan" };
    if (transaction.status !== "PAID") return { error: "Status pesanan tidak valid" };

    // Update status to COMPLETED
    await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: "COMPLETED" }
    });

    // Add +10 reputation to seller
    await prisma.user.update({
      where: { id: transaction.sellerId },
      data: { reputation: { increment: 10 } }
    });

    return { success: true };
  } catch (error) {
    console.error("Error completing order:", error);
    return { error: "Terjadi kesalahan sistem." };
  }
}

export async function cancelOrder(transactionId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction) return { error: "Transaksi tidak ditemukan" };
    if (transaction.buyerId !== session.user.id) return { error: "Hanya pembeli yang dapat membatalkan pesanan" };
    if (transaction.status !== "PENDING") return { error: "Hanya pesanan yang belum dibayar yang dapat dibatalkan" };

    // Delete the transaction so the listing becomes available again
    await prisma.transaction.delete({
      where: { id: transactionId }
    });

    return { success: true };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return { error: "Terjadi kesalahan sistem saat membatalkan pesanan." };
  }
}

export async function syncTransactionStatus(transactionId: string) {
  try {
    const statusResponse = await snap.transaction.status(transactionId);
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    let newStatus = null;

    if (transactionStatus == "capture") {
      if (fraudStatus == "accept") {
        newStatus = "PAID";
      }
    } else if (transactionStatus == "settlement") {
      newStatus = "PAID";
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      newStatus = "FAILED";
    } else if (transactionStatus == "pending") {
      newStatus = "PENDING";
    }

    if (newStatus) {
      const transaction = await prisma.transaction.update({
        where: { id: transactionId },
        data: { status: newStatus }
      });

      if (newStatus === "PAID") {
        await prisma.listing.update({
          where: { id: transaction.listingId },
          data: { status: "SOLD" }
        });
      }
    }
    
    return { success: true, status: newStatus };
  } catch (error: any) {
    console.error("Error syncing transaction status:", error.message);
    return { error: "Gagal sinkronisasi status dengan Midtrans." };
  }
}
