import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";

export default function LogoutButton() {
    const router = useRouter()
    async function handleLogout() {
        const response = await fetch("/api/logout", {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        })
        if (response.ok) {
            router.push("/")
            window.location.reload()
        }
    }
    return (<Button className="bg-black text-white py-1 px-3 rounded-md flex items-center justify-center" onClick={handleLogout}>Logout</Button>)
}