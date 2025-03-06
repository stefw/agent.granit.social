# Migration vers Supabase

Ce document explique comment migrer le contenu du site depuis les fichiers markdown locaux vers Supabase.

## Prérequis

1. Créer un compte sur [Supabase](https://supabase.com)
2. Créer un nouveau projet
3. Récupérer les clés d'API dans les paramètres du projet

## Configuration

1. Créer un fichier `.env.local` à la racine du projet avec les variables suivantes :

```
NEXT_PUBLIC_SUPABASE_URL=votre-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role
```

2. Créer la table `contents` dans Supabase :

- Aller dans l'onglet "SQL Editor" de votre projet Supabase
- Exécuter le script SQL qui se trouve dans `scripts/create-contents-table.sql`

3. Créer un bucket de stockage pour les médias :

- Aller dans l'onglet "Storage" de votre projet Supabase
- Créer un nouveau bucket nommé `media`
- Configurer les politiques d'accès pour permettre la lecture publique

## Migration des données

Exécuter le script de migration :

```bash
npm run migrate
```

Ce script va :
1. Lire tous les fichiers markdown dans le dossier `content/`
2. Uploader les médias (images, fichiers audio) vers Supabase Storage
3. Remplacer les chemins des médias dans le contenu markdown
4. Insérer les données dans la table `contents` de Supabase

## Structure de la base de données

### Table `contents`

| Colonne     | Type                    | Description                           |
|-------------|-------------------------|---------------------------------------|
| id          | UUID                    | Identifiant unique                    |
| slug        | TEXT                    | Slug unique pour l'URL                |
| title       | TEXT                    | Titre du contenu                      |
| date        | TIMESTAMP WITH TIME ZONE| Date de publication                   |
| excerpt     | TEXT                    | Extrait (optionnel)                   |
| content     | TEXT                    | Contenu markdown                      |
| topic       | TEXT                    | Topic/catégorie (optionnel)           |
| cover       | TEXT                    | URL de l'image de couverture (opt.)   |
| type        | TEXT                    | Type de contenu ('post' ou 'page')    |
| created_at  | TIMESTAMP WITH TIME ZONE| Date de création                      |
| updated_at  | TIMESTAMP WITH TIME ZONE| Date de dernière modification         |

## Fonctionnement

Le site utilise maintenant Supabase comme source de données :

1. Les fonctions dans `src/lib/posts.ts` récupèrent les données depuis Supabase au lieu des fichiers locaux
2. Les médias sont servis depuis Supabase Storage
3. Le contenu markdown est rendu côté client avec les mêmes fonctionnalités qu'auparavant

## Développement local

Pour développer localement, assurez-vous que les variables d'environnement sont correctement configurées dans `.env.local`, puis lancez le serveur de développement :

```bash
npm run dev
```

## Déploiement

Lors du déploiement, n'oubliez pas de configurer les variables d'environnement sur votre plateforme d'hébergement.
