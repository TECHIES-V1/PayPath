# PayPath
The Official Repo for The Qwest Hackathon

## Frontend
- Minimal React + Vite project that renders a simple splash page from `src/App.jsx`.
- Run `npm run dev` for local development or `npm run build` before deploying.
- Styles live in `src/index.css` to keep the experience intentionally minimal.

## 🧠 System Design
- **Event Tracker:** GitHub workflows capture PR opened, PR merged, issues closed, and reviews submitted events.
- **Scoring Engine:** Points are mapped as PR opened → +5, PR merged → +20, issue closed → +10, review submitted → +3.
- **Leaderboard Generator:** Scores persist in `scores.json`, and the workflow rewrites this README (between the leaderboard markers) on every run.

## 🏆 Leaderboard
<!-- LEADERBOARD_START -->
Loading...
<!-- LEADERBOARD_END -->

## Deploying on Vercel
- The repository contains `vercel.json` so Vercel uses `npm run build` and serves the `dist` output.
- Link the repo to Vercel, set the root to `/`, and the platform will handle CI/CD automatically.
