import { AdminSidebar } from "./components/admin-sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <main className="flex-1 flex flex-col p-4 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
