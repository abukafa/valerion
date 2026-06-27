import Link from "next/link";
import { ArrowLeft, KeySquare } from "lucide-react";
import { LoginForm } from "@/modules/auth/components/LoginForm";

export default function LoginPage() {
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
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-[0_0_20px_rgba(255,77,0,0.2)]">
            <KeySquare className="w-8 h-8" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-white text-center mb-2">
          Selamat Datang
        </h1>
        <p className="text-foreground/60 text-center text-sm mb-8">
          Masuk ke akun Anda untuk melanjutkan
        </p>

        <LoginForm />

        <div className="mt-6 text-center text-sm text-foreground/60">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-primary font-bold hover:underline"
          >
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
