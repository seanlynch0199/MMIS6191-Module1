'use client'

import { useQuery } from '@tanstack/react-query'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { fetchResults, fetchAthletes, fetchMeets } from '@/lib/api'
import { formatSecondsToTime } from '@/lib/utils'

export default function ResultsPage() {
  const {
    data: results,
    isLoading: resultsLoading,
    isError: resultsError,
    error: resultsErr,
    refetch: refetchResults,
  } = useQuery({
    queryKey: ['results'],
    queryFn: fetchResults,
  })

  const { data: athletes } = useQuery({
    queryKey: ['athletes'],
    queryFn: fetchAthletes,
  })

  const { data: meets } = useQuery({
    queryKey: ['meets'],
    queryFn: fetchMeets,
  })

  // Build lookup maps for athlete/meet names
  const athleteMap = new Map(athletes?.map(a => [a.id, a.name]) ?? [])
  const meetMap = new Map(meets?.map(m => [m.id, m.name]) ?? [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Results (from database)
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Individual race results pulled from the database. Times, placements, and meet details for every recorded performance.
      </p>

      {resultsLoading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Athlete</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Meet</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white hidden sm:table-cell">Time</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white hidden md:table-cell">Place</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800 animate-pulse">
                  <td className="py-3 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" /></td>
                  <td className="py-3 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40" /></td>
                  <td className="py-3 px-4 hidden sm:table-cell"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" /></td>
                  <td className="py-3 px-4 hidden md:table-cell"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {resultsError && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-1">Failed to load results.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            {resultsErr instanceof Error ? resultsErr.message : 'An unexpected error occurred.'}
          </p>
          <Button variant="outline" onClick={() => refetchResults()}>
            Retry
          </Button>
        </div>
      )}

      {results && results.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Athlete</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Meet</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white hidden sm:table-cell">Time</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white hidden md:table-cell">Place</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr
                  key={result.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {athleteMap.get(result.athlete_id) ?? `Athlete #${result.athlete_id}`}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-700 dark:text-gray-300">
                      {meetMap.get(result.meet_id) ?? `Meet #${result.meet_id}`}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className="font-semibold text-prBlue-600 dark:text-prBlue-400 tabular-nums">
                      {formatSecondsToTime(result.time_seconds)}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {result.place_overall}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {results && results.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No results found in the database.</p>
          <p className="mt-2">Check back after meets are completed.</p>
        </div>
      )}
    </div>
  )
}
