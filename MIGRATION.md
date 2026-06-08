# GAZA IMPACT — Migration Guide
## TanStack Start → Standard Vite + React Router

---

## What Changed

### 1. Routing System

| Before (TanStack Start) | After (React Router v7) |
|---|---|
| `createFileRoute("/")` | Plain `export default function` component |
| `Route.useParams()` | `useParams<{ id: string }>()` from `react-router-dom` |
| `Route.useSearch()` with `validateSearch` | `useSearchParams()` from `react-router-dom` |
| `useNavigate()` from `@tanstack/react-router` | `useNavigate()` from `react-router-dom` |
| `<Link to="/initiatives/$id" params={{ id }}>` | `<Link to={"/initiatives/" + id}>` |
| `navigate({ to: "/donate", search: { initiativeId } })` | `navigate("/donate?initiativeId=" + id)` |
| Auto-generated `routeTree.gen.ts` | Routes defined in `App.tsx` with `<Routes>` |
| `Link to="/" hash="initiatives"` | `<Link to="/#initiatives">` |

### 2. Removed Dependencies

These are no longer needed and should be **removed from your `package.json`**:

```
@tanstack/react-start
@tanstack/react-router
@tanstack/router-plugin
@lovable.dev/vite-tanstack-config  (the whole vendor/ folder)
nitro
```

### 3. Added Dependencies

```
react-router-dom: ^7.6.0
```

All other dependencies (`@tanstack/react-query`, Radix UI, etc.) are preserved.

### 4. Config Changes

**`vite.config.ts`** — removed:
- `@tanstack/router-plugin`
- `@lovable.dev/vite-tanstack-config`

Added standard `@vitejs/plugin-react` + `vite-tsconfig-paths`.

**`main.tsx`** — replaced TanStack router provider with `<BrowserRouter>` from React Router.

**`App.tsx`** — new file; defines all routes with `<Routes>` and lazy-loads each page.

---

## Getting Started

```bash
# 1. Delete vendor folder and old lockfile
rm -rf vendor node_modules package-lock.json

# 2. Install fresh dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit VITE_API_BASE_URL to point at your backend

# 4. Run dev server
npm run dev
```

---

## File Structure

```
src/
├── main.tsx              # Entry point — BrowserRouter + QueryClientProvider
├── App.tsx               # Route definitions (<Routes> + lazy imports)
├── index.css             # Global styles + Tailwind v4 + CSS variables
├── lib/
│   ├── api/api.ts        # Axios instance (unchanged from original)
│   └── utils.ts          # cn() helper
└── routes/
    ├── index.tsx          # / — Home page
    ├── donate.tsx         # /donate — Donation form
    ├── initiatives.$id.tsx # /initiatives/:id — Initiative detail
    └── not-found.tsx      # * — 404 fallback
```

---

## Asset Images

The original code imported local assets (`@/assets/hero-gaza.jpg`, etc.). In this migration those
imports are replaced with **Unsplash placeholder URLs** so the project builds without your actual
images. To restore your originals:

1. Copy your `src/assets/` folder into this project.
2. In `src/routes/index.tsx`, replace the `FALLBACK_IMAGES` object with your imports:

```tsx
import heroImg from "@/assets/hero-gaza.jpg";
// ... etc.

// Then replace FALLBACK_IMAGES references with the imported variables
```

---

## Search Params — Detail

The original donate page used TanStack's `validateSearch` with Zod. The migration uses React
Router's `useSearchParams()`:

```tsx
// Before (TanStack)
const donateSearchSchema = z.object({ initiativeId: z.string().optional() });
export const Route = createFileRoute("/donate")({
  validateSearch: donateSearchSchema,
  component: DonatePage,
});
function DonatePage() {
  const { initiativeId } = Route.useSearch();
}

// After (React Router)
function DonatePage() {
  const [searchParams] = useSearchParams();
  const initiativeId = searchParams.get("initiativeId") ?? undefined;
}
```

If you want runtime Zod validation on search params back, wrap the value:

```tsx
const raw = searchParams.get("initiativeId");
const initiativeId = raw ? z.string().parse(raw) : undefined;
```

---

## Console Ninja Cleanup

The original `index.tsx` contained a large `console-ninja` debug injection at the bottom
(`oo_cm`, `oo_tx`, etc.). This has been **removed** in the migration — it was a dev-time
VS Code extension artifact and should never ship to production.
