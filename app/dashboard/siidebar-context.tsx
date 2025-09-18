"use client"

import { createContext, ReactNode, useState } from "react";

type SidebarContextType = {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
};

export const SidebarContext = createContext<SidebarContextType>({isOpen: false, setIsOpen: () => {}});

export const SidebarProvider = ({ children } : { children: ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

    const setIsOpen = (value: boolean) => setSidebarOpen(value)

    return (
        <SidebarContext.Provider value={{isOpen: sidebarOpen, setIsOpen}}>
            {children}
        </SidebarContext.Provider>
    );
};