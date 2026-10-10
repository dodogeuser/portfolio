/**
 * Geometric Core artwork. The controller owns loading, visibility and timing;
 * this module only creates, renders and releases a bounded Three.js scene.
 * No textures, remote resources, shadows or post-processing are used.
 */
export function createCoreScene({ THREE, canvas, quality = 'desktop' }) {
  const low = quality === 'low';
  const geometries = new Set();
  const materials = new Set();
  let renderer;
  let scene;
  let disposed = false;
  const geometry = (value) => { geometries.add(value); return value; };
  const material = (value) => { materials.add(value); return value; };

  // Also used by the construction error path, before all resources exist.
  function dispose() {
    if (disposed) return;
    disposed = true;
    for (const resource of [...geometries, ...materials]) {
      try { resource.dispose(); } catch { /* Continue releasing other resources. */ }
    }
    geometries.clear();
    materials.clear();
    try { scene?.clear(); } catch { /* Renderer cleanup must still run. */ }
    try { renderer?.dispose(); } catch { /* The context may already be lost. */ }
  }

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !low,
      powerPreference: 'low-power',
      depth: true,
      stencil: false,
    });
    renderer.setClearColor(0x09080d, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.debug.onShaderError = () => {
      throw new Error('Geometric Core shader initialization failed');
    };

    scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 24);
    camera.position.set(0, 0, 8);
    const sculpture = new THREE.Group();
    scene.add(sculpture);

    scene.add(new THREE.HemisphereLight(0xf0ebff, 0x211b30, 1.5));
    const key = new THREE.DirectionalLight(0xf0ebff, 3.1);
    key.position.set(3, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xa28af5, 1.8);
    rim.position.set(-4, -1, -3);
    scene.add(rim);
    const violet = new THREE.PointLight(0xa28af5, 7, 8, 2);
    violet.position.set(-2, 1, 2.7);
    scene.add(violet);

    const silverLine = material(new THREE.LineBasicMaterial({
      color: 0xf0ebff, transparent: true, opacity: 0.72,
    }));
    const violetLine = material(new THREE.LineBasicMaterial({
      color: 0xa28af5, transparent: true, opacity: 0.4,
    }));
    const latticeLine = material(new THREE.LineBasicMaterial({
      color: 0xb6aec9, transparent: true, opacity: 0.22,
      depthWrite: false,
    }));
    const orbitMetal = material(new THREE.MeshStandardMaterial({
      color: 0xb6aec9, metalness: 0.78, roughness: 0.38,
      transparent: true, opacity: 0.8, depthWrite: false,
    }));
    const orbitLight = material(new THREE.MeshBasicMaterial({
      color: 0xa28af5, transparent: true, opacity: 0.75,
      depthWrite: false,
    }));

    const core = new THREE.Group();
    core.rotation.set(0.18, -0.24, 0.12);
    sculpture.add(core);
    const facetGeometry = geometry(new THREE.IcosahedronGeometry(1.07, 0));
    const position = facetGeometry.getAttribute('position');
    const palette = [0x211b30, 0x393241, 0x625b73, 0x292331].map((hex) => new THREE.Color(hex));
    const colors = new Float32Array(position.count * 3);
    for (let vertex = 0; vertex < position.count; vertex += 1) {
      const color = palette[Math.floor(vertex / 3) % palette.length];
      colors[vertex * 3] = color.r;
      colors[vertex * 3 + 1] = color.g;
      colors[vertex * 3 + 2] = color.b;
    }
    facetGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const facetMaterial = material(new THREE.MeshStandardMaterial({
      vertexColors: true, metalness: 0.62, roughness: 0.47,
      emissive: 0x55418a, emissiveIntensity: 0.035,
      flatShading: true,
    }));
    core.add(new THREE.Mesh(facetGeometry, facetMaterial));
    core.add(new THREE.LineSegments(geometry(new THREE.EdgesGeometry(facetGeometry)), silverLine));
    const outerGeometry = geometry(new THREE.IcosahedronGeometry(1.29, 0));
    const outerWire = new THREE.LineSegments(geometry(new THREE.EdgesGeometry(outerGeometry)), violetLine);
    outerWire.rotation.set(0.35, 0.25, -0.2);
    core.add(outerWire);

    // Latitude/longitude lines without the diagonals of a triangulated sphere.
    const segments = low ? 32 : 64;
    const latticeVertices = [];
    const radius = 1.64;
    const addSegment = (a, b) => latticeVertices.push(...a, ...b);
    for (let latitude = -2; latitude <= 2; latitude += 1) {
      const phi = latitude * Math.PI / 6;
      const y = radius * Math.sin(phi);
      const r = radius * Math.cos(phi);
      for (let step = 0; step < segments; step += 1) {
        const a = step / segments * Math.PI * 2;
        const b = (step + 1) / segments * Math.PI * 2;
        addSegment([r * Math.cos(a), y, r * Math.sin(a)], [r * Math.cos(b), y, r * Math.sin(b)]);
      }
    }
    for (let meridian = 0; meridian < 6; meridian += 1) {
      const angle = meridian / 6 * Math.PI;
      for (let step = 0; step < segments; step += 1) {
        const a = step / segments * Math.PI * 2;
        const b = (step + 1) / segments * Math.PI * 2;
        addSegment(
          [radius * Math.cos(a) * Math.cos(angle), radius * Math.sin(a), radius * Math.cos(a) * Math.sin(angle)],
          [radius * Math.cos(b) * Math.cos(angle), radius * Math.sin(b), radius * Math.cos(b) * Math.sin(angle)],
        );
      }
    }
    const latticeGeometry = geometry(new THREE.BufferGeometry());
    latticeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(latticeVertices, 3));
    const lattice = new THREE.LineSegments(latticeGeometry, latticeLine);
    lattice.rotation.set(0.2, 0, -0.25);
    sculpture.add(lattice);

    const orbits = [];
    const orbitSettings = [
      { radius: 2.03, x: 1.08, y: 0.13, z: -0.48, speed: 0.065 },
      { radius: 2.33, x: -0.84, y: 0.63, z: 0.62, speed: -0.048 },
      { radius: 1.87, x: 0.46, y: -1.04, z: -0.17, speed: 0.082 },
      { radius: 2.48, x: 1.3, y: -0.28, z: 0.2, speed: -0.035 },
    ];
    for (const settings of orbitSettings.slice(0, low ? 3 : 4)) {
      const group = new THREE.Group();
      group.rotation.set(settings.x, settings.y, settings.z);
      const tube = geometry(new THREE.TorusGeometry(settings.radius, 0.008, low ? 6 : 8, low ? 48 : 96));
      group.add(new THREE.Mesh(tube, orbitMetal));
      const arc = geometry(new THREE.TorusGeometry(settings.radius, 0.011, low ? 6 : 8, low ? 12 : 20, Math.PI * 0.22));
      const highlight = new THREE.Mesh(arc, orbitLight);
      highlight.rotation.z = orbits.length * 1.7;
      group.add(highlight);
      sculpture.add(group);
      orbits.push({ group, ...settings });
    }

    const ticks = [];
    for (let tick = 0; tick < 24; tick += 1) {
      const angle = tick / 24 * Math.PI * 2;
      const start = 2.64;
      const end = tick % 6 === 0 ? 2.78 : 2.69;
      ticks.push(Math.cos(angle) * start, Math.sin(angle) * start, 0,
        Math.cos(angle) * end, Math.sin(angle) * end, 0);
    }
    const tickGeometry = geometry(new THREE.BufferGeometry());
    tickGeometry.setAttribute('position', new THREE.Float32BufferAttribute(ticks, 3));
    const tickMaterial = material(new THREE.LineBasicMaterial({
      color: 0xa28af5, transparent: true, opacity: 0.2, depthWrite: false,
    }));
    scene.add(new THREE.LineSegments(tickGeometry, tickMaterial));

    let elapsed = 0;
    let pointerX = 0;
    let pointerY = 0;
    const bounded = (value, limit = 1) => Number.isFinite(value) ? Math.max(-limit, Math.min(limit, value)) : 0;

    return {
      resize(width, height, dpr = 1) {
        if (disposed) return;
        const w = Math.max(1, Math.round(Number.isFinite(width) ? width : 1));
        const h = Math.max(1, Math.round(Number.isFinite(height) ? height : 1));
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.max(0.5, Math.min(low ? 1 : 1.5, Number.isFinite(dpr) ? dpr : 1)));
        renderer.setSize(w, h, false);
      },
      render(delta = 0, pointer = { x: 0, y: 0 }, depth = 0) {
        if (disposed) return;
        const dt = Math.max(0, Math.min(0.05, Number.isFinite(delta) ? delta : 0));
        elapsed += dt;
        const smoothing = 1 - Math.exp(-dt * 3.5);
        pointerX += (bounded(pointer.x) - pointerX) * smoothing;
        pointerY += (bounded(pointer.y) - pointerY) * smoothing;
        sculpture.rotation.x = pointerY * 0.065;
        sculpture.rotation.y = pointerX * 0.09;
        sculpture.position.y = bounded(depth) * -0.09;
        core.rotation.y = -0.24 + elapsed * 0.095;
        core.rotation.z = 0.12 + elapsed * 0.026;
        outerWire.rotation.y = 0.25 - elapsed * 0.055;
        lattice.rotation.y = elapsed * 0.025;
        for (const orbit of orbits) {
          orbit.group.rotation.z = orbit.z + elapsed * orbit.speed;
          orbit.group.rotation.x = orbit.x + Math.sin(elapsed * 0.09) * 0.035;
        }
        camera.position.z = 8 + bounded(depth) * 0.12;
        renderer.render(scene, camera);
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
