import { useAuthStore } from "../store/authStore"

export default function Dashboard() {
  const { user, logout } = useAuthStore()

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Welcome, {user?.username}</h1>
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Log out
        </button>
      </div>
      <p className="text-gray-500">Projects will go here.</p>
    </div>
  )
}