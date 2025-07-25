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
// --- Game Logic: Slots ---
// ===============================
// Basic frontend demo for Slots. Add more advanced logic and Bits integration later.
const slotSymbols = ['🍒', '🍋', '🔔', '⭐', '💎'];
function getRandomSymbol() {
  return slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
}
function isWin(result) {
  return result[0] === result[1] && result[1] === result[2];
}
document.getElementById('slotsBtn').onclick = function() {
  const result = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
  const win = isWin(result);
  alert(
    `Slots Result:\n${result.join(' | ')}\n\n${win ? "🎉 You win!" : "😢 Try again!"}`
  );
  // TODO: Replace alert with modal/panel, add Bits integration
};

// TODO: Add logic for Dice Roll, Wheel Spin, Soundboard, etc.
// =====================
// --- Slot Test Panel Logic ---
// =====================

// Slot test panel constants
const slotImageCount = 9; // 9 images: slot1.png - slot9.png (slot9 = free spin)
const slotImgPath = "assets/slot";
const slotGridRows = 3;
const slotGridCols = 3;
const slotStreakMax = 10; // e.g., reward every 10 streak spins (customize as needed)

// Slot test state
let slotBits = 1000;
let slotWin = 0;
let slotSpinning = false;
let slotFreeSpins = 0;
let slotStreak = 0;

// Preload slot images
const slotImages = [];
for (let i = 1; i <= slotImageCount; i++) {
  const img = new Image();
  img.src = `${slotImgPath}${i}.png`;
  slotImages.push(img);
}

// Open the Slot Test Panel (DEV)
function showSlotTestPanel() {
  showPanel('slotTestPanel');
  renderSlotGrid();
  updateSlotUI();
}
window.showSlotTestPanel = showSlotTestPanel; // Optional: make global for dev

// Render 3x3 slot grid with images (either random or static)
function renderSlotGrid(gridVals) {
  const grid = document.getElementById('slotGrid');
  grid.innerHTML = '';
  let symbols = gridVals;
  if (!symbols) {
    // If not provided, randomize for initial render
    symbols = [];
    for (let i = 0; i < slotGridRows * slotGridCols; i++) {
      symbols.push(Math.floor(Math.random() * slotImageCount));
    }
  }
  symbols.forEach((imgIdx, i) => {
    const cell = document.createElement('div');
    cell.className = 'slot-cell';
    const img = document.createElement('img');
    img.src = `${slotImgPath}${imgIdx+1}.png`;
    img.alt = `Slot ${imgIdx+1}`;
    cell.appendChild(img);
    grid.appendChild(cell);
  });
}

// Update Bit balance and win display
function updateSlotUI() {
  document.getElementById('slotBitsBalance').textContent = slotBits;
  document.getElementById('slotWinAmount').textContent = slotWin;
  document.getElementById('slotSpinBtn').disabled = slotSpinning || slotBits < 10; // Example cost: 10 bits
  document.getElementById('slotBonusBtn').disabled = slotSpinning;
updateSlotStreakUI();
}

// Animate slot spin (basic version)
// Later: replace with per-reel smooth animation
function spinSlotGrid(callback) {
  slotSpinning = true;
  updateSlotUI();

  // Animate: quickly randomize grid a few times, then settle
  const steps = 18;
  let curStep = 0;
  const spinAnim = setInterval(() => {
    renderSlotGrid();
    curStep++;
    if (curStep >= steps) {
      clearInterval(spinAnim);
      // Final result
      const result = [];
      for (let i = 0; i < 9; i++) result.push(Math.floor(Math.random() * slotImageCount));
      renderSlotGrid(result);
      setTimeout(() => {
        slotSpinning = false;
        callback && callback(result);
      }, 200);
    }
  }, 40);
}

// Calculate win lines (basic, just for display)
function checkSlotWin(result) {
  // Example: win if any horizontal line matches
  let win = 0;
  const winCells = [];
  for (let row = 0; row < 3; row++) {
    const a = result[row*3];
    const b = result[row*3+1];
    const c = result[row*3+2];
    if (a === b && b === c) {
      win += 100;
      winCells.push(row*3, row*3+1, row*3+2);
    }
  }
  // Diagonals
  if (result[0] === result[4] && result[4] === result[8]) {
    win += 200;
    winCells.push(0,4,8);
  }
  if (result[2] === result[4] && result[4] === result[6]) {
    win += 200;
    winCells.push(2,4,6);
  }
  // Bonus: 5+ free spin icons ("slot9")
  const freeSpinCount = result.filter(idx => idx === 8).length;
  let gotBonus = false;
  if (freeSpinCount >= 5) {
    slotFreeSpins += 10;
    gotBonus = true;
  }
  return {win, winCells: [...new Set(winCells)], gotBonus};
}

// Highlight winning cells (simple)
function highlightWinCells(winCells) {
  document.querySelectorAll('#slotGrid .slot-cell').forEach((cell, i) => {
    if (winCells.includes(i)) cell.classList.add('win');
    else cell.classList.remove('win');
  });
}

// SPIN button handler
document.getElementById('slotSpinBtn').onclick = function() {
  if (slotSpinning) return;
  if (slotBits < 10 && slotFreeSpins === 0) return;
  slotSpinning = true;
  updateSlotUI();
  // After spin result
  slotStreak += 1;
  if (slotStreak >= slotStreakMax) {
    // Reward for streak!
    slotFreeSpins += 5; // Example: 5 free spins for hitting streak max
    // Optional: Play animation, sound, or show message
    alert("🔥 Streak Bonus! +5 Free Spins for your streak!");
    slotStreak = 0; // Reset streak, or keep counting if you want multi-bonuses
  }
  updateSlotStreakUI();

// Streak UI 
function updateSlotStreakUI() {
  document.getElementById('slotStreakCount').textContent = slotStreak;
  // Bar width percent
  const pct = Math.min(100, Math.round((slotStreak / slotStreakMax) * 100));
  const bar = document.getElementById('slotStreakBar');
  bar.style.width = pct + '%';
  // Animate color at max
  bar.style.background = (slotStreak === slotStreakMax)
    ? 'linear-gradient(90deg,#ffbf00 0%,#ff00ea 100%)'
    : 'linear-gradient(90deg,#00fff7 0%,#ff00ea 100%)';
}

  // Bits or free spin
  if (slotFreeSpins > 0) {
    slotFreeSpins--;
  } else {
    slotBits -= 10; // Example: 10 bits per spin (update as needed)
  }

  spinSlotGrid((result) => {
    const {win, winCells, gotBonus} = checkSlotWin(result);
    slotWin = win;
    highlightWinCells(winCells);

    // TODO: Trigger win animation, sound, chat msg, etc.
    updateSlotUI();
    slotSpinning = false;
    setTimeout(() => highlightWinCells([]), 1500);

    if (gotBonus) {
      alert("🎉 BONUS: You got 10 Free Spins!");
    }
  });
};

// BONUS button handler (cost and logic TBD)
document.getElementById('slotBonusBtn').onclick = function() {
  if (slotSpinning) return;
  // Example: spend 100 bits for bonus spin with higher odds
  if (slotBits < 100) return alert("Not enough Bits!");
  slotBits -= 100;
  slotSpinning = true;
  updateSlotUI();

  // For now: Just spin, with all reels set to slot9 for demo!
  const result = Array(9).fill(8); // All "free spin" for demo
  renderSlotGrid(result);
  setTimeout(() => {
    slotWin = 1000;
    highlightWinCells([0,1,2,3,4,5,6,7,8]);
    updateSlotUI();
    slotSpinning = false;
    setTimeout(() => highlightWinCells([]), 1800);
  }, 600);
};

// Add a way to open the slot test panel for devs, e.g. in console:
// showSlotTestPanel();
