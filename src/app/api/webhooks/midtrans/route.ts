import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Verify signature key to ensure request comes from Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const signatureKey = body.signature_key;
    const orderId = body.order_id;
    const statusCode = body.status_code;
    const grossAmount = body.gross_amount;

    const hash = crypto
      .createHash("sha512")
      .update(orderId + statusCode + grossAmount + serverKey)
      .digest("hex");

    if (hash !== signatureKey) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;

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

    if (newStatus && newStatus !== "PENDING") {
      // Update transaction status
      const transaction = await prisma.transaction.update({
        where: { id: orderId },
        data: { status: newStatus }
      });

      // If PAID, mark listing as SOLD
      if (newStatus === "PAID") {
        await prisma.listing.update({
          where: { id: transaction.listingId },
          data: { status: "SOLD" }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
