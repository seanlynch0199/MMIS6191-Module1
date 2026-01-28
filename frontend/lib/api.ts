import { Athlete, ApiMeet, ApiResult } from '@/data/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export async function fetchAthletes(): Promise<Athlete[]> {
  const res = await fetch(`${BASE_URL}/api/athletes`)

  if (!res.ok) {
    throw new Error(`Failed to fetch athletes: ${res.status}`)
  }

  return res.json()
}

export async function fetchMeets(): Promise<ApiMeet[]> {
  const res = await fetch(`${BASE_URL}/api/meets`)

  if (!res.ok) {
    throw new Error(`Failed to fetch meets: ${res.status}`)
  }

  return res.json()
}

export async function fetchResults(): Promise<ApiResult[]> {
  const res = await fetch(`${BASE_URL}/api/results`)

  if (!res.ok) {
    throw new Error(`Failed to fetch results: ${res.status}`)
  }

  return res.json()
}
