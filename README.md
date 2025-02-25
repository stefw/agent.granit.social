# Agent.Granit.Social

Un blog moderne sur les agents autonomes et l'intelligence artificielle, construit avec Next.js 15.

## À propos du projet

Agent.Granit.Social est un blog qui explore les initiatives et l'autonomie dans un monde transformé par l'intelligence artificielle. À travers des articles, des analyses et des réflexions, nous examinons comment préserver notre capacité d'action et notre indépendance.

## Fonctionnalités

- **Architecture moderne** : Construit avec Next.js 15 et l'App Router
- **Contenu en Markdown** : Articles stockés en Markdown avec support pour les métadonnées via frontmatter
- **Organisation par topics** : Contenu organisé par thématiques
- **Support multimédia** : Intégration de fichiers audio, images et GIFs
- **Compatibilité Obsidian** : Support pour les liens et médias au format Obsidian
- **Design responsive** : Interface adaptée à tous les appareils
- **Mode sombre/clair** : Thème adaptatif selon les préférences utilisateur

## Structure du projet

```
agent.granit.social/
├── content/               # Contenu du blog
│   ├── pages/             # Pages statiques (About, etc.)
│   ├── posts/             # Articles du blog
│   │   ├── Topic1/        # Organisation par topic
│   │   │   ├── medias/    # Fichiers médias pour ce topic
│   │   │   └── post1.md   # Article au format Markdown
├── public/                # Fichiers statiques
├── src/                   # Code source
│   ├── app/               # App Router de Next.js
│   ├── components/        # Composants React
│   ├── config/            # Configuration du site
│   └── lib/               # Utilitaires et fonctions
```

## Gestion des médias

Le blog supporte différents types de médias :

- **Images** : Intégrées via Markdown standard ou syntaxe Obsidian
- **Audio** : Fichiers audio intégrés via la syntaxe Obsidian `![[nom-du-fichier.m4a]]`
- **GIFs** : Supportés comme les images
- **YouTube** : Intégration automatique des liens YouTube

Les fichiers médias sont stockés dans un dossier `medias` à la racine de chaque topic.

## Démarrage

1. Clonez le dépôt :
```bash
git clone https://github.com/stefw/agent.granit.social.git
cd agent.granit.social
```

2. Installez les dépendances :
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Lancez le serveur de développement :
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

4. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Ajout de contenu

Pour ajouter un nouvel article :

1. Créez un fichier Markdown dans le dossier `content/posts/[Topic]/`
2. Ajoutez le frontmatter avec les métadonnées :
```md
---
title: "Titre de l'article"
date: 2025-02-26
excerpt: "Courte description de l'article"
cover: "/chemin/vers/image.jpg"  # Optionnel
---

Contenu de l'article...
```

3. Pour ajouter des médias, placez-les dans le dossier `content/posts/[Topic]/medias/`

## Déploiement

Le site peut être déployé sur Vercel ou tout autre hébergeur compatible avec Next.js.

```bash
npm run build
# ou
yarn build
# ou
pnpm build
```

## Licence

Ce projet est sous licence MIT.
