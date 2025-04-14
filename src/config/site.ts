export const siteConfig = {
  name: "Agentic Or Not",
  description: "Droguées à l'IA, dissoutes par TikTok et les daubes Hanounesques, des âmes audacieuses tentent, contre vents et marées, de préserver l'initiative et l'autonomie, comme si leurs vies en dépendaient — ce qui, en toute honnêteté, pourrait très bien être le cas. Nous sommes ici pour tenter de comprendre, et pouvoir organiser les luttes qui viennent. ",
  url: "https://agent.granit.social",
  ogImage: "https://agent.granit.social/images/hok.jpg",
  links: {
    twitter: "https://twitter.com/agent_granit",
    github: "https://github.com/agent-granit",
  },
  newsletter: {
    title: "Newsletter",
    description: "Abonnez-vous à notre newsletter"
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