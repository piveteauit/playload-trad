'use client'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

const LOCALES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
] as const

export const LanguageSelector: React.FC = () => {
  const [currentLocale, setCurrentLocale] = useState<string>('fr')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const storedLocale = Cookies.get('payload-locale') || 'fr'
    setCurrentLocale(storedLocale)
    document.documentElement.lang = storedLocale
  }, [])

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    Cookies.set('payload-locale', newLocale, { path: '/' })
    document.documentElement.lang = newLocale
    setCurrentLocale(newLocale)

    // Recharger la page pour appliquer la nouvelle langue
    window.location.reload()
  }

  if (!isClient) return null

  return (
    <div className="relative inline-block">
      <select
        value={currentLocale}
        onChange={handleLanguageChange}
        className="appearance-none bg-transparent border border-gray-300 rounded-md px-8 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        style={{
          backgroundColor: 'transparent',
          color: 'inherit',
        }}
      >
        {LOCALES.map((locale) => (
          <option
            key={locale.code}
            value={locale.code}
            className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
          >
            {locale.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg
          className="h-4 w-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  )
}

export default LanguageSelector
