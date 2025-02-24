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
    primaryTextColor: '#1f2937', // text-gray-800
    primaryBorderColor: '#dc2626',
    secondaryColor: '#ffffff', // blanc pour le fond des nodes
    tertiaryColor: '#ffffff',
    mainBkg: '#ffffff', // fond blanc pour tous les éléments
    nodeBorder: '#dc2626',
    clusterBkg: '#f9fafb', // gray-50 pour les clusters
    titleColor: '#1f2937',
    edgeLabelBackground: '#ffffff',
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
        root.className = 'relative w-full pb-[56.25%] h-0 rounded-lg overflow-hidden my-8'
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

    // Remplacer les div audio par le composant AudioPlayer
    const audioElements = document.querySelectorAll('[data-audio-file]')
    audioElements.forEach((element) => {
      const fileName = element.getAttribute('data-audio-file')
      if (fileName) {
        const audioComponent = document.createElement('div')
        audioComponent.className = 'my-4'
        const audio = document.createElement('audio')
        audio.controls = true
        audio.className = 'w-full'
        audio.preload = 'metadata'
        audio.crossOrigin = 'anonymous'
        const source = document.createElement('source')
        source.src = `/content/${encodeURIComponent(fileName)}`
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
  }, [content])

  return (
    <div 
      className="prose prose-lg max-w-none 
        prose-headings:font-light prose-headings:text-black dark:prose-headings:text-white
        prose-h1:text-4xl prose-h2:text-2xl prose-h3:text-xl
        prose-pre:font-mono prose-pre:bg-black dark:prose-pre:bg-gray-800 prose-pre:text-xs prose-pre:whitespace-pre-wrap 
        prose-code:font-mono prose-code:text-xs prose-code:text-white dark:prose-code:text-white prose-code:whitespace-pre-wrap
        prose-p:text-lg font-serif font-medium prose-p:leading-relaxed prose-p:text-[#111408] dark:prose-p:text-gray-300
        prose-strong:font-bold prose-strong:text-black dark:prose-strong:text-white
        prose-a:text-[#0000CC] prose-a:no-underline hover:prose-a:text-red-700 dark:prose-a:text-red-400 dark:hover:prose-a:text-red-300
        prose-table:border-collapse prose-table:w-full
        prose-thead:bg-gray-50 dark:prose-thead:bg-gray-800
        prose-th:p-2 prose-th:text-left prose-th:font-mono prose-th:text-[0.5rem] prose-th:text-gray-600 dark:prose-th:text-gray-300 prose-th:uppercase
        prose-td:p-2 prose-td:border-b prose-td:border-gray-200 dark:prose-td:border-gray-700 prose-td:text-xs prose-td:text-gray-600 dark:prose-td:text-gray-300"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
} 