/**
 * Public, owner-scoped project metadata. The actual content remains in HTML.
 * Original project guides are absent: no technology is promoted to verified.
 * Future external URLs require owner approval and a deliberate validator update;
 * they are never rendered or substituted with a profile URL by this phase.
 *
 * @typedef {'Cybersecurity' | 'Research'} ProjectCategory
 * @typedef {'featured' | 'archive'} ProjectPlacement
 * @typedef {Object} Project
 * @property {string} slug
 * @property {string} title
 * @property {ProjectCategory} category
 * @property {ProjectPlacement} placement
 * @property {string} status
 * @property {string} summary
 * @property {ReadonlyArray<string>} verifiedTechnologies
 * @property {'pending'} technologyVerification
 * @property {string} internalPath Relative to the Projects HTML document.
 * @property {null} repositoryUrl
 * @property {null} documentationUrl
 * @property {null} installationUrl
 * @property {null} demoUrl
 */

/** @type {ReadonlyArray<Readonly<Project>>} */
export const projects = Object.freeze([
  {
    slug: 'spectre',
    title: 'SPECTRE',
    category: 'Cybersecurity',
    placement: 'featured',
    status: 'Project overview',
    summary: 'A local-first OSINT investigation platform.',
    verifiedTechnologies: Object.freeze([]),
    technologyVerification: 'pending',
    internalPath: './spectre.html',
    repositoryUrl: null,
    documentationUrl: null,
    installationUrl: null,
    demoUrl: null,
  },
  {
    slug: 'revenant',
    title: 'REVENANT',
    category: 'Cybersecurity',
    placement: 'featured',
    status: 'Concept / Architecture',
    summary: 'An authorized security assessment platform concept; implementation is unverified.',
    verifiedTechnologies: Object.freeze([]),
    technologyVerification: 'pending',
    internalPath: './revenant.html',
    repositoryUrl: null,
    documentationUrl: null,
    installationUrl: null,
    demoUrl: null,
  },
  {
    slug: 'shadowwatch',
    title: 'ShadowWatch',
    category: 'Cybersecurity',
    placement: 'featured',
    status: 'Training / Simulation',
    summary: 'A SOC training simulator, not a production monitoring platform.',
    verifiedTechnologies: Object.freeze([]),
    technologyVerification: 'pending',
    internalPath: './shadowwatch.html',
    repositoryUrl: null,
    documentationUrl: null,
    installationUrl: null,
    demoUrl: null,
  },
  {
    slug: 'tracezero',
    title: 'TRACEZERO',
    category: 'Cybersecurity',
    placement: 'archive',
    status: 'Investigation / Training',
    summary: 'A local-first digital forensics investigation and training platform.',
    verifiedTechnologies: Object.freeze([]),
    technologyVerification: 'pending',
    internalPath: './tracezero.html',
    repositoryUrl: null,
    documentationUrl: null,
    installationUrl: null,
    demoUrl: null,
  },
  {
    slug: 'crypto-scalping-bot',
    title: 'Crypto Scalping Bot',
    category: 'Research',
    placement: 'archive',
    status: 'Paper Trading / Research',
    summary: 'A paper-trading and strategy research project; no real-money trading claims.',
    verifiedTechnologies: Object.freeze([]),
    technologyVerification: 'pending',
    internalPath: './crypto-scalping-bot.html',
    repositoryUrl: null,
    documentationUrl: null,
    installationUrl: null,
    demoUrl: null,
  },
].map((project) => Object.freeze(project)));

const expected = Object.freeze({
  spectre: ['Cybersecurity', 'featured', 'Project overview'],
  revenant: ['Cybersecurity', 'featured', 'Concept / Architecture'],
  shadowwatch: ['Cybersecurity', 'featured', 'Training / Simulation'],
  tracezero: ['Cybersecurity', 'archive', 'Investigation / Training'],
  'crypto-scalping-bot': ['Research', 'archive', 'Paper Trading / Research'],
});
const optionalLinks = ['repositoryUrl', 'documentationUrl', 'installationUrl', 'demoUrl'];
const keys = [
  'slug', 'title', 'category', 'placement', 'status', 'summary',
  'verifiedTechnologies', 'technologyVerification', 'internalPath', ...optionalLinks,
];
const safeText = (value, maximum) => typeof value === 'string' &&
  value.length > 0 && value.length <= maximum && value === value.trim() &&
  !/[<>\u0000-\u001f\u007f]/u.test(value);

/**
 * Reject partial/malformed data before exposing any filtering controls.
 * Scope/status enums deliberately match the current owner-approved five projects.
 * @param {unknown} records
 * @returns {records is ReadonlyArray<Readonly<Project>>}
 */
export function validateProjects(records) {
  if (!Array.isArray(records) || records.length !== Object.keys(expected).length) return false;
  const seen = new Set();
  return records.every((project) => {
    if (!project || typeof project !== 'object' || Array.isArray(project)) return false;
    if (Object.keys(project).length !== keys.length ||
        !keys.every((key) => Object.prototype.hasOwnProperty.call(project, key))) return false;
    if (!safeText(project.slug, 48) || !/^[a-z]+(?:-[a-z]+)*$/u.test(project.slug) ||
        !Object.prototype.hasOwnProperty.call(expected, project.slug) || seen.has(project.slug)) return false;
    seen.add(project.slug);
    const [category, placement, status] = expected[project.slug];
    return safeText(project.title, 80) && safeText(project.summary, 400) &&
      project.category === category && project.placement === placement && project.status === status &&
      project.internalPath === `./${project.slug}.html` &&
      project.technologyVerification === 'pending' &&
      Array.isArray(project.verifiedTechnologies) && project.verifiedTechnologies.length === 0 &&
      optionalLinks.every((key) => project[key] === null);
  });
}
