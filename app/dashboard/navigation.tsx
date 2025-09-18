"use client"

import {
    Users,
    Languages,
    BookOpen,
    HelpCircle,
    Menu,
    X,
    Globe,
    LogOut
} from 'lucide-react';
import Link from 'next/link';
import React, { useContext } from 'react';
import { SidebarContext } from './siidebar-context';
import { useSearchParams } from 'next/navigation';

const pages = [
    { title: 'Gestion des Langues', view: 'languages', name: 'Langues', icon: Languages },
    { title: 'Gestion des Lecons', view: 'lessons', name: 'Lecons', icon: BookOpen },
    { title: 'Gestion des Questions', view: 'questions', name: 'Questions', icon: HelpCircle },
    { title: 'Gestion des Utilisateurs', view: 'users', name: 'Utilisateurs', icon: Users },
]

export const Header = () => {
    const { isOpen, setIsOpen } = useContext(SidebarContext)
    const view = useSearchParams().get('view') ?? 'languages'
    const currentPage = pages.find(page => page.view === view)

    return (
        <div className="bg-white shadow">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            className="lg:hidden mr-4"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <Menu className="h-6 w-6 text-gray-500" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">{currentPage?.title}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const Sidebar = () => {
    const { isOpen, setIsOpen } = useContext(SidebarContext)
    const view = useSearchParams().get('view') ?? 'languages'

    return (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
            <div className="flex items-center justify-between h-16 px-6 border-b">
                <div className="flex items-center">
                    <Globe className="h-8 w-8 text-highlight" />
                    <span className="ml-2 text-lg font-semibold text-gray-900">Admin Panel</span>
                </div>
                <button
                    className="lg:hidden"
                    onClick={() => setIsOpen(false)}
                >
                    <X className="h-6 w-6 text-gray-500" />
                </button>
            </div>
            <nav className="mt-8 px-4">
                <div className="space-y-2">
                    {
                        pages.map((page, index) => {
                            if (page.view != 'lessons' && page.view != 'questions') {
                                return (
                                    <Link key={index} href={`/dashboard?view=${page.view}`}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${view === page.view ? 'bg-highlight-second/15 text-highlight-second' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <page.icon className="mr-3 h-5 w-5" />
                                        {page.name}
                                    </Link>
                                )
                            }
                        })
                    }
                </div>
            </nav>
            <div className="absolute bottom-0 w-full p-4 border-t">
                <Link href='/api/logout' className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Déconnexion
                </Link>
            </div>
        </div>
    )
}


