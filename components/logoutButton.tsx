import { useRouter } from "next/navigation"
import { FaSignOutAlt } from "react-icons/fa"
import { Button } from "react-bootstrap"

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
  return (
    <Button className="bg-black text-white py-1 px-4 rounded-lg flex items-center justify-center space-x-1" onClick={handleLogout}>
      <FaSignOutAlt size={20} /> <span>Logout</span>
    </Button>
  )
}