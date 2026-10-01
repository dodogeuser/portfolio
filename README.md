# Georges Youkhanna — Portfolio

A static portfolio built with semantic HTML, compiled Tailwind CSS 4, and vanilla JavaScript. No PHP, database, runtime framework, or browser CDN is required. Node.js is used only for building and local development.

## Local development

Requires Node.js 22+.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4173/portfolio/`. Re-run `npm run build` after source edits, then refresh. `npm run preview` serves an existing build. The local server supports both `/` and `/portfolio/` to check repository-relative URLs.

```sh
npx playwright install chromium
npm test
```

Tests cover project links/assets, mobile navigation, filters, contact drafts, terminal text safety/history, no-JavaScript content, reduced motion, and overflow at 360–1920px.

## Project structure

- `index.html`: homepage content and accessible markup.
- `src/styles.css`: Tailwind theme, reusable components, and motion preferences.
- `src/projects.mjs`: documented project content for three case studies.
- `assets/js/main.js`: menu, section tracking, project filters, clipboard, contact drafts, and optional terminal.
- `assets/icons/favicon.svg`: local vector identity.
- `scripts/build.mjs`: generates project pages and section aliases; copies only public assets into `dist/`.
- `scripts/serve.mjs`: local preview server, not a production service.
- `tests/`: Playwright browser tests.
- `.github/workflows/pages.yml`: build, test, and GitHub Pages deployment.

Edit source files, not generated `dist/`. Dependencies are pinned in `package-lock.json`.

## GitHub Pages deployment

1. Commit and push the changes to `main`.
2. In the repository, open **Settings → Pages → Build and deployment** and choose **GitHub Actions** as the source.
3. Run **Build and deploy portfolio** from the Actions tab if needed. Subsequent pushes to `main` build, test, and publish automatically; pull requests only build and test.

The expected address for the current remote is `https://dodogeuser.github.io/portfolio/`. This is the intended deployment address, not confirmation that the site is live. The workflow uploads only `dist/`, keeping source, tests, and internal documentation out of the published site. All asset and project links are relative, so repository subpaths work without a router or rewrite rules.

Setup follows the [GitHub Pages custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) and [Tailwind CLI documentation](https://tailwindcss.com/docs/installation/tailwind-cli).

## Content and contact

Contact creates a URL-encoded `mailto:` draft only. Visitors review and send using their own email app; the website sends no email and stores no form data. Direct email and phone links work without JavaScript. Long drafts may be limited by the visitor's mail client; copying the message into webmail is the fallback.

Project descriptions come from the existing planning documents. TRACEZERO remains in development through Phase 06; the trading project remains research/simulation. No performance claims, credential dates, unsupported skills, or project repository links have been invented. The missing legacy skills data has not been reconstructed. Use `src/projects.mjs` to update details once verified.

Old `.php` URLs cannot redirect on GitHub Pages. New `about.html`, `projects.html`, `certifications.html`, and `contact.html` aliases lead to homepage sections. Update any external PHP bookmarks.
