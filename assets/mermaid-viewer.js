// Derive the site root from this module, including a GitHub project base path.
const root = new URL('../', import.meta.url);
const flows = new URL('flows/', root);
const MAX_BYTES = 256 * 1024;
let mermaidPromise;
let nextId = 0;

function renderer() {
  if (!mermaidPromise) {
    mermaidPromise = import('https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.esm.min.mjs')
      .then(({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false, securityLevel: 'strict', theme: 'default',
          suppressErrorRendering: true, maxTextSize: MAX_BYTES, maxEdges: 1000,
          flowchart: { htmlLabels: false },
          secure: ['secure', 'securityLevel', 'startOnLoad', 'maxTextSize',
            'maxEdges', 'suppressErrorRendering', 'flowchart'],
        });
        return mermaid;
      }).catch(error => { mermaidPromise = undefined; throw error; });
  }
  return mermaidPromise;
}

export function diagramURL(input, base = root) {
  const url = new URL(input, base);
  const path = decodeURIComponent(url.pathname);
  if (url.origin !== root.origin || url.username || url.password ||
      !url.pathname.startsWith(flows.pathname) ||
      !/^[\w/ .-]+\.mmd$/i.test(path) || path.split('/').some(p => p === '.' || p === '..') ||
      url.search || url.hash) {
    throw new Error('Choose a .mmd file from this site’s flows directory.');
  }
  return url;
}

async function fetchDiagram(url, signal) {
  const response = await fetch(url, { signal, credentials: 'omit', redirect: 'error' });
  if (!response.ok) throw new Error(`Diagram could not be loaded (HTTP ${response.status}).`);
  if (Number(response.headers.get('content-length')) > MAX_BYTES) throw new Error('Diagram is too large.');
  if (/text\/html/i.test(response.headers.get('content-type') || '')) throw new Error('The server returned a page instead of a diagram.');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let size = 0, text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) throw new Error('Diagram is too large.');
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally { await reader.cancel(); reader.releaseLock(); }
}

function panZoom(stage, svg, signal, onTap) {
  const original = svg.getAttribute('viewBox').trim().split(/[\s,]+/).map(Number);
  let box = [...original], pointer, moved = 0;
  const draw = () => svg.setAttribute('viewBox', box.join(' '));
  const zoom = factor => {
    const width = Math.min(original[2] * 4, Math.max(original[2] / 20, box[2] * factor));
    const height = box[3] * width / box[2];
    box = [box[0] + (box[2] - width) / 2, box[1] + (box[3] - height) / 2, width, height];
    draw();
  };
  const reset = () => { box = [...original]; draw(); };
  stage.addEventListener('wheel', e => { e.preventDefault(); zoom(e.deltaY > 0 ? 1.15 : 1 / 1.15); }, { passive: false, signal });
  stage.addEventListener('pointerdown', e => {
    if (e.button !== 0 || pointer) return;
    pointer = { id: e.pointerId, x: e.clientX, y: e.clientY };
    moved = 0;
    stage.setPointerCapture(e.pointerId);
  }, { signal });
  stage.addEventListener('pointermove', e => {
    if (!pointer || e.pointerId !== pointer.id) return;
    moved += Math.abs(e.clientX - pointer.x) + Math.abs(e.clientY - pointer.y);
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    const inverse = matrix.inverse();
    const from = new DOMPoint(pointer.x, pointer.y).matrixTransform(inverse);
    const to = new DOMPoint(e.clientX, e.clientY).matrixTransform(inverse);
    box[0] += from.x - to.x; box[1] += from.y - to.y;
    pointer.x = e.clientX; pointer.y = e.clientY; draw();
  }, { signal });
  // Pointer capture retargets events to the stage, so hit-test the node ourselves.
  stage.addEventListener('pointerup', e => {
    if (pointer && e.pointerId === pointer.id && moved < 5) {
      onTap?.(document.elementFromPoint(e.clientX, e.clientY));
    }
  }, { signal });
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    stage.addEventListener(event, () => { pointer = undefined; }, { signal });
  }
  return { zoom, reset };
}

const relPath = url => url.pathname.slice(root.pathname.length);

function viewerURL(diagram, trail = []) {
  const url = new URL('viewer/', root);
  url.searchParams.set('diagram', diagram);
  if (trail.length) url.searchParams.set('trail', trail.join(','));
  return url;
}

// Subflow nodes are labelled "Name: file.mmd"; make them navigable.
function subflowOf(node) {
  const match = /([\w-]+\.mmd)\s*$/i.exec(node.textContent.trim());
  if (!match) return;
  try { return relPath(diagramURL(match[1], flows)); } catch { return; }
}

function createViewer(host) {
  host.classList.add('flow-viewer');
  // Only fixed UI markup is inserted here; filenames/errors use textContent.
  host.innerHTML = `<nav class="flow-breadcrumb" aria-label="Breadcrumb"><ol></ol></nav>
    <div class="flow-toolbar"><strong>Flow</strong>
    <button type="button" data-action="in" aria-label="Zoom in">+</button>
    <button type="button" data-action="out" aria-label="Zoom out">−</button>
    <button type="button" data-action="reset">Reset</button>
    <a data-link="source" target="_blank" rel="noopener">Source</a></div>
    <p class="flow-status" role="status" aria-live="polite"></p>
    <div class="flow-stage" role="region" aria-label="Flow diagram"></div>`;
  const crumbs = host.querySelector('.flow-breadcrumb ol');
  const title = host.querySelector('strong');
  const status = host.querySelector('.flow-status');
  const stage = host.querySelector('.flow-stage');
  const controls = [...host.querySelectorAll('[data-action]')];
  let navigation;
  host.addEventListener('click', e => {
    const action = e.target.closest('button')?.dataset.action;
    if (action === 'in') navigation?.zoom(1 / 1.25);
    if (action === 'out') navigation?.zoom(1.25);
    if (action === 'reset') navigation?.reset();
  });

  function renderCrumbs(trail, current) {
    const items = [{ label: 'Documentation', href: root.href }];
    trail.forEach((path, i) => items.push({
      label: path.split('/').pop(), href: viewerURL(path, trail.slice(0, i)).href,
    }));
    items.push({ label: current.split('/').pop() });
    crumbs.replaceChildren(...items.map((item, i) => {
      const li = document.createElement('li');
      if (item.href && i < items.length - 1) {
        const a = document.createElement('a');
        a.href = item.href; a.textContent = item.label;
        li.append(a);
      } else {
        li.textContent = item.label;
        li.setAttribute('aria-current', 'page');
      }
      return li;
    }));
  }

  return async (input, trailInput = []) => {
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, 15000);
    controls.forEach(b => { b.disabled = true; });
    status.textContent = 'Loading diagram…';
    try {
      const url = diagramURL(input);
      const trail = trailInput.map(p => relPath(diagramURL(p)));
      const current = relPath(url);
      title.textContent = decodeURIComponent(url.pathname.split('/').pop());
      document.title = `${title.textContent} – Flow viewer`;
      renderCrumbs(trail, current);
      host.querySelector('[data-link="source"]').href = url.href;
      const [source, mermaid] = await Promise.all([fetchDiagram(url, controller.signal), renderer()]);
      const { svg } = await mermaid.render(`flow-svg-${++nextId}`, source);
      if (timedOut) throw new Error('Loading timed out. Please try again.');
      // Mermaid sanitizes its SVG in strict mode; do not bind diagram callbacks.
      stage.innerHTML = svg;
      const open = target => {
        const sub = subflowOf(target);
        if (sub && sub !== current) location.assign(viewerURL(sub, [...trail, current]).href);
      };
      stage.querySelectorAll('g.node').forEach(node => {
        if (!subflowOf(node)) return;
        node.classList.add('flow-subflow');
        node.setAttribute('tabindex', '0');
        node.setAttribute('role', 'link');
        node.addEventListener('keydown', e => { if (e.key === 'Enter') open(node); });
      });
      navigation = panZoom(stage, stage.querySelector('svg'), controller.signal,
        target => { const node = target?.closest('g.node'); if (node) open(node); });
      controls.forEach(b => { b.disabled = false; });
      status.textContent = '';
    } catch (error) {
      status.textContent = timedOut ? 'Loading timed out. Please try again.' : `Unable to show diagram: ${error.message}`;
    } finally { clearTimeout(timer); }
  };
}

const page = document.getElementById('flow-viewer-page');
if (page) {
  const params = new URL(location.href).searchParams;
  const trail = (params.get('trail') || '').split(',').filter(Boolean);
  createViewer(page)(params.get('diagram') || 'flows/project.mmd', trail);
}

// Open diagram links in the viewer page, in the same window.
document.addEventListener('click', event => {
  if (page || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href]');
  if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
  let url;
  try { url = diagramURL(link.href); } catch { return; }
  event.preventDefault();
  location.assign(viewerURL(relPath(url)).href);
});

// Preserve the repository's existing fenced Mermaid support.
async function renderInline() {
  const nodes = [...document.querySelectorAll('code.language-mermaid')];
  if (!nodes.length) return;
  try {
    const mermaid = await renderer();
    for (const node of nodes) {
      try {
        const { svg } = await mermaid.render(`inline-flow-${++nextId}`, node.textContent);
        const output = document.createElement('div');
        output.innerHTML = svg;
        (node.closest('pre') || node).replaceWith(output);
      } catch { /* Keep the original code readable if a diagram is invalid. */ }
    }
  } catch { /* CDN unavailable: preserve source and normal links. */ }
}
renderInline();
