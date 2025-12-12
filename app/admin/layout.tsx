import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { MockDataInitializer } from "@/components/mock-data-initializer"
import { AdminRouteGuard } from "@/components/admin-route-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <MockDataInitializer />
      <AdminRouteGuard>
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 pl-64 transition-all duration-300">
            <div className="container mx-auto p-6">{children}</div>
          </main>
        </div>
      </AdminRouteGuard>
    </>
  )
}
