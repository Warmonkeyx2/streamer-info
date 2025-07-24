// ====== Info Card Toggle ======
function toggleCard() {
  const card = document.getElementById("infoCard");
  card.style.display = card.style.display === "flex" ? "none" : "flex";
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

// ====== Streamer Links ======
function updateStreamerLinks() {
  const links = [
    { id: 'twitch', name: 'Twitch' },
    { id: 'youtube', name: 'YouTube' },
    { id: 'kick', name: 'Kick' },
    { id: 'discord', name: 'Discord' },
    { id: 'tiktok', name: 'TikTok' },
    { id: 'donate', name: 'Donate' }
  ];
  const container = document.querySelector('.streamer-links');
  container.innerHTML = '';
  links.forEach(link => {
    const isChecked = document.getElementById(`${link.id}Check`)?.checked;
    const url = document.getElementById(`${link.id}URL`)?.value;
    if (isChecked && url?.trim() !== '') {
      const a = document.createElement('a');
      a.href = url;
      a.target = "_blank";
      a.textContent = link.name;
      container.appendChild(a);
    }
  });
}

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

  // Load JS
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
function launchStatsApp() {
  const statsWindow = document.getElementById("statsWindow");
  const container = document.getElementById("statsAppContainer");
  statsWindow.style.display = "flex";
  container.innerHTML = `
    <div id="cmdTerminal" style="background: #181818; color: #0f0; font-family: 'Fira Mono', monospace; padding: 20px; border-radius: 8px; min-height: 200px; font-size: 16px;"></div>
    <button onclick="getStats()" style="margin-top: 20px; background: #222; color: #0ff; border: 2px solid #0ff; border-radius: 6px; padding: 8px 18px; font-family: inherit; font-size: 16px; cursor: pointer;">Get Stats</button>
  `;
}

function closeStatsWindow() {
  document.getElementById("statsWindow").style.display = "none";
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
      // Add a longer pause after the first line
      const nextDelay = idx === 0 ? 1200 : 250;
      setTimeout(() => typeLines(lines, idx + 1, terminalId), nextDelay);
    }
  }
  typeChar();
}

function getStats() {
  const terminal = document.getElementById("cmdTerminal");
  terminal.innerHTML = "";
  const statsLines = [
    "> Checking stats for Warmonkeyx...",
    "> Followed since: 2020-05-06",
    "> Messages sent: 1423",
    "> Channel points: 12,350",
    "> Thanks for watching!",
  ];
  typeLines(statsLines);
}

// ====== Drag Functionality for App Windows ======
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let draggedWindow = null;

function startDrag(e) {
  const header = e.target.closest(".app-window-header");
  draggedWindow = header?.parentElement;
  if (!draggedWindow) return;

  isDragging = true;
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
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
}

// ====== Window Onload Setup ======
window.onload = () => {
  showTab('homeTab');
  updateStreamerLinks();
  updateServerButtons();
};
