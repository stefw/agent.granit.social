export const siteConfig = {
  name: "Agentic Or Not",
  description: "Dans un monde entièrement cramé par les influences de l'IA, quelques âmes audacieuses tentent, contre vents et marées, de préserver l'initiative et l'autonomie comme si leurs vies en dépendaient — ce qui, en toute honnêteté, pourrait très bien être le cas. Nous sommes ici pour tenter de comprendre, afin de pouvoir organiser nos luttes.",
  url: "https://agent.granit.social",
  ogImage: "https://agent.granit.social/og.jpg",
  links: {
    twitter: "https://twitter.com/agent_granit",
    github: "https://github.com/agent-granit",
  },
  newsletter: {
    title: "Newsletter",
    description: "sqdfqsdf"
  },
  home: {
    postsPerTopic: 3, // Nombre de posts à afficher par topic sur la page d'accueil
  }
} as const

/**
 * Normalise une chaîne pour l'utiliser dans une URL
 * - Convertit en minuscules
 * - Remplace les espaces par des tirets
 * - Supprime les caractères spéciaux
 */
export function normalizeUrl(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^\w\s-]/g, '') // Supprime les caractères spéciaux
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-') // Remplace les tirets multiples par un seul
}

export type SiteConfig = typeof siteConfig 