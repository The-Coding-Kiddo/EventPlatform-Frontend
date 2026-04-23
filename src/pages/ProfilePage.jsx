import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [success, setSuccess] = useState('')

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
        <p className="text-gray-600">No user information available.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-2 text-gray-600">
          Manage your personal account information.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-lg">
                {name?.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>

              <div>
                {isEditing ? (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 rounded-xl px-3 py-1.5 text-sm font-semibold text-gray-900"
                  />
                ) : (
                  <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
                )}
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setName(user.name)
                    setIsEditing(false)
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setSuccess('Profile updated successfully')
                    setTimeout(() => setSuccess(''), 2000)
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          {success && (
            <p className="text-sm text-green-600 font-medium">{success}</p>
          )}
        </div>
      </div>
    </div>
  )
}