'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = () => {
    if (username === 'admin' && password === '1234') {
      localStorage.setItem('isAdmin', 'true')
      router.push('/admin/general')
    } else {
      alert('Credenziali non valide')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold">Login Admin</h1>
      <input
        type="text"
        placeholder="Username"
        className="w-full border px-4 py-2 rounded-md"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border px-4 py-2 rounded-md"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Login
      </button>
    </div>
  )
}
