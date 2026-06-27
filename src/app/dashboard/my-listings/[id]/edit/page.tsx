import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getListingById } from "@/modules/listing/actions";
import { ListingForm } from "@/modules/listing/components/ListingForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Edit Dagangan - Valerion",
};

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  // Ensure user owns the listing (or is admin)
  if (listing.sellerId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/dashboard/my-listings");
  }

  return (
    <div className="space-y-6 mx-auto pb-10">
      <Link
        href="/dashboard/my-listings"
        className="inline-flex items-center text-foreground/60 hover:text-primary transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Stok Dagangan
      </Link>

      <div className="text-center">
        <h1 className="text-2xl font-black text-white tracking-tight">
          Edit Dagangan
        </h1>
        <p className="text-foreground/60 text-sm">
          Ubah detail, harga, atau gambar untuk akun game Anda.
        </p>
      </div>

      <ListingForm
        initialData={listing}
        redirectPath="/dashboard/my-listings"
      />
    </div>
  );
}
