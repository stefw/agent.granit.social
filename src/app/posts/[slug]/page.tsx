import { getPostBySlug } from '@/lib/posts'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { notFound } from 'next/navigation'
import PostContent from '@/components/PostContent'
import Header from '@/components/Header'

interface PageParams {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PageParams) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <main>
      <Header 
        backButton={{
          label: "Retour",
          href: "/"
        }}
      />
      
      <article className="max-w-3xl mx-auto px-4 my-10 ">
        <div>
          <div className="mb-8">

            
            <h1 className="text-6xl font-serif font-black  text-gray-800 dark:text-gray-100 mb-4">
              {post.title}
            </h1>


            <time className="text-[0.7rem] mb-2 block font-mono uppercase text-gray-500 dark:text-gray-400">
              {format(new Date(post.date), 'dd MMMM yyyy', { locale: fr })}
            </time>
          </div>

          <PostContent content={post.content} />

        </div>
      </article>
    </main>
  )
} 