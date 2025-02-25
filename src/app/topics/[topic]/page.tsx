import { getAllPosts } from '@/lib/posts'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { notFound } from 'next/navigation'
import { normalizeUrl, siteConfig } from '@/config/site'
import ThemeToggle from '@/components/ThemeToggle'
import Image from 'next/image'

interface PageParams {
  params: {
    topic: string
  }
}

export default async function TopicPage({ params }: PageParams) {
  const { topic } = await params
  const posts = await getAllPosts()
  const decodedTopic = decodeURIComponent(topic)
  
  // Trouver le topic original qui correspond à l'URL normalisée
  const originalTopic = posts
    .map(post => post.topic)
    .find(topic => topic && normalizeUrl(topic) === decodedTopic)

  if (!originalTopic) {
    notFound()
  }

  // Filtrer et trier les posts par date (du plus récent au plus ancien)
  const topicPosts = posts
    .filter(post => post.topic === originalTopic)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

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
                    className={`group flex items-start hover:text-[#0000CC] dark:hover:text-[#6666FF] transition-colors nav-link ${
                      topic === originalTopic ? 'font-medium text-[#0000CC] dark:text-[#6666FF]' : 'dark:text-white'
                    }`}
                  >
                    <span className="text-[10px] font-medium relative -top-1 mr-0.5 dark:text-white">{topicCounts[topic] || 0}</span>
                    <span className="text-[18px] font-medium">{topic}</span>
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
            
            {/* En-tête du topic laisser cacher pour l'instant */}
            {/* <div className="mb-16">
              <h1 className="text-[32px] font-medium mb-2">{originalTopic}</h1>
              <p className="text-sm text-[#0E0D09]/70 dark:text-white/70">
                {topicPosts.length} article{topicPosts.length > 1 ? 's' : ''}
              </p>
            </div> */}
            
            {/* Liste des posts */}
            <div className="space-y-2">
              {topicPosts.map((post) => (
                <article key={post.slug} className="pb-8">
                  <div className="flex justify-between items-start mb-2">
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
                    <h2 className="text-[40px] font-medium leading-[1.2]">
                      {post.title}
                    </h2>
                  </Link>
                </article>
              ))}
              
              {topicPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Aucun article disponible pour ce sujet.</p>
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