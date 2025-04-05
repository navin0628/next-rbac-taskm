// components/TaskManager.js
'use client'

import { useState, useEffect } from 'react'
import { databases  } from '@/lib/appwrite'
import { ID } from 'appwrite'

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const tasksCollectionId = process.env.NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID

export default function TaskManager({ user, role }) {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const res = await databases.listDocuments(databaseId, tasksCollectionId)
      setTasks(res.documents)
    } catch (err) {
      console.error('Error fetching tasks:', err)
    }
    setLoading(false)
  }

  const handleAddTask = async () => {
    if (!newTask.trim()) return
    try {
        const res = await databases.createDocument(
            databaseId,
            tasksCollectionId,
            ID.unique(),
            {
              title: newTask,
              userId: user.$id,
              createdAt: new Date().toISOString(),
            }
          )
          
      setTasks(prev => [res, ...prev])
      setNewTask('')
    } catch (err) {
      console.error('Error adding task:', err)
    }
  }

 

  const handleDelete = async (id) => {
    try {
      await databases.deleteDocument(databaseId, tasksCollectionId, id)
      setTasks(prev => prev.filter(task => task.$id !== id)) // Optimistically update UI
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }
  


  const handleUpdate = async (task) => {
    const newTitle = prompt('Update task title:', task.title)
    if (!newTitle) return
    try {
      const updated = await databases.updateDocument(
        databaseId,
        tasksCollectionId,
        task.$id,
        { title: newTitle }
      )
      setTasks(prev => prev.map(t => t.$id === task.$id ? updated : t))
    } catch (err) {
      console.error('Error updating task:', err)
    }
  }

  const canEdit = (taskUserId) => {
    return (
      role === 'admin' ||
      (role === 'editor' && user.$id === taskUserId)
    )
  }

  const canDelete = (taskUserId) => {
    return (
      role === 'admin' ||
      (role === 'editor' && user.$id === taskUserId)
    )
  }

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Task Manager</h2>

      {role !== 'viewer' && (
        <div className="flex gap-2">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task"
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddTask}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul className="space-y-2">
         {tasks.map((task) => {
  console.log('Logged in user:', user.$id, 'Role:', role)
  console.log('Task userId:', task.userId) // 👈 Add this to check structure

  return (
    <li key={task.$id} className="flex justify-between items-center border p-2 rounded">
      <span>{task.title}</span>
      <div className="flex gap-2">
        {canEdit(task.userId) && (
          <button onClick={() => handleUpdate(task)} className="text-blue-500">
            Edit
          </button>
        )}
        {canDelete(task.userId) && (
          <button onClick={() => handleDelete(task.$id)} className="text-red-500">
            Delete
          </button>
        )}
      </div>
    </li>
  )
})}

        </ul>
      )}
    </div>
  )
}
