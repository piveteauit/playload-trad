'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

const LOCALES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
] as const

export const LanguageSelector = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentLocale = searchParams.get('locale') || Cookies.get('payload-locale') || 'fr'

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    params.set('locale', newLocale)
    Cookies.set('payload-locale', newLocale, { path: '/' })
    document.documentElement.lang = newLocale
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="inline-block relative">
      <select
        value={currentLocale}
        onChange={handleLanguageChange}
        className="bg-transparent px-8 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer"
        style={{
          backgroundColor: 'transparent',
          color: 'inherit',
        }}
      >
        {LOCALES.map((locale) => (
          <option
            key={locale.code}
            value={locale.code}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {locale.label}
          </option>
        ))}
      </select>
      <div className="right-0 absolute inset-y-0 flex items-center px-2 text-gray-500 pointer-events-none">
        <svg
          className="fill-current w-4 h-4"
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
