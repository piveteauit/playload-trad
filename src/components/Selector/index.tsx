import React from 'react'

const LocaleSwitcher = (props: any) => {
  // Utilise la locale passée par Payload, sinon fallback 'fr'
  const currentLocale = props?.locale || 'fr'

  console.log('currentLocale', currentLocale)

  return (
    <div>
      <label style={{ fontWeight: 'bold', marginRight: 8 }}>Langue :</label>
      <a
        href="?locale=fr"
        style={{
          marginRight: 8,
          fontWeight: currentLocale === 'fr' ? 'bold' : 'normal',
          textDecoration: 'underline',
          color: currentLocale === 'fr' ? '#0070f3' : 'inherit',
        }}
      >
        Français
      </a>
      <a
        href="?locale=en"
        style={{
          fontWeight: currentLocale === 'en' ? 'bold' : 'normal',
          textDecoration: 'underline',
          color: currentLocale === 'en' ? '#0070f3' : 'inherit',
        }}
      >
        English
      </a>
    </div>
  )
}

export default LocaleSwitcher
