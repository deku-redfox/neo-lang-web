"use client"

import { Suspense } from "react"
import { Header, Sidebar } from "./navigation"
import { SidebarProvider } from "./siidebar-context"

export default function DashboardLayout({ children } : Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider>
            <div className="flex h-screen bg-gray-100">
                <Suspense>
                    <Sidebar />
                </Suspense>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Suspense>
                        <Header />
                    </Suspense>
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}