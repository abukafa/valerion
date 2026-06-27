import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { RegisterForm } from "@/modules/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Link
        href="/"
        className="inline-flex items-center text-primary hover:underline mb-8 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Beranda
      </Link>

      <div className="bg-card border border-card-border p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Neon decorative blob */}
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-[0_0_20px_rgba(255,77,0,0.2)]">
            <UserPlus className="w-8 h-8" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-white text-center mb-2">
          Buat Akun Baru
        </h1>
        <p className="text-foreground/60 text-center text-sm mb-8">
          Daftar untuk mulai berjualan dan bertransaksi
        </p>

        <RegisterForm />

        <div className="mt-6 text-center text-sm text-foreground/60">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-primary font-bold hover:underline"
          >
            Masuk Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
