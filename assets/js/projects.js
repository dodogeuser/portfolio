import { projects, validateProjects } from '../../data/projects.js';

const noop = () => {};
const categories = Object.freeze({
  all: 'All',
  cybersecurity: 'Cybersecurity',
  research: 'Research',
});

/**
 * Progressive archive filtering. Semantic cards and links are never generated,
 * replaced, fetched or reordered. All archive entries remain available without JS.
 * @param {{window?: Window, document?: Document, records?: unknown}} [options]
 * @returns {() => void} Idempotent cleanup restores the static HTML state.
 */
export function initProjects({ window: host = window, document: doc = document, records = projects } = {}) {
  if (!host || !doc || typeof doc.querySelector !== 'function' || !validateProjects(records)) return noop;
  const gallery = doc.querySelector('[data-project-gallery]');
  if (!gallery) return noop;
  const group = gallery.querySelector('[data-project-filters]');
  const archive = gallery.querySelector('[data-project-archive]');
  const results = gallery.querySelector('[data-project-results]');
  const empty = gallery.querySelector('[data-project-empty]');
  if (!group || !archive || !results || !empty || archive.id !== 'project-archive-list' ||
      archive.tagName !== 'UL' || group.getAttribute('role') !== 'group' ||
      results.getAttribute('role') !== 'status' || results.getAttribute('aria-live') !== 'polite' ||
      results.getAttribute('aria-atomic') !== 'true') return noop;

  const buttons = [...group.querySelectorAll('[data-project-filter]')];
  const cards = [...archive.querySelectorAll('[data-project-id]')];
  const archiveRecords = records.filter((record) => record.placement === 'archive');
  if (buttons.length !== Object.keys(categories).length || cards.length !== archiveRecords.length) return noop;
  const buttonByKey = new Map();
  for (const button of buttons) {
    const key = button.getAttribute('data-project-filter');
    if (button.tagName !== 'BUTTON' || button.getAttribute('type') !== 'button' ||
        button.getAttribute('aria-controls') !== archive.id || button.disabled ||
        !Object.prototype.hasOwnProperty.call(categories, key) || buttonByKey.has(key) ||
        typeof button.addEventListener !== 'function') return noop;
    buttonByKey.set(key, button);
  }

  const entryByCard = new Map();
  const seen = new Set();
  for (const card of cards) {
    const id = card.getAttribute('data-project-id');
    const record = archiveRecords.find((candidate) => candidate.slug === id);
    if (card.tagName !== 'LI' || card.parentElement !== archive || !record || seen.has(id)) return noop;
    const caseLink = [...card.querySelectorAll('a[href]')]
      .find((link) => link.getAttribute('href') === record.internalPath);
    if (!caseLink) return noop;
    seen.add(id);
    entryByCard.set(card, record);
  }

  let disposed = false;
  const removeListeners = [];
  const initialResults = results.textContent;
  const initialEmpty = empty.hidden;
  function applyFilter(key) {
    if (disposed || !buttonByKey.has(key)) return;
    const category = categories[key];
    const selected = buttonByKey.get(key);
    let count = 0;
    for (const [card, record] of entryByCard) {
      const visible = key === 'all' || record.category === category;
      // Programmatic activation must not strand focus inside a hidden card.
      if (!visible && card.contains(doc.activeElement)) selected.focus();
      card.hidden = !visible;
      if (visible) count++;
    }
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button === selected));
    }
    results.textContent = key === 'all'
      ? `${count} ${count === 1 ? 'project' : 'projects'} in the archive.`
      : `${count} ${count === 1 ? 'project' : 'projects'} in ${category}.`;
    empty.hidden = count !== 0;
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    for (const remove of removeListeners) remove();
    for (const card of cards) card.hidden = false;
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-project-filter') === 'all'));
    }
    // Move focus before hiding the enhancement, including on BFCache/pagehide.
    if (group.contains(doc.activeElement)) {
      const firstLink = archive.querySelector('a[href]');
      if (firstLink) firstLink.focus();
    }
    group.hidden = true;
    results.textContent = initialResults;
    empty.hidden = initialEmpty;
  }

  try {
    for (const button of buttons) {
      const onClick = () => applyFilter(button.getAttribute('data-project-filter'));
      // Native buttons supply Tab, Enter and Space. No custom tab/arrow semantics.
      button.addEventListener('click', onClick);
      removeListeners.push(() => button.removeEventListener('click', onClick));
    }
    applyFilter('all');
    group.hidden = false;
    return dispose;
  } catch {
    dispose();
    return noop;
  }
}

// This page-specific module does not alter shared navigation or homepage startup.
if (typeof window !== 'undefined' && typeof document !== 'undefined' &&
    document.querySelector('[data-project-gallery]')) {
  let dispose = initProjects();
  window.addEventListener('pagehide', () => {
    dispose();
    dispose = noop;
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      dispose();
      dispose = initProjects();
    }
  });
}
