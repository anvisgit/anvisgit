# Anvi Wadhwa — interactive portfolio

A retro space portfolio adapted from the interactive Vue and p5.js project at [Dazep986/Portfolio_2](https://github.com/Dazep986/Portfolio_2). It keeps the animated 3D systems, orbital motion, draggable project windows, and right-side system navigation, with Anvi’s content and a minimal white, green, and cyan color theme.

## Run locally

Requires Node.js 20.19+ or 22.12+. Do not open index.html directly: the app’s modules need the Vite server.

```sh
npm install
npm run dev
```

## Edit portfolio content

Update src/assets/json/projectsData.json. Each category becomes a navigable solar system with one decorative white archive planet; use the system navigation menu to browse category entries. The English and French entries share Anvi’s English content. Change the subtitle in src/assets/json/translations.json and the retro palette in src/assets/space/sketch.ts.
