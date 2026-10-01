# Repository Guidelines

## Project Structure & Module Organization

This is a static HTML portfolio using Tailwind CSS through a CDN and vanilla JavaScript. `index.html` is the homepage; `projects/` contains three ordinary HTML case studies. Root-level `about.html`, `projects.html`, `certifications.html`, and `contact.html` redirect to homepage sections.

Shared custom CSS lives in `assets/css/style.css`, browser actions in `assets/js/main.js`, and the favicon in `assets/icons/`. Each main page contains a small Tailwind theme block; keep colors and fonts consistent across all four pages. `.nojekyll` enables direct static publishing.

## Development & Deployment

Open `index.html` in a browser or use an editor's static Live Server. Refresh after edits. Internet access is required for the Tailwind CDN.

Do not introduce npm, package manifests, generated build folders, PHP, or custom build workflows. The user explicitly requested a CDN-only setup with no build step.

For GitHub Pages, publish **main → /(root)** using **Deploy from a branch**. Commit the actual HTML and assets, including `.nojekyll`. Relative URLs must work under any repository name, including `/Georges-Portfolio/`.

## Coding Style & Naming Conventions

Use four-space indentation, camelCase JavaScript variables, and lowercase hyphenated filenames. Prefer semantic HTML and Tailwind utilities. Custom styles must be ordinary browser-readable CSS; do not use build-only directives such as `@apply` in linked stylesheets. Tailwind `@theme` declarations belong in the inline `text/tailwindcss` blocks.

Use `textContent` for visitor-controlled text. Preserve accessible labels, keyboard focus, reduced-motion behavior, and content that remains readable without JavaScript.

## Testing Guidelines

There is no dependency-based test runner. Check all four pages on mobile and desktop, navigation links, project filtering, terminal history and text safety, and contact validation/draft generation. Check for missing assets and CDN failures in the browser console. Record actual verification in `PROJECT_STATUS.md`; historical npm test results describe the retired setup.

## Commit & Pull Request Guidelines

Use concise imperative commit subjects. PRs should describe affected pages, verification, and limitations, with screenshots for visual changes. Review deletions when replacing the former build setup so its workflow is not left active remotely.

## Security & Content Integrity

Never commit secrets. Contact must not claim delivery. Preserve documented project statuses and avoid invented credentials, skills, metrics, or links. Do not restore the removed case-study Screenshots, What I Learned, or GitHub Repository sections.
