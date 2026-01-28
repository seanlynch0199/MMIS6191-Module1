'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { fetchMeets } from '@/lib/api'
import { Button } from '@/components/ui/Button'

export function ApiMeetsPreview() {
  const { data: meets, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['meets'],
    queryFn: fetchMeets,
  })

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse"
          >
            <div className="flex-shrink-0 w-16 text-center">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10 mx-auto mb-1" />
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto" />
            </div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 mb-1">Failed to load meets.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
          {error instanceof Error ? error.message : 'An unexpected error occurred.'}
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  if (!meets || meets.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center py-8">
        No meets found. Check back soon!
      </p>
    )
  }

  // Sort by date ascending and take next 4
  const upcoming = [...meets]
    .sort((a, b) => a.meet_date.localeCompare(b.meet_date))
    .slice(0, 4)

  return (
    <div className="grid gap-4">
      {upcoming.map((meet) => {
        const date = new Date(meet.meet_date + 'T00:00:00')
        const month = date.toLocaleDateString('en-US', { month: 'short' })
        const day = date.getDate()

        return (
          <div
            key={meet.id}
            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex-shrink-0 w-16 text-center">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {month}
              </div>
              <div className="text-2xl font-bold text-prBlue-600 dark:text-prBlue-400">
                {day}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {meet.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{meet.location}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
