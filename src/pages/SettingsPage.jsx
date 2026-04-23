import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

function ToggleRow({ title, description, enabled, onToggle }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
        aria-pressed={enabled}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-1'}`}
        />
      </button>
    </div>
  )
}

function InputField({ label, type = 'text', readOnly = false, placeholder = '', value = '', onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${readOnly ? 'border-gray-200 bg-gray-50 text-gray-500' : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'}`}
      />
    </div>
  )
}

export default function SettingsPage() {
  const { user } = useAuth()
  const storageKey = user ? `eventsphere_settings_${user.email}` : null
  const [eventReminders, setEventReminders] = useState(true)
  const [categoryUpdates, setCategoryUpdates] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  useEffect(() => {
    if (!storageKey) return

    try {
      const savedSettings = localStorage.getItem(storageKey)
      if (!savedSettings) return

      const parsed = JSON.parse(savedSettings)
      if (typeof parsed.eventReminders === 'boolean') setEventReminders(parsed.eventReminders)
      if (typeof parsed.categoryUpdates === 'boolean') setCategoryUpdates(parsed.categoryUpdates)
      if (typeof parsed.emailUpdates === 'boolean') setEmailUpdates(parsed.emailUpdates)
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error)
    }
  }, [storageKey])

  useEffect(() => {
    if (!storageKey) return

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          eventReminders,
          categoryUpdates,
          emailUpdates,
        })
      )
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error)
    }
  }, [storageKey, eventReminders, categoryUpdates, emailUpdates])

  function handlePasswordUpdate() {
    setPasswordError('')
    setPasswordSuccess('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.')
      return
    }

    setPasswordSuccess('Password updated successfully.')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
        <p className="text-gray-600">No user information available.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account, notifications, and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">

        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="mb-2">
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose what updates you want to receive.
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            <ToggleRow
              title="Event reminders"
              description="Get reminders before events you registered for start."
              enabled={eventReminders}
              onToggle={() => setEventReminders(prev => !prev)}
            />
            <ToggleRow
              title="Subscribed category updates"
              description="Be notified when new events are added to your subscribed categories."
              enabled={categoryUpdates}
              onToggle={() => setCategoryUpdates(prev => !prev)}
            />
            <ToggleRow
              title="Email updates"
              description="Receive important updates and announcements by email."
              enabled={emailUpdates}
              onToggle={() => setEmailUpdates(prev => !prev)}
            />
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Security</h2>
            <p className="mt-1 text-sm text-gray-500">
              Change your password and keep your account secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
              placeholder="Enter current password"
            />
            <InputField
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              placeholder="Enter new password"
            />
            <InputField
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm new password"
            />
          </div>

          {passwordError && (
            <p className="mt-4 text-sm font-medium text-red-600">{passwordError}</p>
          )}

          {passwordSuccess && (
            <p className="mt-4 text-sm font-medium text-green-600">{passwordSuccess}</p>
          )}

          <div className="mt-5">
            <button
              onClick={handlePasswordUpdate}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Update Password
            </button>
          </div>
        </section>

        <section className="pt-2">
          <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
            Delete account
          </button>
        </section>
      </div>
    </div>
  )
}