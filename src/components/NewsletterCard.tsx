'use client'

import { useState, useEffect } from 'react'
import NewsletterForm from './NewsletterForm'
import { siteConfig } from '@/config/site'

export default function NewsletterCard() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Vérifier si le cookie existe
    const hasSeenCard = document.cookie.includes('hasSeenNewsletterCard=true')
    if (!hasSeenCard) {
      // Afficher immédiatement la card
      setIsVisible(true)
      // Empêcher le scroll du body
      document.body.style.overflow = 'hidden'
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    // Définir un cookie qui expire dans 30 jours
    document.cookie = 'hasSeenNewsletterCard=true; max-age=2592000; path=/'
    // Réactiver le scroll
    document.body.style.overflow = 'auto'
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="p-6 relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
          
          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2">
              {siteConfig.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {siteConfig.description}
            </p>
          </div>

          <NewsletterForm />
        </div>
      </div>
    </div>
  )
} 