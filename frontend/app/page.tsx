import Link from 'next/link'
import { siteConfig } from '@/data/site'
import { runners, getCaptains } from '@/data/runners'
import { schedules, getUpcomingMeets } from '@/data/schedules'
import { StatCard } from '@/components/StatCard'
import { ApiMeetsPreview } from '@/components/ApiMeetsPreview'
import { formatDateShort } from '@/lib/utils'

export default function HomePage() {
  const upcomingMeetsXC = getUpcomingMeets('xc', 5)
  const upcomingMeetsTrack = getUpcomingMeets('track', 5)
  const upcomingMeets = [...upcomingMeetsXC, ...upcomingMeetsTrack]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5)

  const captains = getCaptains()
  const hsRunners = runners.filter(r => r.teamLevel === 'hs')
  const totalPRs = runners.reduce((acc, r) => acc + r.prs.length, 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-prBlue-500 hero-pattern overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {siteConfig.name}
            </h1>
            <p className="text-xl md:text-2xl text-prBlue-100 mb-8 max-w-2xl mx-auto">
              {siteConfig.tagline}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/schedules"
                className="px-6 py-3 bg-white text-prBlue-600 font-semibold rounded-lg hover:bg-prBlue-50 transition-colors"
              >
                View Schedule
              </Link>
              <Link
                href="/runners"
                className="px-6 py-3 bg-prGreen-500 text-white font-semibold rounded-lg hover:bg-prGreen-600 transition-colors"
              >
                Explore Runners
              </Link>
              <Link
                href="/top-hounds"
                className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Top Hounds
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-white dark:fill-gray-900"
            />
          </svg>
        </div>
      </section>

      {/* Upcoming Meets */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Upcoming Meets
            </h2>
            <Link
              href="/schedules"
              className="text-prBlue-600 dark:text-prBlue-400 hover:underline font-medium"
            >
              View Full Schedule
            </Link>
          </div>

          {upcomingMeets.length > 0 ? (
            <div className="grid gap-4">
              {upcomingMeets.map((meet) => (
                <div
                  key={meet.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {formatDateShort(meet.date).split(' ')[0]}
                    </div>
                    <div className="text-2xl font-bold text-prBlue-600 dark:text-prBlue-400">
                      {formatDateShort(meet.date).split(' ')[1]}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {meet.name}
                      {meet.isHomeMeet && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-prGreen-100 dark:bg-prGreen-900 text-prGreen-700 dark:text-prGreen-300 rounded">
                          HOME
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{meet.location}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="px-2 py-1 text-xs font-medium bg-prBlue-100 dark:bg-prBlue-900 text-prBlue-700 dark:text-prBlue-300 rounded uppercase">
                      {meet.season}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No upcoming meets scheduled. Check back soon!
            </p>
          )}
        </div>
      </section>

      {/* Meets from Database */}
      <section className="pb-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Meets (from database)
            </h2>
            <Link
              href="/schedules"
              className="text-prBlue-600 dark:text-prBlue-400 hover:underline font-medium"
            >
              View Full Schedule
            </Link>
          </div>
          <ApiMeetsPreview />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Program Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              label="State Qualifiers"
              value="12"
              description="2024 Season"
              variant="highlight"
            />
            <StatCard
              label="Personal Records"
              value={totalPRs}
              description="This season"
              variant="accent"
            />
            <StatCard
              label="Team Captains"
              value={captains.length}
              description="Leading the pack"
            />
            <StatCard
              label="Active Runners"
              value={runners.length}
              description="HS & MS programs"
            />
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Explore
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/runners"
              className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-prBlue-300 dark:hover:border-prBlue-600 transition-all hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-prBlue-100 dark:bg-prBlue-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-prBlue-600 dark:text-prBlue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Runners</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Meet our athletes and explore their profiles and PRs.
              </p>
            </Link>

            <Link
              href="/high-school/results/boys"
              className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-prBlue-300 dark:hover:border-prBlue-600 transition-all hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-prGreen-100 dark:bg-prGreen-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-prGreen-600 dark:text-prGreen-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Results</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View meet results, team scores, and individual times.
              </p>
            </Link>

            <Link
              href="/top-hounds"
              className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-prBlue-300 dark:hover:border-prBlue-600 transition-all hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Top Hounds</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                All-time records, rankings, and championship history.
              </p>
            </Link>

            <Link
              href="/home-meet"
              className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-prBlue-300 dark:hover:border-prBlue-600 transition-all hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Home Meet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Course info, spectator spots, and meet day details.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-prGreen-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Go Timberwolves!
          </h2>
          <p className="text-prGreen-100 mb-8 max-w-2xl mx-auto">
            Follow our teams throughout the season. Check schedules, results, and cheer on our runners as they chase their goals.
          </p>
          <Link
            href="/schedules"
            className="inline-block px-6 py-3 bg-white text-prGreen-600 font-semibold rounded-lg hover:bg-prGreen-50 transition-colors"
          >
            View Full Schedule
          </Link>
        </div>
      </section>
    </div>
  )
}
