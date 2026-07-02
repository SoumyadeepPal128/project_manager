import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { useAuthStore } from "./store/authStore"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"

function App() {
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser)

  useEffect(() => {
    getCurrentUser()
  }, [getCurrentUser])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App