'use client'
import React from 'react'

const LocaleSwitcher = (props: any) => {
  // Récupère la locale courante depuis l'URL
  let currentLocale = 'fr'
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    currentLocale = params.get('locale') || 'fr'
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('locale', newLocale)
      window.location.href = url.toString()
    }
  }

  return (
    <div>
      <label style={{ fontWeight: 'bold', marginRight: 8 }}>Langue :</label>
      <select value={currentLocale} onChange={handleChange}>
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>
    </div>
  )
}

export default LocaleSwitcher
