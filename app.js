const selectEl = document.getElementById('killteamSelect');
const stageEl = document.getElementById('cardStage');
const exportSelect = document.getElementById('exportSelect');
const clearBtn = document.getElementById('clearButton');
const clearCacheBtn = document.getElementById('clearCacheButton');
const footerControls = document.getElementById('footerControls');

const TAROT_WIDTH_IN = 2.75;
const TAROT_HEIGHT_IN = 4.75;
const CSS_DPI = 96;

let killteams = [];
let currentKillteamId = null;

function loadKillteams() {
  // Wait for kill teams to be loaded if not ready yet
  if (window.KILLTEAM_DATA && Array.isArray(window.KILLTEAM_DATA)) {
    killteams = window.KILLTEAM_DATA;
    hydrateSelect();
  } else {
    // Wait for the killteamsLoaded event
    window.addEventListener(
      'killteamsLoaded',
      () => {
        killteams = Array.isArray(window.KILLTEAM_DATA) ? window.KILLTEAM_DATA : [];
        hydrateSelect();
      },
      { once: true }
    );
  }
}

function hydrateSelect() {
  if (!selectEl) return;
  // Sort kill teams alphabetically by name
  const sortedKillteams = [...killteams].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  selectEl.innerHTML =
    '<option value="" disabled selected>Choose a kill team…</option>' +
    sortedKillteams
      .map((killteam) => `<option value="${killteam.id}">${killteam.name}</option>`)
      .join('');
}

function renderCard(killteamId) {
  const killteam = killteams.find((entry) => entry.id === killteamId);
  if (!killteam) {
    currentKillteamId = null;
    stageEl.innerHTML =
      '<p class="empty-state">Select a kill team above to preview its tactical card.</p>';
    if (footerControls) {
      footerControls.classList.remove('footer-controls--visible');
    }
    return;
  }

  currentKillteamId = killteam.id;
  stageEl.innerHTML = `
    <article class="card" data-killteam="${killteam.id}">
      <header class="card__header">
        <span class="card__tagline">${killteam.tagline ?? ''}</span>
        <h2>${killteam.name}</h2>
        ${
          killteam.archetypes
            ? `<div class="card__archetypes">${
                Array.isArray(killteam.archetypes)
                  ? killteam.archetypes.map((a) => `<span class=\"chip\">${a}</span>`).join(' ')
                  : `<span class=\"chip\">${killteam.archetypes}</span>`
              }</div>`
            : ''
        }
        ${killteam.updated ? `<span class="card__updated">Updated: ${killteam.updated}</span>` : ''}
      </header>
      <section class="card__body">
          ${renderSection('Weapons', killteam.weapons)}
            ${renderSection('Impacts You', killteam.impactsYou)}
            ${renderSection('Impacts Them', killteam.impactsThem)}
      </section>
    </article>
  `;

  if (footerControls) {
    footerControls.classList.add('footer-controls--visible');
  }
}

// Utility to format archetypes for Markdown
function formatArchetypesForMarkdown(archetypes) {
  if (!archetypes) return '';
  if (Array.isArray(archetypes)) return `**Archetypes:** ${archetypes.join(', ')}\n\n`;
  return `**Archetypes:** ${archetypes}\n\n`;
}

function renderSection(title, items = []) {
  // Support either: array of strings (legacy) OR object of subcategory -> array of strings
  if (!items) return '';

  // If it's an array, render a single section
  if (Array.isArray(items)) {
    if (!items.length) return '';
    const listItems = items
      .map((it) => {
        // support either plain string or item object: { text: '...', important: true }
        if (typeof it === 'string') {
          return `<li>${it}</li>`;
        }
        if (it && typeof it === 'object') {
          const safeText = it.text || '';
          const cls = it.important ? 'marker-important' : '';
          return `<li><span class="${cls}">${safeText}</span></li>`;
        }
        return '';
      })
      .join('');
    return `
      <div class="card-section">
        <h3 class="card-section__title">${title}</h3>
        <ul class="card-section__list">
          ${listItems}
        </ul>
      </div>
    `;
  }

  // If it's an object, each key is a subcategory with its own array
  if (typeof items === 'object') {
    const subSections = Object.keys(items)
      .map((subTitle) => {
        const subItems = Array.isArray(items[subTitle]) ? items[subTitle] : [];
        if (!subItems.length) return '';
        const list = subItems
          .map((it) => {
            if (typeof it === 'string') return `<li>${it}</li>`;
            if (it && typeof it === 'object') {
              const safeText = it.text || '';
              const cls = it.important ? 'marker-important' : '';
              return `<li><span class="${cls}">${safeText}</span></li>`;
            }
            return '';
          })
          .join('');
        return `
        <div class="card-subsection">
          <h4 class="card-subsection__title">${subTitle}</h4>
          <ul class="card-section__list">
            ${list}
          </ul>
        </div>
      `;
      })
      .join('');

    if (!subSections) return '';
    return `
      <div class="card-section">
        <h3 class="card-section__title">${title}</h3>
        ${subSections}
      </div>
    `;
  }

  return '';
}

function handleSelectChange(event) {
  renderCard(event.target.value);
}

function handleExportChange(event) {
  const format = event.target.value;
  if (!format) return;

  const cardEl = stageEl.querySelector('.card');
  if (!cardEl) {
    alert('Please select a kill team first.');
    event.target.value = '';
    return;
  }

  const killteam = killteams.find((entry) => entry.id === currentKillteamId);
  const label = killteam ? killteam.name.replace(/\s+/g, '-').toLowerCase() : 'kill-team-card';

  if (format === 'md') {
    exportMarkdownOnly(killteam, label);
  } else if (format === 'pdf') {
    exportAsMarkdownAndPDF(killteam, label);
  } else if (format === 'pdf-tarot') {
    exportAsTarotPDF(killteam, label);
  }

  // Reset dropdown
  event.target.value = '';
}

function buildMarkdown(killteam) {
  if (!killteam) return '';
  let md = `# ${killteam.name}\n\n`;
  if (killteam.tagline) md += `*${killteam.tagline}*\n\n`;
  // Archetypes at top
  if (killteam.archetypes) md += formatArchetypesForMarkdown(killteam.archetypes);
  if (killteam.updated) md += `**Updated:** ${killteam.updated}\n\n`;

  function appendSection(title, items) {
    if (!items) return;
    if (Array.isArray(items) && items.length > 0) {
      md += `## ${title}\n\n`;
      items.forEach((it) => {
        if (typeof it === 'string') md += `- ${it}\n`;
        else if (it && typeof it === 'object') {
          const text = it.text || '';
          if (it.important) md += `- **${text}**\n`;
          else md += `- ${text}\n`;
        }
      });
      md += '\n';
    } else if (typeof items === 'object') {
      const keys = Object.keys(items);
      if (!keys.length) return;
      md += `## ${title}\n\n`;
      keys.forEach((sub) => {
        const subItems = Array.isArray(items[sub]) ? items[sub] : [];
        if (!subItems.length) return;
        md += `### ${sub}\n\n`;
        subItems.forEach((it) => {
          if (typeof it === 'string') md += `- ${it}\n`;
          else if (it && typeof it === 'object') {
            const text = it.text || '';
            if (it.important) md += `- **${text}**\n`;
            else md += `- ${text}\n`;
          }
        });
        md += '\n';
      });
    }
  }

  appendSection('Weapons', killteam.weapons);
  appendSection('Impacts You', killteam.impactsYou);
  appendSection('Impacts Them', killteam.impactsThem);

  return md;
}

function exportMarkdownOnly(killteam, label) {
  if (!killteam) return;
  const md = buildMarkdown(killteam);
  try {
    const blob = new Blob([md], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.download = `${label}.md`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (e) {
    console.error('Failed to download markdown file', e);
  }
}

function exportAsMarkdownAndPDF(killteam, label) {
  if (!killteam) return;

  const md = buildMarkdown(killteam);

  // Render markdown to HTML then capture to PDF
  const markedAvailable =
    (typeof window.marked === 'object' && typeof window.marked.parse === 'function') ||
    typeof marked === 'function';
  if (!markedAvailable) {
    console.warn('marked.js not available — skipping PDF generation');
    return;
  }

  const mdHtml = window.marked && window.marked.parse ? window.marked.parse(md) : marked(md);

  // Render to a larger PDF page (A4) to improve readability
  const PDF_WIDTH_IN = 8.27; // A4 width in inches
  const PDF_HEIGHT_IN = 11.69; // A4 height in inches
  const widthPx = PDF_WIDTH_IN * CSS_DPI;
  const heightPx = PDF_HEIGHT_IN * CSS_DPI;
  const scale = Math.max(window.devicePixelRatio || 2, 2);

  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = `${widthPx}px`;
  container.style.background = '#0b0b0d';
  container.style.color = '#efe6cf';
  container.style.padding = '28px';
  container.style.boxSizing = 'border-box';
  container.innerHTML = `
    <div class="wy-theme">
      <header class="wy-header">
        <div class="wy-accent"></div>
        <h1>${killteam.name}</h1>
        ${killteam.tagline ? `<div class="wy-tagline">${killteam.tagline}</div>` : ''}
        ${
          killteam.archetypes
            ? `<div class="wy-archetypes">${
                Array.isArray(killteam.archetypes)
                  ? killteam.archetypes.join(' · ')
                  : killteam.archetypes
              }</div>`
            : ''
        }
      </header>
      <article class="md-export" style="font-family: Inter, system-ui, sans-serif; font-size: 16px; line-height:1.8;">${mdHtml}</article>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    .wy-theme{background:linear-gradient(180deg,#0b0b0d,#0f1115);padding:12px;border:1px solid rgba(212,175,55,0.15);box-shadow:0 6px 18px rgba(0,0,0,0.6)}
    .wy-header{border-bottom:2px solid rgba(212,175,55,0.12);padding-bottom:8px;margin-bottom:12px;display:block}
    .wy-accent{height:6px;background:linear-gradient(90deg,#d4af37,#b97a00);width:100%;margin-bottom:8px}
    .wy-header h1{font-family:Oswald,serif;color:#f6eadb;margin:0;padding:0;font-size:1.6rem;letter-spacing:1px;text-transform:uppercase}
    .wy-tagline{color:#e6d6b0;font-style:italic;margin-top:4px;font-size:0.9rem}
    .wy-archetypes{color:#ffdca1;margin-top:6px;font-weight:600}
    .md-export{max-width:100%;color:#efe6cf}
    .md-export h1{font-family:Oswald,serif;font-size:1.3rem;margin:0 0 .6rem}
    .md-export h2{font-family:Oswald,serif;font-size:1.05rem;margin:0 0 .5rem}
    .md-export h3{font-weight:600;margin:0 0 .4rem}
    .md-export p{margin:0 0 .5rem}
    .md-export ul{padding-left:1.1rem;margin:0 0 .6rem}
    .md-export li{margin:0 0 .35rem}
    .md-export strong{color:#fff}
  `;
  container.appendChild(style);
  document.body.appendChild(container);

  if (typeof html2canvas !== 'function' || typeof window.jspdf === 'undefined') {
    console.warn('html2canvas/jsPDF not available — cannot generate PDF');
    document.body.removeChild(container);
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [PDF_WIDTH_IN, PDF_HEIGHT_IN],
  });

  html2canvas(container, {
    backgroundColor: '#0b0b0d',
    scale,
    width: widthPx,
    scrollX: 0,
    scrollY: 0,
  })
    .then((canvas) => {
      try {
        const pxPerPdfPage = heightPx * scale;
        const totalHeight = canvas.height;
        const totalSlices = Math.max(1, Math.ceil(totalHeight / pxPerPdfPage));

        for (let sliceIndex = 0; sliceIndex < totalSlices; sliceIndex++) {
          const y = sliceIndex * pxPerPdfPage;
          const sliceHeight = Math.min(pxPerPdfPage, totalHeight - y);

          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = sliceHeight;
          const ctx = sliceCanvas.getContext('2d');
          ctx.drawImage(canvas, 0, y, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

          const imgData = sliceCanvas.toDataURL('image/png');

          if (sliceIndex > 0) pdf.addPage();
          // Compute the image size in inches so we don't stretch partial slices
          const sliceWidthIn = sliceCanvas.width / (CSS_DPI * scale);
          const sliceHeightIn = sliceCanvas.height / (CSS_DPI * scale);
          pdf.addImage(imgData, 'PNG', 0, 0, sliceWidthIn, sliceHeightIn);
        }

        pdf.save(`${label}.pdf`);
      } catch (err) {
        console.error('Error generating PDF from markdown render', err);
      } finally {
        document.body.removeChild(container);
      }
    })
    .catch((err) => {
      console.error('Error rendering markdown to canvas', err);
      document.body.removeChild(container);
    });
}

async function exportAsTarotPDF(killteam, label) {
  if (!killteam) return;
  const md = buildMarkdown(killteam);

  const markedAvailable =
    (typeof window.marked === 'object' && typeof window.marked.parse === 'function') ||
    typeof marked === 'function';
  if (!markedAvailable) {
    console.warn('marked.js not available — skipping tarot PDF generation');
    return;
  }

  const mdHtml = window.marked && window.marked.parse ? window.marked.parse(md) : marked(md);

  const widthPx = TAROT_WIDTH_IN * CSS_DPI;
  const heightPx = TAROT_HEIGHT_IN * CSS_DPI;
  const scale = Math.max(window.devicePixelRatio || 2, 2);

  // Try progressively smaller font sizes so content fits reasonably on tarot pages
  let fontSize = 12; // start
  const minFont = 8;
  const maxPages = 6;
  let chosenCanvas = null;
  let chosenFont = fontSize;

  while (fontSize >= minFont) {
    // build container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = `${widthPx}px`;
    container.style.background = '#ffffff';
    container.style.color = '#111111';
    container.style.padding = '10px';
    container.style.boxSizing = 'border-box';
    container.innerHTML = `
      <div class="wy-theme">
        <header class="wy-header">
          <div class="wy-accent"></div>
          <h1>${killteam.name}</h1>
          ${killteam.tagline ? `<div class="wy-tagline">${killteam.tagline}</div>` : ''}
        </header>
        <article class="md-export" style="font-family: Inter, system-ui, sans-serif; font-size: ${fontSize}px; line-height:1.4;">${mdHtml}</article>
      </div>`;

    const style = document.createElement('style');
    style.textContent = `
      .wy-theme{background:linear-gradient(180deg,#0b0b0d,#0f1115);padding:6px;border:1px solid rgba(212,175,55,0.15);box-shadow:0 6px 18px rgba(0,0,0,0.6)}
      .wy-header{border-bottom:2px solid rgba(212,175,55,0.12);padding-bottom:6px;margin-bottom:8px;display:block}
      .wy-accent{height:4px;background:linear-gradient(90deg,#d4af37,#b97a00);width:100%;margin-bottom:6px}
      .wy-header h1{font-family:Oswald,serif;color:#f6eadb;margin:0;padding:0;font-size:1.1rem;letter-spacing:1px;text-transform:uppercase}
      .wy-tagline{color:#e6d6b0;font-style:italic;margin-top:3px;font-size:0.85rem}
      .md-export{max-width:100%;color:#efe6cf}
      .md-export h1{font-family:Oswald,serif;font-size:1.05rem;margin:0 0 .45rem}
      .md-export h2{font-family:Oswald,serif;font-size:1rem;margin:0 0 .4rem}
      .md-export h3{font-weight:600;margin:0 0 .35rem}
      .md-export p{margin:0 0 .45rem}
      .md-export ul{padding-left:0.95rem;margin:0 0 .45rem}
      .md-export li{margin:0 0 .22rem}
    `;
    container.appendChild(style);
    document.body.appendChild(container);

    try {
      // Render and check how many tarot pages the content will require
      // Use await to simplify control flow
      // eslint-disable-next-line no-undef
      const canvas = await html2canvas(container, {
        backgroundColor: '#0b0b0d',
        scale,
        width: widthPx,
        scrollX: 0,
        scrollY: 0,
      });
      const pxPerPdfPage = heightPx * scale;
      const totalSlices = Math.max(1, Math.ceil(canvas.height / pxPerPdfPage));

      if (totalSlices <= maxPages) {
        chosenCanvas = canvas;
        chosenFont = fontSize;
        document.body.removeChild(container);
        break;
      }

      // not acceptable, reduce font and retry
      document.body.removeChild(container);
      fontSize -= 1;
    } catch (err) {
      console.error('tarot pdf render attempt failed', err);
      try {
        document.body.removeChild(container);
      } catch (e) {}
      break;
    }
  }

  // If we never produced a chosenCanvas via the loop, render once with the smallest font
  if (!chosenCanvas) {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = `${widthPx}px`;
    container.style.background = '#0b0b0d';
    container.style.color = '#efe6cf';
    container.style.padding = '8px';
    container.style.boxSizing = 'border-box';
    container.innerHTML = `
      <div class="wy-theme">
        <header class="wy-header">
          <div class="wy-accent"></div>
          <h1>${killteam.name}</h1>
          ${killteam.tagline ? `<div class="wy-tagline">${killteam.tagline}</div>` : ''}
        </header>
        <article class="md-export" style="font-family: Inter, system-ui, sans-serif; font-size: ${minFont}px; line-height:1.3;">${mdHtml}</article>
      </div>`;
    const style = document.createElement('style');
    style.textContent = `
      .wy-theme{background:linear-gradient(180deg,#0b0b0d,#0f1115);padding:6px;border:1px solid rgba(212,175,55,0.12)}
      .wy-header{border-bottom:1px solid rgba(212,175,55,0.12);padding-bottom:6px;margin-bottom:8px}
      .wy-accent{height:3px;background:linear-gradient(90deg,#d4af37,#b97a00);width:100%;margin-bottom:6px}
      .wy-header h1{font-family:Oswald,serif;color:#f6eadb;margin:0;padding:0;font-size:1.05rem;letter-spacing:0.6px;text-transform:uppercase}
      .wy-tagline{color:#e6d6b0;font-style:italic;margin-top:3px;font-size:0.75rem}
      .md-export{max-width:100%;color:#efe6cf}
      .md-export h1{font-family:Oswald,serif;font-size:1.05rem;margin:0 0 .4rem}
      .md-export h2{font-family:Oswald,serif;font-size:1rem;margin:0 0 .35rem}
      .md-export p{margin:0 0 .35rem}
      .md-export ul{padding-left:0.9rem;margin:0 0 .35rem}
      .md-export li{margin:0 0 .2rem}
    `;
    container.appendChild(style);
    document.body.appendChild(container);
    try {
      // eslint-disable-next-line no-undef
      chosenCanvas = await html2canvas(container, {
        backgroundColor: '#0b0b0d',
        scale,
        width: widthPx,
        scrollX: 0,
        scrollY: 0,
      });
    } catch (err) {
      console.error('final tarot render failed', err);
      document.body.removeChild(container);
      return;
    }
    document.body.removeChild(container);
  }

  // Create PDF from chosenCanvas, slicing into tarot pages
  if (typeof window.jspdf === 'undefined') {
    console.warn('jsPDF not available — cannot save tarot PDF');
    return;
  }
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [TAROT_WIDTH_IN, TAROT_HEIGHT_IN],
  });

  try {
    const pxPerPdfPage = heightPx * scale;
    const totalHeight = chosenCanvas.height;
    const totalSlices = Math.max(1, Math.ceil(totalHeight / pxPerPdfPage));

    for (let sliceIndex = 0; sliceIndex < totalSlices; sliceIndex++) {
      const y = sliceIndex * pxPerPdfPage;
      const sliceHeight = Math.min(pxPerPdfPage, totalHeight - y);

      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = chosenCanvas.width;
      sliceCanvas.height = sliceHeight;
      const ctx = sliceCanvas.getContext('2d');
      ctx.drawImage(
        chosenCanvas,
        0,
        y,
        chosenCanvas.width,
        sliceHeight,
        0,
        0,
        chosenCanvas.width,
        sliceHeight
      );

      const imgData = sliceCanvas.toDataURL('image/png');

      if (sliceIndex > 0) pdf.addPage();
      // Preserve correct aspect by sizing image using pixels->inches conversion
      const sliceWidthIn = sliceCanvas.width / (CSS_DPI * scale);
      const sliceHeightIn = sliceCanvas.height / (CSS_DPI * scale);
      pdf.addImage(imgData, 'PNG', 0, 0, sliceWidthIn, sliceHeightIn);
    }

    pdf.save(`${label}.tarot.pdf`);
  } catch (err) {
    console.error('Error saving tarot PDF', err);
  }
}

function createPageElement(type, data) {
  const pageEl = document.createElement('div');
  pageEl.className = 'card card--exporting card--pdf-page';
  pageEl.style.width = `${TAROT_WIDTH_IN * CSS_DPI}px`;
  // Allow variable height so long content can be captured and paginated
  // (we'll slice the rendered canvas into multiple PDF pages if needed)
  pageEl.style.position = 'relative';
  pageEl.style.overflow = 'hidden';

  if (type === 'header') {
    pageEl.innerHTML = `
      <header class="card__header">
        ${data.tagline ? `<span class="card__tagline">${data.tagline}</span>` : ''}
        <h2>${data.name}</h2>
        ${data.updated ? `<span class="card__updated">Updated: ${data.updated}</span>` : ''}
      </header>
    `;
  } else if (type === 'section') {
    // items may be an array (legacy) or an object of subsections
    let bodyHtml = '';

    if (Array.isArray(data.items)) {
      const listItems = data.items
        .map((it) => {
          if (typeof it === 'string') return `<li>${it}</li>`;
          if (it && typeof it === 'object') {
            const safeText = it.text || '';
            const cls = it.important ? 'marker-important' : '';
            return `<li><span class="${cls}">${safeText}</span></li>`;
          }
          return '';
        })
        .join('');
      bodyHtml = `
        <div class="card-section">
          <h3 class="card-section__title">${data.title}</h3>
          <ul class="card-section__list">
            ${listItems}
          </ul>
        </div>
      `;
    } else if (typeof data.items === 'object') {
      // Render a single section with multiple subsections
      const subsections = Object.keys(data.items)
        .map((subTitle) => {
          const subItems = Array.isArray(data.items[subTitle]) ? data.items[subTitle] : [];
          if (!subItems.length) return '';
          const list = subItems.map((it) => `<li>${it}</li>`).join('');
          return `
          <div class="card-subsection">
            <h4 class="card-subsection__title">${subTitle}</h4>
            <ul class="card-section__list">
              ${list}
            </ul>
          </div>
        `;
        })
        .join('');

      bodyHtml = `
        <div class="card-section">
          <h3 class="card-section__title">${data.title}</h3>
          ${subsections}
        </div>
      `;
    }

    pageEl.innerHTML = `
      <header class="card__header">
        <h2 style="font-size: 1.2rem; margin-bottom: 0.5rem;">${data.killteamName}</h2>
      </header>
      <section class="card__body">
        ${bodyHtml}
      </section>
    `;
  }

  return pageEl;
}

function handleClear() {
  selectEl.value = '';
  renderCard(null);
}

function handleClearCache() {
  // Ask the user before removing caches
  const ok = confirm(
    'Clear cached resources (service worker, Cache Storage, localStorage, indexedDB) and reload?'
  );
  if (!ok) return;
  clearCachesAndReload();
}

async function clearCachesAndReload() {
  try {
    // Unregister service workers
    if ('serviceWorker' in navigator) {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister().catch(() => {})));
      } catch (e) {
        console.warn('Error unregistering service workers', e);
      }
    }

    // Clear Cache Storage
    if ('caches' in window) {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k).catch(() => {})));
      } catch (e) {
        console.warn('Error clearing caches', e);
      }
    }

    // Clear localStorage
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Error clearing localStorage', e);
    }

    // Delete indexedDB databases if available (best-effort)
    try {
      if (indexedDB && indexedDB.databases) {
        const dbs = await indexedDB.databases();
        await Promise.all(
          dbs.map((db) =>
            db.name
              ? new Promise((res) => {
                  indexedDB.deleteDatabase(db.name);
                  setTimeout(res, 200);
                })
              : Promise.resolve()
          )
        );
      }
    } catch (e) {
      // Some browsers don't support indexedDB.databases()
      console.warn('Error clearing indexedDB', e);
    }
  } catch (err) {
    console.error('Error clearing caches', err);
  }

  // Reload with cache-bypass
  try {
    const url = window.location.pathname + '?_=' + Date.now();
    window.location.href = url;
  } catch (e) {
    window.location.reload();
  }
}

function init() {
  loadKillteams();
  selectEl?.addEventListener('change', handleSelectChange);
  exportSelect?.addEventListener('change', handleExportChange);
  clearBtn?.addEventListener('click', handleClear);
  clearCacheBtn?.addEventListener('click', handleClearCache);
}

document.addEventListener('DOMContentLoaded', init);
