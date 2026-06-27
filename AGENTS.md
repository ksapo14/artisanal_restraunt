# Repository Guidelines

## Project Structure & Module Organization

This is a Vite React TypeScript app. Application code lives in `src/`, with
route-level screens in `src/pages/`, shared UI in `src/components/`, app state
in `src/context/`, hooks in `src/hooks/`, and reusable data or validation
helpers in `src/data/`, `src/lib/`, `src/types/`, and `src/utils/`. Firebase,
storage, menu, and email integrations are in `src/api/`. Static images and logos
are stored in `src/assets/`; public browser assets are in `public/`. Serverless
email handling lives in `api/send-email.ts`.

## Build, Test, and Development Commands

- `npm run dev`: start the Vite development server.
- `npm run build`: run TypeScript project builds and create the production Vite
  bundle in `dist/`.
- `npm run preview`: serve the production build locally for verification.
- `npm run lint`: run ESLint across the repository.
- NEVER RUN ANY DEV SERVERS, leave that to me, I will handle all the networking
  for this (dont start any servers or processes)

There is no configured `npm test` script at this time.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Follow the existing four-space
indentation style in `.tsx` files. Component filenames use PascalCase, such as
`Navbar.tsx`; hooks use `useX.ts`, such as `useMenuData.ts`; utility modules use
descriptive camelCase names. Prefer local Tailwind utility classes and existing
CSS variables in `src/index.css` before adding new global styles. Keep comments
brief and only where they clarify non-obvious behavior.

## Testing Guidelines

No test framework is currently configured. When adding tests, place them near
the code they cover or in a clearly named test directory, and use names like
`ComponentName.test.tsx` or `moduleName.test.ts`. At minimum, run
`npm run build` and `npm run lint` before submitting changes.

## Commit & Pull Request Guidelines

Recent commits use short, direct summaries such as
`Updated readme and quick description fixes.` Keep commit messages concise and
focused on the visible change. Pull requests should include a short description,
testing performed, screenshots or screen recordings for UI changes, and any
required Firebase, Vercel, or environment configuration notes.

## Security & Configuration Tips

Keep secrets in local environment files and never commit credentials. Review
`firebase.json`, rules files, and `api/send-email.ts` when changing deployment,
email, storage, or database behavior.
