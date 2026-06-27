import { ListingForm } from "@/modules/listing/components/ListingForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function PostListingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <Link href="/" className="inline-flex items-center text-primary hover:underline mb-8 text-sm font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Batal & Kembali ke Beranda
      </Link>
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Jual Akun Game Kamu</h1>
        <p className="text-foreground/60">Isi formulir di bawah ini dengan lengkap dan jujur agar pembeli percaya.</p>
      </div>

      <ListingForm />
    </div>
  );
}
