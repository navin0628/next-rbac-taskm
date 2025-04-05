'use client'
import { useState } from 'react'
import Login from '@/components/Login'
import TaskManager from '@/components/TaskManager'
import { logout } from '@/lib/auth'

export default function Home() {
  const [userInfo, setUserInfo] = useState(null)

  const handleLogout = async () => {
    await logout()
    setUserInfo(null)
  }

  return (
    <main className="w-full max-w-2xl p-4">
      {!userInfo ? (
        <Login onLogin={setUserInfo} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-black">Navin Logged in as <strong>{userInfo.role}</strong></p>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          <TaskManager user={userInfo.user} role={userInfo.role} />
        </>
      )}
    </main>
  )
}
