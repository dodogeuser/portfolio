// The SVG and its accessible description stay in HTML; WebGL is optional.
const noop = () => {};
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function getCorePolicy({
  reducedMotion = false, forcedColors = false, saveData = false,
  deviceMemory, hardwareConcurrency, coarsePointer = false, width = 1024,
} = {}) {
  const lowEnd = (deviceMemory > 0 && deviceMemory <= 2) ||
    (hardwareConcurrency > 0 && hardwareConcurrency <= 2);
  const low = coarsePointer || width < 768 ||
    (deviceMemory > 0 && deviceMemory <= 4) ||
    (hardwareConcurrency > 0 && hardwareConcurrency <= 4);
  return {
    enabled: !reducedMotion && !forcedColors && !saveData && !lowEnd,
    quality: low ? 'low' : 'desktop',
    maxDpr: low ? 1 : 1.5,
    maxFps: 30,
    maxSize: low ? 640 : 800,
    pointer: !coarsePointer,
  };
}

async function loadCoreScene() {
  // Literal module-relative paths work at / and at GitHub Pages subdirectories.
  const [THREE, { createCoreScene }] = await Promise.all([
    import('../vendor/three/0.180.0/three.module.min.js'),
    import('./core-scene.js'),
  ]);
  return { THREE, createCoreScene };
}

/** Injected environment/loader allow lifecycle tests without pretending to be WebGL. */
export function initCore({ window: host = window, document: doc = document,
  loadScene = loadCoreScene } = {}) {
  const stage = doc.querySelector('[data-core-stage]');
  if (!stage?.querySelector('img') || typeof host.matchMedia !== 'function' ||
      typeof host.IntersectionObserver !== 'function' ||
      typeof host.ResizeObserver !== 'function' ||
      typeof host.requestAnimationFrame !== 'function' ||
      typeof host.cancelAnimationFrame !== 'function') return noop;

  const reduced = host.matchMedia('(prefers-reduced-motion: reduce)');
  const forced = host.matchMedia('(forced-colors: active)');
  const coarse = host.matchMedia('(hover: none), (pointer: coarse)');
  const printing = host.matchMedia('print');
  const connection = host.navigator?.connection;
  const removers = [];
  const pendingContexts = new Map();
  const pointer = { x: 0, y: 0 };
  let scene, canvas, activeContext, control, frame = 0, lastTime = null, generation = 0;
  let visible = false, disposed = false, loading = false, failed = false;
  let userPaused = false;
  let policy = readPolicy();
  let width = 0, height = 0, depth = 0, depthDirty = true;
  let sizingKey = '';
  let slowFrames = 0, sampledFrames = 0;

  function readPolicy() {
    return getCorePolicy({ reducedMotion: reduced.matches,
      forcedColors: forced.matches, saveData: connection?.saveData,
      coarsePointer: coarse.matches, width: host.innerWidth,
      deviceMemory: host.navigator?.deviceMemory,
      hardwareConcurrency: host.navigator?.hardwareConcurrency });
  }

  function listen(target, type, callback, options) {
    if (typeof target?.addEventListener === 'function') {
      target.addEventListener(type, callback, options);
      removers.push(() => target.removeEventListener(type, callback, options));
    } else if (type === 'change' && typeof target?.addListener === 'function') {
      target.addListener(callback);
      removers.push(() => target.removeListener(callback));
    }
  }

  const shouldRun = () => !disposed && !failed && visible && policy.enabled &&
    !userPaused && !doc.hidden && !printing.matches && width > 0 && height > 0 &&
    !doc.documentElement.classList.contains('menu-open');

  function pause() {
    if (frame) host.cancelAnimationFrame(frame);
    frame = 0;
    lastTime = null;
    pointer.x = pointer.y = 0;
  }

  function releaseScene() {
    pause();
    generation++;
    loading = false;
    stage.classList.remove('core-ready');
    if (canvas) canvas.removeEventListener('webglcontextlost', onContextLost);
    try { scene?.dispose(); } catch { /* Fallback must survive cleanup failures. */ }
    scene = undefined;
    sizingKey = '';
    releaseContext(activeContext);
    activeContext = undefined;
    for (const candidate of pendingContexts.keys()) discardPending(candidate);
    canvas?.remove();
    canvas = undefined;
  }

  function releaseContext(context) {
    // Release a canceled probe too, rather than holding its GPU context until GC.
    // Active scene listeners/resources are disposed before this optional extension.
    try { context?.getExtension?.('WEBGL_lose_context')?.loseContext(); } catch { /* Optional API. */ }
  }

  function discardPending(candidate) {
    const context = pendingContexts.get(candidate);
    pendingContexts.delete(candidate);
    releaseContext(context);
    candidate.remove();
  }

  function fail() {
    failed = true; // No retry loop after import, driver or context failure.
    releaseScene();
    if (control) control.hidden = true;
  }

  function onContextLost(event) {
    event.preventDefault();
    fail(); // Keep the static illustration until the next document load.
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    width = Math.max(0, rect.width);
    height = Math.max(0, rect.height);
    depthDirty = true;
    if (!scene || !width || !height || !shouldRun()) return;
    const scale = Math.min(1, policy.maxSize / width, policy.maxSize / height);
    const renderWidth = Math.round(width * scale);
    const renderHeight = Math.round(height * scale);
    const dpr = Math.min(host.devicePixelRatio || 1, policy.maxDpr);
    const nextKey = `${renderWidth}/${renderHeight}/${dpr}`;
    if (nextKey === sizingKey) return;
    try {
      scene.resize(renderWidth, renderHeight, dpr);
      sizingKey = nextKey;
    } catch { fail(); }
  }

  function requestFrame() {
    if (!frame && scene && shouldRun()) frame = host.requestAnimationFrame(tick);
  }

  function tick(time) {
    frame = 0;
    if (!shouldRun() || !scene) { pause(); return; }
    const elapsed = lastTime === null ? 1000 / policy.maxFps : time - lastTime;
    if (elapsed >= 1000 / policy.maxFps - 0.5) {
      lastTime = time;
      if (depthDirty) {
        const rect = stage.getBoundingClientRect();
        depth = clamp((host.innerHeight / 2 - (rect.top + rect.height / 2)) /
          Math.max(host.innerHeight, 1), -1, 1);
        depthDirty = false;
      }
      try {
        scene.render(Math.min(elapsed / 1000, 0.05), pointer, depth);
        // Switch presentation only after a successful frame. The image keeps its alt.
        stage.classList.add('core-ready');
      } catch { fail(); return; }
      // Conservative escape hatch for sustained slow frame scheduling on unknown devices.
      sampledFrames++;
      if (elapsed > 90) slowFrames++;
      if (sampledFrames >= 90) {
        if (slowFrames > 45) { fail(); return; }
        sampledFrames = slowFrames = 0;
      }
    }
    requestFrame();
  }

  async function start() {
    if (loading || scene || !shouldRun()) return;
    loading = true;
    const token = ++generation;
    const candidate = doc.createElement('canvas');
    candidate.className = 'core-canvas';
    candidate.setAttribute('aria-hidden', 'true');
    candidate.setAttribute('tabindex', '-1');
    try {
      // Use the same canvas/context for capability checking and rendering; no extra GPU context.
      const context = candidate.getContext('webgl2', { alpha: true, depth: true,
        stencil: false, failIfMajorPerformanceCaveat: true,
        antialias: policy.quality !== 'low', powerPreference: 'low-power' });
      if (!context) {
        if (token === generation && !disposed) fail();
        return;
      }
      pendingContexts.set(candidate, context);
      const { THREE, createCoreScene } = await loadScene();
      if (disposed || token !== generation || !shouldRun()) return;
      if (context.isContextLost?.()) { fail(); return; }
      pendingContexts.delete(candidate);
      canvas = candidate;
      activeContext = context;
      canvas.addEventListener('webglcontextlost', onContextLost);
      scene = createCoreScene({ THREE, canvas, quality: policy.quality });
      stage.append(canvas);
      if (!control) {
        control = doc.createElement('button');
        control.className = 'core-motion-control';
        control.setAttribute('type', 'button');
        updateControl();
        listen(control, 'click', () => {
          userPaused = !userPaused;
          updateControl();
          refresh();
        });
        stage.append(control);
      }
      resize();
      requestFrame();
    } catch {
      if (!disposed && token === generation) fail();
    } finally {
      if (token === generation) loading = false;
      // A skipped late load never enters the document or displaces the fallback.
      if (candidate !== canvas) discardPending(candidate);
    }
  }

  function updateControl() {
    if (!control) return;
    control.textContent = userPaused ? 'Resume' : 'Pause';
    control.setAttribute('aria-label', userPaused ? 'Resume Core animation' : 'Pause Core animation');
    control.hidden = !policy.enabled || failed || printing.matches;
  }

  function refresh() {
    if (disposed) return;
    const next = readPolicy();
    const changedQuality = next.quality !== policy.quality;
    policy = next;
    if (!policy.enabled || printing.matches || changedQuality) releaseScene();
    updateControl();
    resize();
    if (!shouldRun()) {
      pause();
      if (loading && !scene) {
        generation++;
        loading = false;
        for (const candidate of pendingContexts.keys()) discardPending(candidate);
      }
      return;
    }
    if (scene) requestFrame();
    else void start();
  }

  function onPointer(event) {
    if (!shouldRun() || !policy.pointer || event.pointerType === 'touch') return;
    pointer.x = clamp(event.clientX / Math.max(host.innerWidth, 1) * 2 - 1, -1, 1);
    pointer.y = clamp(event.clientY / Math.max(host.innerHeight, 1) * 2 - 1, -1, 1);
  }

  const intersection = new host.IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === stage) visible = entry.isIntersecting && entry.intersectionRatio > 0;
    }
    refresh();
  }, { threshold: [0, 0.01] });
  const sizing = new host.ResizeObserver(refresh);
  const menu = typeof host.MutationObserver === 'function' ?
    new host.MutationObserver(refresh) : null;
  listen(reduced, 'change', refresh);
  listen(forced, 'change', refresh);
  listen(coarse, 'change', refresh);
  listen(printing, 'change', refresh);
  listen(connection, 'change', refresh);
  listen(doc, 'visibilitychange', refresh);
  listen(host, 'resize', refresh, { passive: true });
  listen(host, 'scroll', () => { depthDirty = true; }, { passive: true });
  listen(host, 'pointermove', onPointer, { passive: true });
  listen(host, 'pointerout', (event) => {
    if (!event.relatedTarget) pointer.x = pointer.y = 0;
  }, { passive: true });
  intersection.observe(stage);
  sizing.observe(stage);
  menu?.observe(doc.documentElement, { attributes: true, attributeFilter: ['class'] });

  return function disposeCore() {
    if (disposed) return;
    disposed = true;
    intersection.disconnect();
    sizing.disconnect();
    menu?.disconnect();
    for (const remove of removers) remove();
    releaseScene();
    control?.remove();
    control = undefined;
  };
}
