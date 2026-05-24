import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const { login } = useAuth()
  const navigate  = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }
      login({ username: data.username, role: data.role, tableNumber: data.tableNumber }, data.token)
      // redirect based on role
      if (data.role === 'staff') {
        navigate('/kitchen')
      } else {
        navigate('/order')
      }
    } catch (err) {
      setError('Could not connect to server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page login-page">
      <div className="container">
        <div className="login-card">
          <h2>Sign In</h2>
          <p className="login-subtitle">Staff: use your staff credentials. Customers: use the credentials on your table card.</p>

          {error && <p className="status-msg error">{error}</p>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. table1 or staff1"
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-hint">
            <p><strong>Demo credentials:</strong></p>
            <p>Staff: <code>staff1</code> / <code>password123</code></p>
            <p>Table 1: <code>table1</code> / <code>table1pass</code></p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
