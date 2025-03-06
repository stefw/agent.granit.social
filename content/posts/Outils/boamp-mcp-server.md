---
title: Serveur Model Context Protocol (MCP) pour interroger l'API BOAMP et récupérer les avis de marchés publics.
date: 2024-05-26
excerpt: Tout ce qu'il faut savoir sur la course la plus prestigieuse du calendrier F1
---


Serveur Model Context Protocol (MCP) pour interroger l'API BOAMP et récupérer les avis de marchés publics.

![[mcp.png]]

Ce serveur permet de rechercher des marchés publics en utilisant divers critères et d'obtenir des détails complets sur des marchés spécifiques.  
  
A utiliser dans ton application interne et à connecter sur tes LLMs préférés ou dans cline cursor windsurf, Claude Desktop, etc...

```
get_public_markets

Récupère les avis de marchés publics selon divers critères

**Paramètres:**

- **keywords*** : Liste de mots-clés à rechercher
- **type** : Type de marché (SERVICES, TRAVAUX, FOURNITURES)
- **limit** : Nombre maximum de résultats à retourner
- **sort_by** : Champ de tri (dateparution, datelimitereponse)
- **departments** : Liste des départements (codes)

#### get_market_details

Récupère les détails complets d'un marché spécifique

**Paramètres:**

- **idweb*** : Identifiant du marché
```


### Exemples

- "Recherche les marchés publics contenant les mots-clés *communication et digital*"
- "Recherche les marchés publics contenant *construction d'un hôpital*, exporte les résultats dans un CSV