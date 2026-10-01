# Repository Guidelines

## Project Structure & Module Organization

This is Georges Youkhanna’s static HTML, Tailwind CSS 4, and vanilla JavaScript portfolio for GitHub Pages. `index.html` contains the homepage; `src/projects.mjs` supplies case-study content. `src/styles.css` defines the Tailwind theme and components. Browser actions live in `assets/js/main.js`; icons live in `assets/icons/`.

`scripts/build.mjs` generates deployable pages in `dist/`. `scripts/serve.mjs` provides local preview. Browser tests live in `tests/`, and `.github/workflows/pages.yml` builds, tests, and deploys. Edit source files rather than generated output.

## Build, Test, and Development Commands

Use Node.js 22+ with the committed lockfile.

- `npm ci`: install pinned development dependencies.
- `npm run dev`: build and serve at `http://127.0.0.1:4173/portfolio/`.
- `npm run build`: generate HTML/assets and compile minified Tailwind CSS.
- `npm run preview`: serve the existing build.
- `npx playwright install chromium`: install the test browser once.
- `npm test`: rebuild and run Playwright tests.

Rebuild after source changes; the preview server does not watch files. The deployed site requires no Node.js or PHP runtime.

## Coding Style & Naming Conventions

Use four-space indentation, JavaScript ES modules, camelCase variables, and lowercase hyphenated filenames. Prefer semantic HTML and Tailwind utilities; keep reusable styling in `src/styles.css`. Use relative asset and navigation URLs to support GitHub Pages repository paths. Keep meaningful content accessible without JavaScript. Use `textContent` for visitor-controlled text, never HTML injection or evaluation.

## Testing Guidelines

Run `npm test` before submitting behavior changes. Tests exercise links, repository subpaths, filtering, mobile menu controls, contact validation, terminal safety/history, reduced motion, and no-JavaScript fallback. There is no numeric coverage threshold. Check visual changes at mobile and desktop sizes, and record actual verification in `PROJECT_STATUS.md`.

## Commit & Pull Request Guidelines

The initial history uses `Add files via upload`; no formal convention exists. Use concise imperative subjects for focused changes. PRs should describe behavior, affected pages, checks performed, and known limitations. Link relevant issues and attach screenshots for visual updates. Deployment runs only from `main`, after tests pass.

## Security & Content Integrity

Publish only `dist/`; never commit secrets. Contact prepares email drafts and must not claim delivery. Preserve documented project status and avoid invented credentials, skills, metrics, or links. Do not restore the removed case-study Screenshots, What I Learned, or GitHub Repository sections.
