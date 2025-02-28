import { getPageBySlug } from '@/lib/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import ThemeToggle from '@/components/ThemeToggle'

interface PageParams {
  params: Promise<{ page: string }>
}

export default async function StaticPage({ params }: PageParams) {
  const { page } = await params
  const pageContent = await getPageBySlug(page)

  if (!pageContent) {
    notFound()
  }

  return (
    <main className="min-h-screen relative">
      {/* Container avec padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 pt-6 sm:pt-8 lg:mt-16">
        {/* Grille de 12 colonnes pour le header - Adaptée pour mobile */}
        <div className="grid grid-cols-1 md:grid-cols-12 mb-8 md:mb-16 gap-4 md:gap-0">
          {/* Partie gauche (4 colonnes sur desktop, pleine largeur sur mobile) - Nom du site */}
          <div className="col-span-1 md:col-span-4">
            <h1 className="text-[18px] font-extrabold">
              <Link href="/" className="hover:underline transition-colors dark:text-white">
                {siteConfig.name}
              </Link>
            </h1>
          </div>
          
          {/* Partie droite (8 colonnes sur desktop, pleine largeur sur mobile) - Navigation */}
          <div className="col-span-1 md:col-span-8 md:pl-4 mt-4 md:mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <Link href="/" className="flex items-center text-sm hover:underline dark:text-white">
                  <svg className="mr-1 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 5L21 12L14 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Retour</span>
                </Link>
              </div>
              
              <div className="flex items-center mt-4 sm:mt-0">
                <Link 
                  href="/about"
                className="text-xl hover:text-[#0000CC] dark:hover:text-[#6666FF] transition-colors nav-link dark:text-white mt-4 sm:mt-0"
                >
                  ?
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contenu de la page - Adaptée pour mobile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Colonne de gauche vide pour maintenir la structure - Cachée sur mobile */}
          <div className="hidden md:block md:col-span-4">
            {/* Espace vide intentionnel */}
          </div>
          
          {/* Colonne de droite avec le contenu - Pleine largeur sur mobile */}
          <div className="col-span-1 md:col-span-8">
            <article>
              <h1 className="text-[28px] sm:text-[32px] md:text-[40px] font-medium leading-[1.2] mb-6 md:mb-8">
                {pageContent.title}
              </h1>
              
              <div className="prose prose-lg dark:prose-invert max-w-none 
                prose-headings:font-medium 
                prose-h1:text-2xl sm:prose-h1:text-3xl md:prose-h1:text-4xl 
                prose-h2:text-xl sm:prose-h2:text-2xl 
                prose-h3:text-lg sm:prose-h3:text-xl
                prose-pre:font-mono prose-pre:bg-white dark:prose-pre:bg-gray-800 prose-pre:text-xs
                prose-code:font-mono prose-code:text-xs
                prose-p:text-[18px] md:prose-p:text-[14px] prose-p:leading-relaxed  font-medium 
                prose-a:text-[#0000CC] dark:prose-a:text-[#6666FF] prose-a:no-underline hover:prose-a:text-[#0000CC]/80 dark:hover:prose-a:text-[#6666FF]/80
                prose-table:border-collapse prose-table:w-full
              prose-thead:bg-gray-50 dark:prose-thead:bg-gray-800
                prose-th:p-2 prose-th:text-left prose-th:text-[0.5rem] prose-th:text-gray-600 dark:prose-th:text-white prose-th:uppercase
                prose-td:p-2 prose-td:border-b prose-td:border-gray-200 dark:prose-td:border-gray-700 prose-td:text-xs prose-td:text-gray-600 dark:prose-td:text-white"
                dangerouslySetInnerHTML={{ __html: pageContent.content }}
              />
            </article>
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