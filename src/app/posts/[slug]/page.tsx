import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { notFound } from 'next/navigation'
import PostContent from '@/components/PostContent'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import { siteConfig, normalizeUrl } from '@/config/site'
import type { Metadata } from 'next'

type PageParams = {
  params: Promise<{ slug: string }>
}

// Fonction pour extraire la première image du contenu HTML
function extractFirstImage(content: string): string | null {
  console.log('Contenu à analyser:', content);
  
  // Recherche d'images avec data-image-file
  const dataImageRegex = /<div[^>]*data-image-file="([^"]*)"[^>]*>/;
  const dataImageMatch = content.match(dataImageRegex);
  
  console.log('Match data-image-file:', dataImageMatch);
  
  if (dataImageMatch && dataImageMatch[1]) {
    const fileName = dataImageMatch[1].trim();
    console.log('Fichier image trouvé (data-image-file):', fileName);
    return fileName;
  }
  
  // Recherche d'images avec la syntaxe Obsidian ![[filename]]
  const obsidianImageRegex = /!\[\[(.*?)\]\]/;
  const obsidianMatch = content.match(obsidianImageRegex);
  
  console.log('Match Obsidian:', obsidianMatch);
  
  if (obsidianMatch && obsidianMatch[1]) {
    // Extraire le nom du fichier et nettoyer les espaces
    const fileName = obsidianMatch[1].trim();
    console.log('Fichier image trouvé (Obsidian):', fileName);
    return fileName;
  }
  
  // Recherche d'images avec la syntaxe markdown standard ![alt](url)
  const markdownImageRegex = /!\[.*?\]\((.*?)\)/;
  const markdownMatch = content.match(markdownImageRegex);
  
  console.log('Match Markdown:', markdownMatch);
  
  if (markdownMatch && markdownMatch[1]) {
    console.log('Fichier image trouvé (Markdown):', markdownMatch[1]);
    return markdownMatch[1];
  }
  
  // Recherche d'images avec la balise HTML <img>
  const imgTagRegex = /<img.*?src=["'](.*?)["']/;
  const imgMatch = content.match(imgTagRegex);
  
  console.log('Match HTML:', imgMatch);
  
  if (imgMatch && imgMatch[1]) {
    console.log('Fichier image trouvé (HTML):', imgMatch[1]);
    return imgMatch[1];
  }
  
  console.log('Aucune image trouvée');
  return null;
}

// Générer les métadonnées dynamiquement pour chaque post
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post non trouvé',
      description: 'Le post demandé n\'existe pas',
    };
  }
  
  console.log('Analyse du post:', post.slug);
  
  // Extraire la première image du contenu
  const firstImage = extractFirstImage(post.content);
  
  console.log('Image extraite:', firstImage);
  
  // Construire l'URL complète de l'image
  let ogImage: string | null = null;
  
  if (firstImage) {
    // Si c'est une image Obsidian ou une image avec data-image-file
    if (firstImage.endsWith('.gif') || firstImage.endsWith('.jpg') || firstImage.endsWith('.png') || firstImage.endsWith('.jpeg')) {
      // Extraire uniquement le nom du fichier du chemin complet
      const fileName = firstImage.split('/').pop() || firstImage;
      // Construire le chemin vers l'image dans le dossier medias du topic
      ogImage = `${siteConfig.url}/content/posts/${post.topic}/medias/${fileName}`;
      console.log('URL de l\'image construite (Obsidian):', ogImage);
    }
    // Si l'image est une URL absolue, l'utiliser directement
    else if (firstImage.startsWith('http')) {
      ogImage = firstImage;
      console.log('URL de l\'image (absolue):', ogImage);
    } 
    // Si l'image est un chemin relatif, construire l'URL complète
    else {
      // Assurez-vous que le chemin commence par un slash
      const imagePath = firstImage.startsWith('/') ? firstImage : `/${firstImage}`;
      ogImage = `${siteConfig.url}${imagePath}`;
      console.log('URL de l\'image (relative):', ogImage);
    }
  }

  // Utiliser l'image par défaut uniquement si aucune image n'a été trouvée dans le post
  if (!ogImage) {
    ogImage = siteConfig.ogImage;
    console.log('Utilisation de l\'image par défaut:', ogImage);
  }
  
  return {
    title: post.title,
    description: post.excerpt || `${post.title} - ${siteConfig.name}`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `${post.title} - ${siteConfig.name}`,
      type: 'article',
      url: `${siteConfig.url}/posts/${post.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.date,
      authors: ['Granit'],
      tags: [post.topic || 'article'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || `${post.title} - ${siteConfig.name}`,
      images: [ogImage],
      creator: '@agent_granit',
    },
  };
}

export default async function PostPage({ params }: PageParams) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Récupérer tous les posts pour obtenir les topics
  const allPosts = await getAllPosts()

  // Obtenir la liste unique de tous les topics disponibles
  const allTopics = [...new Set(allPosts.map(post => post.topic).filter(Boolean) as string[])]
  
  // Compter les posts par topic
  const topicCounts = allTopics.reduce((acc, topic) => {
    acc[topic] = allPosts.filter(post => post.topic === topic).length
    return acc
  }, {} as Record<string, number>)

  return (
    <main className="md:min-h-screen relative">
      {/* Container avec padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 pt-6 sm:pt-8 lg:mt-16">
        {/* Grille de 12 colonnes pour le header - Adaptée pour mobile */}
        <div className="grid grid-cols-1 md:grid-cols-12 mb-8 md:mb-16 gap-4 md:gap-0">
          {/* Partie gauche (4 colonnes sur desktop, pleine largeur sur mobile) - Nom du site */}
          <div className="col-span-1 md:col-span-4">
            <h1 className="text-[18px] font-extrabold">
              <Link href="/" className="hover:underline transition-colors text-[#0E0D09] dark:text-[#B0B0B0]">
                {siteConfig.name}
              </Link>
            </h1>
          </div>
          
          {/* Partie droite (8 colonnes sur desktop, pleine largeur sur mobile) - Topics et navigation */}
          <div className="col-span-1 md:col-span-8 md:pl-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="overflow-x-auto pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex items-center space-x-6 min-w-max">
                  {allTopics.map(topic => (
                    <Link 
                      key={topic}
                      href={`/topics/${normalizeUrl(topic)}`}
                      className={`group flex items-start hover:text-[#0000CC] dark:hover:text-[#6666FF] transition-colors nav-link ${
                        topic === post.topic 
                          ? 'font-medium text-[#0000CC] dark:text-[#6666FF]' 
                          : 'text-[#0E0D09] dark:text-[#B0B0B0]'
                      }`}
                    >
                      <span className="text-[10px] font-medium relative -top-1 mr-0.5 text-[#0E0D09] dark:text-[#B0B0B0]">{topicCounts[topic] || 0}</span>
                      <span className="text-[16px] sm:text-[18px] font-medium">{topic}</span>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center mt-4 sm:mt-0">
                <Link 
                  href="/about"
                  className="text-xl hover:text-[#0000CC] dark:hover:text-[#6666FF] transition-colors nav-link text-[#0E0D09] dark:text-[#B0B0B0] mt-4 sm:mt-0 hidden sm:block"
                >
                  ?
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Lien "?" positionné en haut à droite sur mobile */}
        <div className="absolute top-6 right-4 sm:hidden">
          <Link 
            href="/about"
            className="text-xl hover:text-[#0000CC] dark:hover:text-[#6666FF] transition-colors nav-link text-[#0E0D09] dark:text-[#B0B0B0]"
          >
            ?
          </Link>
        </div>
        
        {/* Article */}
        <article>
          {/* Première section qui prend la hauteur de l'écran visible moins le header - Adaptée pour mobile */}
          <section className="min-h-[50vh] md:h-[calc(100vh-180px)] flex flex-col">
            {/* Titre centré verticalement */}
            <div className="flex-grow flex items-center">
              <h1 className="text-[40px] sm:text-[60px] md:text-[90px] font-medium leading-[1.1] max-w-full md:max-w-[90%] text-[#0E0D09] dark:text-[#B0B0B0]">
                {post.title}
              </h1>
            </div>
            
            {/* Informations remontées légèrement */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-8 md:pb-24 space-y-4 sm:space-y-0">
              <div className="flex items-center">
                <Link href="/" className="flex items-center text-sm hover:underline text-[#0E0D09] dark:text-[#B0B0B0]">
                  <span>Retour</span>
                  <svg className="ml-1 w-4 h-4 rotate-180" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 5L21 12L14 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-[#0E0D09]/70 dark:text-[#B0B0B0]/70">
                  {post.topic}
                </span>
                <time className="text-sm text-[#0E0D09]/70 dark:text-[#B0B0B0]/70">
                  {new Date(post.date).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: '2-digit'
                  })}
                </time>
              </div>
            </div>
          </section>
          
          {/* Contenu de l'article en grille - Adaptée pour mobile */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-8 md:mt-16">
            {/* Colonne de gauche vide pour maintenir la structure - Cachée sur mobile */}
            <div className="hidden md:block md:col-span-4">
              {/* Espace vide intentionnel */}
            </div>
            
            {/* Colonne de droite avec le contenu - Pleine largeur sur mobile */}
            <div className="col-span-1 md:col-span-8">
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
              <div className="prose prose-lg dark:prose-invert prose-headings:text-[#0E0D09] prose-p:text-[#0E0D09] dark:prose-headings:text-[#B0B0B0] dark:prose-p:text-[#B0B0B0] max-w-none text-[18px] md:text-[22px]">
                <PostContent content={post.content} />
              </div>
            </div>
          </div>
        </article>
      </div>
      
      {/* Theme toggle fixé en bas à droite, aligné avec le "?" */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 md:right-[calc(3em+4.166%)]">
        <ThemeToggle />
      </div>
    </main>
  )
} 