# Georges Youkhanna — Portfolio

Plain HTML, Tailwind CSS via CDN, custom CSS, and vanilla JavaScript. No npm installation, build command, PHP server, or custom GitHub Actions workflow is needed.

## Preview and edit

Open `index.html` in your browser, or use your editor's static Live Server. An internet connection is needed to load Tailwind from the CDN. Edit the HTML, CSS, or JavaScript and refresh the page.

- `index.html`: homepage.
- `projects/*.html`: three directly editable project pages.
- `assets/css/style.css`: ordinary CSS for shared components and artwork.
- Each main page's `style type="text/tailwindcss"` block: shared Tailwind theme colors and fonts. Keep these four blocks consistent.
- `assets/js/main.js`: menu, filters, terminal, clipboard, and email drafts.
- `assets/icons/favicon.svg`: favicon.
- `about.html`, `projects.html`, `certifications.html`, `contact.html`: section redirects.
- `.nojekyll`: tells GitHub Pages to serve these files directly.

Tailwind loads through the [official browser CDN approach](https://tailwindcss.com/docs/installation/play-cdn). The CDN URL contains `/npm/` because that is jsDelivr's package URL; it does not require npm on your computer or GitHub.

## Publish on GitHub Pages

1. Commit and push this repository's files, including `.nojekyll` and the new `projects/` pages. Include deletion of the old `.github/workflows/pages.yml` workflow and npm/build files.
2. Open **Settings → Pages → Build and deployment**.
3. Choose **Deploy from a branch**, then **main** and **/(root)**. Click **Save**.
4. Wait for GitHub's built-in Pages deployment to finish, then refresh the website. Use Ctrl+F5 if the old version is cached.

There is no `dist/` folder to upload and no custom build workflow to run. Publish the repository root. Relative links support both `/portfolio/` and `/Georges-Portfolio/` without edits. The test deployment address is `https://samer-nasr.github.io/Georges-Portfolio/`.

## Verification

Check the homepage and all three project pages at mobile and desktop widths. Verify the menu, filters, terminal commands, contact validation, and email-draft link. Inspect the browser console for failed CDN or asset requests. There is no package-based test runner.

## Content and contact

The form prepares a `mailto:` draft; visitors review and send it in their own email app. The website sends no email and stores no form data. Direct email and phone links remain available without JavaScript, although Tailwind styling requires JavaScript and CDN access.

Project descriptions retain the documented scope. TRACEZERO remains in development through Phase 06, and the trading project remains research/simulation. No unsupported skills, credential dates, performance claims, or project repository links have been added. Old `.php` URLs are no longer supported.
