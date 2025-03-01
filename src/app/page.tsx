import { getAllPosts } from '@/lib/posts'
import Link from 'next/link'
import { siteConfig, normalizeUrl } from '@/config/site'
import ThemeToggle from '@/components/ThemeToggle'

export default async function Home() {
  const posts = await getAllPosts()
  
  // Trier les posts par date (du plus récent au plus ancien)
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 10) // Limiter aux 10 posts les plus récents
  
  // Obtenir la liste unique de tous les topics disponibles
  const allTopics = [...new Set(posts.map(post => post.topic).filter(Boolean) as string[])]
  
  // Compter les posts par topic
  const topicCounts = allTopics.reduce((acc, topic) => {
    acc[topic] = posts.filter(post => post.topic === topic).length
    return acc
  }, {} as Record<string, number>)

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
                  {allTopics.map(topic => (
                    <Link 
                      key={topic}
                      href={`/topics/${normalizeUrl(topic)}`}
                      className="group flex items-start hover:text-[#0000CC] dark:hover:text-[#6666FF] transition-colors nav-link dark:text-white"
                    >
                      <span className="text-[10px] font-medium relative -top-1 mr-0.5 dark:text-white">{topicCounts[topic] || 0}</span>
                      <span className="text-[16px] sm:text-[18px] font-medium dark:text-white">{topic}</span>
                    </Link>
                  ))}
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
            

            <div className="my-10 md:my-12">
              <img 
                src="/images/hp22.png" 
                className="object-cover" 
              />
            </div>


            {/* Liste des posts (sans groupement par topic) */}
            <div className="pt-20 space-y-2">
              {sortedPosts.map((post) => (
                <article key={post.slug} className="pb-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-1 sm:space-y-0">
                    <span className="text-sm text-[#0E0D09]/70 dark:text-white">
                      {post.topic}
                    </span>
                    <time className="text-sm text-[#0E0D09]/70 dark:text-white">
                      {new Date(post.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit'
                      })}
                    </time>
                  </div>
                  <Link 
                    href={`/posts/${post.slug}`} 
                    className="block hover:opacity-95 transition-opacity"
                  >
                    <h2 className="text-[28px] sm:text-[32px] md:text-[40px] font-medium leading-[1.2]">
                      {post.title}
                    </h2>
                  </Link>
                </article>
              ))}
              
              {/* Afficher un message si aucun post n'est disponible */}
              {sortedPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Aucun article disponible pour le moment.</p>
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
