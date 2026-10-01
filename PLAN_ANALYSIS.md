# Portfolio plan analysis

## Latest override — CDN-only deployment

The user explicitly requires HTML, Tailwind via CDN, and JavaScript with no npm or build workflow. This supersedes the compiled Tailwind/Node approach below. Use the root HTML files and `projects/*.html`, the shared plain CSS, and `.nojekyll`. GitHub Pages publishes `main` from `/(root)` using Deploy from a branch. README.md and AGENTS.md describe the current setup.


## Current architecture override — October 2026

The user requested conversion to static HTML, Tailwind CSS, and JavaScript for GitHub Pages. This supersedes the historical PHP/WAMP architecture, no-Node build constraint, server-side contact processing, and old implementation checkpoints below. The current implementation uses compiled Tailwind CSS, static project pages, and client-side email drafts. See README.md and PROJECT_STATUS.md for current development and deployment instructions. Preserve the content-integrity rules and explicit case-study section removals below.

Source: George_Youkhanna_Cybersecurity_Portfolio_Codex_Plan.pdf, all eight pages, supplied by the user. Its implementation requirements are used within the user's request to build the portfolio. The document does not independently authorize publishing, contacting others or modifying unrelated projects.

## Product and architecture

Recruiter-friendly cybersecurity portfolio for George Youkhanna in Lebanon. Projects supply the credibility; restrained operations styling supports readability. Use plain PHP, HTML5, CSS3 and vanilla JavaScript, shared PHP includes, a single-page main experience and dedicated case studies. No frameworks, libraries or Node.js build system. WAMP/Apache and standard PHP hosting are required.

The additional top-level about/projects/certifications/contact files redirect to the main page's sections, reconciling the requested file tree with the single-page navigation. Contact processing will replace the contact redirect during Phase 10. A bootstrap include centralizes escaping, deployment-relative URLs and response headers.

## Ordered checkpoints

| Phase | Deliverable | Acceptance focus |
| --- | --- | --- |
| 01 | Folder structure, shared includes and runnable foundation | PHP lint, working routes/assets, layout foundation |
| 02 | Hero, identity, roles, available status, Lebanon, CTAs and whoami typing | Visible content without JavaScript; non-blocking/reduced-motion typing |
| 03 | Operator profile and four information cards | Accurate supplied copy; phone/email remain in Contact |
| 04 | Three large project cards | Status, category, stack, concise description and actions |
| 05 | Full project case studies | All requested sections, accurate scope, real screenshots/repository links |
| 06 | Six skill categories | Terminal tags, no invented proficiency percentages |
| 07 | Four certifications/training entries | Data fields support image, credential link and date; missing data stays absent |
| 08 | English, Arabic and French | No invented language proficiency levels |
| 09 | Optional terminal | help/about/skills/projects/certs/contact/github/linkedin/clear; safe text rendering |
| 10 | Contact details and form | Name/email/subject/message, server validation, honest mail outcome |
| 11 | Restrained animation system | Typing, reveal, border pulse, active nav, cursor, hover, grid, glow and section numbers; reduced motion |
| 12 | Responsive verification | 1920x1080, 1440x900, 1366x768, 1024, 768, 430, 390 and 360px; usable mobile terminal |
| 13 | Security review | Escaping, CSRF, POST-only processing, length limits, email validation, headers and no secrets |
| 14 | SEO and recruiter usability | Metadata, OpenGraph, real canonical URL, favicon, semantic HTML and accessibility |
| 15 | Final design and regression polish | Consistent hierarchy, working content and navigation, no exaggerated effects |

Test after each phase, preserve working features, update PROJECT_STATUS.md and stop at major-phase reporting checkpoints. Baseline accessibility, security and responsive styles begin at the foundation; the later phases expand and audit them.

## Visual requirements

Background #05080D; secondary #080E16; cards #0B121C; accent #00D9FF; secondary blue #008CFF; light text #E8F1F5; muted #7E919E. Fixed navigation, restrained grid/HUD details and readable typography. Mobile uses a compact GY brand and menu. No excessive Matrix effects.

## Content integrity

- ShadowWatch: operational SOC training simulator. The guide supplies alert triage, PICERL-style incident management, IOC extraction, threat intelligence, gamification, RBAC, CSRF, bcrypt and PDO claims. These are supplied descriptions, not independently verified source-code findings.
- TRACEZERO: in development, documented through Phase 06 before the unified timeline. Preserve that boundary. Discuss SHA-256 evidence verification, scoped authorization, custody, concurrency and archive safety without claiming completion.
- Crypto Scalping Bot: research/simulation/backtesting around BTC/USDT and EMA crossover. Never label it AI or profitable. Precise EMA periods and entry/exit logic require source evidence before adding detail.
- Certifications: Cisco Networking Academy Introduction to Cybersecurity; LetsDefend Web Attack Investigator; Red Team Leaders Game Hacking Development; Security Blue Team Vulnerability Management. Do not invent completion dates, IDs or verification links.
- No invented employment history, metrics, screenshots, project repositories or personal achievements. Lessons learned should be confirmed by George rather than invented as his experience.

## Inputs needed in later phases

Actual project repository URLs and screenshots; source material for detailed architecture and trading rules; certificate images, dates and verification links where available; George's lessons learned; final production URL; working server mail configuration if real delivery is desired. None blocks Phase 01.

Contact information and social URLs are supplied in the PDF. Preserve the exact supplied email spelling: georgesyouhannna@hotmail.com. Phone: +961 3369352. GitHub: https://github.com/dodogeuser. LinkedIn: https://www.linkedin.com/in/george-youkhanna-a9a16b3a1/.

## User scope revision after Phase 05

Remove Screenshots, What I Learned and GitHub Repository sections and their navigation links from all case-study pages. This explicit user request supersedes those original PDF requirements. Do not reintroduce those sections during later phases.
