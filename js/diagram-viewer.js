'use strict';

(() => {
  const links = [...document.querySelectorAll('a.diagram-link')];
  if (!links.length || typeof HTMLDialogElement === 'undefined' ||
      typeof HTMLDialogElement.prototype.showModal !== 'function') return;

  const viewer = document.createElement('dialog');
  viewer.id = 'diagram-viewer';
  viewer.className = 'diagram-viewer';
  viewer.setAttribute('aria-labelledby', 'diagram-viewer-title');
  viewer.setAttribute('aria-describedby', 'diagram-viewer-description');
  viewer.innerHTML = `
    <header class="diagram-viewer__header">
      <h2 id="diagram-viewer-title" class="diagram-viewer__title"></h2>
      <button class="diagram-viewer__close" type="button">Close</button>
    </header>
    <div class="diagram-viewer__toolbar" role="group" aria-label="Diagram size">
      <button class="diagram-viewer__fit" type="button" aria-pressed="true">Fit to view</button>
      <button class="diagram-viewer__actual" type="button" aria-pressed="false">Actual size</button>
      <span class="diagram-viewer__status" role="status" aria-live="polite"></span>
    </div>
    <div class="diagram-viewer__viewport" role="region" aria-label="Diagram, scroll to inspect at actual size" tabindex="0">
      <img class="diagram-viewer__image" alt="" width="1536" height="1024" decoding="async" hidden>
    </div>
    <footer class="diagram-viewer__footer">
      <p id="diagram-viewer-description" class="diagram-viewer__description"></p>
      <a class="diagram-viewer__source" target="_blank" rel="noopener noreferrer">Open image in a new tab</a>
    </footer>`;
  document.body.append(viewer);

  const title = viewer.querySelector('.diagram-viewer__title');
  const description = viewer.querySelector('.diagram-viewer__description');
  const image = viewer.querySelector('.diagram-viewer__image');
  const viewport = viewer.querySelector('.diagram-viewer__viewport');
  const status = viewer.querySelector('.diagram-viewer__status');
  const source = viewer.querySelector('.diagram-viewer__source');
  const fitButton = viewer.querySelector('.diagram-viewer__fit');
  const actualButton = viewer.querySelector('.diagram-viewer__actual');
  let opener = null;
  let previousOverflow = '';
  let pointerStartedOutside = false;

  function setActualSize(actual) {
    viewport.classList.toggle('is-actual-size', actual);
    fitButton.setAttribute('aria-pressed', String(!actual));
    actualButton.setAttribute('aria-pressed', String(actual));
    viewport.scrollLeft = 0;
    viewport.scrollTop = 0;
  }

  function imageReady() {
    if (!viewer.open || !image.naturalWidth) return;
    image.hidden = false;
    fitButton.disabled = false;
    actualButton.disabled = false;
    status.textContent = '';
    viewport.removeAttribute('aria-busy');
  }

  image.addEventListener('load', imageReady);
  image.addEventListener('error', () => {
    if (!viewer.open) return;
    image.hidden = true;
    status.textContent = 'The diagram could not be loaded. Try opening the image in a new tab.';
    viewport.removeAttribute('aria-busy');
  });

  links.forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', viewer.id);
    const label = link.getAttribute('aria-label');
    if (label) link.setAttribute('aria-label', label.replace(/ \(opens in a new tab\)$/, ''));
    link.addEventListener('click', event => {
      // Keep native new-tab, download and modified-click behavior available.
      if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
          event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download')) return;
      const originalImage = link.querySelector('img');
      if (!originalImage || viewer.open) return;

      const projectTitle = link.closest('article')?.querySelector('h3')?.innerText;
      title.textContent = projectTitle?.replace(/\s+/g, ' ').trim() || 'Technical architecture';
      description.textContent = originalImage.alt;
      image.alt = originalImage.alt;
      image.width = originalImage.naturalWidth || originalImage.width || 1536;
      image.height = originalImage.naturalHeight || originalImage.height || 1024;
      source.href = link.href;
      status.textContent = 'Loading diagram…';
      image.hidden = true;
      fitButton.disabled = true;
      actualButton.disabled = true;
      viewport.setAttribute('aria-busy', 'true');
      setActualSize(false);

      try {
        viewer.showModal();
      } catch {
        return; // A regular image link remains usable if the dialog cannot open.
      }
      event.preventDefault();
      opener = link;
      previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      image.src = link.href;
      if (image.complete && image.naturalWidth) imageReady();
    });
  });

  fitButton.addEventListener('click', () => setActualSize(false));
  actualButton.addEventListener('click', () => setActualSize(true));
  viewer.querySelector('.diagram-viewer__close').addEventListener('click', () => viewer.close());

  function isOutside(event) {
    const bounds = viewer.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom;
  }

  viewer.addEventListener('pointerdown', event => {
    pointerStartedOutside = event.target === viewer && isOutside(event);
  });
  viewer.addEventListener('pointercancel', () => { pointerStartedOutside = false; });
  viewer.addEventListener('click', event => {
    if (pointerStartedOutside && event.target === viewer && isOutside(event)) viewer.close();
    pointerStartedOutside = false;
  });
  viewer.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow;
    pointerStartedOutside = false;
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    opener = null;
  });
})();
