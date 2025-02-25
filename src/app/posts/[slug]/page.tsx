import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { notFound } from 'next/navigation'
import PostContent from '@/components/PostContent'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import { siteConfig, normalizeUrl } from '@/config/site'
import Image from 'next/image'

interface PageParams {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PageParams) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Récupérer tous les posts pour obtenir les topics
  const allPosts = await getAllPosts()
  const topicUrl = post.topic ? `/topics/${normalizeUrl(post.topic)}` : null

  // Obtenir la liste unique de tous les topics disponibles
  const allTopics = [...new Set(allPosts.map(post => post.topic).filter(Boolean) as string[])]
  
  // Compter les posts par topic
  const topicCounts = allTopics.reduce((acc, topic) => {
    acc[topic] = allPosts.filter(post => post.topic === topic).length
    return acc
  }, {} as Record<string, number>)

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
          
          {/* Partie droite (8 colonnes) - Topics et navigation */}
          <div className="col-span-8 pl-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {allTopics.map(topic => (
                  <Link 
                    key={topic}
                    href={`/topics/${normalizeUrl(topic)}`}
                    className={`group flex items-start hover:text-[#0000CC] dark:hover:text-[#6666FF] transition-colors nav-link ${
                      topic === post.topic ? 'font-medium text-[#0000CC] dark:text-[#6666FF]' : 'dark:text-white'
                    }`}
                  >
                    <span className="text-[10px] font-medium relative -top-1 mr-0.5 dark:text-white">{topicCounts[topic] || 0}</span>
                    <span className="text-[18px] font-medium">{topic}</span>
                  </Link>
                ))}
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
        
        {/* Article */}
        <article>
          {/* Première section qui prend la hauteur de l'écran visible moins le header */}
          <section className="h-[calc(100vh-120px)] flex flex-col">
            {/* Titre centré verticalement */}
            <div className="flex-grow flex items-center">
              <h1 className="text-[90px] font-medium leading-[1.1] max-w-[90%]">
                {post.title}
              </h1>
            </div>
            
            {/* Informations remontées légèrement */}
            <div className="flex justify-between items-center pb-16 pt-4">
              <div className="flex items-center">
                <Link href="/" className="flex items-center text-sm hover:underline dark:text-white">
                  <span>Retour</span>
                  <svg className="ml-1 w-4 h-4 rotate-180" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 5L21 12L14 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-[#0E0D09]/70 dark:text-white/70">
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
            </div>
          </section>
          
          {/* Contenu de l'article en grille */}
          <div className="grid grid-cols-12 gap-8 mt-16">
            {/* Colonne de gauche vide pour maintenir la structure */}
            <div className="col-span-4">
              {/* Espace vide intentionnel */}
            </div>
            
            {/* Colonne de droite avec le contenu */}
            <div className="col-span-8">
              {/* Lecteur vidéo laisser cacher */}
              {/* <div className="mb-12 w-full rounded-lg overflow-hidden bg-black relative aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div> */}

              {/* Contenu de l'article */}
              <div className="prose prose-lg dark:prose-invert prose-headings:text-[#0E0D09] prose-p:text-[#0E0D09] dark:prose-headings:text-[#B0B0B0] dark:prose-p:text-[#B0B0B0] max-w-none text-[22px]">
                <PostContent content={post.content} />
              </div>
            </div>
          </div>
        </article>
      </div>
      
      {/* Theme toggle fixé en bas à droite */}
      <div className="fixed bottom-8 right-8">
        <ThemeToggle />
      </div>
    </main>
  )
} 