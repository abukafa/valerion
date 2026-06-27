import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { submitKYC } from "@/modules/users/actions";
import prisma from "@/lib/prisma";
import { ShieldCheck, Upload } from "lucide-react";

export const metadata = {
  title: "Verifikasi KTP - Valerion",
};

export default async function KYCPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isVerified: true, kycDocumentUrl: true, kycRejectionReason: true }
  });

  const isVerified = user?.isVerified;
  const isPending = !isVerified && !!user?.kycDocumentUrl;
  const isRejected = !isVerified && !user?.kycDocumentUrl && !!user?.kycRejectionReason;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-green-500" />
          Verifikasi Identitas (KYC)
        </h1>
        <p className="text-foreground/60 text-sm">Verifikasi data diri Anda untuk meningkatkan kepercayaan pembeli.</p>
      </div>

      {isVerified ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
          <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Akun Terverifikasi!</h2>
          <p className="text-green-200/70 text-sm">
            KTP Anda telah berhasil diverifikasi oleh sistem. Anda sekarang memiliki lencana "Verified" di profil Anda.
          </p>
        </div>
      ) : isPending ? (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 text-center">
          <ShieldCheck className="w-12 h-12 text-yellow-500 mx-auto mb-4 opacity-50" />
          <h2 className="text-lg font-bold text-white mb-2">Menunggu Verifikasi</h2>
          <p className="text-yellow-200/70 text-sm">
            Dokumen KTP Anda sedang ditinjau oleh tim Admin kami. Mohon tunggu maksimal 1x24 jam.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-card-border p-6 rounded-2xl relative overflow-hidden">
          {isRejected && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <h3 className="text-red-500 font-bold mb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Verifikasi KTP Ditolak
              </h3>
              <p className="text-red-200/80 text-sm mb-2">
                Mohon maaf, dokumen Anda ditolak dengan alasan berikut:
              </p>
              <div className="bg-background/50 p-3 rounded-lg text-white font-medium text-sm border border-red-500/20">
                "{user.kycRejectionReason}"
              </div>
              <p className="text-red-200/80 text-xs mt-3">
                Silakan perbaiki dokumen Anda dan unggah ulang melalui formulir di bawah ini.
              </p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-bold text-white mb-2">Unggah Foto KTP Asli</h3>
            <p className="text-xs text-foreground/60">
              Pastikan foto KTP terlihat jelas, tidak terpotong, dan tulisan dapat terbaca dengan baik. Data Anda aman dan dienkripsi.
            </p>
          </div>

          <form className="space-y-4" action={async (formData) => {
            "use server";
            await submitKYC(formData);
          }}>
            <div className="space-y-2">
              <label htmlFor="ktpUrl" className="text-xs font-bold text-foreground/70">URL GAMBAR KTP</label>
              <input 
                id="ktpUrl"
                name="ktpUrl"
                type="url" 
                placeholder="https://imgur.com/your-ktp.jpg" 
                className="w-full bg-secondary border border-card-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(255,77,0,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Kirim untuk Verifikasi
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
