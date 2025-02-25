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
      <div className="container mx-auto px-2 md:px-4 lg:px-6 pt-6 md:pt-8 lg:pt-12">
        {/* Grille de 12 colonnes pour le header */}
        <div className="grid grid-cols-12 mb-16">
          {/* Partie gauche (4 colonnes) - Nom du site */}
          <div className="col-span-4">
            <h1 className="text-[18px] font-extrabold">
              <Link href="/" className="hover:underline transition-colors dark:text-white">
                {siteConfig.name}
              </Link>
            </h1>
          </div>
          
          {/* Partie droite (8 colonnes) - Navigation */}
          <div className="col-span-8 pl-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/" className="flex items-center text-sm hover:underline dark:text-white">
                  <svg className="mr-1 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 5L21 12L14 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Retour</span>
                </Link>
              </div>
              
              <div className="flex items-center">
                <Link 
                  href="/about"
                  className="text-xl hover:text-[#0000CC] dark:hover:text-[#6666FF] transition-colors nav-link mr-4 dark:text-white"
                >
                  ?
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contenu de la page */}
        <div className="grid grid-cols-12 gap-8">
          {/* Colonne de gauche vide pour maintenir la structure */}
          <div className="col-span-4">
            {/* Espace vide intentionnel */}
          </div>
          
          {/* Colonne de droite avec le contenu */}
          <div className="col-span-8">
            <article>
              <h1 className="text-[40px] font-medium leading-[1.2] mb-8">
                {pageContent.title}
              </h1>
              
              <div className="prose prose-lg dark:prose-invert max-w-none 
                prose-headings:font-light 
                prose-h1:text-4xl prose-h2:text-2xl prose-h3:text-xl
                prose-pre:font-mono prose-pre:bg-white dark:prose-pre:bg-gray-800 prose-pre:text-xs
                prose-code:font-mono prose-code:text-xs
                prose-p:text-[22px] prose-p:leading-relaxed 
                prose-a:text-[#0000CC] dark:prose-a:text-[#6666FF] prose-a:no-underline hover:prose-a:text-[#0000CC]/80 dark:hover:prose-a:text-[#6666FF]/80"
                dangerouslySetInnerHTML={{ __html: pageContent.content }}
              />
            </article>
          </div>
        </div>
      </div>
      
      {/* Theme toggle fixé en bas à droite */}
      <div className="fixed bottom-8 right-8">
        <ThemeToggle />
      </div>
    </main>
  )
} 