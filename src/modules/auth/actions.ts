"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

// Fix Prisma global
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function registerUser(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      return { error: "Semua kolom wajib diisi" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: "Email sudah terdaftar. Silakan gunakan email lain atau masuk dengan Google." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isVerified: false
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Register error:", error);
    return { error: "Terjadi kesalahan sistem. Coba lagi nanti." };
  }
}

export async function loginUser(formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email atau password salah." };
        default:
          return { error: "Gagal masuk. Silakan coba lagi." };
      }
    }
    throw error; // This re-throws the NEXT_REDIRECT error so Next.js handles it properly
  }
}

export async function loginWithGoogle() {
  await signIn("google");
}

export async function logoutUser() {
  const { signOut } = await import("@/auth");
  await signOut();
}
