import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <nav>
        <div className="nav-container">
          <Link to="/" className="logo">OpenRest</Link>
          <ul className="nav-links">
            <li><Link to="/"      className={pathname === '/'       ? 'active' : ''}>Home</Link></li>
            {/* Menu management only for staff */}
            {user?.role === 'staff' && (
              <li><Link to="/menu"    className={pathname === '/menu'    ? 'active' : ''}>Menu</Link></li>
            )}
            {/* Order page for table users */}
            {user?.role === 'table' && (
              <li><Link to="/order"   className={pathname === '/order'   ? 'active' : ''}>Order</Link></li>
            )}
            {/* Kitchen dashboard only for staff */}
            {user?.role === 'staff' && (
              <li><Link to="/kitchen" className={pathname === '/kitchen' ? 'active' : ''}>Kitchen</Link></li>
            )}
            <li><Link to="/about"   className={pathname === '/about'   ? 'active' : ''}>About</Link></li>
          </ul>

          <div className="nav-auth">
            {user ? (
              <>
                <span className="nav-username">
                  {user.role === 'table' ? `Table ${user.tableNumber}` : user.username}
                </span>
                <button className="btn btn-sm btn-outline" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-sm btn-primary">Sign In</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
