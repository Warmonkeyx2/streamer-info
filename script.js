// ===============================
// Streamer Info App JS (Cleaned/FIXED)
// ===============================

// --- Info Card Toggle ---
function toggleCard() {
  const card = document.getElementById("infoCard");
  card.style.display = card.style.display === "flex" ? "none" : "flex";
}
window.toggleCard = toggleCard;

// --- Tab Switching ---
function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'flex';
}
window.showTab = showTab;

// 🔧 CONFIGURABLE THEME SETTINGS
// These variables will be injected or toggled across all panels
const defaultTheme = {
  primaryColor: '#00ffcc',  // Buttons, borders
  secondaryColor: '#ff00cc', // Accents, shadows
  backgroundColor: '#000000',
  fontFamily: 'Orbitron, sans-serif',
  fontSize: '14px',
  borderRadius: '12px'
};

let currentTheme = { ...defaultTheme };

function applyTheme(theme) {
  const root = document.documentElement;
  root.style.setProperty('--primary-color', theme.primaryColor);
  root.style.setProperty('--secondary-color', theme.secondaryColor);
  root.style.setProperty('--background-color', theme.backgroundColor);
  root.style.setProperty('--font-family', theme.fontFamily);
  root.style.setProperty('--font-size', theme.fontSize);
  root.style.setProperty('--border-radius', theme.borderRadius);
}

function loadSavedTheme() {
  const saved = localStorage.getItem('customTheme');
  if (saved) {
    currentTheme = JSON.parse(saved);
    applyTheme(currentTheme);
  } else {
    applyTheme(defaultTheme);
  }
}

function saveTheme(theme) {
  currentTheme = { ...theme };
  localStorage.setItem('customTheme', JSON.stringify(currentTheme));
  applyTheme(currentTheme);
}

// Example usage:
// saveTheme({ ...currentTheme, primaryColor: '#ff9900' });

// Load the theme when page loads
window.addEventListener('DOMContentLoaded', loadSavedTheme);


// --- Admin Panel Section Switching ---
function showAdminSection(sectionId) {
  document.querySelectorAll('.admin-section').forEach(sec => {
    sec.style.display = 'none';
  });
  const target = document.getElementById(sectionId);
  if (target) target.style.display = 'block';

  document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelector(`.admin-tab[onclick*="${sectionId}"]`)?.classList.add('active');
}
window.showAdminSection = showAdminSection;

// --- Admin Panel Toggle ---
function toggleAdminPanel() {
  const panel = document.querySelector(".admin-panel");
  if (panel) {
    panel.style.display = panel.style.display === "flex" ? "none" : "flex";
  }
}
window.toggleAdminPanel = toggleAdminPanel;

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
// ===============================
// --- SLOT MACHINE LEVEL/XP LOGIC ---
// ===============================

// Slot state
let slotLevel = 0;
let slotXP = 0;
let slotXPMax = 100;
let slotLevelMax = 10; // Admin default, can be set in admin panel
let slotLevelRewards = {}; // {level: reward}

// Placeholder for global XP logic (future)
let globalXP = 0;

// HTML element references (cache once DOM is loaded)
let slotLevelValue, slotXPCount, slotXPBar, slotBitsBalance, slotWinAmount;

// --- XP & Level functions ---

function addXP(amount) {
  // Player XP
  slotXP += amount;
  // Global XP (future use)
  globalXP += amount;

  let leveledUp = false;
  while (slotXP >= slotXPMax && slotLevel < slotLevelMax) {
    slotXP -= slotXPMax;
    slotLevel++;
    slotXPMax = (slotLevel + 1) * 100;
    leveledUp = true;

    // Reward logic
    let reward = slotLevelRewards[slotLevel] || "No reward";
    showLevelUpNotification(slotLevel, reward);
  }
  updateSlotLevelUI();
  return leveledUp;
}

function showLevelUpNotification(level, reward) {
  // Replace with fancy modal/toast in production
  alert(`🎉 Level up! Now level ${level}. Reward: ${reward}`);
}

function updateSlotLevelUI() {
  if (!slotLevelValue) {
    slotLevelValue = document.getElementById('slotLevelValue');
    slotXPCount = document.getElementById('slotXPCount');
    slotXPBar = document.getElementById('slotXPBar');
  }
  slotLevelValue.textContent = slotLevel;
  slotXPCount.textContent = `${slotXP}/${slotXPMax}`;
  const pct = Math.min(100, Math.round((slotXP / slotXPMax) * 100));
  slotXPBar.style.width = pct + '%';
  // Optionally animate the XP bar color based on level
  slotXPBar.style.background = (slotLevel % 2 === 0)
    ? 'linear-gradient(90deg,#00fff7 0%,#ff00ea 100%)'
    : 'linear-gradient(90deg,#ffbf00 0%,#ff00ea 100%)';
}

// --- SLOT BUTTON LOGIC ---

let slotBits = 1000;
let slotWin = 0;
let slotSpinning = false;
let slotFreeSpins = 0;
let slotImageCount = 9;
let slotImgPath = "assets/slot";
let slotGridRows = 3;
let slotGridCols = 3;

const slotImages = [];
for (let i = 1; i <= slotImageCount; i++) {
  const img = new Image();
  img.src = `${slotImgPath}${i}.png`;
  slotImages.push(img);
}

function renderSlotGrid(gridVals) {
  const grid = document.getElementById('slotGrid');
  grid.innerHTML = '';
  let symbols = gridVals;
  if (!symbols) {
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

function updateSlotUI() {
  if (!slotBitsBalance) slotBitsBalance = document.getElementById('slotBitsBalance');
  if (!slotWinAmount) slotWinAmount = document.getElementById('slotWinAmount');
  slotBitsBalance.textContent = slotBits;
  slotWinAmount.textContent = slotWin;
  document.getElementById('slotSpinBtn').disabled = slotSpinning || (slotBits < 10 && slotFreeSpins === 0);
  document.getElementById('slotBonusBtn').disabled = slotSpinning;
  updateSlotLevelUI();
}

function checkSlotWin(result) {
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
  if (result[0] === result[4] && result[4] === result[8]) {
    win += 200;
    winCells.push(0,4,8);
  }
  if (result[2] === result[4] && result[4] === result[6]) {
    win += 200;
    winCells.push(2,4,6);
  }
  const freeSpinCount = result.filter(idx => idx === 8).length;
  let gotBonus = false;
  if (freeSpinCount >= 5) {
    slotFreeSpins += 10;
    gotBonus = true;
  }
  return {win, winCells: [...new Set(winCells)], gotBonus};
}

function highlightWinCells(winCells) {
  document.querySelectorAll('#slotGrid .slot-cell').forEach((cell, i) => {
    if (winCells.includes(i)) cell.classList.add('win');
    else cell.classList.remove('win');
  });
}

// --- SPIN/TURBO/BONUS BUTTONS ---

function getSpinSpeed() {
  // Turbo = fast, else normal
  return document.getElementById('slotTurboCheckbox').checked ? 12 : 40;
}

function spinSlotGrid(callback) {
  slotSpinning = true;
  updateSlotUI();

  // Animate with blur effect
  const grid = document.getElementById('slotGrid');
  grid.querySelectorAll('.slot-cell').forEach(cell => cell.classList.add('spinning'));

  const steps = 18;
  let curStep = 0;
  const spinAnim = setInterval(() => {
    renderSlotGrid();
    curStep++;
    if (curStep >= steps) {
      clearInterval(spinAnim);
      const result = [];
      for (let i = 0; i < 9; i++) result.push(Math.floor(Math.random() * slotImageCount));
      renderSlotGrid(result);
      setTimeout(() => {
        slotSpinning = false;
        grid.querySelectorAll('.slot-cell').forEach(cell => cell.classList.remove('spinning'));
        callback && callback(result);
      }, 350);
    }
  }, getSpinSpeed());
}

function handleSpin(isBonusSpin=false) {
  if (slotSpinning) return;
  if (!isBonusSpin && slotBits < 10 && slotFreeSpins === 0) return;
  slotSpinning = true;
  updateSlotUI();

  if (!isBonusSpin) {
    if (slotFreeSpins > 0) {
      slotFreeSpins--;
    } else {
      slotBits -= 10;
    }
  }

  spinSlotGrid((result) => {
    const {win, winCells, gotBonus} = checkSlotWin(result);
    slotWin = win;
    highlightWinCells(winCells);

    if (!isBonusSpin) {
      addXP(10); // Each spin: 10xp for player & global (future)
    }
    // (You can track bonus usage/wins here for leaderboard later)

    updateSlotUI();
    slotSpinning = false;
    setTimeout(() => highlightWinCells([]), 1500);

    if (gotBonus) alert("🎉 BONUS: You got 10 Free Spins!");
  });
}

// Attach handlers on page load
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('slotSpinBtn').onclick = () => handleSpin(false);
  document.getElementById('slotTurboCheckbox').onclick = () => {}; // For state, handled in getSpinSpeed
  document.getElementById('slotBonusBtn').onclick = () => handleSpin(true);

  // Initialize panel UI
  updateSlotUI();
  renderSlotGrid();

  // If admin sets max level or rewards, re-render reward table etc.
  if (typeof renderLevelRewardTable === "function") renderLevelRewardTable();
});

// ===============================
// --- ADMIN: LEVEL REWARD CONTROL ---
// ===============================

function renderLevelRewardTable() {
  const table = document.getElementById('levelRewardTable');
  if (!table) return;
  table.innerHTML = '<tr><th>Level</th><th>XP Needed</th><th>Reward</th></tr>';
  for (let lvl = 0; lvl < slotLevelMax; lvl++) {
    const xpNeeded = (lvl+1)*100;
    const reward = slotLevelRewards[lvl] || '';
    table.innerHTML += `<tr>
      <td>${lvl}</td>
      <td>${xpNeeded}</td>
      <td><input type="text" value="${reward}" data-level="${lvl}" class="level-reward-input"></td>
    </tr>`;
  }
  Array.from(document.querySelectorAll('.level-reward-input')).forEach(input => {
    input.onchange = function() {
      slotLevelRewards[this.dataset.level] = this.value;
    };
  });
}

// Max level input handler
window.addEventListener('DOMContentLoaded', () => {
  const maxLevelInput = document.getElementById('slotLevelMaxInput');
  if (maxLevelInput) {
    maxLevelInput.onchange = function() {
      slotLevelMax = Number(this.value);
      renderLevelRewardTable();
    };
  }
});

// XP Reset Type
window.addEventListener('DOMContentLoaded', () => {
  const xpResetType = document.getElementById('xpResetType');
  if (xpResetType) {
    xpResetType.onchange = function() {
      document.getElementById('xpCustomDays').style.display = (this.value === 'event') ? 'inline-block' : 'none';
    };
  }
});

// ===============================
// --- ADMIN PANEL DRAGGABLE ---
// ===============================

let adminDragging = false, adminOffsetX = 0, adminOffsetY = 0, adminDraggedPanel = null;
window.addEventListener('DOMContentLoaded', () => {
  const adminPanel = document.querySelector('.admin-panel');
  const adminHeader = adminPanel?.querySelector('.admin-header');
  if (adminHeader) {
    adminHeader.style.cursor = 'move';
    adminHeader.onmousedown = function(e) {
      adminDragging = true;
      adminDraggedPanel = adminPanel;
      adminOffsetX = e.clientX - adminPanel.offsetLeft;
      adminOffsetY = e.clientY - adminPanel.offsetTop;
      document.addEventListener('mousemove', adminDragMove);
      document.addEventListener('mouseup', adminDragStop);
    };
  }
});
function adminDragMove(e) {
  if (!adminDragging || !adminDraggedPanel) return;
  adminDraggedPanel.style.position = 'fixed';
  adminDraggedPanel.style.left = (e.clientX - adminOffsetX) + "px";
  adminDraggedPanel.style.top = (e.clientY - adminOffsetY) + "px";
}
function adminDragStop() {
  adminDragging = false;
  adminDraggedPanel = null;
  document.removeEventListener('mousemove', adminDragMove);
  document.removeEventListener('mouseup', adminDragStop);
}

// ===============================
// --- LEADERBOARD PLACEHOLDER ---
// ===============================

function renderLeaderboardTable() {
  const table = document.getElementById('leaderboardTable');
  if (!table) return;
  table.innerHTML = `<tr><th>Name</th><th>Spins</th><th>Wins</th><th>Bonus</th><th>XP Level</th></tr>
    <tr><td>MonkeyKing</td><td>124</td><td>18</td><td>12</td><td>5</td></tr>
    <tr><td>ChaosGamer</td><td>110</td><td>11</td><td>8</td><td>4</td></tr>
    <tr><td>NeonQueen</td><td>98</td><td>9</td><td>7</td><td>3</td></tr>
    <tr><td>FakeUser</td><td>80</td><td>7</td><td>5</td><td>2</td></tr>`;
}
window.addEventListener('DOMContentLoaded', renderLeaderboardTable);

function showSlotTestPanel() {
  const panel = document.getElementById('slotTestPanel');
  if (panel) {
    panel.style.display = 'block';
    updateSlotUI();
    renderSlotGrid();
  }
}
window.showSlotTestPanel = showSlotTestPanel; // Make it accessible globally for inline HTML onclick

// Always bring slotTestPanel to front and show when requested
window.showSlotTestPanel = function() {
  const panel = document.getElementById('slotTestPanel');
  if (panel) {
    panel.style.display = 'block';
    // Optionally bring to front
    panel.style.zIndex = 2001;
    updateSlotUI();
    renderSlotGrid();
  }
}

// ===============================
// --- Crate Clash Mini-Game (MVP) ---
// ===============================

const ITEM_POOL = [
  { name: "Streamer Sticker", rarity: "Common", icon: "🟦" },
  { name: "Monkey Hat", rarity: "Uncommon", icon: "🟩" },
  { name: "Golden Banana", rarity: "Rare", icon: "🟧" },
  { name: "Neon Mic", rarity: "Epic", icon: "🟪" },
  { name: "Crown of Hype", rarity: "Legendary", icon: "🟨" },
  { name: "First Edition Badge", rarity: "Collector", icon: "🔷" }
];

const RARITY_RATES = {
  "Common": 0.50,
  "Uncommon": 0.25,
  "Rare": 0.15,
  "Epic": 0.07,
  "Legendary": 0.025,
  "Collector": 0.005
};

let crateCount = 5;
let keyCount = 2;
let inventory = [];

document.getElementById("crateClashBtn").onclick = function() {
  document.getElementById("gamingPanelOverlay").style.display = "none";
  document.getElementById("crateClashPanel").style.display = "block";
  renderCrateClashUI();
};
document.querySelector('#crateClashPanel .close-btn').onclick = function() {
  document.getElementById("crateClashPanel").style.display = "none";
};

function renderCrateClashUI() {
  document.getElementById("crateCount").textContent = crateCount;
  document.getElementById("keyCount").textContent = keyCount;
  renderInventory();
}

function renderInventory() {
  const invDiv = document.getElementById("crateInventory");
  if (!inventory.length) {
    invDiv.innerHTML = "<em>No items yet. Open crates to collect items!</em>";
    return;
  }
  invDiv.innerHTML = inventory.map(item =>
    `<div class="crate-item crate-${item.rarity.toLowerCase()}">${item.icon} <b>${item.name}</b> <span style="font-size:0.85em;">(${item.rarity})</span> <span style="color:#aaa;">${item.date}</span></div>`
  ).join('');
}

document.getElementById("buyKeyBtn").onclick = function() {
  keyCount++;
  renderCrateClashUI();
};

document.getElementById("openCrateBtn").onclick = function() {
  if (crateCount < 1 || keyCount < 1) {
    alert("You need at least 1 crate and 1 key!");
    return;
  }
  crateCount--;
  keyCount--;
  const item = getRandomItem();
  openCrateWithAnimation(item);
  inventory.push({ ...item, date: new Date().toLocaleTimeString() });
};

function getRandomItem() {
  let r = Math.random();
  let acc = 0;
  for (let i = 0; i < ITEM_POOL.length; i++) {
    acc += RARITY_RATES[ITEM_POOL[i].rarity];
    if (r < acc) return ITEM_POOL[i];
  }
  return ITEM_POOL[0];
}

// ===============================
// --- Crate Clash Cinematic Animation ---
// ===============================
function openCrateWithAnimation(finalItem) {
  document.getElementById("crateAnimationModal").style.display = "flex";
  document.getElementById("crateReveal").innerHTML = "";
  populateReel(finalItem);
  startReelAnimation(finalItem, function() {
    showCrateFinalReveal(finalItem, function() {
      setTimeout(() => {
        document.getElementById("crateAnimationModal").style.display = "none";
        renderCrateClashUI();
      }, 1200);
    });
  });
}

// Prepare the reel (fill with random items, with the winner in winning position)
function populateReel(finalItem) {
  const reel = document.getElementById("crateReel");
  reel.innerHTML = "";
  const reelLen = 32, winPos = 16;
  let items = [];
  for (let i = 0; i < reelLen; i++) {
    let item = ITEM_POOL[Math.floor(Math.random() * ITEM_POOL.length)];
    items.push(item);
  }
  items[winPos] = finalItem;
  for (let i = 0; i < items.length; i++) {
    const div = document.createElement("div");
    div.className = `crate-reel-item crate-${items[i].rarity.toLowerCase()}`;
    div.innerHTML = `<span class="reel-icon">${items[i].icon}</span>`;
    div.setAttribute("data-name", items[i].name);
    div.setAttribute("data-rarity", items[i].rarity);
    reel.appendChild(div);
  }
}

// Animate reel to land the winner under the pointer, for exactly 9s
function playSound(id) {
  const audio = document.getElementById(id);
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

// This function will spin the wheel for exactly the length of the music (spinSound),
// and stop precisely at the winning item.
function startReelAnimation(finalItem, cb) {
  const reel = document.getElementById("crateReel");
  const itemWidth = 48; // Set to your actual CSS item width
  const visible = 9;    // Number of visible items in the reel
  const centerIndex = Math.floor(visible / 2);

  // Build the reel with the winner at the correct spot
  let items = [];
  const total = 30;
  for (let i = 0; i < total; i++) {
    items.push(ITEM_POOL[Math.floor(Math.random() * ITEM_POOL.length)]);
  }
  let winIdx = Math.floor(total / 2);
  items[winIdx] = finalItem;

  reel.innerHTML = "";
  items.forEach(item => {
    const div = document.createElement("div");
    div.className = `crate-reel-item crate-${item.rarity.toLowerCase()}`;
    div.innerHTML = `<span class="reel-icon">${item.icon}</span>`;
    reel.appendChild(div);
  });

  let offset = 0;
  let speed = 36;
  let minSpeed = 7;
  let stopped = false;
  let spinDuration = 9000; // fallback in ms

  // --- Sync spin duration with spin sound actual length ---
  const spinAudio = document.getElementById('crateSpinSound');
  if (spinAudio && spinAudio.duration && !isNaN(spinAudio.duration)) {
    spinDuration = spinAudio.duration * 1000;
  } else if (spinAudio) {
    // If metadata hasn't loaded, listen for it
    spinAudio.onloadedmetadata = function() {
      spinDuration = spinAudio.duration * 1000;
    };
  }

  // Play spin sound and start animation together
  playSound('crateSpinSound');
  let startTime = null;

  function animate(now) {
    if (!startTime) startTime = now;
    const elapsed = now - startTime;
    let remaining = spinDuration - elapsed;
    if (remaining < 2000) {
      speed = Math.max(minSpeed, speed * 0.98);
    }

    offset -= speed;
    if (offset <= -itemWidth) {
      offset += itemWidth;
      reel.appendChild(reel.firstElementChild);
    }

    if (elapsed >= spinDuration) {
      // Align winner under pointer
      let currentItems = reel.children;
      let winnerIndex = Array.from(currentItems).findIndex(
        child => child.innerText === finalItem.icon
      );
      let shift = winnerIndex - centerIndex;
      offset -= shift * itemWidth;
      reel.style.transform = `translateX(${offset}px)`;
      stopped = true;
      // Stop spin sound and play win sound
      spinAudio.pause();
      spinAudio.currentTime = 0;
      playSound('crateWinSound');
      setTimeout(cb, 850);
      return;
    }

    reel.style.transform = `translateX(${offset}px)`;
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}


// Show the final item with a flash/sparkle
function showCrateFinalReveal(item, cb) {
  const reveal = document.getElementById("crateReveal");
  reveal.innerHTML = `<div class="crate-reveal-item crate-${item.rarity.toLowerCase()} ${item.rarity === "Legendary" || item.rarity === "Collector" ? "confetti" : ""}">
    <span class="reel-icon" style="font-size:2em;">${item.icon}</span><br>
    <b>${item.name}</b><br>
    <span style="font-size:1.1em;">${item.rarity}</span>
    <div class="crate-reveal-flash"></div>
  </div>`;
  setTimeout(cb, 1200);
}

// Particle background for crate animation
function startCrateParticles() {
  const canvas = document.getElementById('crateParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = canvas.offsetWidth;
  let h = canvas.height = canvas.offsetHeight;

  let particles = Array.from({length: 44}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 1.9 + Math.random()*2.8,
    dx: -0.22 + Math.random()*0.44,
    dy: -0.12 + Math.random()*0.33,
    color: `rgba(${100+Math.random()*155|0},${230+Math.random()*25|0},255,${0.21+Math.random()*0.29})`
  }));

  function draw() {
    ctx.clearRect(0,0,w,h);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2*Math.PI);
      ctx.fillStyle = p.color;
      ctx.shadowColor = "#00fff7cc";
      ctx.shadowBlur = 5 + p.r*2;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// Play sound by id (make sure your audio tag exists in HTML)
function playSound(id) {
  const audio = document.getElementById(id);
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

// Start crate particles on modal open
document.getElementById("crateAnimationModal").addEventListener("transitionend", startCrateParticles);

// Make showSlotTestPanel globally accessible for dev/test
window.showSlotTestPanel = function() {
  const panel = document.getElementById('slotTestPanel');
  if (panel) {
    panel.style.display = 'block';
    panel.style.zIndex = 2001;
    updateSlotUI && updateSlotUI();
    renderSlotGrid && renderSlotGrid();
  }
};
