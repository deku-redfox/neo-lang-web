"use client"

import { logoutAction } from "@/actions"
import LoadingImg from "@/components/loading-img"
import { useEffect, useState } from "react"

export default function LogoutBtn() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [disconnected, setDisconnected] = useState<boolean>(false)

    useEffect(() => {
        if (disconnected) {
            location.reload()
        }
    }, [disconnected])

    const handleLogout = async () => {
        setIsLoading(true)
        const result = await logoutAction()
        setDisconnected(result);
    }
    return (
        <button onClick={handleLogout} className="bg-red-500 cursor-pointer">
            {
                isLoading ? <LoadingImg /> : 'Logout'
            }
        </button>
    )
}