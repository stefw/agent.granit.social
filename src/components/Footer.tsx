import NewsletterForm from './NewsletterForm'
import Link from 'next/link'
import { siteConfig } from '@/config/site'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-24">
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="mb-16">
          <NewsletterForm />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-mono text-xs uppercase text-gray-500 mb-4">À propos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-xs text-gray-600 hover:text-red-600 transition-colors">
                  Qui suis je ?
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h3 className="font-mono text-xs uppercase text-gray-500 mb-4">Manifesto</h3>
            <p className="text-xs text-gray-600">
              Agentic Or Not explore les initiatives et l'autonomie dans un monde transformé par l'intelligence artificielle. À travers des articles, des analyses et des réflexions, nous examinons comment préserver notre capacité d'action et notre indépendance.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
} 