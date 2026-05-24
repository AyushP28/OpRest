import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // restore user from localStorage
    const stored = localStorage.getItem('openrest_user')
    return stored ? JSON.parse(stored) : null
  })

  function login(userData, token) {
    localStorage.setItem('openrest_token', token)
    localStorage.setItem('openrest_user', JSON.stringify(userData))
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('openrest_token')
    localStorage.removeItem('openrest_user')
    setUser(null)
  }

  function getToken() {
    return localStorage.getItem('openrest_token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}


export function useAuth() {
  return useContext(AuthContext)
}
