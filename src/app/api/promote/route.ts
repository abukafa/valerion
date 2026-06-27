import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Anda harus login terlebih dahulu." }, { status: 401 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "ADMIN" }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Akun ${updatedUser.email} berhasil dijadikan ADMIN! Silakan Logout lalu Login kembali agar perubahan efek.`
    });
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan sistem." }, { status: 500 });
  }
}
