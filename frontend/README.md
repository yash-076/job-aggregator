# RoleSync Frontend

React 18 + Vite + Tailwind CSS frontend for the RoleSync job aggregation platform.

## Setup

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`. Vite proxies `/api/*` to the backend on port 8000.

## Routing

| Route | Layout | Auth | Page |
|-------|--------|------|------|
| `/` | Standalone | Public | Landing page |
| `/signin` | DarkLayout | Public | Sign in |
| `/signup` | DarkLayout | Public | Sign up |
| `/about` | DarkLayout | Public | About |
| `/blog` | DarkLayout | Public | Blog |
| `/contact` | DarkLayout | Public | Contact |
| `/privacy` | DarkLayout | Public | Privacy Policy |
| `/terms` | DarkLayout | Public | Terms of Service |
| `/search` | AppDarkLayout | Protected | Job search & filters |
| `/alerts` | AppDarkLayout | Protected | Alert management |
| `/resume` | AppDarkLayout | Protected | Resume matching |

**DarkLayout** = LandingNavbar + LandingFooter (public pages)  
**AppDarkLayout** = AppNavbar + LandingFooter (authenticated pages)

## Key Dependencies

- `react` / `react-dom` 18
- `react-router-dom` 6
- `lucide-react` (icons)
- `tailwindcss` 3
- `vite` + `@vitejs/plugin-react`

## Build

```bash
npm run build    # Output: dist/
npm run preview  # Preview production build
```

Deployed to **Vercel** — see `vercel.json` for SPA rewrite config.
