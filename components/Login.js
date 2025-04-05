// components/Login.js
'use client'

import { useState, useEffect } from 'react'
import { databases  } from '@/lib/appwrite'
import { ID } from 'appwrite'
import { login, getCurrentUser, getUserRole, logout } from '@/lib/auth'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)

  useEffect(() => {
   
    
    const checkSession = async () => {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        const role = await getUserRole(currentUser.$id)
        setUser(currentUser)
        setRole(role)
        onLogin({ user: currentUser, role })
      }
    }
    checkSession()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
  
    try {
      await login(email, password) // ← this creates a new session
  
      const newUser = await getCurrentUser()
      const newRole = await getUserRole(newUser.$id)
  
      setUser(newUser)
      setRole(newRole)
      onLogin({ user: newUser, role: newRole })
    } catch (err) {
      console.error(err)
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }
  
  const handleLogout = async () => {
    await logout()
    setUser(null)
    setRole(null)
    onLogin(null)
  }
  
  if (user && role) {
   
  
    return (
      <div className="mb-6 bg-white p-4 rounded shadow">
     

      </div>
    )
  }
  
  return (
    <form onSubmit={handleLogin} className="mb-6 bg-white p-4 rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}



