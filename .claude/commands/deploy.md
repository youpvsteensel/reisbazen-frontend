# Deploy naar Vercel

Pusht de huidige `frontend` branch naar `frontend-origin/main` (reisbazen-frontend.git), wat een Vercel productie-deployment triggert.

```bash
cd C:/Users/youpv/Documents/Claude/Routebaas && git push frontend-origin HEAD:main
```

Gebruik dit commando alleen wanneer je klaar bent met alle wijzigingen — elke push triggert een Vercel build (limiet: 100/dag op het free plan).
