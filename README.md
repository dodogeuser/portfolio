# George Youkhanna - Portfolio

Security-Focused Software Engineer and Co-Founder of NexusQart. Carbon & Violet static portfolio using semantic HTML, ordinary CSS, vanilla JavaScript and local pinned Three.js 0.180.0.

Live site: https://dodogeuser.github.io/portfolio/

## Hosting

GitHub Pages publishes main / root using Deploy from a branch. .nojekyll enables direct static serving. No backend, database, npm, package installation, build command or CDN is needed. Do not add a contact form or tracking.

## Editing

Pages: index.html, projects/index.html, five projects/*.html case studies, services/index.html, about/index.html, resume/index.html, contact/index.html and 404.html. Root-level about/projects/certifications/contact HTML files are compatibility redirects. Historical unused assets/docs are preserved; active pages link only the approved new assets.

Shared CSS and JavaScript live under assets; keep duplicated navigation synchronized. Data/projects.js retains null future project-link fields. Notes and challenge-story sections were removed at owner request. Individual project repository/documentation links are not enabled. Current approved CV lives at assets/docs/George-Youkhanna-CV.pdf; original supplied SPECTRE/REVENANT logos are in assets/images/projects/. Do not publish private planning docs or source references.

## Updates

Edit the private source workspace first, run its regression checks, then export public files with tools/prepare_release.py using https://dodogeuser.github.io/portfolio/. Copy the reviewed export into a clean checkout and push a normal commit; no force push. A fresh directory is required for export. Preserve compatibility redirects and repository history. Keep canonical/social/sitemap URLs aligned with the production base.

To update the CV, supply an owner-approved current PDF and update the existing asset. Add certifications only from confirmed facts/links. Add real project logos only. Keep conceptual/planned components explicitly scoped. Do not invent achievements, features, metrics or notes. Future project links require owner-approved exact URLs, metadata validation and intentional rendering; never substitute the profile URL.

## Verification

Source and executable adapter suites and local HTTP checks passed before release. Real browser/AT/GPU/print/performance acceptance remains unrecorded; automated source checks are not a WCAG or Lighthouse score. Recheck desktop/mobile, menu focus/Escape, filtering, services, skills, architecture explorers, no-JS, reduced motion, Core fallbacks/visibility pause and browser console on the live site.

Original repository history and retained historical documents remain available. PROJECT_STATUS.md records this release.
