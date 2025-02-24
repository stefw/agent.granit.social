import { getAllPosts } from '@/lib/posts'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import { normalizeUrl } from '@/config/site'

interface PageParams {
  params: Promise<{ topic: string }>
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

  const topicPosts = posts.filter(post => post.topic === originalTopic)

  return (
    <main>
      <Header 
        backButton={{
          label: "Retour à l'accueil",
          href: "/"
        }}
      />
      
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-xs font-mono uppercase text-gray-500 dark:text-gray-400">
            {originalTopic}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {topicPosts.length} post{topicPosts.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid divide-y divide-gray-100 dark:divide-gray-800">
          {topicPosts.map((post) => (
            <article key={post.slug} className="overflow-hidden py-4">
              <Link 
                href={`/posts/${post.slug}`}
                className="block hover:opacity-95 transition-opacity"
              >
                <div className="flex gap-8 items-baseline">
                  <time className="text-[0.6rem] font-mono uppercase text-black dark:text-gray-400 w-24 shrink-0">
                    {format(new Date(post.date), 'dd MMMM yyyy', { locale: fr })}
                  </time>
                  <h2 className="text-2xl group font-serif ">
                    {post.title} <span className="font-mono text-transparent group-hover:text-black dark:group-hover:text-white transition-colors">#</span>
                  </h2>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
} 