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

function diagramURL(input, base = root) {
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

// Keep documentation links connected to the HTML viewer.
document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href]');
  if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
  let source;
  try { source = diagramURL(link.href); } catch { return; }
  const match = /^([A-Za-z0-9][A-Za-z0-9_-]{0,79})\.mmd$/.exec(source.pathname.slice(flows.pathname.length));
  if (!match) return;
  const viewer = new URL(root);
  viewer.searchParams.set('flow', match[1]);
  event.preventDefault();
  location.assign(viewer.href);
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
