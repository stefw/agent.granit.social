import MarkdownIt from 'markdown-it'
import markdownItFootnote from 'markdown-it-footnote'
import { supabase } from './supabase'

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
})
.use(markdownItFootnote)
.use((md) => {
  // Règle personnalisée pour les liens YouTube
  const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  // Regex pour détecter les liens Obsidian vers les fichiers audio
  const audioRegex = /!\[\[(.*?\.m4a)\]\]/;

  // Regex pour détecter les liens Obsidian vers les images
  // Capture tous les types d'images courants et aussi les fichiers sans extension (pour les GIF)
  const imageRegex = /!\[\[(.*?(?:\.(?:jpg|jpeg|png|gif|webp|svg)|(?!\.m4a)))\]\]/;

  md.inline.ruler.before('link', 'obsidian_audio', function(state, silent) {
    const match = state.src.slice(state.pos).match(audioRegex);
    if (!match) return false;
    
    if (!silent) {
      const fileName = match[1];
      // Récupérer le topic du post actuel depuis l'environnement
      const topic = state.env.topic || '';
      // Construire le chemin avec les segments encodés individuellement
      const segments = [topic, 'medias', fileName].filter(Boolean);
      const mediaPath = segments.join('/');
      const token = state.push('html_inline', '', 0);
      token.content = `<div data-audio-file="${mediaPath}"></div>`;
      state.pos += match[0].length;
    }
    
    return true;
  });

  // Règle pour les images Obsidian
  md.inline.ruler.before('link', 'obsidian_image', function(state, silent) {
    const match = state.src.slice(state.pos).match(imageRegex);
    if (!match) return false;
    
    if (!silent) {
      const fileName = match[1];
      // Récupérer le topic du post actuel depuis l'environnement
      const topic = state.env.topic || '';
      // Construire le chemin avec les segments encodés individuellement
      const segments = [topic, 'medias', fileName].filter(Boolean);
      const mediaPath = segments.join('/');
      
      const token = state.push('html_inline', '', 0);
      // Utiliser data-image-file comme pour les fichiers audio, au lieu de générer directement l'image
      token.content = `<div data-image-file="${mediaPath}"></div>`;
      state.pos += match[0].length;
    }
    
    return true;
  });

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const href = tokens[idx].attrGet('href');
    
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

  md.renderer.rules.link_close = function(tokens, idx) {
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
  // Vérifier si Supabase est configuré
  if (!supabase) {
    console.warn('Supabase n\'est pas configuré. Retour de données factices.');
    return [
      {
        slug: 'exemple-post',
        title: 'Exemple de post',
        date: new Date().toISOString(),
        excerpt: 'Ceci est un exemple de post généré car Supabase n\'est pas configuré.',
        cover: '',
        content: '<p>Contenu d\'exemple</p>',
        topic: 'Exemple'
      }
    ];
  }

  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .eq('type', 'post')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    return [];
  }
  
  return data.map(post => {
    // Passer le topic dans l'environnement du markdown
    const env = { topic: post.topic };
    
    return {
      slug: post.slug,
      title: post.title,
      date: post.date,
      excerpt: post.excerpt || '',
      cover: post.cover || '',
      content: md.render(post.content, env),
      topic: post.topic
    };
  });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Vérifier si Supabase est configuré
  if (!supabase) {
    console.warn(`Supabase n'est pas configuré. Impossible de récupérer le post ${slug}.`);
    // Retourner un post factice si le slug correspond à notre exemple
    if (slug === 'exemple-post') {
      return {
        slug: 'exemple-post',
        title: 'Exemple de post',
        date: new Date().toISOString(),
        excerpt: 'Ceci est un exemple de post généré car Supabase n\'est pas configuré.',
        cover: '',
        content: '<p>Contenu d\'exemple</p>',
        topic: 'Exemple'
      };
    }
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('contents')
      .select('*')
      .eq('type', 'post')
      .eq('slug', slug)
      .single();
    
    if (error || !data) {
      console.error(`Erreur lors de la récupération du post ${slug}:`, error);
      return null;
    }
    
    // Passer le topic dans l'environnement du markdown
    const env = { topic: data.topic };
    
    return {
      slug: data.slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt || '',
      cover: data.cover || '',
      content: md.render(data.content, env),
      topic: data.topic
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération du post ${slug}:`, error);
    return null;
  }
}

export interface Page {
  slug: string;
  title: string;
  content: string;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  // Vérifier si Supabase est configuré
  if (!supabase) {
    console.warn(`Supabase n'est pas configuré. Impossible de récupérer la page ${slug}.`);
    // Retourner une page factice si le slug correspond à "about"
    if (slug === 'about') {
      return {
        slug: 'about',
        title: 'À propos',
        content: '<p>Cette page est générée car Supabase n\'est pas configuré.</p>'
      };
    }
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('contents')
      .select('*')
      .eq('type', 'page')
      .eq('slug', slug)
      .single();
    
    if (error || !data) {
      console.error(`Erreur lors de la récupération de la page ${slug}:`, error);
      return null;
    }
    
    return {
      slug: data.slug,
      title: data.title,
      content: md.render(data.content)
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération de la page ${slug}:`, error);
    return null;
  }
}

export async function getAllPages(): Promise<Page[]> {
  // Vérifier si Supabase est configuré
  if (!supabase) {
    console.warn('Supabase n\'est pas configuré. Retour de données factices pour les pages.');
    return [
      {
        slug: 'about',
        title: 'À propos',
        content: '<p>Cette page est générée car Supabase n\'est pas configuré.</p>'
      }
    ];
  }

  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .eq('type', 'page');
  
  if (error) {
    console.error('Erreur lors de la récupération des pages:', error);
    return [];
  }
  
  return data.map(page => ({
    slug: page.slug,
    title: page.title,
    content: md.render(page.content)
  }));
}
