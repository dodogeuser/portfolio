/**
 * Progressive enhancement for the document's static navigation.
 *
 * The HTML owns all destinations and current-page states. Native dialog makes
 * the background inert; the explicit Tab loop also covers keyboard edge cases.
 * If modal dialogs are unavailable, the visible HTML fallback stays in place.
 *
 * @param {Document} documentRoot
 * @returns {() => void} Remove listeners and restore the static navigation.
 */
export function initNavigation(documentRoot = document) {
  const dialog = documentRoot.querySelector('#site-menu');
  const triggers = [...documentRoot.querySelectorAll('[data-menu-open]')];
  const closeControl = dialog?.querySelector('[data-menu-close]');
  const viewport = documentRoot.defaultView;
  const root = documentRoot.documentElement;

  if (!dialog || !closeControl || !triggers.length || !viewport ||
      typeof dialog.showModal !== 'function') {
    return () => {};
  }

  let openingTrigger = null;
  let scrollPosition = { x: 0, y: 0 };
  let isOpen = false;

  const setExpanded = (expanded) => {
    triggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', String(expanded));
    });
  };

  const focusableElements = () => {
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]',
    ];

    return [...dialog.querySelectorAll(selectors.join(','))].filter((element) => {
      return element.tabIndex >= 0 &&
        !element.closest('[hidden], [inert]') &&
        element.getClientRects().length > 0 &&
        viewport.getComputedStyle(element).visibility !== 'hidden';
    });
  };

  const finishClose = () => {
    root.classList.remove('menu-open');
    setExpanded(false);

    if (!isOpen) return;

    isOpen = false;
    if (openingTrigger?.isConnected && !openingTrigger.hidden) {
      openingTrigger.focus({ preventScroll: true });
    }
    viewport.scrollTo(scrollPosition.x, scrollPosition.y);
    openingTrigger = null;
  };

  const closeMenu = () => {
    if (dialog.open) dialog.close();
    finishClose();
  };

  const openMenu = (event) => {
    if (isOpen || dialog.open) return;

    openingTrigger = event.currentTarget;
    scrollPosition = { x: viewport.scrollX, y: viewport.scrollY };

    try {
      dialog.showModal();
    } catch {
      // A failed enhancement must not leave the page without navigation.
      cleanup();
      return;
    }

    isOpen = true;
    root.classList.add('menu-open');
    setExpanded(true);
    closeControl.focus({ preventScroll: true });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    closeMenu();
  };

  const handleClose = () => {
    // A queued close event must not reset a subsequently reopened dialog.
    if (!dialog.open) finishClose();
  };

  const handleKeydown = (event) => {
    if (!dialog.open || event.key !== 'Tab' ||
        event.altKey || event.ctrlKey || event.metaKey) return;

    const elements = focusableElements();
    const first = elements[0];
    const last = elements[elements.length - 1];
    const active = documentRoot.activeElement;

    if (!first) {
      event.preventDefault();
      closeControl.focus({ preventScroll: true });
      return;
    }

    if (event.shiftKey && (active === first || active === dialog || !dialog.contains(active))) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  };

  const handleNavigation = (event) => {
    if (event.target.closest?.('a[href]')) closeMenu();
  };

  const handlePageShow = () => {
    // Back/forward cache can restore a document with a modal still open.
    closeMenu();
  };

  const cleanup = () => {
    closeMenu();
    triggers.forEach((trigger) => {
      trigger.removeEventListener('click', openMenu);
      trigger.hidden = true;
    });
    closeControl.removeEventListener('click', closeMenu);
    dialog.removeEventListener('cancel', handleCancel);
    dialog.removeEventListener('close', handleClose);
    dialog.removeEventListener('keydown', handleKeydown);
    dialog.removeEventListener('click', handleNavigation);
    viewport.removeEventListener('pageshow', handlePageShow);
    root.classList.remove('navigation-ready');
  };

  triggers.forEach((trigger) => trigger.addEventListener('click', openMenu));
  closeControl.addEventListener('click', closeMenu);
  dialog.addEventListener('cancel', handleCancel);
  dialog.addEventListener('close', handleClose);
  dialog.addEventListener('keydown', handleKeydown);
  dialog.addEventListener('click', handleNavigation);
  viewport.addEventListener('pageshow', handlePageShow);

  // Reveal functional controls only after every required listener is attached.
  setExpanded(false);
  triggers.forEach((trigger) => { trigger.hidden = false; });
  root.classList.add('navigation-ready');

  return cleanup;
}
