export type ReportStatus = 'OPEN' | 'RESOLVED' | 'REJECTED'
export type UserStatus = 'ACTIVE' | 'SUSPENDED'
export type ListingStatus = 'ACTIVE' | 'SOLD' | 'REMOVED'

export interface User { id: string; name: string; email: string; status: UserStatus }
export interface Listing { id: string; title: string; seller: string; status: ListingStatus }
export interface Report { id: string; listingId: string; reason: string; status: ReportStatus }

const seeds = {
  users: [
    { id: 'u1', name: 'Alice', email: 'alice@campus.edu', status: 'ACTIVE' },
    { id: 'u2', name: 'Bob', email: 'bob@campus.edu', status: 'SUSPENDED' },
    { id: 'u3', name: 'Carol', email: 'carol@campus.edu', status: 'ACTIVE' },
  ] as User[],
  listings: [
    { id: 'l1', title: 'Calculus Textbook', seller: 'Alice', status: 'ACTIVE' },
    { id: 'l2', title: 'MacBook 2020', seller: 'Bob', status: 'SOLD' },
    { id: 'l3', title: 'Desk Lamp', seller: 'Carol', status: 'ACTIVE' },
  ] as Listing[],
  reports: [
    { id: 'r1', listingId: 'l1', reason: 'Spam', status: 'OPEN' },
    { id: 'r2', listingId: 'l3', reason: 'Inappropriate', status: 'RESOLVED' },
  ] as Report[],
}

function load<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key)
  return raw ? (JSON.parse(raw) as T) : fallback
}
function save<T>(key: string, value: T) { localStorage.setItem(key, JSON.stringify(value)) }

export function getUsers() { return load<User[]>('admin_users', seeds.users) }
export function setUsers(v: User[]) { save('admin_users', v) }
export function getListings() { return load<Listing[]>('admin_listings', seeds.listings) }
export function setListings(v: Listing[]) { save('admin_listings', v) }
export function getReports() { return load<Report[]>('admin_reports', seeds.reports) }
export function setReports(v: Report[]) { save('admin_reports', v) }

export function metrics() {
  const users = getUsers()
  const listings = getListings()
  const reports = getReports()
  return {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'ACTIVE').length,
    totalListings: listings.length,
    openReports: reports.filter(r => r.status === 'OPEN').length,
  }
}


