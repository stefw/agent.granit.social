import { getAllPosts } from '@/lib/posts'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import NewsletterForm from '@/components/NewsletterForm'
import Header from '@/components/Header'
import { siteConfig, normalizeUrl } from '@/config/site'

export default async function Home() {
  const posts = await getAllPosts()
  const postsPerTopic = siteConfig.home.postsPerTopic

  // Grouper les posts par topic
  const postsByTopic = posts.reduce((acc, post) => {
    const topic = post.topic || 'Non classé'
    if (!acc[topic]) {
      acc[topic] = []
    }
    acc[topic].push(post)
    return acc
  }, {} as Record<string, typeof posts>)

  // Obtenir la liste des topics
  const topics = Object.keys(postsByTopic)

  return (
    <main>
      <Header />
      
      <div className="max-w-3xl mx-auto px-4">
        {/* Navigation par topic */}
        <nav className="mb-16">
          <ul className="flex flex-wrap gap-2 font-mono text-xs">
            {topics.map(topic => (
              <li key={topic}>
                <Link 
                  href={`/topics/${normalizeUrl(topic)}`}
                  className="px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 hover:border-red-600 hover:text-[#0000CC]  transition-colors"
                >
                  {topic}
                  <span className="ml-2 text-gray-400 dark:text-gray-500">
                    {postsByTopic[topic].length}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="space-y-16">
          {Object.entries(postsByTopic).map(([topic, topicPosts]) => (
            <div key={topic} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-mono uppercase text-gray-500 dark:text-gray-400">
                  <Link href={`/topics/${normalizeUrl(topic)}`} className="hover:text-[#0000CC] transition-colors px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 hover:border-red-600">
                    {topic}
                  </Link>
                </h2>
                {topicPosts.length > postsPerTopic && (
                  <Link 
                    href={`/topics/${normalizeUrl(topic)}`}
                    className="text-xs font-mono text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors"
                  >
                    Voir tout ({topicPosts.length})
                  </Link>
                )}
              </div>
              
              <div className="grid divide-y divide-gray-100 dark:divide-gray-800">
                {topicPosts.slice(0, postsPerTopic).map((post) => (
                  <article key={post.slug} className="overflow-hidden py-4">
                    <Link 
                      href={`/posts/${post.slug}`} 
                      className="block hover:opacity-95 transition-opacity"
                    >
                      <div className="flex gap-8 items-baseline">
                        <time className="text-[0.5rem]  uppercase  dark:text-gray-400 w-24 shrink-0">
                          {format(new Date(post.date), 'dd MMMM yyyy', { locale: fr })}
                        </time>
                        <h2 className="text-2xl group font-serif font-medium   ">
                          {post.title} <span className="font-mono text-transparent group-hover:text-black dark:group-hover:text-white transition-colors">#</span>
                        </h2>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>


      </div>
    </main>
  )
}
