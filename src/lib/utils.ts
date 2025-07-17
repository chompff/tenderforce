import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useState, useEffect } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Stealth Mode Management
const STEALTH_MODE_KEY = 'tenderforce_stealth_mode'

export const stealthModeStorage = {
  get: (): boolean => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(STEALTH_MODE_KEY) === 'true'
  },
  set: (enabled: boolean): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STEALTH_MODE_KEY, enabled.toString())
  }
}

export const useStealthMode = () => {
  const [isStealthMode, setIsStealthMode] = useState<boolean>(() => stealthModeStorage.get())

  const toggleStealthMode = (enabled: boolean) => {
    setIsStealthMode(enabled)
    stealthModeStorage.set(enabled)
    
    // Update document title
    if (enabled) {
      document.title = 'EED Tool - EU Energy Efficiency Directive Check'
    } else {
      document.title = 'Tenderforce - Complete aanbestedingen'
    }
  }

  useEffect(() => {
    // Set initial title
    if (isStealthMode) {
      document.title = 'EED Tool - EU Energy Efficiency Directive Check'
    }
  }, [isStealthMode])

  return {
    isStealthMode,
    enableStealthMode: () => toggleStealthMode(true),
    disableStealthMode: () => toggleStealthMode(false)
  }
}
