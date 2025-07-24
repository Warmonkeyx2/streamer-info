// ====== Info Card Toggle ======
function toggleCard() {
  const card = document.getElementById("infoCard");
  card.style.display = card.style.display === "flex" ? "none" : "flex";
}

// ====== Drag Functionality for App Windows ======
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let draggedWindow = null;

function startDrag(e) {
  const header = e.target.closest(".app-window-header");
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

// ====== Tab Switching ======
function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'flex';
}

// ====== Color Picker and Theme ======
function toggleColorPicker() {
  const picker = document.getElementById("colorPicker");
  picker.style.display = picker.style.display === "block" ? "none" : "block";
}

function updateThemeColor(hexColor) {
  document.documentElement.style.setProperty('--accent-color', hexColor);
  const buttons = document.querySelectorAll(
    '.streamer-links a, .internal-nav a, .internal-nav button, .server-entry a, .color-button'
  );
  buttons.forEach(btn => {
    btn.style.backgroundImage = `linear-gradient(#121212, #121212), linear-gradient(to right, ${hexColor}, ${hexColor})`;
  });
}

// ====== Streamer Info/Bio/Profile Image ======
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

// ====== Streamer Links Sync (Main + Popout Panel) ======
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

// Real-time sync whenever link settings change
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

// ====== Admin Panel Sections ======
function showAdminSection(sectionId) {
  document.querySelectorAll('.admin-section').forEach(sec => {
    sec.style.display = 'none';
  });
  const target = document.getElementById(sectionId);
  if (target) target.style.display = 'block';

  document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelector(`.admin-tab[onclick*="${sectionId}"]`)?.classList.add('active');

  if (sectionId === 'serverSettingsPanel') {
    updateServerButtons();
  }
}

function toggleAdminPanel() {
  const panel = document.querySelector(".admin-panel");
  if (panel) {
    panel.style.display = panel.style.display === "flex" ? "none" : "flex";
  }
}

// ====== Server Buttons (Admin Panel) ======
function updateServerButtons() {
  const serverTab = document.getElementById('serversTab');
  const navContainer = serverTab.querySelector('.internal-nav');
  navContainer.innerHTML = ''; // Clear previous buttons

  const typeCards = document.querySelectorAll('.server-type-card');

  typeCards.forEach((card, i) => {
    const labelInput = card.querySelector('.server-type-label');
    const checkbox = card.querySelector('.server-type-visible');
    const label = labelInput.value.trim();

    if (label && checkbox.checked) {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.classList.add('color-button');
      btn.onclick = () => alert(`Open tab for: ${label}`);
      navContainer.appendChild(btn);
    }
  });
}

// ====== Modal App Windows (Solitaire, Stats) ======

// --- Solitaire App ---
function launchSolitaireApp() {
  const appWindow = document.getElementById("solitaireWindow");
  const container = document.getElementById("solitaireGameContainer");

  appWindow.style.display = "flex";
  container.innerHTML = `<div id="solitaire-root"></div>`;

  // Load JS (must exist at this path!)
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

// --- Stats App ---
// FIXED: Do NOT overwrite the whole stats window, only update the terminal/welcome message!
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

// ====== Stats Window Controls ======
function closeStatsWindow() {
  const statsWindow = document.getElementById("statsWindow");
  if (statsWindow) {
    statsWindow.style.display = "none";
  }
  // Optionally close/hide custom stats panel if open
  const customPanel = document.getElementById("customStatsPanel");
  if (customPanel) {
    customPanel.classList.remove("open");
  }
}

function minimizeStatsWindow() {
  closeStatsWindow();
}

// ====== Custom Stats Slide-Out Panel ======
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

// ====== Typing Effect for Stats Terminal ======
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

// ====== Customizable Stats ======
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

// ====== Streaming App Dock & Panels ======

// Mock Twitch API for demo purposes
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

// ------- Panel Show/Hide -------
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

function showPanel(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  panel.style.display = "block";
  if (!customizeMode) restorePanelPosition(panel);
  if (panelId === "streamInfoPanel") renderStreamInfo();
  if (panelId === "pollPanel") renderPolls();
}

function hidePanel(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  panel.style.display = "none";
}

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
  header.addEventListener("mousedown", (e) => {
    if (!customizeMode) return;
    dragPanel = panel;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    document.body.style.userSelect = "none";
  });
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

// ------- Restore open panels and layout on load -------
window.addEventListener("DOMContentLoaded", () => {
  panels.forEach(panel => restorePanelPosition(panel));
  showPanel('streamInfoPanel');
  updateMainStreamerLinks();
  updatePopoutLinksPanel();
});

// ====== Window Onload Setup and Event Binding ======
window.onload = () => {
  showTab('homeTab');
  updateStreamerLinks();
  updateServerButtons();

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
