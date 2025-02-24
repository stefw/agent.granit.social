export function normalizeUrl(str: string): string {
  return str
    .toLowerCase() // Convertir en minuscules
    .normalize('NFD') // Normaliser les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les diacritiques
    .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères non alphanumériques par des tirets
    .replace(/^-+|-+$/g, '') // Supprimer les tirets au début et à la fin
}

export const siteConfig = {
  name: "Agentic Or Not",
  description: "Initiatives et autonomies dans un monde cramé par l'IA",
  url: "https://agenticornot.com",
  links: {
    twitter: "https://twitter.com",
    github: "https://github.com"
  },
  newsletter: {
    title: "Newsletter",
    description: "sqdfqsdf"
  },
  home: {
    postsPerTopic: 2 // Nombre d'articles à afficher par topic sur la page d'accueil
  }
} as const

export type SiteConfig = typeof siteConfig 