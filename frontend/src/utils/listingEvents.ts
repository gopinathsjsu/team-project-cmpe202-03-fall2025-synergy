const LISTING_DELETED_EVENT = 'listingDeleted'

export type ListingDeletedDetail = {
  listingId: number
}

type ListenerCleanup = () => void

const isBrowser = typeof window !== 'undefined'

export const emitListingDeleted = (listingId: number) => {
  if (!isBrowser) return
  window.dispatchEvent(
    new CustomEvent<ListingDeletedDetail>(LISTING_DELETED_EVENT, {
      detail: { listingId }
    })
  )
}

export const subscribeToListingDeleted = (callback: (listingId: number) => void): ListenerCleanup => {
  if (!isBrowser) {
    return () => {}
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<ListingDeletedDetail>
    const deletedId = customEvent.detail?.listingId
    if (typeof deletedId === 'number') {
      callback(deletedId)
    }
  }

  window.addEventListener(LISTING_DELETED_EVENT, handler as EventListener)

  return () => {
    window.removeEventListener(LISTING_DELETED_EVENT, handler as EventListener)
  }
}

