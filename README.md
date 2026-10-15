# NeuroBridge — Frontend
Live: https://neurobridge.asyrafisa.com
(UI prototype: backend and AI not connected)

The single-page React app: **React 19 + Vite 8 + Tailwind CSS v4 + shadcn/ui**.

## Commands

```bash
npm install      # install dependencies
npm run dev      # dev server → http://localhost:5173
npm run build    # production build (must stay green)
npm run lint     # ESLint (must stay green)
npm run preview  # preview the production build
```

All application code lives in [`src/`](./src). Styling is Tailwind utilities
only — `src/index.css` is the sole stylesheet and holds every design token.

## Vite notes

This project uses [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
(Oxc). The React Compiler is not enabled; see the
[React Compiler docs](https://react.dev/learn/react-compiler/installation) if
you want to add it.
