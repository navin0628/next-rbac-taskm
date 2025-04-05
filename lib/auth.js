// lib/auth.js
import { account, databases } from './appwrite';
import { Query } from 'appwrite'


const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const usersCollectionId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;

export async function login(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// lib/auth.js
// lib/auth.js

export async function logout() {
  try {
    await account.deleteSession('current')
  } catch (err) {
    console.error('Logout failed:', err.message)
  }
}

  

export async function getCurrentUser() {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    return null;
  }
}




export const getUserRole = async (userId) => {
  try {
    const res = await databases.listDocuments(
      databaseId,
      usersCollectionId,
      [Query.equal('userId', [userId])]
    )

    if (res.total === 0) {
      console.warn('⚠️ No role found for user:', userId)
      return null
    }

    const userDoc = res.documents[0]
    return userDoc.role || null
  } catch (error) {
    console.error('🚨 Error fetching user role:', error)
    return null
  }
}
