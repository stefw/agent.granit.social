'use client'

import React, { useState } from 'react'
import { siteConfig } from '@/config/site'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Merci de votre inscription !')
        setEmail('')
      } else {
        throw new Error(data.error || 'Une erreur est survenue')
      }
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Une erreur est survenue')
    }
  }

  return (
    <div className="mt-12 pt-12">
      <div className="max-w-xl">
        <h3 className="font-light text-xl mb-4">{siteConfig.newsletter.title}</h3>
        <p className="text-gray-600 text-xs mb-6">
          {siteConfig.newsletter.description}
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            className="flex-1 px-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-red-600"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-2 text-xs font-mono bg-[#0000CC] text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Envoi...' : 'S\'inscrire'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-xs ${status === 'success' ? 'text-green-600' : 'text-[#0000CC]'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
} 