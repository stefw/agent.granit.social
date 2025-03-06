'use client'

import { useEffect } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: true,
  theme: 'neutral',
  securityLevel: 'loose',
  themeVariables: {
    fontFamily: 'var(--font-geist-mono)',
    fontSize: '14px',
    lineHeight: '1.5',
    primaryColor: '#dc2626', // text-red-600
    primaryTextColor: '#000000', // Noir pour le texte
    primaryBorderColor: '#dc2626',
    secondaryColor: '#f5f5dc', // Fond beige clair pour les nodes
    tertiaryColor: '#f5f5dc', // Beige clair
    mainBkg: '#f5f5dc', // Fond beige clair pour tous les éléments
    nodeBorder: '#dc2626',
    clusterBkg: '#f5f5dc', // Beige clair pour les clusters
    titleColor: '#000000', // Noir pour les titres
    edgeLabelBackground: '#f5f5dc', // Beige clair
    lineColor: '#dc2626',
  },
  flowchart: {
    curve: 'basis',
    padding: 20,
    nodeSpacing: 50,
    rankSpacing: 50,
    htmlLabels: true,
  },
  sequence: {
    mirrorActors: false,
    bottomMarginAdj: 10,
    messageAlign: 'center',
    actorFontSize: 14,
    noteFontSize: 14,
    messageFontSize: 14,
    wrap: true,
    width: 150,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
  },
})

interface PostContentProps {
  content: string
}

export default function PostContent({ content }: PostContentProps) {
  useEffect(() => {
    mermaid.contentLoaded()

    // Remplacer les div YouTube par le composant
    const youtubeElements = document.querySelectorAll('[data-youtube-id]')
    youtubeElements.forEach((element) => {
      const videoId = element.getAttribute('data-youtube-id')
      if (videoId) {
        const youtubeComponent = document.createElement('div')
        const root = document.createElement('div')
        root.className = 'relative w-full pb-[56.25%] h-0 rounded-lg overflow-hidden my-20'
        const iframe = document.createElement('iframe')
        iframe.src = `https://www.youtube.com/embed/${videoId}`
        iframe.title = 'YouTube video player'
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        iframe.allowFullscreen = true
        iframe.className = 'absolute top-0 left-0 w-full h-full border-0'
        root.appendChild(iframe)
        youtubeComponent.appendChild(root)
        element.parentNode?.replaceChild(youtubeComponent, element)
      }
    })

    // Note: Les fichiers audio sont maintenant directement intégrés en HTML dans le contenu
    // via le script de migration, donc nous n'avons plus besoin de remplacer les div audio
    
    // Cependant, nous conservons le code pour les éléments qui pourraient encore utiliser
    // l'ancien format (pour la rétrocompatibilité)
    const audioElements = document.querySelectorAll('[data-audio-file]')
    audioElements.forEach((element) => {
      const mediaPath = element.getAttribute('data-audio-file')
      if (mediaPath) {
        const audioComponent = document.createElement('div')
        audioComponent.className = 'my-20'
        const audio = document.createElement('audio')
        audio.controls = true
        audio.className = 'w-full audio-player'
        audio.preload = 'metadata'
        
        // Appliquer les styles directement
        audio.style.backgroundColor = 'var(--bg-color, #F9F9F9)'
        document.documentElement.style.setProperty('--bg-color', document.documentElement.classList.contains('dark') ? '#0E0D09' : '#F9F9F9')
        
        // Mettre à jour la couleur de fond lorsque le thème change
        const observer = new MutationObserver(() => {
          document.documentElement.style.setProperty('--bg-color', document.documentElement.classList.contains('dark') ? '#0E0D09' : '#F9F9F9')
        })
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
        audio.style.borderRadius = '4px'
        audio.style.padding = '0px'
        
        // Ajouter des styles personnalisés pour le lecteur audio
        const style = document.createElement('style')
        style.textContent = `
          .audio-player::-webkit-media-controls-panel {
            background-color: #6666FF !important;
          }
          
          .audio-player::-webkit-media-controls-play-button,
          .audio-player::-webkit-media-controls-volume-slider,
          .audio-player::-webkit-media-controls-timeline,
          .audio-player::-webkit-media-controls-current-time-display,
          .audio-player::-webkit-media-controls-time-remaining-display,
          .audio-player::-webkit-media-controls-mute-button {
            filter: brightness(200%);
            color: white !important;
          }
        `
        audioComponent.appendChild(style)
        
        // Vérifier si le chemin est déjà une URL complète (Supabase Storage)
        const source = document.createElement('source')
        if (mediaPath.startsWith('http')) {
          source.src = mediaPath
        } else {
          // Fallback pour les anciens chemins
          source.src = `/content/posts/${mediaPath}`
        }
        source.type = 'audio/mp4'
        audio.appendChild(source)
        
        // Ajouter un message de fallback
        const fallback = document.createElement('p')
        fallback.textContent = 'Votre navigateur ne supporte pas la lecture audio.'
        audio.appendChild(fallback)
        
        audioComponent.appendChild(audio)
        element.parentNode?.replaceChild(audioComponent, element)
      }
    })
    
    // Note: Les images sont maintenant directement intégrées en markdown standard dans le contenu
    // via le script de migration, donc nous n'avons plus besoin de remplacer les div image
    
    // Cependant, nous conservons le code pour les éléments qui pourraient encore utiliser
    // l'ancien format (pour la rétrocompatibilité)
    const imageElements = document.querySelectorAll('[data-image-file]')
    imageElements.forEach((element) => {
      const mediaPath = element.getAttribute('data-image-file')
      if (mediaPath) {
        const img = document.createElement('img')
        
        // Vérifier si le chemin est déjà une URL complète (Supabase Storage)
        if (mediaPath.startsWith('http')) {
          img.src = mediaPath
        } else {
          // Fallback pour les anciens chemins
          img.src = `/content/posts/${mediaPath}`
        }
        
        img.alt = mediaPath.split('/').pop() || ''
        img.className = 'my-8 w-full'
        
        element.parentNode?.replaceChild(img, element)
      }
    })
    

    
  }, [content])

  return (
    <div 
      className="prose prose-lg max-w-none 
        prose-headings:font-light prose-headings:text-black dark:prose-headings:text-white
        prose-h1:text-4xl prose-h2:text-2xl prose-h3:text-xl
        prose-pre:my-20 prose-pre:font-mono prose-pre:bg-[transparent] prose-pre:text-black dark:prose-pre:bg-[transparent] dark:prose-pre:text-[#FFFFFF] prose-pre:whitespace-pre-wrap prose-pre:border-l-[20px] 
        prose-code:font-mono prose-code:text-xs prose-code:text-black prose-code:bg-[transparent] dark:prose-code:bg-[transparent] dark:prose-code:text-white prose-code:whitespace-pre-wrap
        prose-p:text-[22px] prose-p:leading-relaxed prose-p:text-[#111408] dark:prose-p:text-white
        prose-li:text-[20px] prose-li:leading-relaxed prose-li:text-[#111408] dark:prose-li:text-white
        prose-strong:font-bold prose-strong:text-black dark:prose-strong:text-white
        prose-a:text-[#0000CC] prose-a:no-underline hover:prose-a:text-[#0000CC]/80 dark:prose-a:text-[#6666FF] dark:hover:prose-a:text-[#6666FF]/80
        prose-table:border-collapse prose-table:w-full
        prose-thead:bg-gray-50 dark:prose-thead:bg-gray-800
        prose-th:p-2 prose-th:text-left prose-th:text-[0.5rem] prose-th:text-gray-600 dark:prose-th:text-white prose-th:uppercase
        prose-td:p-2 prose-td:border-b prose-td:border-gray-200 dark:prose-td:border-gray-700 prose-td:text-xs prose-td:text-gray-600 dark:prose-td:text-white
        [&_.mermaid]:bg-[#f5f5dc] [&_.mermaid]:text-black [&_.mermaid]:p-4 dark:[&_.mermaid]:bg-[#f5f5dc] dark:[&_.mermaid]:text-black
        [&_.footnotes]:mt-16  [&_.footnotes]:border-t [&_.footnotes]:border-b [&_.footnotes]:border-gray-200 dark:[&_.footnotes]:border-gray-700
        [&_.footnotes-sep]:hidden
        [&_.footnotes_ol]:list-decimal [&_.footnotes_ol]:pl-4
        [&_.footnotes-list]:text-sm
        [&_.footnotes_li]:text-sm [&_.footnotes_li]:text-gray-600 dark:[&_.footnotes_li]:text-gray-400
        [&_.footnotes_li_p]:!text-sm [&_.footnotes_li_p]:!text-gray-600 dark:[&_.footnotes_li_p]:!text-gray-400
        [&_.footnote-ref]:text-xs [&_.footnote-ref]:align-super [&_.footnote-ref]:text-[#0000CC] dark:[&_.footnote-ref]:text-[#6666FF]
        [&_.footnote-backref]:ml-1 [&_.footnote-backref]:text-[#0000CC] dark:[&_.footnote-backref]:text-[#6666FF]"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
