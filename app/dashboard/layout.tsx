"use client"

import { Header, Sidebar } from "./navigation"
import { SidebarProvider } from "./siidebar-context"

export default function DashboardLayout({ children } : Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider>
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}