import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { getListingById } from "@/modules/listing/actions";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import { ListingDetailCard } from "@/modules/listing/components/ListingDetailCard";

export const metadata = {
  title: "Detail Dagangan - Valerion",
};

export default async function PreviewListingDashboardPage({
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

  // Security check: Only seller or admin can view this in dashboard
  if (listing.sellerId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/dashboard/my-listings");
  }

  return (
    <div className="space-y-6 pb-10">
      <Link 
        href="/dashboard/my-listings" 
        className="inline-flex items-center text-foreground/60 hover:text-primary transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Stok Dagangan
      </Link>

      <div className="bg-card border border-card-border rounded-2xl shadow-xl overflow-hidden p-6 md:p-8">
        <ListingDetailCard 
          listing={listing} 
          actionButtons={
            <Link 
              href={`/dashboard/my-listings/${listing.id}/edit`}
              className="flex-1 bg-primary text-primary-foreground font-bold py-3 md:py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(255,77,0,0.4)]"
            >
              <Edit className="w-5 h-5" />
              Edit Dagangan
            </Link>
          }
        />
      </div>
    </div>
  );
}
