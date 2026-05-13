# SCP-3008: The Infinite IKEA

A multiplayer survival horror game based on [SCP-3008](https://scp-wiki.wikidot.com/scp-3008) — "A Perfectly Normal, Regular Old IKEA."

You are trapped inside an infinite IKEA. During the day, faceless staff wander aimlessly. At night, they become hostile and hunt you down, repeating: *"The store is now closed. Please exit the building."*

## Features

- **Infinite procedural world** — Chunk-based generation creates an endless IKEA interior with living rooms, bedrooms, kitchens, and more
- **SCP-3008-2 entities** — Faceless humanoids with disproportionate bodies (tall/short/normal), yellow shirt and blue pants
- **Day/night cycle** — NPCs are passive during the day, aggressive at night
- **Multiplayer** — Real-time multiplayer via Socket.io
- **Survival mechanics** — Health system, sprint, and death
- **First-person 3D** — Built with Three.js and react-three-fiber

## Tech Stack

- **Frontend:** React, TypeScript, Three.js (react-three-fiber), Zustand, Vite
- **Backend:** Node.js, Express, Socket.io, TypeScript
- **Shared:** TypeScript types between client and server

## Getting Started

```bash
npm install
cd client && npm install
cd ../server && npm install
cd ..
npm run dev
```

Open `http://localhost:5003` in your browser.

## Controls

| Key | Action |
|-----|--------|
| WASD | Move |
| Mouse | Look around |
| Shift | Sprint |
| Enter | Open chat |
| Escape | Close chat |
| Click | Lock cursor |

## Deployment

The client can be deployed to Vercel. Set the `VITE_SERVER_URL` environment variable to point to your hosted server.

## License

This project is a fan game based on SCP-3008 by Mortos, licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).
