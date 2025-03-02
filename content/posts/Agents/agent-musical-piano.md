---
title: Jouons du piano, en python ma soeur...
date: 2025-03-02
excerpt: Tout ce qu'il faut savoir sur la course la plus prestigieuse du calendrier F1
cover: /images/monaco.jpg
---


## 1) Je construis un piano html5 
## 2) Je lance un agent pour m'aider


![[Recording 20250302195014.m4a]]





[look](https://www.youtube.com/watch?v=I4CNwJ3zXso)



```
async def run_piano():
	agent = Agent(
		task=('Joue moi Au Clair de la lune'),
		llm=llm,
		max_actions_per_step=8,
		use_vision=True,
		browser=browser,
	)
	await agent.run(max_steps=40)
	await browser.close()
```



