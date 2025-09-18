import LogoutBtn from "./logout-btn"

export default async function Me() {
    
    return (
        <main className="flex flex-col justify-center">
            <p className="mb-3">En attendant qu&apos;un utilisateur puisse se connecter 😁</p>
            <p>En tout cas Bienvenue a toi </p>
            <LogoutBtn />
        </main>
    )
}