/** Progressive, page-scoped architecture selection. Static HTML owns all content. */
export const componentIds = Object.freeze(['ui', 'api', 'persistence', 'collectors', 'evidence', 'analysis', 'reporting', 'security']);
const noop = () => {};

export function initArchitectureExplorer({ window: host = window, document: doc = document } = {}) {
  if (!host || !doc || typeof doc.querySelector !== 'function') return noop;
  const root = doc.querySelector('[data-architecture-explorer]');
  if (!root) return noop;
  // Fixed author-authored identifiers only; SPECTRE retains its original defaults.
  const declared = root.getAttribute('data-component-ids');
  const ids = declared === null ? componentIds : declared.split(' ');
  if (ids.length < 2 || ids.length > 12 || new Set(ids).size !== ids.length ||
      ids.some((id) => !/^[a-z][a-z0-9-]{0,31}$/.test(id))) return noop;
  const controls = root.querySelector('[data-explorer-controls]');
  const status = root.querySelector('[data-explorer-status]');
  const reset = root.querySelector('[data-explorer-reset]');
  const buttons = [...root.querySelectorAll('[data-component-select]')];
  const panels = [...root.querySelectorAll('[data-component-panel]')];
  const nodes = [...root.querySelectorAll('[data-architecture-node]')];
  const edges = [...root.querySelectorAll('[data-architecture-edge]')];
  if (!controls || !status || !reset || controls.getAttribute('role') !== 'group' ||
      status.getAttribute('role') !== 'status' || status.getAttribute('aria-live') !== 'polite' ||
      status.getAttribute('aria-atomic') !== 'true' || buttons.length !== ids.length ||
      panels.length !== ids.length || nodes.length !== ids.length ||
      reset.tagName !== 'BUTTON' || reset.getAttribute('type') !== 'button' || reset.disabled ||
      reset.getAttribute('aria-controls') !== 'component-details' || reset.getAttribute('aria-pressed') !== 'true' ||
      !controls.contains(reset)) return noop;
  const byId = new Map();
  for (const id of ids) {
    const button = buttons.find((item) => item.getAttribute('data-component-select') === id);
    const panel = panels.find((item) => item.getAttribute('data-component-panel') === id);
    const node = nodes.find((item) => item.getAttribute('data-architecture-node') === id);
    const title = panel?.querySelector('h3');
    if (!button || !panel || !node || !title || !title.textContent.trim() ||
        button.tagName !== 'BUTTON' || button.getAttribute('type') !== 'button' ||
        button.disabled || !controls.contains(button) || button.getAttribute('aria-controls') !== panel.id ||
        !panel.id || button.getAttribute('aria-pressed') !== 'false' || panel.hidden) return noop;
    byId.set(id, { button, panel, node, title: title.textContent.trim() });
  }
  if (!edges.length) return noop;
  const connections = new Map(ids.map((id) => [id, new Set()]));
  const endpoints = new Map();
  for (const edge of edges) {
    const pair = edge.getAttribute('data-architecture-edge').split(' ');
    if (pair.length !== 2 || pair[0] === pair[1] || pair.some((id) => !byId.has(id))) return noop;
    endpoints.set(edge, pair);
    connections.get(pair[0]).add(pair[1]);
    connections.get(pair[1]).add(pair[0]);
  }
  if ([...connections.values()].some((items) => !items.size)) return noop;
  const originalStatus = status.textContent;
  const removeListeners = [];
  let disposed = false;
  function select(id) {
    if (disposed || (id !== null && !byId.has(id))) return;
    const target = id === null ? reset : byId.get(id).button;
    for (const [key, record] of byId) {
      const hidden = id !== null && key !== id;
      if (hidden && record.panel.contains(doc.activeElement)) target.focus();
      record.panel.hidden = hidden;
      record.button.setAttribute('aria-pressed', String(key === id));
      if (id === null) record.node.removeAttribute('data-state');
      else record.node.setAttribute('data-state', key === id ? 'selected' : connections.get(id).has(key) ? 'connected' : 'context');
    }
    for (const [edge, pair] of endpoints) {
      if (id === null) edge.removeAttribute('data-state');
      else edge.setAttribute('data-state', pair.includes(id) ? 'connected' : 'context');
    }
    reset.setAttribute('aria-pressed', String(id === null));
    if (id === null) root.removeAttribute('data-explorer-selected');
    else root.setAttribute('data-explorer-selected', id);
    status.textContent = id === null ? originalStatus :
      `${byId.get(id).title} selected. Connections: ${[...connections.get(id)].map((key) => byId.get(key).title).join(', ')}.`;
  }
  function dispose() {
    if (disposed) return;
    select(null);
    disposed = true;
    for (const remove of removeListeners) remove();
    if (controls.contains(doc.activeElement)) {
      const heading = root.querySelector('[data-explorer-heading]');
      heading?.focus();
    }
    controls.hidden = true;
    root.classList.remove('explorer-enhanced');
  }
  try {
    for (const [id, record] of byId) {
      const handler = () => select(id);
      record.button.addEventListener('click', handler);
      removeListeners.push(() => record.button.removeEventListener('click', handler));
    }
    const onReset = () => select(null);
    reset.addEventListener('click', onReset);
    removeListeners.push(() => reset.removeEventListener('click', onReset));
    select(null);
    root.classList.add('explorer-enhanced');
    controls.hidden = false;
    return dispose;
  } catch {
    dispose();
    return noop;
  }
}

/** Ordinary anchors retain native hash/history behavior; optional section indication. */
export function initCaseNavigation({ window: host = window, document: doc = document } = {}) {
  if (!host || !doc || typeof doc.querySelector !== 'function') return noop;
  const nav = doc.querySelector('[data-case-navigation]');
  if (!nav) return noop;
  const links = [...nav.querySelectorAll('a[href]')];
  const entries = links.map((link) => ({ link, section: doc.getElementById(link.getAttribute('href').slice(1)) }));
  if (!entries.length || entries.some(({link, section}) => !link.getAttribute('href').startsWith('#') || !section)) return noop;
  let observer;
  let disposed = false;
  const visible = new Set();
  function mark(id) {
    if (disposed) return;
    for (const {link, section} of entries) {
      if (section.id === id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  const onHash = () => mark(host.location?.hash?.slice(1));
  try {
    host.addEventListener('hashchange', onHash);
    onHash();
    if (typeof host.IntersectionObserver === 'function') {
      observer = new host.IntersectionObserver((changes) => {
        if (disposed) return;
        for (const item of changes) {
          if (item.isIntersecting) visible.add(item.target);
          else visible.delete(item.target);
        }
        const first = entries.find(({section}) => visible.has(section));
        mark(first?.section.id);
      }, {rootMargin: '-15% 0px -65% 0px', threshold: 0});
      for (const {section} of entries) observer.observe(section);
    }
  } catch {
    observer?.disconnect();
    // Native hash indication can continue without an observer.
  }
  return () => {
    if (disposed) return;
    disposed = true;
    observer?.disconnect();
    host.removeEventListener('hashchange', onHash);
    for (const {link} of entries) link.removeAttribute('aria-current');
  };
}

if (typeof window !== 'undefined' && typeof document !== 'undefined' &&
    document.querySelector('[data-architecture-explorer]')) {
  let cleanups = [initArchitectureExplorer(), initCaseNavigation()];
  window.addEventListener('pagehide', () => { for (const cleanup of cleanups) cleanup(); cleanups = []; });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      for (const cleanup of cleanups) cleanup();
      cleanups = [initArchitectureExplorer(), initCaseNavigation()];
    }
  });
}
