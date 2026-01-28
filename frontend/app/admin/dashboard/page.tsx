'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authFetch, clearToken, isAuthed } from '@/lib/auth'
import { AdminAthlete, AdminAthleteCreate } from '@/data/types'
import { AthleteFormModal } from '@/components/admin/AthleteFormModal'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [athletes, setAthletes] = useState<AdminAthlete[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAthlete, setEditingAthlete] = useState<AdminAthlete | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!isAuthed()) {
      router.replace('/admin/login')
    }
  }, [router])

  const fetchAthletes = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await authFetch('/api/athletes')
      if (!response.ok) {
        throw new Error('Failed to fetch athletes')
      }
      const data = await response.json()
      setAthletes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load athletes')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthed()) {
      fetchAthletes()
    }
  }, [fetchAthletes])

  function handleLogout() {
    clearToken()
    router.replace('/admin/login')
  }

  function handleAddClick() {
    setEditingAthlete(null)
    setIsModalOpen(true)
  }

  function handleEditClick(athlete: AdminAthlete) {
    setEditingAthlete(athlete)
    setIsModalOpen(true)
  }

  function handleModalClose() {
    setIsModalOpen(false)
    setEditingAthlete(null)
  }

  async function handleSaveAthlete(data: AdminAthleteCreate) {
    if (editingAthlete) {
      const response = await authFetch(`/api/athletes/${editingAthlete.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update athlete')
      }

      const updated = await response.json()
      setAthletes((prev) =>
        prev.map((a) => (a.id === editingAthlete.id ? updated : a))
      )
    } else {
      const response = await authFetch('/api/athletes', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create athlete')
      }

      const created = await response.json()
      setAthletes((prev) => [...prev, created])
    }

    handleModalClose()
  }

  async function handleDeleteClick(id: string) {
    setDeleteConfirm(id)
  }

  async function confirmDelete() {
    if (!deleteConfirm) return

    setIsDeleting(true)
    try {
      const response = await authFetch(`/api/athletes/${deleteConfirm}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete athlete')
      }

      setAthletes((prev) => prev.filter((a) => a.id !== deleteConfirm))
      setDeleteConfirm(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete athlete')
    } finally {
      setIsDeleting(false)
    }
  }

  function cancelDelete() {
    setDeleteConfirm(null)
  }

  if (!isAuthed()) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          {/* Section Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Athletes
            </h2>
            <button
              onClick={handleAddClick}
              className="px-4 py-2 bg-prBlue-600 hover:bg-prBlue-700 text-white font-medium rounded-lg transition-colors"
            >
              Add Athlete
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Loading athletes...
            </div>
          ) : athletes.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 m-6 rounded-lg">
              No athletes found. Click &quot;Add Athlete&quot; to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50">
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Team
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Events
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {athletes.map((athlete) => (
                    <tr
                      key={athlete.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900/30"
                    >
                      <td className="py-3 px-6 text-gray-900 dark:text-white font-medium">
                        {athlete.firstName} {athlete.lastName}
                      </td>
                      <td className="py-3 px-6 text-gray-600 dark:text-gray-400">
                        {athlete.grade ?? '-'}
                      </td>
                      <td className="py-3 px-6 text-gray-600 dark:text-gray-400">
                        {athlete.team ?? '-'}
                      </td>
                      <td className="py-3 px-6 text-gray-600 dark:text-gray-400">
                        {athlete.events?.join(', ') || '-'}
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(athlete)}
                            className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(athlete.id)}
                            className="px-3 py-1 text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <AthleteFormModal
          athlete={editingAthlete}
          onSave={handleSaveAthlete}
          onClose={handleModalClose}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this athlete? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
