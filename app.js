const selectEl = document.getElementById("killteamSelect");
const stageEl = document.getElementById("cardStage");
const exportSelect = document.getElementById("exportSelect");
const clearBtn = document.getElementById("clearButton");
const footerControls = document.getElementById("footerControls");

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
    window.addEventListener('killteamsLoaded', () => {
      killteams = Array.isArray(window.KILLTEAM_DATA) ? window.KILLTEAM_DATA : [];
      hydrateSelect();
    }, { once: true });
  }
}

function hydrateSelect() {
  if (!selectEl) return;
  // Sort kill teams alphabetically by name
  const sortedKillteams = [...killteams].sort((a, b) => 
    (a.name || '').localeCompare(b.name || '')
  );
  selectEl.innerHTML =
    '<option value="" disabled selected>Choose a kill team…</option>' +
    sortedKillteams
      .map((killteam) => `<option value="${killteam.id}">${killteam.name}</option>`)
      .join("");
}

function renderCard(killteamId) {
  const killteam = killteams.find((entry) => entry.id === killteamId);
  if (!killteam) {
    currentKillteamId = null;
    stageEl.innerHTML =
      '<p class="empty-state">Select a kill team above to preview its tactical card.</p>';
    if (footerControls) {
      footerControls.classList.remove("footer-controls--visible");
    }
    return;
  }

  currentKillteamId = killteam.id;
  stageEl.innerHTML = `
    <article class="card" data-killteam="${killteam.id}">
      <header class="card__header">
        <span class="card__tagline">${killteam.tagline ?? ""}</span>
        <h2>${killteam.name}</h2>
        ${killteam.updated ? `<span class="card__updated">Updated: ${killteam.updated}</span>` : ""}
      </header>
      <section class="card__body">
          ${renderSection("Weapons", killteam.weapons)}
            ${renderSection("Impacts You", killteam.impactsYou)}
            ${renderSection("Impacts Them", killteam.impactsThem)}
      </section>
    </article>
  `;
  
  if (footerControls) {
    footerControls.classList.add("footer-controls--visible");
  }
}

function renderSection(title, items = []) {
  // Support either: array of strings (legacy) OR object of subcategory -> array of strings
  if (!items) return "";

  // If it's an array, render a single section
  if (Array.isArray(items)) {
    if (!items.length) return "";
    const listItems = items.map((it) => {
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
    }).join("");
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
  if (typeof items === "object") {
    const subSections = Object.keys(items).map((subTitle) => {
      const subItems = Array.isArray(items[subTitle]) ? items[subTitle] : [];
      if (!subItems.length) return "";
      const list = subItems.map((it) => {
        if (typeof it === 'string') return `<li>${it}</li>`;
        if (it && typeof it === 'object') {
          const safeText = it.text || '';
          const cls = it.important ? 'marker-important' : '';
          return `<li><span class="${cls}">${safeText}</span></li>`;
        }
        return '';
      }).join("");
      return `
        <div class="card-subsection">
          <h4 class="card-subsection__title">${subTitle}</h4>
          <ul class="card-section__list">
            ${list}
          </ul>
        </div>
      `;
    }).join("");

    if (!subSections) return "";
    return `
      <div class="card-section">
        <h3 class="card-section__title">${title}</h3>
        ${subSections}
      </div>
    `;
  }

  return "";
}

function handleSelectChange(event) {
  renderCard(event.target.value);
}

function handleExportChange(event) {
  const format = event.target.value;
  if (!format) return;

  const cardEl = stageEl.querySelector(".card");
  if (!cardEl) {
    alert("Please select a kill team first.");
    event.target.value = "";
    return;
  }

  const killteam = killteams.find((entry) => entry.id === currentKillteamId);
  const label = killteam
    ? killteam.name.replace(/\s+/g, "-").toLowerCase()
    : "kill-team-card";

  if (format === "text") {
    exportAsText(killteam, label);
  } else if (format === "pdf") {
    exportAsPDF(cardEl, killteam, label);
  }

  // Reset dropdown
  event.target.value = "";
}

function exportAsText(killteam, label) {
  if (!killteam) return;

  let text = `${killteam.name}\n`;
  if (killteam.tagline) {
    text += `${killteam.tagline}\n`;
  }
  if (killteam.updated) {
    text += `Updated: ${killteam.updated}\n`;
  }
  text += "\n";
  // Helper to format either array or object subcategories
  function appendSection(title, items) {
    if (!items) return;
    if (Array.isArray(items) && items.length > 0) {
      text += `${title}:\n`;
      items.forEach((it) => {
        if (typeof it === 'string') {
          text += `  • ${it}\n`;
        } else if (it && typeof it === 'object') {
          const safeText = it.text || '';
          text += `  • ${prefix}${safeText}\n`;
        }
      });
      text += "\n";
    } else if (typeof items === "object") {
      const keys = Object.keys(items);
      if (!keys.length) return;
      text += `${title}:\n`;
      keys.forEach((sub) => {
        const subItems = Array.isArray(items[sub]) ? items[sub] : [];
        if (!subItems.length) return;
        text += `  ${sub}:\n`;
        subItems.forEach((it) => {
          if (typeof it === 'string') {
            text += `    • ${it}\n`;
          } else if (it && typeof it === 'object') {
            const safeText = it.text || '';
            text += `    • ${prefix}${safeText}\n`;
          }
        });
      });
      text += "\n";
    }
  }

  appendSection("WEAPONS", killteam.weapons);
  appendSection("IMPACTS YOU", killteam.impactsYou);
  appendSection("IMPACTS THEM", killteam.impactsThem);

  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.download = `${label}.txt`;
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
}

function exportAsPDF(cardEl, killteam, label) {
  if (typeof html2canvas !== "function") {
    console.warn("html2canvas failed to load.");
    return;
  }
  if (typeof window.jspdf === "undefined") {
    console.warn("jsPDF failed to load.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const scale = Math.max(window.devicePixelRatio || 2, 2);
  const widthPx = TAROT_WIDTH_IN * CSS_DPI;
  const heightPx = TAROT_HEIGHT_IN * CSS_DPI;

  // Create pages for each section
  const pages = [];
  
  // Page 1: Header with kill team name
  pages.push(createPageElement("header", killteam));
  
  // Additional pages: One per section
  // Weapons: support array or object (subsections). Group object subsections onto one page.
  if (killteam.weapons) {
    if (Array.isArray(killteam.weapons) && killteam.weapons.length > 0) {
      pages.push(createPageElement("section", {
        title: "Weapons",
        items: killteam.weapons,
        killteamName: killteam.name
      }));
    } else if (typeof killteam.weapons === "object") {
      // Push a single page containing all subcategories
      pages.push(createPageElement("section", {
        title: "Weapons",
        items: killteam.weapons,
        killteamName: killteam.name
      }));
    }
  }

  // Impacts You
  if (killteam.impactsYou) {
    if (Array.isArray(killteam.impactsYou) && killteam.impactsYou.length > 0) {
      pages.push(createPageElement("section", {
        title: "Impacts You",
        items: killteam.impactsYou,
        killteamName: killteam.name
      }));
    } else if (typeof killteam.impactsYou === "object") {
      pages.push(createPageElement("section", {
        title: "Impacts You",
        items: killteam.impactsYou,
        killteamName: killteam.name
      }));
    }
  }

  // Impacts Them
  if (killteam.impactsThem) {
    if (Array.isArray(killteam.impactsThem) && killteam.impactsThem.length > 0) {
      pages.push(createPageElement("section", {
        title: "Impacts Them",
        items: killteam.impactsThem,
        killteamName: killteam.name
      }));
    } else if (typeof killteam.impactsThem === "object") {
      pages.push(createPageElement("section", {
        title: "Impacts Them",
        items: killteam.impactsThem,
        killteamName: killteam.name
      }));
    }
  }

  // Create a container to hold all pages temporarily
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = `${widthPx}px`;
  document.body.appendChild(container);

  pages.forEach((pageEl) => {
    container.appendChild(pageEl);
  });

  // Capture each page and add to PDF
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: [TAROT_WIDTH_IN, TAROT_HEIGHT_IN],
  });

  let pageIndex = 0;
  
  function captureNextPage() {
    if (pageIndex >= pages.length) {
      // All pages captured, save PDF
      pdf.save(`${label}.pdf`);
      document.body.removeChild(container);
      return;
    }

    const pageEl = pages[pageIndex];
    
    html2canvas(pageEl, {
      backgroundColor: "#0f1115",
      scale,
      width: widthPx,
      height: heightPx,
      scrollX: 0,
      scrollY: 0,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        
        if (pageIndex > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, "PNG", 0, 0, TAROT_WIDTH_IN, TAROT_HEIGHT_IN);
        pageIndex++;
        captureNextPage();
      })
      .catch((error) => {
        console.error("Error capturing page:", error);
        document.body.removeChild(container);
      });
  }

  // Start capturing pages
  captureNextPage();
}

function createPageElement(type, data) {
  const pageEl = document.createElement("div");
  pageEl.className = "card card--exporting card--pdf-page";
  pageEl.style.width = `${TAROT_WIDTH_IN * CSS_DPI}px`;
  pageEl.style.height = `${TAROT_HEIGHT_IN * CSS_DPI}px`;
  pageEl.style.position = "relative";
  pageEl.style.overflow = "hidden";

  if (type === "header") {
    pageEl.innerHTML = `
      <header class="card__header">
        ${data.tagline ? `<span class="card__tagline">${data.tagline}</span>` : ""}
        <h2>${data.name}</h2>
        ${data.updated ? `<span class="card__updated">Updated: ${data.updated}</span>` : ""}
      </header>
    `;
  } else if (type === "section") {
    // items may be an array (legacy) or an object of subsections
    let bodyHtml = "";

    if (Array.isArray(data.items)) {
      const listItems = data.items.map((it) => {
        if (typeof it === 'string') return `<li>${it}</li>`;
        if (it && typeof it === 'object') {
          const safeText = it.text || '';
          const cls = it.important ? 'marker-important' : '';
          return `<li><span class="${cls}">${safeText}</span></li>`;
        }
        return '';
      }).join("");
      bodyHtml = `
        <div class="card-section">
          <h3 class="card-section__title">${data.title}</h3>
          <ul class="card-section__list">
            ${listItems}
          </ul>
        </div>
      `;
    } else if (typeof data.items === "object") {
      // Render a single section with multiple subsections
      const subsections = Object.keys(data.items).map((subTitle) => {
        const subItems = Array.isArray(data.items[subTitle]) ? data.items[subTitle] : [];
        if (!subItems.length) return "";
        const list = subItems.map((it) => `<li>${it}</li>`).join("");
        return `
          <div class="card-subsection">
            <h4 class="card-subsection__title">${subTitle}</h4>
            <ul class="card-section__list">
              ${list}
            </ul>
          </div>
        `;
      }).join("");

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
  selectEl.value = "";
  renderCard(null);
}

function init() {
  loadKillteams();
  selectEl?.addEventListener("change", handleSelectChange);
  exportSelect?.addEventListener("change", handleExportChange);
  clearBtn?.addEventListener("click", handleClear);
}

document.addEventListener("DOMContentLoaded", init);

