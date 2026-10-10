/** Static HTML owns every service. Disclosure controls are progressive enhancement. */
export const serviceIds = Object.freeze(['secure-software', 'backend-systems', 'ai-integration', 'full-stack-web', 'cybersecurity', 'process-automation']);
const noop = () => {};

export function initServices({ window: host = window, document: doc = document } = {}) {
  if (!host || !doc || typeof doc.querySelector !== 'function') return noop;
  const root = doc.querySelector('[data-services-explorer]');
  if (!root) return noop;
  const all = root.querySelector('[data-services-all]');
  const heading = root.querySelector('[data-services-heading]');
  const cards = [...root.querySelectorAll('[data-service]')];
  if (!all || !heading || cards.length !== serviceIds.length ||
      all.tagName !== 'BUTTON' || all.getAttribute('type') !== 'button' || all.disabled ||
      all.getAttribute('aria-controls') !== serviceIds.map((id) => id + '-details').join(' ') ||
      all.getAttribute('aria-expanded') !== 'true') return noop;
  const records = [];
  for (const id of serviceIds) {
    const card = cards.find((item) => item.getAttribute('data-service') === id);
    const button = card?.querySelector('[data-service-toggle]');
    const panel = card?.querySelector('[data-service-detail]');
    const label = button?.querySelector('[data-service-action]');
    const title = card?.querySelector('h2');
    if (!card || card.tagName !== 'ARTICLE' || !button || !panel || !label ||
        !title?.textContent.trim() || panel.id !== id + '-details' || panel.hidden ||
        button.tagName !== 'BUTTON' || button.getAttribute('type') !== 'button' || button.disabled ||
        button.getAttribute('aria-controls') !== panel.id || button.getAttribute('aria-expanded') !== 'true')
      return noop;
    records.push({ card, button, panel, label });
  }
  let disposed = false;
  const removals = [];
  const updateAll = () => {
    const expanded = records.every(({panel}) => !panel.hidden);
    all.setAttribute('aria-expanded', String(expanded));
    all.textContent = expanded ? 'Collapse all details' : 'Expand all details';
  };
  const setExpanded = (record, expanded) => {
    if (!expanded && record.panel.contains(doc.activeElement)) record.button.focus();
    record.panel.hidden = !expanded;
    record.button.setAttribute('aria-expanded', String(expanded));
    record.label.textContent = expanded ? 'Hide details' : 'Show details';
    if (expanded) record.card.setAttribute('data-service-expanded', '');
    else record.card.removeAttribute('data-service-expanded');
  };
  function dispose() {
    if (disposed) return;
    disposed = true;
    for (const remove of removals) remove();
    if (all === doc.activeElement || records.some(({button}) => button.contains(doc.activeElement))) heading.focus();
    for (const record of records) {
      setExpanded(record, true);
      record.button.hidden = true;
      record.card.removeAttribute('data-service-expanded');
    }
    updateAll();
    all.hidden = true;
    root.classList.remove('services-enhanced');
  }
  try {
    for (const record of records) {
      const onClick = () => { if (disposed) return; setExpanded(record, record.panel.hidden); updateAll(); };
      record.button.addEventListener('click', onClick);
      removals.push(() => record.button.removeEventListener('click', onClick));
    }
    const onAll = () => {
      if (disposed) return;
      const expanded = records.some(({panel}) => panel.hidden);
      for (const record of records) setExpanded(record, expanded);
      updateAll();
    };
    all.addEventListener('click', onAll);
    removals.push(() => all.removeEventListener('click', onAll));
    for (const record of records) setExpanded(record, false);
    updateAll();
    for (const record of records) record.button.hidden = false;
    all.hidden = false;
    root.classList.add('services-enhanced');
    return dispose;
  } catch {
    dispose();
    return noop;
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined' && document.querySelector('[data-services-explorer]')) {
  let cleanup = initServices();
  window.addEventListener('pagehide', () => { cleanup(); cleanup = noop; });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) { cleanup(); cleanup = initServices(); }
  });
}
