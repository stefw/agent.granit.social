---
title: "Mon agent (autonome) part faire mes courses chez #carrefour"
date: 2025-02-26
excerpt: Tout ce qu'il faut savoir sur la course la plus prestigieuse du calendrier F1
cover: /images/monaco.jpg
---
Ce soir c’est crêpes à la maison.  
J’ai besoin de **lait** et d’**oeufs bio**, Carrefour bien entendu.
Je lâche mon **agent** sur le eCommerce de [carrefour.Fr](https://carrefour.fr)

Il est contrôlé un minimum - je ne veux pas qu’il fasse de bêtises - par un système d’instructions savamment (!) pensé par mes soins.


```
async def run_carrefour():
	agent = Agent(
		task=('Va sur carrefour.fr, ajoute au panier le produit "Œufs bio moyen CARREFOUR BIO" et 1 bouteille de lait. Je suis à Lille, choisis le premier Drive. Accepte les cookies, ne réponds pas aux enquêtes ni aux questions de carrefrour et ferme les publicités si besoin. Attention, quand tu cliques sur les quantités, cela ajoute directement au panier. Vérifie bien le panier.'),
		llm=llm,
		max_actions_per_step=8,
		use_vision=True,
		browser=browser,
	)
	await agent.run(max_steps=40)
	await browser.close()
```


[look](https://www.youtube.com/watch?v=TvqlGgS0aJw)



![[Recording 20250224194000.m4a]]
