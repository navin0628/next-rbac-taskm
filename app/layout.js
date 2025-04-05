// app/layout.js
import './globals.css'

export const metadata = {
  title: 'Role-Based Task Manager',
  description: 'A simple task app with RBAC using Appwrite and Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex items-center justify-center">
        {children}
      </body>
    </html>
  )
}
