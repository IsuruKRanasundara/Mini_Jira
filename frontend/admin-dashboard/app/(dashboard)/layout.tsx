import { AdminShell } from "@/components/layout/admin-shell";
import { AdminDataProvider } from "@/context/admin-data-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminDataProvider>
      <AdminShell>{children}</AdminShell>
    </AdminDataProvider>
  );
}
