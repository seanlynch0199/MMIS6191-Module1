export type Season = 'xc' | 'track'
export type TeamLevel = 'hs' | 'ms'
export type Gender = 'boys' | 'girls'
export type EventFocus = 'distance' | 'mid-distance' | 'sprints' | 'relay'

export interface SiteConfig {
  name: string
  shortName: string
  tagline: string
  description: string
  school: string
  mascot: string
  location: string
  colors: {
    primary: string
    accent: string
  }
  contact: {
    email: string
    phone: string
    address: string
  }
  social: {
    twitter?: string
    instagram?: string
    facebook?: string
  }
}

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export interface Runner {
  id: string
  slug: string
  firstName: string
  lastName: string
  teamLevel: TeamLevel
  gender: Gender
  grade: number
  eventFocus: EventFocus
  photo?: string
  bio: string
  prs: PersonalRecord[]
  seasonHistory: SeasonResult[]
  notableMeets: string[]
  isCaptain?: boolean
}

export interface PersonalRecord {
  event: string
  time: string
  date: string
  meet: string
  season: Season
}

export interface SeasonResult {
  season: Season
  year: number
  meetName: string
  date: string
  event: string
  time: string
  place?: number
}

export interface Meet {
  id: string
  name: string
  date: string
  location: string
  address?: string
  notes?: string
  externalUrl?: string
  season: Season
  teamLevels: TeamLevel[]
  isHomeMeet?: boolean
}

export interface ScheduleSeason {
  season: Season
  year: number
  meets: Meet[]
}

export interface MeetResult {
  meetId: string
  meetName: string
  date: string
  season: Season
  teamLevel: TeamLevel
  gender: Gender
  teamPlace?: number
  teamScore?: number
  top5Average?: string
  individualResults: IndividualResult[]
}

export interface IndividualResult {
  runnerId: string
  runnerName: string
  grade: number
  time: string
  place: number
  pr?: boolean
}

export interface Record {
  id: string
  category: string
  event: string
  time: string
  holderName: string
  holderId?: string
  year: number
  meet?: string
  notes?: string
  season: Season
  teamLevel: TeamLevel
  gender: Gender
}

export interface Coach {
  id: string
  name: string
  title: string
  teamLevel: TeamLevel
  bio: string
  photo?: string
  email?: string
  yearsCoaching: number
  specialties: string[]
}

export interface CourseInfo {
  name: string
  distance: string
  terrain: string
  description: string
  mapImageUrl?: string
  mapLink?: string
  tips: CourseTip[]
  spectatorSpots: SpectatorSpot[]
  parking: string
  restrooms: string
  facilities: string[]
}

export interface CourseTip {
  title: string
  content: string
}

export interface SpectatorSpot {
  name: string
  description: string
  accessibility?: string
}

export interface Athlete {
  id: number
  name: string
  grade: number
  personal_record_seconds: number
  created_at: string
}

export interface ApiMeet {
  id: number
  name: string
  meet_date: string
  location: string
  created_at: string
}

export interface ApiResult {
  id: number
  athlete_id: number
  meet_id: number
  time_seconds: number
  place_overall: number
  created_at: string
}

export interface StatHighlight {
  label: string
  value: string | number
  description?: string
  icon?: string
}
