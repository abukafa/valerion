import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ShieldAlert, LayoutDashboard } from "lucide-react";
import { DashboardSidebar } from "./components/DashboardSidebar";

export const metadata = {
  title: "User Dashboard - Valerion",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar via Client Component */}
      <DashboardSidebar user={session.user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
        
        {/* Custom Header untuk Back-Page */}
        <header className="h-16 border-b border-card-border bg-background/80 backdrop-blur-md flex items-center px-6 pl-20 md:pl-6 justify-between shrink-0 relative z-10">
          <h2 className="font-bold text-white tracking-tight flex items-center gap-2">
            {isAdmin ? <ShieldAlert className="w-5 h-5 text-primary" /> : <LayoutDashboard className="w-5 h-5 text-primary" />}
            {isAdmin ? "Sistem Moderasi" : "Pusat Kontrol User"}
          </h2>
          <div className="text-xs font-medium text-foreground/50 bg-secondary/50 px-3 py-1.5 rounded-full border border-card-border">
            v1.0.0
          </div>
        </header>

        {/* Page Content (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-0">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
