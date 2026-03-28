'use client'

import { useState, useEffect, useCallback } from 'react'
import { CONTENT_VERSIONS, CONTENT_ADDITIONS, type ContentAddition } from './contentVersions'

const STORAGE_PREFIX = 'cv-seen-'

/** Custom event name used to notify same-window hooks when a route is marked seen. */
const SEEN_EVENT = 'cv-content-seen'

function getStorageKey(route: string) {
  return `${STORAGE_PREFIX}${route}`
}

function computeNewRoutes(): Set<string> {
  const routes = new Set<string>()
  try {
    for (const [route, version] of Object.entries(CONTENT_VERSIONS)) {
      const seen = localStorage.getItem(getStorageKey(route))
      if (seen !== version) routes.add(route)
    }
  } catch {
    // localStorage unavailable (SSR, private browsing, etc.)
  }
  return routes
}

export function useNewRoutes(): Set<string> {
  const [newRoutes, setNewRoutes] = useState<Set<string>>(new Set())

  useEffect(() => {
    setNewRoutes(computeNewRoutes())

    // Re-compute when another hook in the same window marks a route as seen
    const refresh = () => setNewRoutes(computeNewRoutes())
    window.addEventListener(SEEN_EVENT, refresh)
    return () => window.removeEventListener(SEEN_EVENT, refresh)
  }, [])

  return newRoutes
}

export function useNewContent(route: string) {
  const [isNew, setIsNew] = useState(false)

  const markSeen = useCallback(() => {
    const expectedVersion = CONTENT_VERSIONS[route]
    if (!expectedVersion) return

    try {
      localStorage.setItem(getStorageKey(route), expectedVersion)
    } catch {
      // localStorage unavailable
    }
    setIsNew(false)

    // Notify other hooks (e.g. useNewRoutes in Navigation) to refresh
    window.dispatchEvent(new Event(SEEN_EVENT))
  }, [route])

  useEffect(() => {
    const expectedVersion = CONTENT_VERSIONS[route]
    if (!expectedVersion) return

    try {
      const seenVersion = localStorage.getItem(getStorageKey(route))
      if (seenVersion !== expectedVersion) {
        setIsNew(true)
      }
    } catch {
      // localStorage unavailable (SSR, private browsing, etc.)
    }
  }, [route, markSeen])

  const additions: ContentAddition[] = CONTENT_ADDITIONS[route] ?? []

  return { isNew, markSeen, additions }
}
