// lib/db.js
import { ID, databases } from '@/lib/appwrite'

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID
const COLLECTION_ID = 'posts'

// Create a new task
export async function createTask(data) {
  return await databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), data)
}

// Get all tasks
export async function getAllTasks() {
  const res = await databases.listDocuments(DB_ID, COLLECTION_ID)
  return res.documents
}

// Update a task
export async function updateTask(id, data) {
  return await databases.updateDocument(DB_ID, COLLECTION_ID, id, data)
}

// Delete a task
export async function deleteTask(id) {
  return await databases.deleteDocument(DB_ID, COLLECTION_ID, id)
}
