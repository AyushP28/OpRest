import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import HomePage from './views/HomePage'
import MenuPage from './views/MenuPage'
import OrderPage from './views/OrderPage'
import AboutPage from './views/AboutPage'
import LoginPage from './views/LoginPage'
import KitchenPage from './views/KitchenPage'

// redirects to /login if not authenticated
function RequireAuth({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

// redirects to /order if not staff
function RequireStaff({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'staff') return <Navigate to="/order" replace />
  return children
}

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Page not found.</p>
      <a href="/" className="btn btn-primary">Go Home</a>
    </div>
  )
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"        element={<HomePage />} />
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/about"   element={<AboutPage />} />
        <Route path="/menu"    element={<RequireStaff><MenuPage /></RequireStaff>} />
        <Route path="/order"   element={<RequireAuth><OrderPage /></RequireAuth>} />
        <Route path="/kitchen" element={<RequireStaff><KitchenPage /></RequireStaff>} />
        <Route path="*"        element={<NotFound />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
