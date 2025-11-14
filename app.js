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
  const safeItems = Array.isArray(items) ? items : [];
  if (!safeItems.length) return "";
  const listItems = safeItems.map((text) => `<li>${text}</li>`).join("");
  return `
    <div class="card-section">
      <h3 class="card-section__title">${title}</h3>
      <ul class="card-section__list">
        ${listItems}
      </ul>
    </div>
  `;
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
  text += "\n";

  if (killteam.weapons && killteam.weapons.length > 0) {
    text += "WEAPONS:\n";
    killteam.weapons.forEach((weapon) => {
      text += `  • ${weapon}\n`;
    });
    text += "\n";
  }

  if (killteam.impactsYou && killteam.impactsYou.length > 0) {
    text += "IMPACTS YOU:\n";
    killteam.impactsYou.forEach((impact) => {
      text += `  • ${impact}\n`;
    });
    text += "\n";
  }

  if (killteam.impactsThem && killteam.impactsThem.length > 0) {
    text += "IMPACTS THEM:\n";
    killteam.impactsThem.forEach((impact) => {
      text += `  • ${impact}\n`;
    });
  }

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
  if (killteam.weapons && killteam.weapons.length > 0) {
    pages.push(createPageElement("section", {
      title: "Weapons",
      items: killteam.weapons,
      killteamName: killteam.name
    }));
  }
  
  if (killteam.impactsYou && killteam.impactsYou.length > 0) {
    pages.push(createPageElement("section", {
      title: "Impacts You",
      items: killteam.impactsYou,
      killteamName: killteam.name
    }));
  }
  
  if (killteam.impactsThem && killteam.impactsThem.length > 0) {
    pages.push(createPageElement("section", {
      title: "Impacts Them",
      items: killteam.impactsThem,
      killteamName: killteam.name
    }));
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
      </header>
    `;
  } else if (type === "section") {
    const listItems = data.items.map((item) => `<li>${item}</li>`).join("");
    pageEl.innerHTML = `
      <header class="card__header">
        <h2 style="font-size: 1.2rem; margin-bottom: 0.5rem;">${data.killteamName}</h2>
      </header>
      <section class="card__body">
        <div class="card-section">
          <h3 class="card-section__title">${data.title}</h3>
          <ul class="card-section__list">
            ${listItems}
          </ul>
        </div>
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

