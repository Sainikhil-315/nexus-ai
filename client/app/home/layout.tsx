import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/home/app-sidebar";
import Header from "@/components/home/header";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      {/* Header at top - full width */}
      <Header />
      
      {/* Sidebar + Content below header */}
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            <div className="container py-8">
              {children}
            </div>
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
}
