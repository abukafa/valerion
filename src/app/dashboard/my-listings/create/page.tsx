import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ListingForm } from "@/modules/listing/components/ListingForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Tambah Dagangan - Valerion",
};

export default async function CreateListingDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
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
          Tambah Dagangan Baru
        </h1>
        <p className="text-foreground/60 text-sm">
          Isi formulir di bawah ini untuk mengunggah akun game jualan Anda.
        </p>
      </div>

      <ListingForm redirectPath="/dashboard/my-listings" />
    </div>
  );
}
