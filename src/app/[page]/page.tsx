import { getPageBySlug } from '@/lib/posts'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'

interface PageParams {
  params: { page: string }
}

export default async function StaticPage({ params }: PageParams) {
  const page = await getPageBySlug(params.page)

  if (!page) {
    notFound()
  }

  return (
    <main>
      <Header 
        backButton={{
          label: "Retour à l'accueil",
          href: "/"
        }}
      />
      
      <div className="max-w-3xl mx-auto px-4">
        <article className="prose prose-lg max-w-none 
          prose-headings:font-light prose-headings:text-black dark:prose-headings:text-white
          prose-h1:text-4xl prose-h2:text-2xl prose-h3:text-xl
          prose-pre:font-mono prose-pre:bg-white dark:prose-pre:bg-gray-800 prose-pre:text-xs
          prose-code:font-mono prose-code:text-xs prose-code:text-black dark:prose-code:text-white
          prose-p:text-xs prose-p:leading-relaxed prose-p:text-gray-600 dark:prose-p:text-gray-300
          prose-a:text-red-600 prose-a:no-underline hover:prose-a:text-red-700 dark:prose-a:text-red-400 dark:hover:prose-a:text-red-300"
        >
          <h1>{page.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </article>
      </div>
    </main>
  )
} 