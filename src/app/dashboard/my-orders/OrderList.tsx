"use client";

import { useTransition, useEffect } from "react";
import { completeOrder, syncTransactionStatus, cancelOrder } from "@/modules/transaction/actions";
import { CheckCircle2, Package, Clock, ShieldCheck, Loader2, CreditCard, XCircle } from "lucide-react";
import { useDialog } from "@/components/ui/DialogProvider";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    snap: any;
  }
}

export function OrderList({ orders }: { orders: any[] }) {
  const [isPending, startTransition] = useTransition();
  const { showConfirm, showAlert } = useDialog();
  const router = useRouter();

  useEffect(() => {
    // Load Midtrans Snap Script dynamically for resuming payment
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-XXXXX"; 
    
    if (!document.querySelector(`script[src="${snapScript}"]`)) {
      const script = document.createElement("script");
      script.src = snapScript;
      script.setAttribute("data-client-key", clientKey);
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleResumePayment = (snapToken: string, transactionId: string) => {
    if (window.snap && snapToken) {
      window.snap.pay(snapToken, {
        onSuccess: async () => {
          await syncTransactionStatus(transactionId);
          router.refresh();
        },
        onPending: async () => {
          await syncTransactionStatus(transactionId);
          router.refresh();
        },
        onError: () => showAlert({ title: "Gagal", message: "Pembayaran gagal diproses.", type: "error" }),
        onClose: () => {}
      });
    } else {
      showAlert({ title: "Error", message: "Token pembayaran tidak valid.", type: "error" });
    }
  };

  const handleCancel = async (id: string) => {
    const confirmed = await showConfirm({
      title: "Batalkan Pesanan",
      message: "Apakah Anda yakin ingin membatalkan pesanan ini? Akun ini akan dikembalikan ke beranda dan bisa dibeli orang lain.",
      confirmText: "Ya, Batalkan",
      cancelText: "Tutup",
      type: "warning"
    });

    if (!confirmed) return;

    startTransition(async () => {
      const result = await cancelOrder(id);
      if (result.error) {
        showAlert({ title: "Gagal", message: result.error, type: "error" });
      } else {
        showAlert({ title: "Berhasil", message: "Pesanan berhasil dibatalkan.", type: "success" });
        router.refresh();
      }
    });
  };

  const handleComplete = async (id: string) => {
    const confirmed = await showConfirm({
      title: "Konfirmasi Pesanan Selesai",
      message: "Apakah Anda yakin telah menerima data akun dari penjual dan bisa login dengan aman? Dana akan diteruskan ke penjual dan transaksi tidak dapat dibatalkan.",
      confirmText: "Ya, Pesanan Selesai",
      cancelText: "Batal",
      type: "warning"
    });

    if (!confirmed) return;

    startTransition(async () => {
      const result = await completeOrder(id);
      if (result.error) {
        showAlert({ title: "Gagal", message: result.error, type: "error" });
      } else {
        showAlert({ title: "Berhasil", message: "Pesanan selesai! Terima kasih telah berbelanja.", type: "success" });
        router.refresh();
      }
    });
  };

  if (orders.length === 0) {
    return (
      <div className="bg-card border border-card-border p-12 rounded-2xl text-center flex flex-col items-center">
        <Package className="w-16 h-16 text-foreground/20 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Belum ada pesanan</h3>
        <p className="text-foreground/60 max-w-md mx-auto">
          Anda belum pernah melakukan pembelian akun. Jelajahi pasar dan temukan akun impian Anda!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-card border border-card-border p-5 rounded-2xl flex flex-col md:flex-row gap-6 shadow-sm hover:border-primary/30 transition-colors">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                order.status === "COMPLETED" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                order.status === "PAID" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                order.status === "FAILED" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                "bg-orange-500/10 text-orange-500 border border-orange-500/20"
              }`}>
                {order.status}
              </span>
              <span className="text-xs text-foreground/50">
                {new Date(order.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{order.listing.title}</h3>
            <p className="text-sm text-foreground/60 mb-4">Total: Rp {order.amount.toLocaleString("id-ID")}</p>

            <div className="bg-background rounded-xl p-3 flex items-center gap-3 w-max max-w-full">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground overflow-hidden">
                {order.seller?.image ? (
                  <img src={order.seller.image} alt={order.seller.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  order.seller?.name?.charAt(0) || "U"
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-foreground/50">Penjual:</span>
                <span className="text-sm font-bold text-white flex items-center gap-1">
                  {order.seller?.name || "Unknown"} 
                  <ShieldCheck className="w-3 h-3 text-green-500" />
                </span>
                {order.status === "PAID" && (
                  <span className="text-xs text-primary font-medium mt-1">Chat penjual untuk meminta data akun!</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 min-w-[200px] border-t md:border-t-0 md:border-l border-card-border pt-4 md:pt-0 md:pl-6">
            {order.status === "PENDING" && (
              <div className="flex flex-col items-center text-center p-3 bg-orange-500/5 rounded-xl border border-orange-500/10 gap-2">
                <Clock className="w-6 h-6 text-orange-500" />
                <span className="text-sm font-bold text-white">Menunggu Pembayaran</span>
                <button
                  onClick={() => handleResumePayment(order.paymentUrl, order.id)}
                  className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(255,77,0,0.3)]"
                >
                  <CreditCard className="w-4 h-4" /> Bayar Sekarang
                </button>
                <button
                  onClick={() => handleCancel(order.id)}
                  disabled={isPending}
                  className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                  Batalkan Pesanan
                </button>
              </div>
            )}

            {order.status === "PAID" && (
              <>
                <p className="text-xs text-foreground/60 text-center">Tunggu penjual memberikan data akun, lalu klik:</p>
                <button
                  onClick={() => handleComplete(order.id)}
                  disabled={isPending}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Pesanan Diterima
                </button>
              </>
            )}

            {order.status === "COMPLETED" && (
              <div className="flex flex-col items-center text-center p-3 bg-green-500/5 rounded-xl border border-green-500/10">
                <CheckCircle2 className="w-6 h-6 text-green-500 mb-2" />
                <span className="text-sm font-bold text-white">Transaksi Selesai</span>
                <span className="text-xs text-foreground/60">Dana telah diteruskan</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
