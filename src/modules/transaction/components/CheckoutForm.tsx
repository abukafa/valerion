"use client";

import { useState, useEffect } from "react";
import { createTransaction, syncTransactionStatus } from "@/modules/transaction/actions";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";

declare global {
  interface Window {
    snap: any;
  }
}

export function CheckoutForm({ listingId }: { listingId: string }) {
  const [step, setStep] = useState<"INITIAL" | "PENDING" | "PAID">("INITIAL");
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load Midtrans Snap Script dynamically
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    // We assume the user has set process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY or we can just use the script without data-client-key for snap.pay(token)
    // Actually, Midtrans requires data-client-key in the script tag
    // Since we don't expose it to NEXT_PUBLIC yet, we'll try to just load it. If it fails, we will need the NEXT_PUBLIC key.
    // Snap token contains the transaction auth anyway.
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-XXXXX"; 
    
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    const result = await createTransaction(listingId);
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    if (result.success && result.snapToken) {
      // Open Snap Popup
      window.snap.pay(result.snapToken, {
        onSuccess: async function(snapResult: any) {
          // Sync with Midtrans to update DB since localhost webhooks fail
          await syncTransactionStatus(result.transactionId);
          setStep("PAID");
        },
        onPending: async function(snapResult: any) {
          // Sync with Midtrans to update DB since localhost webhooks fail
          await syncTransactionStatus(result.transactionId);
          router.push("/dashboard/my-orders");
        },
        onError: function(snapResult: any) {
          setError("Pembayaran gagal. Silakan coba lagi.");
          setIsLoading(false);
        },
        onClose: function() {
          // User closed the popup without finishing payment
          setIsLoading(false);
          // Don't set state to PAID, stay in INITIAL so they can click pay again
        }
      });
    }
  };

  if (step === "PAID") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-6 gap-4">
        <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
        <h3 className="text-xl font-bold text-white">Pembayaran Berhasil!</h3>
        <p className="text-sm text-foreground/60 mb-2">
          Dana Anda ditahan dengan aman oleh sistem Escrow Valerion hingga penjual menyerahkan data akun.
        </p>
        <button 
          onClick={() => router.push("/")}
          className="w-full bg-secondary hover:bg-secondary/80 text-white font-bold py-3 rounded-xl transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  if (step === "PENDING") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-6 gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <h3 className="text-xl font-bold text-white">Menunggu Pembayaran...</h3>
        <p className="text-sm text-foreground/60 mb-2">
          Selesaikan pembayaran Anda di popup Midtrans.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <div className="text-red-500 text-sm font-medium text-center mb-2 bg-red-500/10 border border-red-500/50 p-2 rounded-lg">{error}</div>}
      <button 
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(255,77,0,0.4)] hover:shadow-[0_0_25px_rgba(255,77,0,0.6)] disabled:opacity-50"
      >
        {isLoading ? "Mempersiapkan Transaksi..." : "Konfirmasi & Bayar"}
      </button>
    </div>
  );
}
