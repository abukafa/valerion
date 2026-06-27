import { getMyOrders } from "@/modules/transaction/actions";
import { OrderList } from "./OrderList";

export const metadata = {
  title: "Pesanan Saya - Valerion",
};

export default async function MyOrdersPage() {
  const orders = await getMyOrders();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border pb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Pesanan Saya</h1>
          <p className="text-sm text-foreground/60 mt-1">
            Pantau status pembelian akun Anda dan konfirmasi pesanan jika data sudah diterima.
          </p>
        </div>
      </div>

      <OrderList orders={orders} />
    </div>
  );
}
