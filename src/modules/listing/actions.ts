"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllListings() {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        seller: {
          select: {
            name: true,
            reputation: true,
            isVerified: true,
            image: true
          }
        },
        transactions: {
          where: { status: "PENDING" },
          select: { id: true }
        }
      }
    });
    
    // Parse images JSON string back to array and add isBooked flag
    return listings.map(listing => ({
      ...listing,
      images: JSON.parse(listing.images || "[]"),
      isBooked: listing.transactions.length > 0
    }));
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}

export async function getListingById(id: string) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            name: true,
            reputation: true,
            isVerified: true,
            image: true
          }
        },
        transactions: {
          where: { status: "PENDING" },
          select: { id: true }
        }
      }
    });

    if (!listing) return null;

    return {
      ...listing,
      images: JSON.parse(listing.images || "[]"),
      isBooked: listing.transactions.length > 0
    };
  } catch (error) {
    console.error("Error fetching listing by ID:", error);
    return null;
  }
}

export async function createListing(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const gameName = formData.get("gameName") as string;
    const price = parseFloat(formData.get("price") as string);
    const originalPriceInput = formData.get("originalPrice") as string;
    const originalPrice = originalPriceInput ? parseFloat(originalPriceInput) : null;
    const description = formData.get("description") as string;
    const imageFiles = formData.getAll("images") as File[]; // Gets all appended files

    // Get the authenticated user from session
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Anda harus login untuk membuat postingan");
    }

    const sellerId = session.user.id;

    // Process image uploads
    const imagesArray: string[] = [];
    if (imageFiles && imageFiles.length > 0) {
      const fs = await import("fs/promises");
      const path = await import("path");
      
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      // Ensure the uploads directory exists
      await fs.mkdir(uploadDir, { recursive: true });

      for (const file of imageFiles) {
        if (file.size === 0) continue;
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = file.name.split('.').pop() || 'png';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, buffer);
        imagesArray.push(`/uploads/${fileName}`);
      }
    }

    if (imagesArray.length === 0) {
      imagesArray.push("https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80");
    }

    const newListing = await prisma.listing.create({
      data: {
        title,
        gameName,
        price,
        originalPrice,
        description,
        images: JSON.stringify(imagesArray),
        sellerId: sellerId,
        isPremium: Math.random() > 0.8
      }
    });

    return { success: true, id: newListing.id };
  } catch (error: any) {
    console.error("Error creating listing:", error);
    return { success: false, error: error.message };
  }
}

export async function getMyListings() {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) {
      return [];
    }

    const listings = await prisma.listing.findMany({
      where: { sellerId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        transactions: {
          where: { status: "PENDING" },
          select: { id: true }
        }
      }
    });
    
    return listings.map(listing => ({
      ...listing,
      images: JSON.parse(listing.images || "[]"),
      isBooked: listing.transactions.length > 0
    }));
  } catch (error) {
    console.error("Error fetching my listings:", error);
    return [];
  }
}

export async function deleteListing(id: string) {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing || (listing.sellerId !== session.user.id && session.user.role !== "ADMIN")) {
      throw new Error("Unauthorized to delete this listing");
    }

    await prisma.listing.delete({ where: { id } });
    
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/dashboard/my-listings");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting listing:", error);
    return { success: false, error: error.message };
  }
}

export async function updateListing(id: string, formData: FormData) {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing || (listing.sellerId !== session.user.id && session.user.role !== "ADMIN")) {
      throw new Error("Unauthorized to edit this listing");
    }

    const title = formData.get("title") as string;
    const gameName = formData.get("gameName") as string;
    const price = parseFloat(formData.get("price") as string);
    const originalPriceInput = formData.get("originalPrice") as string;
    const originalPrice = originalPriceInput ? parseFloat(originalPriceInput) : null;
    const description = formData.get("description") as string;
    
    const imageFiles = formData.getAll("images") as File[]; // New files
    const existingImagesRaw = formData.get("existingImages") as string;
    const existingImages = existingImagesRaw ? JSON.parse(existingImagesRaw) : [];

    const imagesArray: string[] = [...existingImages];

    if (imageFiles && imageFiles.length > 0) {
      const fs = await import("fs/promises");
      const path = await import("path");
      
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      for (const file of imageFiles) {
        if (file.size === 0) continue;
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = file.name.split('.').pop() || 'png';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, buffer);
        imagesArray.push(`/uploads/${fileName}`);
      }
    }

    if (imagesArray.length === 0) {
      imagesArray.push("https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80");
    }

    await prisma.listing.update({
      where: { id },
      data: {
        title,
        gameName,
        price,
        originalPrice,
        description,
        images: JSON.stringify(imagesArray),
      }
    });

    const { revalidatePath } = await import("next/cache");
    revalidatePath(`/listing/${id}`);
    revalidatePath("/dashboard/my-listings");

    return { success: true, id };
  } catch (error: any) {
    console.error("Error updating listing:", error);
    return { success: false, error: error.message };
  }
}
