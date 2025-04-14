import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { siteConfig } from '@/config/site'
import ThemeToggle from '@/components/ThemeToggle'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liens utiles - F4YB',
  description: 'Collection de liens utiles et intéressants',
}

export default async function LinksPage() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        set(name: string, value: string, options: Record<string, unknown>) {
          // Note: Dans Next.js 15, on ne peut pas modifier les cookies dans un composant serveur
          // Cette fonction ne sera pas utilisée ici, mais est nécessaire pour l'interface
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        remove(name: string, options: Record<string, unknown>) {
          // Note: Dans Next.js 15, on ne peut pas modifier les cookies dans un composant serveur
          // Cette fonction ne sera pas utilisée ici, mais est nécessaire pour l'interface
        },
      },
    }
  )
  
  // Récupérer tous les liens triés par date (du plus récent au plus ancien)
  const { data: links, error } = await supabase
    .from('contents')
    .select('title, content, excerpt, url, date')
    .eq('type', 'link')
    .order('date', { ascending: false })
  
  if (error) {
    console.error('Erreur lors de la récupération des liens:', error)
  }

  return (
    <main className="min-h-screen relative">
      {/* Container avec padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 pt-6 sm:pt-8 lg:mt-16">
        {/* Grille de 12 colonnes - Adaptée pour mobile */} 
        <div className="grid grid-cols-1 md:grid-cols-12 md:min-h-screen gap-8 md:gap-0">
          {/* Partie gauche (4 colonnes sur desktop, pleine largeur sur mobile) - Header */}
          <div className="col-span-1 md:col-span-4 md:pr-4 flex flex-col">
            <div className="md:sticky md:top-8">
              <h1 className="text-[18px] font-extrabold mb-4">
                <Link href="/" className="hover:underline transition-colors dark:text-white">
                  {siteConfig.name}
                </Link>
              </h1>
              <div className="h-auto md:h-[calc(100vh-200px)] flex items-start md:items-center mb-8 md:mb-0">
                <p className="text-[16px] md:text-[18px] font-normal text-[#0E0D09] dark:text-white leading-[1.3]">
                  {siteConfig.description}
                </p>
              </div>
            </div>
          </div>
          
          {/* Partie droite (8 colonnes sur desktop, pleine largeur sur mobile) - Contenu */}
          <div className="col-span-1 md:col-span-8 md:pl-8">
            {/* Navigation principale - Scrollable sur mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 md:mb-6">
              <div className="overflow-x-auto pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex items-center space-x-6 min-w-max">
                  <h2 className="text-[16px] sm:text-[18px] font-medium dark:text-white">
                    A manger, et à boire
                  </h2>
                </div>
              </div>
              
              {/* Lien "?" visible uniquement sur tablette et desktop */}
              <div className="hidden sm:block">
                <Link 
                  href="/about"
                  className="text-xl hover:text-[#0000CC] dark:hover:text-[#6666FF] transition-colors nav-link dark:text-white"
                >
                  ?
                </Link>
              </div>
            </div>
            
            {/* Lien "?" positionné en haut à droite sur mobile */}
            <div className="absolute top-6 right-4 sm:hidden">
              <Link 
                href="/about"
                className="text-xl hover:text-[#0000CC] dark:hover:text-[#6666FF] transition-colors nav-link dark:text-white"
              >
                ?
              </Link>
            </div>

            {/* Liste des liens - Style similaire à la page d'accueil */}
            <div className="pt-8 space-y-2">
              {links && links.length > 0 ? (
                <div className="space-y-2">
                  {links.map((link, index) => (
                    <article key={index} className="pb-2 border-b border-gray-100 dark:border-gray-800 last:border-0">

                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-2">
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group"
                          >
                            <h2 className="text-[14px] sm:text-[16px] font-medium leading-[1.1] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {link.title}
                            </h2>
                          </a>
                        </div>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center shrink-0 pt-1"
                        >
                         
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                      
                      {link.excerpt && (
                        <p className="text-gray-600 dark:text-gray-400 mt-0.5 text-xs">
                          {link.excerpt}
                        </p>
                      )}
                      
                      {!link.excerpt && link.content && (
                        <p className="text-gray-600 dark:text-gray-400 mt-0.5 text-xs">
                          {link.content}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Aucun lien disponible pour le moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Theme toggle fixé en bas à droite, aligné avec le "?" */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 md:right-[calc(3em+4.166%)]">
        <ThemeToggle />
      </div>
    </main>
  )
}
