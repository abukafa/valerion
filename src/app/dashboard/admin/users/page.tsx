import { getUsers, getPendingKYCUsers } from "@/modules/admin/actions";
import { KYCList } from "./KYCList";
import { ShieldCheck, UserX } from "lucide-react";

export default async function AdminUsersPage() {
  const pendingUsers = await getPendingKYCUsers();
  const allUsers = await getUsers();

  return (
    <div>
      <h1 className="text-3xl font-black text-white tracking-tight mb-2">Pengguna & KYC</h1>
      <p className="text-foreground/60 mb-8">Verifikasi identitas pengguna (KTP) dan manajemen akun.</p>

      {/* Pending KYC Section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          Menunggu Verifikasi KTP ({pendingUsers.length})
        </h2>
        
        {pendingUsers.length === 0 ? (
          <div className="bg-card border border-card-border p-8 rounded-2xl text-center">
            <ShieldCheck className="w-12 h-12 text-foreground/20 mx-auto mb-3" />
            <p className="text-foreground/60 font-medium">Semua dokumen KTP sudah diverifikasi.</p>
          </div>
        ) : (
          <KYCList users={pendingUsers} />
        )}
      </section>

      {/* All Users Section */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Semua Pengguna</h2>
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-foreground/80">
              <thead className="bg-secondary/50 text-foreground uppercase border-b border-card-border">
                <tr>
                  <th className="px-6 py-4 font-bold">Nama</th>
                  <th className="px-6 py-4 font-bold">Email</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold">Status KYC</th>
                  <th className="px-6 py-4 font-bold">Reputasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {allUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{user.name || "-"}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        user.role === 'ADMIN' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-secondary text-foreground/60'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isVerified ? (
                        <span className="text-green-500 font-bold text-xs flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi
                        </span>
                      ) : (
                        <span className="text-foreground/40 text-xs">Belum</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{user.reputation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
