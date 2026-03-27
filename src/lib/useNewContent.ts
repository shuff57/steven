'use client'

import { useState, useEffect, useCallback } from 'react'
import { CONTENT_VERSIONS, CONTENT_ADDITIONS, type ContentAddition } from './contentVersions'

const STORAGE_PREFIX = 'cv-seen-'

function getStorageKey(route: string) {
  return `${STORAGE_PREFIX}${route}`
}

export function useNewRoutes(): Set<string> {
  const [newRoutes, setNewRoutes] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const routes = new Set<string>()
      for (const [route, version] of Object.entries(CONTENT_VERSIONS)) {
        const seen = localStorage.getItem(getStorageKey(route))
        if (seen !== version) routes.add(route)
      }
      setNewRoutes(routes)
    } catch {
      // localStorage unavailable (SSR, private browsing, etc.)
    }
  }, [])

  return newRoutes
}

export function useNewContent(route: string) {
  const [isNew, setIsNew] = useState(false)

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
  }, [route])

  const markSeen = useCallback(() => {
    const expectedVersion = CONTENT_VERSIONS[route]
    if (!expectedVersion) return

    try {
      localStorage.setItem(getStorageKey(route), expectedVersion)
    } catch {
      // localStorage unavailable
    }
    setIsNew(false)
  }, [route])

  const additions: ContentAddition[] = CONTENT_ADDITIONS[route] ?? []

  return { isNew, markSeen, additions }
}
