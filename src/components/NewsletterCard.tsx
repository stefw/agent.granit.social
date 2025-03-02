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
    <div className="fixed inset-0 bg-[#F9F9F9] dark:bg-[#0E0D09] z-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-[#F9F9F9] dark:bg-[#0E0D09] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="p-6 relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-[#0E0D09]/70 hover:text-[#0E0D09] dark:text-[#B0B0B0]/70 dark:hover:text-[#B0B0B0] transition-colors"
          >
            ✕
          </button>
          
          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2 text-[#0E0D09] dark:text-[#B0B0B0]">
              {siteConfig.name}
            </h1>
            <p className="text-sm text-[#0E0D09]/70 dark:text-[#B0B0B0]/70">
              {siteConfig.description}
            </p>
          </div>

          <NewsletterForm />
        </div>
      </div>
    </div>
  )
} 