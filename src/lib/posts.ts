import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

const postsDirectory = path.join(process.cwd(), 'content/posts')
const pagesDirectory = path.join(process.cwd(), 'content/pages')

// Fonction récursive pour lire les fichiers dans les sous-dossiers
function getFilesRecursively(dir: string): string[] {
  const files: string[] = []
  
  // Vérifier si le répertoire existe
  if (!fs.existsSync(dir)) {
    console.warn(`Le répertoire ${dir} n'existe pas`)
    return files
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getFilesRecursively(fullPath))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // Obtenir le chemin relatif par rapport au dossier content
      const relativePath = path.relative(postsDirectory, fullPath)
      files.push(relativePath)
    }
  })

  return files
}

// Regex pour extraire l'ID de la vidéo YouTube
const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/

const md = new MarkdownIt({ 
  html: true,
  highlight: function (str, lang) {
    if (lang === 'mermaid') {
      return `<div class="mermaid">${str}</div>`
    }
    return `<pre class="language-${lang}"><code>${str}</code></pre>`
  }
}).use((md) => {
  // Règle personnalisée pour les liens YouTube
  const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const href = token.attrGet('href');
    
    if (href) {
      const match = href.match(youtubeRegex);
      if (match && match[1]) {
        const videoId = match[1];
        // Remplacer le lien par un composant YouTube
        return `<div data-youtube-id="${videoId}">`;
      }
    }

    return defaultRender(tokens, idx, options, env, self);
  };

  md.renderer.rules.link_close = function(tokens, idx, options, env, self) {
    const token = tokens[idx];
    const openToken = tokens[idx - 2]; // Le token d'ouverture correspondant
    if (openToken && openToken.attrGet('href')?.match(youtubeRegex)) {
      return '</div>';
    }
    return '</a>';
  };

  return md;
});

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  cover: string
  content: string
  topic?: string // Le topic du post basé sur le dossier
}

export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(postsDirectory)) {
    console.warn('Le répertoire des posts n\'existe pas')
    return []
  }

  const fileNames = getFilesRecursively(postsDirectory)
  const allPosts = await Promise.all(fileNames.map(async (fileName) => {
    // Extraire le slug et le topic du chemin relatif
    const topic = path.dirname(fileName) !== '.' ? path.dirname(fileName) : undefined
    const slug = path.basename(fileName, '.md')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = await fs.promises.readFile(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug: slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      cover: data.cover,
      content: md.render(content),
      topic
    }
  }))

  return allPosts.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const allPosts = await getAllPosts()
    // Chercher le post par le nom du fichier uniquement
    const post = allPosts.find(post => post.slug === slug)
    
    if (!post) {
      return null
    }

    return post
  } catch {
    return null
  }
}

export interface Page {
  slug: string
  title: string
  content: string
}

export function getPageBySlug(slug: string): Page | null {
  try {
    const fullPath = path.join(pagesDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title,
      content: md.render(content)
    }
  } catch {
    return null
  }
}

export function getAllPages(): Page[] {
  if (!fs.existsSync(pagesDirectory)) {
    console.warn('Le répertoire des pages n\'existe pas')
    return []
  }

  const fileNames = fs.readdirSync(pagesDirectory)
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(pagesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title,
        content: md.render(content)
      }
    })
} 