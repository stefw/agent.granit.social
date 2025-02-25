import { getAllPosts } from '@/lib/posts'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { siteConfig, normalizeUrl } from '@/config/site'
import ThemeToggle from '@/components/ThemeToggle'
import Image from 'next/image'

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
      <div className="container mx-auto px-2 md:px-4 lg:px-6 pt-6 md:pt-8 lg:pt-12">
        {/* Grille de 12 colonnes */}
        <div className="grid grid-cols-12 min-h-screen">
          {/* Partie gauche (4 colonnes) - Header */}
          <div className="col-span-4 pr-4 flex flex-col">
            <div className="sticky top-8">
              <h1 className="text-[18px] font-extrabold mb-4">
                <Link href="/" className="hover:underline transition-colors dark:text-white">
                  {siteConfig.name}
                </Link>
              </h1>
              <div className="h-[calc(100vh-200px)] flex items-center">
                <p className="text-[18px] font-normal text-[#0E0D09] dark:text-white leading-[1.3]">
                  {siteConfig.description}
                </p>
              </div>
            </div>
          </div>
          
          {/* Partie droite (8 colonnes) - Contenu */}
          <div className="col-span-8 pl-8">
            {/* Navigation principale */}
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center space-x-6">
                {allTopics.map(topic => (
                  <Link 
                    key={topic}
                    href={`/topics/${normalizeUrl(topic)}`}
                    className="group flex items-start hover:text-[#0000CC] dark:hover:text-[#6666FF] transition-colors nav-link dark:text-white"
                  >
                    <span className="text-[10px] font-medium relative -top-1 mr-0.5 dark:text-white">{topicCounts[topic] || 0}</span>
                    <span className="text-[18px] font-medium dark:text-white">{topic}</span>
                  </Link>
                ))}
              </div>
              
              <Link 
                href="/about"
                className="text-xl hover:text-[#0000CC] dark:hover:text-[#6666FF] transition-colors nav-link dark:text-white"
              >
                ?
              </Link>
            </div>
            
            {/* Image d'illustration A laisser cacher pour l'instant */}
            {/* <div className="mb-16">
              <div className="relative w-full aspect-[16/9] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="absolute inset-0">
                  <svg className="w-full h-full text-gray-300 dark:text-gray-600" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="1200" height="675" fill="currentColor" />
                    <path d="M600 337.5C600 522.9 464.4 675 300 675C135.6 675 0 522.9 0 337.5C0 152.1 135.6 0 300 0C464.4 0 600 152.1 600 337.5Z" fill="black" fillOpacity="0.1" />
                    <path d="M1200 337.5C1200 522.9 1064.4 675 900 675C735.6 675 600 522.9 600 337.5C600 152.1 735.6 0 900 0C1064.4 0 1200 152.1 1200 337.5Z" fill="black" fillOpacity="0.1" />
                  </svg>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-[18px] font-normal leading-[1.6] text-gray-700 dark:text-gray-300">
                  Dans un monde entièrement cramé par les influences de l'IA, quelques âmes audacieuses tentent, contre vents et marées, de préserver l'initiative et l'autonomie comme si leur vie en dépendait — ce qui, en toute honnêteté, pourrait très bien être le cas.
                </p>
              </div>
            </div> */}
            
            {/* Liste des posts (sans groupement par topic) */}
            <div className="space-y-2">
              {sortedPosts.map((post) => (
                <article key={post.slug} className="pb-8">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-[#0E0D09]/70 dark:text-white">
                      {post.topic}
                    </span>
                    <time className="text-sm text-[#0E0D09]/70 dark:text-white/70">
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
                    <h2 className="text-[40px] font-medium leading-[1.2]">
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
      
      {/* Theme toggle fixé en bas à droite */}
      <div className="fixed bottom-8 right-8">
        <ThemeToggle />
      </div>
    </main>
  )
}
