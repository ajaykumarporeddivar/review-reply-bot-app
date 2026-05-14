'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'

/**
 * Custom hook for managing state in localStorage, with SSR safety.
 *
 * @param key The key to use for localStorage.
 * @param initialValue The initial value if no item is found in localStorage.
 * @returns A tuple containing the current value and a setter function.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // SSR-safe: Read from localStorage only after the component mounts
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error)
    }
  }, [key])

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }, [key])

  return [storedValue, setValue]
}

/**
 * Custom hook for filtering a list of items based on search string and status.
 *
 * @param items The array of items to filter.
 * @param fields An array of keys to search within each item.
 * @returns An object containing filtered items, search string, setSearch, status, and setStatus.
 */
export function useFilter<T extends Record<string, unknown>>(
  items: T[],
  fields: (keyof T)[]
): {
  filtered: T[]
  search: string
  setSearch: (s: string) => void
  status: string
  setStatus: (s: string) => void
} {
  const [search, setSearch] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  const filtered = useMemo(() => {
    let filteredItems = items

    if (search) {
      const lowercasedSearch = search.toLowerCase()
      filteredItems = filteredItems.filter((item) =>
        fields.some((field) =>
          String(item[field]).toLowerCase().includes(lowercasedSearch)
        )
      )
    }

    if (status) {
      filteredItems = filteredItems.filter(
        (item) => String(item.status).toLowerCase() === status.toLowerCase()
      )
    }

    return filteredItems
  }, [items, search, status, fields])

  return { filtered, search, setSearch, status, setStatus }
}

/**
 * Custom hook for managing modal state.
 *
 * @returns An object with modal open state, open/close functions, and the active item.
 */
export function useModal<T = unknown>(): {
  isOpen: boolean
  open: (item?: T) => void
  close: () => void
  activeItem: T | null
} {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [activeItem, setActiveItem] = useState<T | null>(null)

  const open = useCallback((item?: T) => {
    setActiveItem(item ?? null)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setActiveItem(null)
  }, [])

  return { isOpen, open, close, activeItem }
}

/**
 * Custom hook for displaying transient toast notifications.
 *
 * @returns An object with toast message, type, visibility, and a function to show the toast.
 */
export function useDemoToast(): {
  message: string
  type: 'success' | 'error' | 'info'
  visible: boolean
  show: (msg: string, type?: 'success' | 'error' | 'info') => void
} {
  const [message, setMessage] = useState<string>('')
  const [type, setType] = useState<'success' | 'error' | 'info'>('info')
  const [visible, setVisible] = useState<boolean>(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const show = useCallback(
    (msg: string, toastType: 'success' | 'error' | 'info' = 'info') => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      setMessage(msg)
      setType(toastType)
      setVisible(true)

      timerRef.current = setTimeout(() => {
        setVisible(false)
        setMessage('')
      }, 2500)
    },
    []
  )

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return { message, type, visible, show }
}