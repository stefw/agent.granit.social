import NewsletterForm from './NewsletterForm'
import Link from 'next/link'
import { siteConfig } from '@/config/site'

export default function Footer() {
  return (
    <footer className="mt-2">
      <div className="container mx-auto px-2 md:px-4 lg:px-6 pb-6 md:pb-8 lg:pb-12">
        <div className="grid grid-cols-12">
          {/* Partie gauche (4 colonnes) - vide pour maintenir l'alignement */}
          <div className="col-span-4"></div>
          
          {/* Partie droite (8 colonnes) - contenu du footer */}
          <div className="col-span-8 pl-8 py-8">
            <div className="mb-16">
              <NewsletterForm />
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <h3 className="text-xs uppercase text-gray-500 mb-4">À propos</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="text-xs text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors">
                      Qui suis je ?
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="md:col-span-3">
                <h3 className="text-xs uppercase text-gray-500 mb-4">Manifesto</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Agentic Or Not explore les initiatives et l&apos;autonomie dans un monde transformé par l&apos;intelligence artificielle. À travers des articles, des analyses et des réflexions, nous examinons comment préserver notre capacité d&apos;action et notre indépendance.
                </p>
              </div>
            </div>

            <div className="mt-12 pt-8">
              <p className="text-xs text-gray-500 text-center">
                © {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 