import { getMySales } from "@/modules/transaction/actions";
import { SalesList } from "./SalesList";

export const metadata = {
  title: "Penjualan Saya - Valerion",
};

export default async function MySalesPage() {
  const sales = await getMySales();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border pb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Penjualan Saya</h1>
          <p className="text-sm text-foreground/60 mt-1">
            Kelola penjualan Anda dan hubungi pembeli untuk penyerahan data akun.
          </p>
        </div>
      </div>

      <SalesList sales={sales} />
    </div>
  );
}
