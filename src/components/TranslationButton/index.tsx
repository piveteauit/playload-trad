'use client'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TranslationButton: React.FC<{
  englishText: string
  frenchText: string
  fieldName: string
  onTranslate: (translation: string) => void
}> = ({ englishText, frenchText, fieldName, onTranslate }) => {
  const { i18n } = useTranslation()
  const currentLocale = i18n.language

  const handleTranslate = async () => {
    try {
      const textToTranslate = currentLocale === 'fr' ? frenchText : englishText
      const targetLang = currentLocale === 'fr' ? 'en' : 'fr'

      // Pour l'instant, on fait juste une copie du texte
      // TODO: Implémenter un service de traduction
      onTranslate(textToTranslate)
    } catch (error) {
      console.error('Erreur lors de la traduction:', error)
    }
  }

  return (
    <button
      type="button"
      onClick={handleTranslate}
      className="btn btn-sm btn-secondary"
      style={{
        padding: '6px 12px',
        fontSize: '14px',
        borderRadius: '4px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ddd',
        cursor: 'pointer',
        marginLeft: '8px',
      }}
    >
      {currentLocale === 'fr' ? 'Traduire en anglais' : 'Translate to French'}
    </button>
  )
}

export default TranslationButton
