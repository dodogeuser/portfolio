// Optional, finite reveals. HTML remains readable before, during and after motion.
const REVEAL_SELECTOR = [
  '.home-section-head',
  '.feature',
  '.approach-item',
  '.skills-layout > header',
  '.skill-group',
  '.about-layout > header',
  '.about-copy',
  '.contact-composition > .eyebrow',
  '.contact-composition > h2',
  '.contact-composition > .contact-copy',
  '.home-contact-links',
].join(', ');

const noop = () => {};

/**
 * Root startup owns pagehide disposal and BFCache pageshow reinitialization.
 * No scroll listener, hidden class, DOM replacement or navigation interception.
 */
export function initMotion({ window: host = window, document: doc = document } = {}) {
  if (typeof host.IntersectionObserver !== 'function' ||
      typeof host.matchMedia !== 'function') return noop;

  const targets = [...doc.querySelectorAll(REVEAL_SELECTOR)];
  if (!targets.length || targets.some((target) => typeof target.animate !== 'function')) {
    return noop;
  }

  const reducedMotion = host.matchMedia('(prefers-reduced-motion: reduce)');
  const forcedColors = host.matchMedia('(forced-colors: active)');
  const printing = host.matchMedia('print');
  const connection = host.navigator?.connection;
  // Hints are optional; their absence never requires device identification.
  const lowPower = (host.navigator?.hardwareConcurrency > 0 &&
                    host.navigator.hardwareConcurrency <= 2) ||
                   (host.navigator?.deviceMemory > 0 && host.navigator.deviceMemory <= 2);
  if (lowPower) return noop;

  const seen = new Set();
  const active = new Map();
  const removeListeners = [];
  let disposed = false;
  let observer;

  const allowed = () => !disposed && !doc.hidden && !reducedMotion.matches &&
    !forcedColors.matches && !printing.matches && !connection?.saveData;

  function listen(target, type, callback) {
    if (typeof target?.addEventListener === 'function') {
      target.addEventListener(type, callback);
      removeListeners.push(() => target.removeEventListener(type, callback));
    } else if (type === 'change' && typeof target?.addListener === 'function') {
      // Older MediaQueryList implementations still receive live preference changes.
      target.addListener(callback);
      removeListeners.push(() => target.removeListener(callback));
    }
  }

  function cancelActive() {
    for (const animation of active.values()) animation.cancel();
    active.clear();
  }

  function reveal(target) {
    seen.add(target);
    observer.unobserve(target);
    // Never animate a focused control or the ancestor containing it.
    if (target.contains(doc.activeElement)) return;

    try {
      const animation = target.animate([
        { opacity: 0.8, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], {
        duration: 420,
        easing: 'cubic-bezier(.16, 1, .3, 1)',
        iterations: 1,
        fill: 'none',
      });
      active.set(target, animation);
      const release = () => {
        if (active.get(target) === animation) active.delete(target);
      };
      // Cancellation rejects finished; handle both outcomes without console noise.
      animation.finished.then(release, release);
    } catch {
      // An optional animation failure leaves the original document untouched.
    }
  }

  observer = new host.IntersectionObserver((entries) => {
    if (!allowed()) return;
    for (const entry of entries) {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.12 &&
          !seen.has(entry.target)) reveal(entry.target);
    }
  }, { threshold: 0.12 });

  function refresh() {
    observer.disconnect();
    if (!allowed()) {
      cancelActive();
      return;
    }
    for (const target of targets) {
      if (!seen.has(target)) observer.observe(target);
    }
  }

  function onFocus(event) {
    // Focused content is always stable, including keyboard jumps into a panel.
    for (const target of targets) {
      if (!target.contains(event.target)) continue;
      seen.add(target);
      observer.unobserve(target);
      active.get(target)?.cancel();
      active.delete(target);
    }
  }

  listen(reducedMotion, 'change', refresh);
  listen(forcedColors, 'change', refresh);
  listen(printing, 'change', refresh);
  listen(connection, 'change', refresh);
  listen(doc, 'visibilitychange', refresh);
  listen(doc, 'focusin', onFocus);
  refresh();

  return function disposeMotion() {
    if (disposed) return;
    disposed = true;
    observer.disconnect();
    cancelActive();
    for (const remove of removeListeners) remove();
    seen.clear();
  };
}
