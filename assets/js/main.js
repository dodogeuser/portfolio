import { initNavigation } from './navigation.js';

// Modules defer automatically. Essential content and links live in the HTML.
initNavigation();

// Optional module loading cannot delay or prevent navigation initialization.
let disposeEnhancements = [];
let enhancementGeneration = 0;
function startEnhancements() {
  const token = ++enhancementGeneration;
  const initializers = [
    import('./motion.js').then(({ initMotion }) => initMotion),
    import('./core-controller.js').then(({ initCore }) => initCore),
  ];
  return Promise.allSettled(initializers.map(async (loading) => {
    const initialize = await loading;
    if (token !== enhancementGeneration) return;
    disposeEnhancements.push(initialize());
  }));
}
function stopEnhancements() {
  enhancementGeneration++;
  for (const dispose of disposeEnhancements) {
    try { dispose(); } catch { /* Never interfere with document navigation. */ }
  }
  disposeEnhancements = [];
}
export let enhancementsReady = startEnhancements();
window.addEventListener('pagehide', stopEnhancements);
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    stopEnhancements();
    enhancementsReady = startEnhancements();
  }
});
