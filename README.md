# George Youkhanna - Cybersecurity Portfolio

Framework-free PHP, HTML5, CSS3 and vanilla JavaScript portfolio. Implementation follows the supplied eight-page plan, with a tested checkpoint after each major phase.

## Run locally

1. Place this folder in WAMP's `www/portfolio` directory.
2. Start Apache in WAMP. No database or dependency installation is required.
3. Open http://localhost/portfolio/ (do not open PHP files directly).

PHP 8.0+ and Apache 2.4 are the target. Development validation uses PHP 8.3.28. Apache must allow `.htaccess` overrides for the directory protection rules. On other servers, reproduce those rules in server configuration. Deploy application files only; never deploy `tmp/`.

## Structure

- `index.php`: single-page experience with hero, operator profile, featured project cards, categorized skills, training entries, languages and an optional terminal, plus placeholders for later sections.
- `about.php`, `projects.php`, `certifications.php`: compatibility routes redirecting to home sections.
- `contact.php`: POST-only form processing; GET redirects to the Contact section. Valid submissions prepare a mailto draft, never claim delivery.
- `projects/`: three dedicated case studies with scope, security notes, conceptual architecture.
- `includes/`: bootstrap, shared header, navigation, footer and reusable case-study template/data. The earlier placeholder template is unused.
- `includes/project-data.php`, `includes/project-cards.php`: reusable project content and escaped card rendering; repository URLs are unset until supplied or verified.
- `includes/skills-data.php`, `includes/skills.php`: supplied skill categories and accessible tag lists, reusable by the later terminal.
- `includes/certifications-data.php`, `includes/certification-cards.php`: four supplied training entries. Optional fields: `image` (local site-relative image path), `credential_url` (verified HTTPS URL), `completed_on` (valid YYYY-MM-DD date). Leave missing details null.
- `includes/terminal.php`: escaped responses built from shared portfolio data; terminal commands do not execute system commands or store visitor input.
- `includes/contact-state.php`, `includes/contact-form.php`: CSRF session setup and shared form. PHP sessions must be enabled with a writable configured session directory; the homepage is intentionally not cached because it includes a session token.
- `assets/css/`: base styling, motion preferences and responsive styles.
- `assets/js/`: mobile navigation, motion-aware hero typing and the optional portfolio terminal.
- `assets/images/`, `assets/icons/`: image and icon assets.
- `PLAN_ANALYSIS.md`: requirements, phase order and unresolved content inputs.
- `PROJECT_STATUS.md`: implementation checkpoint and verification record.

## Current limitations

Phases 01 through 10 have implemented and server-verified pages; Screenshots, What I Learned and GitHub Repository sections were removed from case studies at the user's request. Source verification remains pending. Architecture is labeled conceptual. Browser visual/interactive verification remains pending. Later homepage content is labeled as forthcoming. The contact form validates input and prepares a mailto draft. Sending requires the visitor's email app; no server mail transport is configured. Production canonical URL, certificates and mail configuration remain outstanding. See the status document before continuing.

No packages, frontend frameworks, Node.js runtime, database, external fonts or third-party scripts are needed by the site.
