// ===============================
// Streamer Info App JS
// ===============================
// This file contains all logic for streamer info, admin panel, server panels, streamer links, dock, app windows, drag/resize,
// Twitch mock API, stats app, chat/poll panels, Solitaire, and FreeMode mode for viewer custom layouts.

// ===============================
// --- Info Card Toggle ---
// ===============================
function toggleCard() {
  const card = document.getElementById("infoCard");
  card.style.display = card.style.display === "flex" ? "none" : "flex";
}

// ===============================
// --- Tab Switching ---
// ===============================
function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'flex';
}

// ===============================
// --- Admin Panel Section Switching ---
// ===============================
function showAdminSection(sectionId) {
  document.querySelectorAll('.admin-section').forEach(sec => {
    sec.style.display = 'none';
  });
  const target = document.getElementById(sectionId);
  if (target) target.style.display = 'block';

  document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelector(`.admin-tab[onclick*="${sectionId}"]`)?.classList.add('active');
}

// ===============================
// --- Admin Panel Toggle ---
// ===============================
function toggleAdminPanel() {
  const panel = document.querySelector(".admin-panel");
  if (panel) {
    panel.style.display = panel.style.display === "flex" ? "none" : "flex";
  }
}

// ===============================
// --- Streamer Info/Bio/Profile Image ---
// ===============================
function updateStreamerInfo() {
  const name = document.getElementById('streamerNameInput')?.value;
  const bio = document.getElementById('streamerBioInput')?.value;
  if (name) document.querySelector('#homeTab h3').textContent = name;
  if (bio) document.querySelector('#homeTab p').innerHTML = bio.replace(/\n/g, '<br>');
}

function updateProfileImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.querySelector('#homeTab img');
      if (img) img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// ===============================
// --- Theme Color Picker ---
// ===============================
function updateThemeColor(hexColor) {
  document.documentElement.style.setProperty('--accent-color', hexColor);
  const buttons = document.querySelectorAll(
    '.streamer-links a, .internal-nav a, .internal-nav button, .server-entry a, .color-button'
  );
  buttons.forEach(btn => {
    btn.style.backgroundImage = `linear-gradient(#121212, #121212), linear-gradient(to right, ${hexColor}, ${hexColor})`;
  });
}

// ===============================
// --- Streamer Links (Main & Popout Panel) ---
// ===============================
const streamerLinksData = [
  { id: 'twitch', name: 'Twitch' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'kick', name: 'Kick' },
  { id: 'discord', name: 'Discord' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'donate', name: 'Donate' }
];

function updateMainStreamerLinks() {
  const container = document.getElementById('mainStreamerLinks') || document.querySelector('.streamer-links');
  if (!container) return;
  container.innerHTML = '';
  streamerLinksData.forEach(link => {
    const isChecked = document.getElementById(`${link.id}Check`);
    const urlInput = document.getElementById(`${link.id}URL`);
    if (isChecked && urlInput && isChecked.checked && urlInput.value.trim() !== '') {
      const a = document.createElement('a');
      a.href = urlInput.value.trim();
      a.target = '_blank';
      a.textContent = link.name;
      container.appendChild(a);
    }
  });
}

function updatePopoutLinksPanel() {
  const popoutList = document.getElementById('popoutLinksList');
  if (!popoutList) return;
  popoutList.innerHTML = '';
  streamerLinksData.forEach(link => {
    const isChecked = document.getElementById(`${link.id}Check`);
    const urlInput = document.getElementById(`${link.id}URL`);
    if (isChecked && urlInput && isChecked.checked && urlInput.value.trim() !== '') {
      const a = document.createElement('a');
      a.href = urlInput.value.trim();
      a.target = '_blank';
      a.textContent = link.name;
      a.className = 'popout-link';
      const li = document.createElement('li');
      li.appendChild(a);
      popoutList.appendChild(li);
    }
  });
}

function updateStreamerLinks() {
  updateMainStreamerLinks();
  updatePopoutLinksPanel();
}

// Listen for changes in link settings and sync both panels
streamerLinksData.forEach(link => {
  document.addEventListener("input", function(e) {
    if (
      e.target.id === `${link.id}Check` ||
      e.target.id === `${link.id}URL`
    ) {
      updateStreamerLinks();
    }
  });
});

function toggleLinkSettings() {
  const container = document.getElementById("linkSettingsContainer");
  container.style.display = container.style.display === "none" ? "block" : "none";
}

// ===============================
// --- Server Buttons (Admin Panel) & Server Info Logic ---
// ===============================
function updateServerButtons() {
  const navContainer = document.getElementById('serverTypeButtons');
  navContainer.innerHTML = '';
  const typeCards = document.querySelectorAll('.server-type-card');
  const servers = [];

  typeCards.forEach((card, i) => {
    const labelInput = card.querySelector('.server-type-label');
    const urlInput = card.querySelector('.server-type-url');
    const logoInput = card.querySelector('.server-type-logo');
    const logoPreview = card.querySelector('.server-type-logo-preview');
    const checkbox = card.querySelector('.server-type-visible');
    const label = labelInput.value.trim();
    const url = urlInput.value.trim();
    const show = checkbox.checked;
    let logoData = logoPreview.src && logoPreview.style.display !== "none" ? logoPreview.src : "";

    servers.push({
      name: label,
      url: url,
      logo: logoData,
      show: show
    });

    if (label && show) {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.classList.add('color-button');
      btn.onclick = () => {
        if (label.toLowerCase().includes('gta')) {
          showTab('gtaTab');
          renderServerPanel('gtaServerPanel', servers[i]);
        } else if (label.toLowerCase().includes('redm')) {
          showTab('redmTab');
          renderServerPanel('redmServerPanel', servers[i]);
        } else {
          showServerPanel(i);
        }
      };
      navContainer.appendChild(btn);
    }
  });

  localStorage.setItem("servers", JSON.stringify(servers));
}

// Handle logo uploads & preview in admin panel
document.querySelectorAll('.server-type-logo').forEach((input, idx) => {
  input.addEventListener('change', function (e) {
    const file = e.target.files[0];
    const preview = input.parentElement.querySelector('.server-type-logo-preview');
    if (file && preview) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        preview.src = ev.target.result;
        preview.style.display = "inline";
      };
      reader.readAsDataURL(file);
    }
  });
});

function showServerPanel(index) {
  const servers = JSON.parse(localStorage.getItem("servers") || "[]");
  const server = servers[index];
  if (!server) return;
  document.getElementById("serverInfoTitle").textContent = server.name;
  document.getElementById("serverInfoBody").innerHTML = `
    ${server.logo ? `<img src="${server.logo}" style="max-width:120px; margin-bottom:12px;"/>` : ""}
    <div style="margin-bottom:12px;">
      <button class="color-button" style="font-size:1.1em;" onclick="window.open('${server.url}', '_blank')">Join</button>
    </div>
  `;
  showPanel('serverInfoPanel');
}

function renderServerPanel(panelId, server) {
  const panel = document.getElementById(panelId);
  panel.innerHTML = `
    ${server.logo ? `<img src="${server.logo}" style="max-width:120px; margin-bottom:12px;"/>` : ""}
    <div style="margin-bottom:12px;">
      <button class="color-button" style="font-size:1.1em;" onclick="window.open('${server.url}', '_blank')">Join</button>
    </div>
  `;
}

// Restore server settings on load
window.addEventListener("DOMContentLoaded", () => {
  const servers = JSON.parse(localStorage.getItem("servers") || "[]");
  document.querySelectorAll('.server-type-card').forEach((card, i) => {
    if (servers[i]) {
      card.querySelector('.server-type-label').value = servers[i].name;
      card.querySelector('.server-type-url').value = servers[i].url;
      if (servers[i].logo) {
        const preview = card.querySelector('.server-type-logo-preview');
        preview.src = servers[i].logo;
        preview.style.display = "inline";
      }
      card.querySelector('.server-type-visible').checked = !!servers[i].show;
    }
  });
  updateServerButtons();
  updateMainStreamerLinks();
  updatePopoutLinksPanel();
});

// ===============================
// --- Panel Show/Hide ---
// ===============================
function showPanel(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  panel.style.display = "block";
  if (panelId === "streamInfoPanel") renderStreamInfo();
  if (panelId === "freeModePanel") {
    document.getElementById("twitchEmbedPanel").style.display = "none";
  }
}
function hidePanel(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  panel.style.display = "none";
}

// ===============================
// --- Dock Visibility Controls ---
// ===============================
function toggleAppsVisibilityControls() {
  const controls = document.querySelector('.apps-visibility-controls');
  if (controls) {
    controls.style.display = (controls.style.display === 'none' || controls.style.display === '') ? 'block' : 'none';
  }
}

function loadDockVisibilityPrefs() {
  const prefs = JSON.parse(localStorage.getItem("dockVisibilityPrefs") || "{}");
  document.querySelectorAll('.dock-toggle').forEach(toggle => {
    const dockId = toggle.getAttribute('data-dock');
    toggle.checked = prefs[dockId] === true;
  });
  const saveBtn = document.getElementById('saveDockVisibility');
  if (saveBtn) {
    saveBtn.onclick = function () {
      document.querySelectorAll('.dock-toggle').forEach(toggle => {
        const dockId = toggle.getAttribute('data-dock');
        updateDockButtonVisibility(dockId, toggle.checked);
      });
      saveDockVisibilityPrefs();
    };
  }
}

function updateDockButtonVisibility(dockId, show) {
  const btn = dockId === "customizeToggle"
    ? document.getElementById("customizeToggle")
    : document.querySelector('.dock-btn[data-panel="'+dockId+'"]');
  if (btn) btn.style.display = show ? "" : "none";
}

function saveDockVisibilityPrefs() {
  const prefs = {};
  document.querySelectorAll('.dock-toggle').forEach(toggle => {
    const dockId = toggle.getAttribute('data-dock');
    prefs[dockId] = toggle.checked;
  });
  localStorage.setItem("dockVisibilityPrefs", JSON.stringify(prefs));
}

// ===============================
// --- Solitaire App Logic (Window, Drag, Restore, Minimize) ---
// ===============================
function launchSolitaireApp() {
  const appWindow = document.getElementById("solitaireWindow");
  const container = document.getElementById("solitaireGameContainer");

  appWindow.style.display = "flex";
  container.innerHTML = `<div id="solitaire-root"></div>`;

  fetch("apps/games/solitaire/solitaire.js")
    .then((res) => res.text())
    .then((scriptText) => {
      const script = document.createElement("script");
      script.textContent = scriptText;
      document.body.appendChild(script);
    })
    .catch((err) => {
      container.innerHTML = "<p>Failed to load Solitaire.</p>";
      console.error("Solitaire Load Error:", err);
    });
}

function closeAppWindow() {
  const appWindow = document.getElementById("solitaireWindow");
  if (appWindow) {
    appWindow.style.display = "none";
  }
}

function vanishAppWindow() {
  const appWindow = document.getElementById("solitaireWindow");
  if (appWindow) {
    appWindow.style.display = "none";
  }
  const restoreBtn = document.getElementById("solitaireRestoreBtn");
  if (restoreBtn) {
    restoreBtn.style.display = "block";
  }
}

function restoreSolitaire() {
  const appWindow = document.getElementById("solitaireWindow");
  const restoreBtn = document.getElementById("solitaireRestoreBtn");
  if (appWindow) appWindow.style.display = "flex";
  if (restoreBtn) restoreBtn.style.display = "none";
}

// ===============================
// --- Drag Functionality for App Windows ---
// ===============================
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let draggedWindow = null;

function startDrag(e) {
  const header = e.target.closest(".app-window-header, .panel-header");
  if (!header) return;
  draggedWindow = header.parentElement;
  if (!draggedWindow) return;

  isDragging = true;
  draggedWindow.style.position = 'absolute';
  dragOffsetX = e.clientX - draggedWindow.offsetLeft;
  dragOffsetY = e.clientY - draggedWindow.offsetTop;

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
}
function drag(e) {
  if (!isDragging || !draggedWindow) return;
  draggedWindow.style.left = `${e.clientX - dragOffsetX}px`;
  draggedWindow.style.top = `${e.clientY - dragOffsetY}px`;
}
function stopDrag() {
  isDragging = false;
  draggedWindow = null;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
}

// ===============================
// --- Stats App Logic ---
// ===============================
function launchStatsApp() {
  const statsWindow = document.getElementById("statsWindow");
  statsWindow.style.display = "flex";
  const terminal = document.getElementById("cmdTerminal");
  if (terminal) {
    terminal.innerHTML = `
      <span style="color: #0ff;">███ WELCOME TO THE STATS TERMINAL ███</span><br>
      <span style="color: #fff;">Click <b>Get Stats</b> or customize your experience.<br>
      <span style="color: #08f;">Tips: Try "Custom Stats" for more options!</span>
      <br><br>
    `;
  }
}

function closeStatsWindow() {
  const statsWindow = document.getElementById("statsWindow");
  if (statsWindow) {
    statsWindow.style.display = "none";
  }
  const customPanel = document.getElementById("customStatsPanel");
  if (customPanel) {
    customPanel.classList.remove("open");
  }
}

function minimizeStatsWindow() {
  closeStatsWindow();
}

// ===============================
// --- Custom Stats Panel ---
// ===============================
function openCustomStats() {
  const panel = document.getElementById("customStatsPanel");
  const form = document.getElementById("statsPrefsForm");
  if (!panel || !form) return;
  const prefs = JSON.parse(localStorage.getItem("statsPrefs") || "{}");
  availableStats.forEach(stat => {
    if (form.elements[stat.key]) {
      form.elements[stat.key].checked = prefs[stat.key] ?? true;
    }
  });
  panel.classList.add("open");
}

function closeCustomStats() {
  const panel = document.getElementById("customStatsPanel");
  if (panel) panel.classList.remove("open");
}

// ===============================
// --- Stats App Typing Effect ---
// ===============================
function typeLines(lines, idx = 0, terminalId = "cmdTerminal") {
  if (idx >= lines.length) {
    document.getElementById(terminalId).innerHTML += `<span class="cmd-cursor">_</span>`;
    return;
  }
  const terminal = document.getElementById(terminalId);
  let i = 0;
  function typeChar() {
    if (i < lines[idx].length) {
      terminal.innerHTML += lines[idx][i++];
      setTimeout(typeChar, 30);
    } else {
      terminal.innerHTML += "<br/>";
      const nextDelay = idx === 0 ? 1200 : 250;
      setTimeout(() => typeLines(lines, idx + 1, terminalId), nextDelay);
    }
  }
  typeChar();
}

// ===============================
// --- Customizable Stats ---
// ===============================
const availableStats = [
  { key: "followage", label: "Followed Since", line: "> Followed since: 2020-05-06" },
  { key: "channelPoints", label: "Channel Points", line: "> Channel points: 12,350" },
  { key: "messagesSent", label: "Messages Sent", line: "> Messages sent: 1423" },
  { key: "badges", label: "Badges", line: "> Badges: VIP, Founder" },
  { key: "subStatus", label: "Sub Status", line: "> Sub Status: Tier 1" },
  { key: "viewerNumber", label: "Viewer Number", line: "> Viewer Number: #27" },
];

function showBasicStats() {
  const terminal = document.getElementById("cmdTerminal");
  if (!terminal) return;
  terminal.innerHTML = "";
  const prefs = JSON.parse(localStorage.getItem("statsPrefs") || "{}");
  const lines = [
    "> Checking stats for Warmonkeyx...",
    ...availableStats.filter(stat => prefs[stat.key] ?? true).map(stat => stat.line),
    "> Thanks for watching!",
  ];
  typeLines(lines);
}

// ===============================
// --- Streaming App Dock & Panels ---
// ===============================
const dockButtons = document.querySelectorAll(".dock-btn");
const closeButtons = document.querySelectorAll(".close-btn");
const panels = document.querySelectorAll(".panel");
let customizeMode = false;

dockButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (customizeMode) return;
    const panelId = btn.dataset.panel;
    if (panelId) showPanel(panelId);
  });
});

closeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const panelId = btn.dataset.panel;
    if (panelId) hidePanel(panelId);
  });
});

// ===============================
// --- Layout Customize Mode ---
// ===============================
const customizeToggle = document.getElementById("customizeToggle");
let dragPanel = null, offsetX = 0, offsetY = 0;

customizeToggle.addEventListener("click", () => {
  customizeMode = !customizeMode;
  customizeToggle.classList.toggle("active", customizeMode);
  panels.forEach(panel => {
    panel.classList.toggle("customize", customizeMode);
    if (customizeMode) {
      panel.style.display = "block";
    } else {
      if (!panel.classList.contains("keep-open")) panel.style.display = "none";
    }
  });
});

panels.forEach(panel => {
  const header = panel.querySelector(".panel-header");
  if (header) header.addEventListener("mousedown", startDrag);
});

document.addEventListener("mousemove", (e) => {
  if (!dragPanel || !customizeMode) return;
  dragPanel.style.left = (e.clientX - offsetX) + "px";
  dragPanel.style.top = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => {
  if (dragPanel && customizeMode) {
    savePanelPosition(dragPanel);
  }
  dragPanel = null;
  document.body.style.userSelect = "";
});

function savePanelPosition(panel) {
  const pos = { left: panel.style.left, top: panel.style.top, width: panel.style.width, height: panel.style.height };
  localStorage.setItem("panel_" + panel.id, JSON.stringify(pos));
}
function restorePanelPosition(panel) {
  const pos = localStorage.getItem("panel_" + panel.id);
  if (pos) {
    const { left, top, width, height } = JSON.parse(pos);
    if (left) panel.style.left = left;
    if (top) panel.style.top = top;
    if (width) panel.style.width = width;
    if (height) panel.style.height = height;
  }
}

// ===============================
// --- Mock Twitch API ---
// ===============================
window.mockTwitch = {
  getStreamInfo: () => ({
    title: "Let's Build a Streaming App!",
    game: "Software & Game Dev",
    viewers: 127,
    uptime: "2h 17m",
    category: "Just Chatting",
    streamer: "Warmonkeyx2",
    startedAt: new Date(Date.now() - 2 * 3600 * 1000 - 17 * 60 * 1000),
  }),
  getPolls: () => ([
    { question: "Which feature next?", options: ["Schedule", "Mini-games", "Custom Chat"], votes: [7,9,3] }
  ])
};

// ===============================
// --- Render Stream Info ---
// ===============================
function renderStreamInfo() {
  const info = window.mockTwitch.getStreamInfo();
  document.getElementById("streamInfoBody").innerHTML = `
    <div style="font-size:1.2rem; font-weight:bold;">${info.title}</div>
    <div style="margin: 2px 0 8px 0; color:#0ff;">${info.streamer} — <span style="color:#faf;">${info.category}</span></div>
    <div>Game: <b>${info.game}</b></div>
    <div>Viewers: <b>${info.viewers}</b></div>
    <div>Uptime: <b>${info.uptime}</b></div>
  `;
}

// ===============================
// --- Render Polls ---
// ===============================
function renderPolls() {
  const polls = window.mockTwitch.getPolls();
  if (!polls.length) {
    document.getElementById("pollBody").innerHTML = `<em>No polls running</em>`;
    return;
  }
  document.getElementById("pollBody").innerHTML = polls.map(p =>
    `<div><b>${p.question}</b><ul style="margin-top:4px;">${
      p.options.map((opt, i) =>
        `<li>${opt} <span style="color:#0ff;font-weight:bold;">${p.votes[i]}</span></li>`
      ).join('')
    }</ul></div>`
  ).join("<hr>");
}

// ===============================
// --- Restore open panels and layout on load ---
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  panels.forEach(panel => restorePanelPosition(panel));
  updateMainStreamerLinks();
  updatePopoutLinksPanel();
  loadDockVisibilityPrefs();
});

// ===============================
// --- Window Onload Setup and Event Binding ---
// ===============================
window.onload = () => {
  showTab('homeTab');
  updateStreamerLinks();
  updateServerButtons();
  renderStreamInfo();

  const statsPrefsForm = document.getElementById("statsPrefsForm");
  if (statsPrefsForm) {
    statsPrefsForm.onsubmit = function(e) {
      e.preventDefault();
      const prefs = {};
      availableStats.forEach(stat => {
        prefs[stat.key] = this.elements[stat.key].checked;
      });
      localStorage.setItem("statsPrefs", JSON.stringify(prefs));
      closeCustomStats();
      showBasicStats();
    };
  }
};

// ===============================
// --- FreeMode Panel Logic (Twitch Embed Toggle & Responsive Resize) ---
// ===============================
// This feature lets viewers activate a mode, open a Twitch embed in a draggable/resizable window, and build out their own layout.

function toggleTwitchEmbed() {
  const panel = document.getElementById("twitchEmbedPanel");
  if (!panel) return;
  if (panel.style.display === "none" || panel.style.display === "") {
    panel.style.display = "block";
    panel.innerHTML = `<iframe
      src="https://player.twitch.tv/?channel=goochy2&parent=localhost"
      frameborder="0"
      allowfullscreen="true"
      scrolling="no"
      style="width:100%;height:100%;display:block;"
      allow="autoplay"
    ></iframe>`;
  } else {
    panel.style.display = "none";
    panel.innerHTML = "";
  }
}

// ===============================
// --- Gaming Panel Popup Logic ---
// ===============================
// Handles opening and closing the gaming panel overlay (pop-up) and hooking up game buttons.

// Open the Gaming Panel (when Gaming app icon is clicked)
document.getElementById('gamingAppIcon').onclick = function() {
  document.getElementById('gamingPanelOverlay').style.display = 'flex';
};
// Close the Gaming Panel (when X button is clicked)
document.getElementById('closeGamingPanel').onclick = function() {
  document.getElementById('gamingPanelOverlay').style.display = 'none';
};
// Optional: Close when clicking outside the modal
document.getElementById('gamingPanelOverlay').onclick = function(e) {
  if (e.target === document.getElementById('gamingPanelOverlay')) {
    document.getElementById('gamingPanelOverlay').style.display = 'none';
  }
};

// ===============================
// Neon Slot Machine Full Logic
// ===============================

// --- Images for Slot Symbols ---
const SLOT_SYMBOLS = [
  { img: 'assets/slots1.png', name: "Ember" },
  { img: 'assets/slots2.png', name: "Streamer Coin" },
  { img: 'assets/slots3.png', name: "GG" },
  { img: 'assets/slots4.png', name: "Streamer Face" },
  { img: 'assets/slots5.png', name: "Neon Star" },
  { img: 'assets/slots6.png', name: "Twitch Coin" },
  { img: 'assets/slots7.png', name: "Arcade" },
  { img: 'assets/slots8.png', name: "Jackpot" },
  { img: 'assets/slots9.png', name: "FREE SPIN" }
];

let slotBalance = 0;
let freeSpins = 0;
let isSpinning = false;

// DOM Elements (slot machine)
const reels = [0, 1, 2].map(i => document.querySelector(`.slot-reel[data-reel="${i}"]`));
const spinBtn = document.getElementById('slot-spin');
const autoBtn = document.getElementById('slot-autospin');
const msgEl = document.getElementById('slot-message');
const fsEl = document.getElementById('slot-freespins');
const balEl = document.getElementById('balanceAmount');
const winlinesCanvas = document.getElementById('slot-winlines');
const ctx = winlinesCanvas.getContext('2d');

// === Utility: Random Symbol Index ===
function randSymbol() {
  return Math.floor(Math.random() * SLOT_SYMBOLS.length);
}

// === Utility: Animate Reels ===
function animateReel(reelIdx, result, duration = 900) {
  return new Promise(resolve => {
    const reel = reels[reelIdx];
    const steps = 18 + Math.floor(Math.random() * 6);
    let pos = 0;
    let lastTime = performance.now();

    // Prepare initial random symbols
    reel.innerHTML = '';
    let queue = [];
    for (let i = 0; i < steps; i++) {
      const idx = randSymbol();
      queue.push(idx);
      const el = document.createElement('div');
      el.className = 'slot-symbol';
      el.innerHTML = `<img src="${SLOT_SYMBOLS[idx].img}" alt="">`;
      reel.appendChild(el);
    }

    // Final symbols (result)
    for (let i = 0; i < 3; i++) {
      queue.push(result[i]);
      const el = document.createElement('div');
      el.className = 'slot-symbol';
      el.innerHTML = `<img src="${SLOT_SYMBOLS[result[i]].img}" alt="">`;
      reel.appendChild(el);
    }

    // Animate
    let offset = 0;
    function animate(time) {
      const dt = Math.min(24, time - lastTime);
      lastTime = time;
      offset += dt * (420 / duration);

      reel.style.transform = `translateY(${-offset}px)`;
      if (offset < (steps * 140)) {
        requestAnimationFrame(animate);
      } else {
        // Set final symbols
        reel.innerHTML = '';
        for (let i = 0; i < 3; i++) {
          const idx = result[i];
          const el = document.createElement('div');
          el.className = 'slot-symbol';
          el.innerHTML = `<img src="${SLOT_SYMBOLS[idx].img}" alt="">`;
          reel.appendChild(el);
        }
        reel.style.transform = 'translateY(0)';
        resolve();
      }
    }
    requestAnimationFrame(animate);
  });
}

// === Utility: Get 3x3 Result ===
function getSpinResult() {
  // For now, random; can add weighted odds for bonus rounds
  return [
    [randSymbol(), randSymbol(), randSymbol()], // Col 0
    [randSymbol(), randSymbol(), randSymbol()], // Col 1
    [randSymbol(), randSymbol(), randSymbol()]  // Col 2
  ];
}

// === Draw Win Lines on Canvas ===
function drawWinLines(winLines) {
  ctx.clearRect(0, 0, winlinesCanvas.width, winlinesCanvas.height);
  winLines.forEach(line => {
    ctx.save();
    ctx.strokeStyle = line.color || "#ff0";
    ctx.shadowColor = line.color || "#ff0";
    ctx.shadowBlur = 12;
    ctx.lineWidth = 8;
    ctx.beginPath();
    const cell = (row, col) => [col * 140 + 70, row * 140 + 70];
    line.pts.forEach((pt, i) => {
      const [x, y] = cell(pt[0], pt[1]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();
  });
}

// === Win Logic ===
function checkWin(resultGrid) {
  // resultGrid: 3 cols x 3 rows (resultGrid[col][row])
  // Transpose for rows
  const rows = [0,1,2].map(r => [resultGrid[0][r], resultGrid[1][r], resultGrid[2][r]]);
  const cols = resultGrid;
  const diags = [
    [resultGrid[0][0], resultGrid[1][1], resultGrid[2][2]],
    [resultGrid[0][2], resultGrid[1][1], resultGrid[2][0]]
  ];

  let winLines = [];
  let bigWin = false;
  let freeSpinCount = 0;
  let winSymbols = [];

  // Check horizontal, vertical, diagonal lines for all-equal
  for (let i = 0; i < 3; i++) {
    if (rows[i][0] === rows[i][1] && rows[i][1] === rows[i][2]) {
      winLines.push({ pts: [[i,0],[i,1],[i,2]], color: "#ff0" });
      winSymbols.push(SLOT_SYMBOLS[rows[i][0]].name);
      if (rows[i][0] === 8) bigWin = true;
    }
    if (cols[i][0] === cols[i][1] && cols[i][1] === cols[i][2]) {
      winLines.push({ pts: [[0,i],[1,i],[2,i]], color: "#0ff" });
      winSymbols.push(SLOT_SYMBOLS[cols[i][0]].name);
      if (cols[i][0] === 8) bigWin = true;
    }
  }
  if (diags[0][0] === diags[0][1] && diags[0][1] === diags[0][2]) {
    winLines.push({ pts: [[0,0],[1,1],[2,2]], color: "#ff00ea" });
    winSymbols.push(SLOT_SYMBOLS[diags[0][0]].name);
    if (diags[0][0] === 8) bigWin = true;
  }
  if (diags[1][0] === diags[1][1] && diags[1][1] === diags[1][2]) {
    winLines.push({ pts: [[2,0],[1,1],[0,2]], color: "#ffae00" });
    winSymbols.push(SLOT_SYMBOLS[diags[1][0]].name);
    if (diags[1][0] === 8) bigWin = true;
  }

  // Count FREE SPIN icons
  for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) if (resultGrid[c][r] === 8) freeSpinCount++;

  return { winLines, bigWin, freeSpinCount, winSymbols };
}

// === Slot Spin Handler ===
async function spinSlots(isBonus = false) {
  if (isSpinning) return;
  isSpinning = true;
  spinBtn.disabled = true;
  autoBtn.disabled = true;
  msgEl.textContent = '';
  drawWinLines([]);

  // Determine result
  let resultGrid = getSpinResult();

  // Animate each reel (vertical)
  await Promise.all([0,1,2].map(i => animateReel(i, resultGrid[i])));

  // Check wins
  const { winLines, bigWin, freeSpinCount, winSymbols } = checkWin(resultGrid);

  // Draw win lines
  drawWinLines(winLines);

  // Free spin logic
  if (freeSpinCount >= 5) {
    freeSpins += 10;
    fsEl.textContent = `FREE SPINS +10!`;
    msgEl.textContent = "🎉 BONUS! 10 Free Spins Awarded!";
    // TODO: trigger special animation/sound
  } else if (winLines.length > 0) {
    msgEl.textContent = `WIN! ${winSymbols.join(", ")}`;
    // TODO: trigger win animation/sound
    if (bigWin) {
      // TODO: trigger "Big Win" overlay, chat message, badge, leaderboard
      msgEl.textContent = "🔥 BIG WIN! 🔥";
      // Example: triggerBigWinOverlay(), sendChatWin();
    }
  } else {
    msgEl.textContent = "No win. Try again!";
    fsEl.textContent = '';
  }

  // Handle free spins
  if (freeSpins > 0) {
    freeSpins--;
    fsEl.textContent = `Free Spins: ${freeSpins}`;
    setTimeout(() => spinSlots(false), 1200);
  } else {
    fsEl.textContent = '';
    spinBtn.disabled = false;
    autoBtn.disabled = false;
    isSpinning = false;
  }
}

// === Bits Integration (Stub) ===
spinBtn.onclick = async () => {
  // TODO: Integrate Twitch Bits API, unlock after Bits processed
  await spinSlots(false);
};
autoBtn.onclick = async () => {
  // TODO: Integrate Twitch Bits API (100 bits), unlock after Bits processed
  await spinSlots(true);
};

// --- Optional: Slot game initialization if needed ---
function initSlotMachine() {
  msgEl.textContent = '';
  fsEl.textContent = '';
  balEl.textContent = slotBalance;
  reels.forEach(r => r.innerHTML = '');
  drawWinLines([]);
  spinBtn.disabled = false;
  autoBtn.disabled = false;
  isSpinning = false;
}

// --- Slot close resets state ---
document.getElementById('slot-close').onclick = function() {
  document.getElementById('slot-machine').style.display = 'none';
  initSlotMachine();
};

// ===============================
// Rest of your script.js remains unchanged for other apps, overlays, etc.
// ===============================
